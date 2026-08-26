# TASKS.md — Antrian Digital

## Cara Pakai File Ini
Eksekusi berurutan. Fokus pembelajaran utama project ini ada di **Phase 3 (Atomic Operations)** dan **Phase 4 (Real-Time Socket.io)** — dua checkpoint ini paling penting diuji manual, bukan cuma "kodenya jalan tanpa error".

---

## Phase 0 — Setup Project

- [ ] Init folder `server/` (Express + Node) dan `client/` (React via Vite) sebagai 2 project terpisah dalam 1 repo
- [ ] Setup `docker-compose.yml`: PostgreSQL saja (server & client dijalankan langsung via `npm run dev` saat development, tidak perlu di-Docker-kan dulu untuk kemudahan iterasi)
- [ ] Install dependencies server: `express`, `pg`, `socket.io`, `jsonwebtoken`, `bcrypt`, `dotenv`
- [ ] Install dependencies client: `react-router-dom`, `socket.io-client`, `axios`
- [ ] **Checkpoint:** `docker compose up` menjalankan PostgreSQL, server Express bisa connect ke database tanpa error

## Phase 1 — Database Schema

- [ ] Migration SQL: `loket`, `daily_counters`, `queue_tickets`, `admins` sesuai PRD.md section 8
- [ ] Seeder: 2-3 loket contoh, 1 admin contoh (password di-hash pakai bcrypt)
- [ ] **Checkpoint:** jalankan migration & seeder, cek data masuk lewat `psql` langsung

## Phase 2 — CRUD Dasar (Tanpa Concurrency/Real-Time Dulu)

- [ ] `loket.routes.js` + `loket.controller.js` — CRUD loket sederhana
- [ ] `auth.routes.js` + `auth.controller.js` — login admin, generate JWT
- [ ] `authMiddleware.js` — verifikasi JWT untuk route admin
- [ ] Frontend: halaman `Login.jsx`, halaman admin dasar untuk kelola loket
- [ ] **Checkpoint:** admin bisa login, CRUD loket berfungsi dari UI, route admin ter-protect (akses tanpa token ditolak)

## Phase 3 — Atomic Operations (Ambil Nomor & Call-Next) — PALING KRITIS

- [ ] `queueService.js` — implementasi `takeNewTicket()` sesuai pola `ON CONFLICT DO UPDATE` di ARCHITECTURE.md
- [ ] `queueService.js` — implementasi `callNextTicket()` sesuai pola `FOR UPDATE SKIP LOCKED` di ARCHITECTURE.md
- [ ] `queue.routes.js` + `queue.controller.js` — endpoint `POST /loket/:id/take-ticket` dan `POST /loket/:id/call-next`
- [ ] Frontend: halaman `TakeQueue.jsx` (ambil nomor), tombol "Panggil Berikutnya" di dashboard admin
- [ ] **Checkpoint (WAJIB diuji manual, bukan cuma baca kode):**
  1. Buka 2 tab browser berbeda, klik "Ambil Nomor Antrian" untuk loket yang sama di kedua tab secara nyaris bersamaan — pastikan hasilnya 2 nomor BERBEDA, bukan nomor yang sama.
  2. Buka 2 tab dashboard admin (atau simulasikan dengan 2 request cURL/Postman bersamaan) untuk loket yang sama, klik "Panggil Berikutnya" di kedua tab secara nyaris bersamaan — pastikan hasilnya 2 tiket BERBEDA yang berhasil dipanggil, bukan 1 tiket yang "dipanggil dobel" atau error.

## Phase 4 — Real-Time via Socket.io — SAMA KRITISNYA

- [ ] `socket.js` — setup Socket.io server, gabungkan dengan HTTP server yang sama dengan Express
- [ ] `socketService.js` — fungsi `broadcastQueueUpdate(io, loketId, data)`
- [ ] Integrasikan broadcast ke SETIAP endpoint yang mengubah status tiket (take-ticket, call-next, done, skip) — sesuai Hard Rules di AGENTS.md
- [ ] Frontend: `useQueueSocket.js` custom hook — join room, listen event `queue:update`
- [ ] Frontend: halaman `QueueStatus.jsx` — tampilkan posisi antrian yang update otomatis
- [ ] **Checkpoint (WAJIB diuji manual):** buka halaman `QueueStatus.jsx` di 2 tab berbeda (seolah 2 mahasiswa menunggu di loket yang sama), lalu dari dashboard admin klik "Panggil Berikutnya" — pastikan KEDUA tab tersebut update posisi antriannya secara otomatis TANPA di-refresh manual sama sekali.

## Phase 5 — Estimasi Waktu Tunggu

- [ ] Query rata-rata durasi layanan (called_at → completed_at) dari N tiket terakhir per loket
- [ ] Tampilkan estimasi di `QueueStatus.jsx` (posisi antrian × rata-rata durasi)
- [ ] **Checkpoint:** estimasi muncul dan masuk akal (tidak 0 atau angka aneh) setelah ada beberapa tiket yang sudah `done`

## Phase 6 — Fitur "Selesai" & "Skip"

- [ ] Endpoint & UI untuk tandai tiket `done` dan `skipped`
- [ ] Pastikan broadcast juga berjalan untuk 2 aksi ini (sesuai Hard Rules)
- [ ] **Checkpoint:** alur lengkap dari ambil nomor → dipanggil → selesai/skip berjalan mulus dan ter-update real-time di semua sisi

## Phase 7 — Polish & Testing Menyeluruh

- [ ] Test skenario: loket dengan antrian kosong (klik "Panggil Berikutnya" saat tidak ada yang menunggu) — pastikan tidak error, tampilkan pesan yang jelas
- [ ] Test multi-loket: pastikan update di Loket A tidak muncul di layar mahasiswa yang menunggu di Loket B
- [ ] Review keseluruhan concurrency handling — coba stress test sederhana (buka banyak tab sekaligus, ambil nomor bersamaan)

## Phase 8 (Nice-to-Have, Setelah MVP Stabil)

- [ ] Papan status gabungan semua loket dalam 1 halaman
- [ ] Notifikasi saat antrian tersisa sedikit
- [ ] Statistik harian/mingguan

## Phase 9 — Deployment

- [ ] Dockerize server & client untuk production
- [ ] Deploy ke VPS
- [ ] Test end-to-end di lingkungan production-like, termasuk ulangi checkpoint Phase 3 & 4 di sana
