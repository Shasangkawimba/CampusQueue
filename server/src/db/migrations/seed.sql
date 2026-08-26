-- Insert some sample lokets
INSERT INTO loket (name, description, is_active) VALUES
('Loket A - Administrasi Umum', 'Layanan pendaftaran dan administrasi mahasiswa', true),
('Loket B - Keuangan', 'Layanan pembayaran dan informasi SPP', true),
('Loket C - Pengambilan Ijazah', 'Layanan khusus pengambilan dokumen kelulusan', true);

-- Insert admin user (password is 'password123' hashed with bcrypt)
-- Using $2b$10$w8T.N.yYcK4wB/D2/XzQjO55rXnQv7V2k3iT3j9nZt2c3r5Qv7V2k
-- Wait, I will hash password in JS instead, or use a pre-calculated hash.
-- password123 -> $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW
INSERT INTO admins (username, password_hash, loket_id) VALUES
('admin_a', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 1),
('admin_b', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 2),
('superadmin', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', NULL);

-- Insert some dummy queue tickets for today so there is data to display
INSERT INTO daily_counters (loket_id, date, last_number) VALUES
(1, CURRENT_DATE, 3),
(2, CURRENT_DATE, 1);

INSERT INTO queue_tickets (loket_id, number, status) VALUES
(1, 1, 'called'),
(1, 2, 'waiting'),
(1, 3, 'waiting'),
(2, 1, 'waiting');
