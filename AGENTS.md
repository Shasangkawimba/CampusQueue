# Antrian Digital — Agent Rules

## 🎯 Project Core

- **App:** Antrian Digital — Real-Time Queue System untuk layanan loket kampus
- **Type:** Public queue-taking (guest) + Admin dashboard (petugas)
- **Stack:** PostgreSQL, Express, React, Node (PERN) + Socket.io
- **Scope:** Ambil nomor antrian, live queue position (real-time), dashboard petugas, estimasi waktu tunggu
- **Constraint:** NO fitur baru di luar PRD.md tanpa persetujuan, NO mengganti PostgreSQL ke NoSQL (keputusan ini sudah final berdasarkan pertimbangan kebutuhan data relational & concurrency).

---

## ⚠️ Hard Rules

- **Atomic Ticket Numbering Wajib:** Pengambilan nomor antrian baru HARUS menggunakan pola `INSERT ... ON CONFLICT DO UPDATE` pada tabel `daily_counters` di dalam transaction (`BEGIN`/`COMMIT`). Tidak boleh menghitung nomor antrian dengan cara `SELECT COUNT(*) + 1` biasa — pola ini rentan race condition dan TIDAK menjamin keunikan saat 2 request datang bersamaan.
- **Atomic Call-Next Wajib:** Pemanggilan nomor antrian berikutnya HARUS menggunakan `SELECT ... FOR UPDATE SKIP LOCKED` di dalam transaction. Tidak boleh menggunakan `SELECT` biasa tanpa locking untuk operasi ini.
- **Setiap Perubahan Status Tiket Wajib Broadcast:** Setiap kali status `queue_tickets` berubah (waiting → called → done/skipped), backend WAJIB memanggil `broadcastQueueUpdate()` ke room Socket.io yang sesuai SETELAH transaksi database berhasil di-commit — tidak boleh ada jalur kode yang mengubah status tiket tanpa broadcast.
- **Dilarang Polling:** Frontend TIDAK BOLEH melakukan `setInterval` untuk fetch ulang status antrian secara berkala — semua update posisi antrian harus lewat event Socket.io. Jika ditemukan pola polling di kode, itu adalah bug yang harus diperbaiki, bukan fitur.
- **Room Scoping Wajib:** Broadcast Socket.io HARUS di-scope ke room `loket_{id}` spesifik — tidak boleh broadcast global ke semua klien yang terhubung.
- **Raw SQL untuk 2 Operasi Kritis:** `take-ticket` dan `call-next` WAJIB ditulis dengan raw SQL via `node-postgres`, bukan ORM — sesuai ARCHITECTURE.md.
- **Reset Harian per Loket:** Penomoran antrian direset otomatis setiap hari (berdasarkan `CURRENT_DATE` di query, bukan dihitung manual di aplikasi) — loket berbeda punya urutan nomor independen.

---

## 🏗️ Architecture Rules

- Setiap operasi database yang melibatkan lebih dari 1 query dan butuh konsistensi (take-ticket, call-next) WAJIB dibungkus `BEGIN`/`COMMIT`/`ROLLBACK` eksplisit, dengan `client.release()` di blok `finally`.
- Socket.io connection setup terpisah dari Express route handler — logic broadcast ada di `socketService.js`, dipanggil dari controller, bukan ditulis inline di route handler.
- Halaman publik (ambil nomor, lihat status) TIDAK memerlukan autentikasi. Semua route di bawah `/admin` atau yang mengubah status tiket via aksi petugas WAJIB dilindungi middleware JWT.

---

## 🔒 Security Rules

- `total_price`-equivalent di project ini (tidak ada nilai uang) tetap perlu validasi: `loket_id` yang dikirim dari client untuk ambil nomor HARUS divalidasi ada dan `is_active = true` di backend, jangan percaya begitu saja.
- Endpoint `call-next`, `done`, `skip` HANYA bisa diakses petugas yang login dan terasosiasi dengan `loket_id` yang bersangkutan (kalau desain akhirnya 1 admin = 1 loket) atau admin umum — sesuaikan sesuai keputusan final desain akses di PRD.md.

---

## ⚡ Performance Rules

- Query estimasi waktu tunggu (rata-rata durasi layanan) sebaiknya dibatasi ke N tiket terakhir (misal 10 terakhir) per loket, bukan menghitung dari semua histori — supaya tetap cepat seiring data bertambah banyak.
- Socket.io room memastikan bandwidth tidak terbuang — jangan sampai ada broadcast yang tidak perlu ke klien yang tidak relevan.

---

## ✅ Expected Output

Generate production-oriented code following:
- Express dengan pemisahan route/controller/service yang jelas
- Raw SQL (`node-postgres`) untuk operasi concurrency-sensitive, ORM/query builder ringan boleh untuk CRUD sederhana (loket, admin) jika diperlukan
- React dengan custom hook untuk logic Socket.io (`useQueueSocket`), bukan logic socket tersebar di banyak komponen

Rules:
- Be concise. Output code first. Avoid tutorials.
- Avoid speculative features — terutama nice-to-have (papan status gabungan, notifikasi suara) sebelum MVP selesai.
- Do not change database engine (PostgreSQL) or replace WebSocket dengan polling, dalam kondisi apapun.
- Follow PRD.md dan ARCHITECTURE.md before generating code.
- Prefer correctness pada concurrency handling (take-ticket, call-next) di atas kecepatan development — ini bagian yang paling menentukan nilai pembelajaran project ini.
- Always give commit name recommendation at the end of each Tasks done. Format: `feat: <task description>`