# ARCHITECTURE.md — Antrian Digital

## Tujuan Dokumen
Menjelaskan struktur teknis stack PERN (PostgreSQL, Express, React, Node) — berbeda dari project-project sebelumnya yang berbasis Laravel, jadi dokumen ini ditulis cukup detail terutama di bagian pola concurrency dan real-time yang jadi inti pembelajaran project ini.

## Struktur Folder

```text
antrian-digital/
├── server/                          # Backend (Express + Node)
│   ├── src/
│   │   ├── db/
│   │   │   ├── pool.js               # Koneksi PostgreSQL (node-postgres Pool)
│   │   │   └── migrations/           # SQL migration files (raw .sql, dijalankan manual/script)
│   │   ├── routes/
│   │   │   ├── loket.routes.js
│   │   │   ├── queue.routes.js
│   │   │   └── auth.routes.js
│   │   ├── controllers/
│   │   │   ├── loket.controller.js
│   │   │   ├── queue.controller.js   # Termasuk logic ambil nomor & call-next
│   │   │   └── auth.controller.js
│   │   ├── services/
│   │   │   ├── queueService.js        # Business logic murni, dipanggil controller
│   │   │   └── socketService.js       # Setup & helper Socket.io (emit ke room)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js      # Verifikasi JWT untuk route admin
│   │   └── app.js                     # Setup Express app
│   ├── socket.js                       # Setup Socket.io server, event handler
│   └── server.js                       # Entry point, gabungkan Express + Socket.io dalam 1 HTTP server
│
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── TakeQueue.jsx           # Halaman pilih loket & ambil nomor
│   │   │   ├── QueueStatus.jsx         # Halaman live status antrian (WebSocket)
│   │   │   └── admin/
│   │   │       ├── Login.jsx
│   │   │       └── Dashboard.jsx        # Dashboard petugas
│   │   ├── components/
│   │   │   ├── QueueNumberDisplay.jsx
│   │   │   └── EstimatedWaitTime.jsx
│   │   ├── hooks/
│   │   │   └── useQueueSocket.js        # Custom hook: subscribe ke room loket, handle event real-time
│   │   └── services/
│   │       └── api.js                    # Wrapper fetch/axios ke Express API
│   └── vite.config.js
│
└── docker-compose.yml                # PostgreSQL + server + client (dev)
```

## Pattern yang Dipakai

### 1. Atomic Ticket Numbering (Ambil Nomor Antrian Baru)

```js
// queueService.js
async function takeNewTicket(loketId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Upsert counter harian, atomic increment
    const counterResult = await client.query(
      `INSERT INTO daily_counters (loket_id, date, last_number)
       VALUES ($1, CURRENT_DATE, 1)
       ON CONFLICT (loket_id, date)
       DO UPDATE SET last_number = daily_counters.last_number + 1
       RETURNING last_number`,
      [loketId]
    );
    const number = counterResult.rows[0].last_number;

    const ticketResult = await client.query(
      `INSERT INTO queue_tickets (loket_id, number, status)
       VALUES ($1, $2, 'waiting') RETURNING *`,
      [loketId, number]
    );

    await client.query('COMMIT');
    return ticketResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
```
**Kenapa `ON CONFLICT ... DO UPDATE` (upsert):** ini yang menjamin atomicity — kalau 2 request datang bersamaan untuk loket yang sama di hari yang sama, PostgreSQL menjamin salah satu akan "menang" duluan menaikkan angka, request kedua otomatis dapat angka berikutnya, tidak pernah dapat angka yang sama.

### 2. Atomic Call-Next (Bagian Paling Kritis)

```js
// queueService.js
async function callNextTicket(loketId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT * FROM queue_tickets
       WHERE loket_id = $1 AND status = 'waiting'
       ORDER BY created_at ASC
       LIMIT 1
       FOR UPDATE SKIP LOCKED`,
      [loketId]
    );

    if (result.rows.length === 0) {
      await client.query('COMMIT');
      return null; // tidak ada antrian tersisa
    }

    const ticket = result.rows[0];
    const updateResult = await client.query(
      `UPDATE queue_tickets SET status = 'called', called_at = NOW()
       WHERE id = $1 RETURNING *`,
      [ticket.id]
    );

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
```
**Kenapa `FOR UPDATE SKIP LOCKED`:** kalau 2 petugas di loket sama klik "Panggil Berikutnya" dalam waktu nyaris bersamaan, request pertama akan "mengunci" baris tiket teratas. Request kedua, alih-alih menunggu (yang bisa bikin race condition kalau tidak hati-hati) atau gagal, otomatis **skip** baris yang terkunci itu dan ambil baris `waiting` berikutnya. Hasilnya: 2 petugas mendapat 2 tiket berbeda, tidak ada yang tabrakan.

### 3. Real-Time Broadcast via Socket.io Room per Loket

```js
// socketService.js
function broadcastQueueUpdate(io, loketId, eventData) {
  io.to(`loket_${loketId}`).emit('queue:update', eventData);
}
```
```js
// Client-side: useQueueSocket.js
useEffect(() => {
  socket.emit('join', `loket_${loketId}`);
  socket.on('queue:update', (data) => {
    setQueueState(data);
  });
  return () => socket.off('queue:update');
}, [loketId]);
```
**Kenapa pakai konsep "room":** ini penting untuk efisiensi — klien yang sedang menunggu di Loket A tidak perlu menerima update dari Loket B. Socket.io room memastikan broadcast hanya terkirim ke klien yang relevan.

**Aturan penting:** SETIAP kali ada perubahan status tiket (ambil nomor baru, call-next, selesai, skip), controller terkait WAJIB memanggil `broadcastQueueUpdate()` setelah transaksi database berhasil — supaya semua klien yang menunggu di loket itu langsung ter-update tanpa refresh.

## Konvensi Penamaan

| Elemen | Konvensi | Contoh |
|---|---|---|
| File route/controller/service | camelCase dengan suffix jenis | `queue.controller.js`, `queueService.js` |
| Komponen React | PascalCase | `QueueStatus.jsx` |
| Custom hook | camelCase + `use` prefix | `useQueueSocket.js` |
| Socket.io event name | `namespace:action` | `queue:update`, `queue:called` |
| Socket.io room name | `loket_{id}` | `loket_3` |

## Batasan Eksplisit

- Jangan gunakan ORM berat (Prisma/Sequelize) untuk query `call-next` dan `take-ticket` — dua operasi ini WAJIB pakai raw SQL via `node-postgres` langsung, karena butuh kontrol penuh atas `FOR UPDATE SKIP LOCKED` dan transaction eksplisit yang tidak semua ORM dukung dengan baik.
- Jangan implementasikan real-time dengan polling (setInterval fetch berulang) — ini bertentangan dengan tujuan pembelajaran utama project ini (real-time via WebSocket).
- Jangan broadcast update ke SEMUA klien tanpa scoping room — akan boros bandwidth dan membingungkan klien yang menunggu di loket lain.
- Jangan campur logic "ambil nomor" dan "call-next" dalam satu fungsi — keduanya adalah operasi atomic yang berbeda dengan pola locking yang berbeda pula.