DROP TABLE IF EXISTS queue_tickets;
DROP TABLE IF EXISTS daily_counters;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS loket;

CREATE TABLE loket (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_counters (
    id SERIAL PRIMARY KEY,
    loket_id INTEGER REFERENCES loket(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    last_number INTEGER NOT NULL DEFAULT 0,
    UNIQUE(loket_id, date)
);

CREATE TABLE queue_tickets (
    id SERIAL PRIMARY KEY,
    loket_id INTEGER REFERENCES loket(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'waiting', -- waiting | called | done | skipped
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    loket_id INTEGER REFERENCES loket(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
