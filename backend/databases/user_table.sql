-- ================================================
-- BASTA AI - Users Table (AES-256 Encrypted)
-- Run this in pgAdmin Query Tool
-- ================================================

DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users (
    id          SERIAL PRIMARY KEY,
    fullname    TEXT NOT NULL,           -- AES-256 encrypted
    email       TEXT NOT NULL,           -- AES-256 encrypted
    password    VARCHAR(255) NOT NULL,   -- bcrypt hashed
    role        VARCHAR(50)  NOT NULL CHECK (role IN ('tourist', 'admin', 'establishment')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.users OWNER TO postgres;