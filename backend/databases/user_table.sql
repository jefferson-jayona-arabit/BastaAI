-- ================================================
-- BASTA AI - Users Table
-- Run this in pgAdmin Query Tool
-- ================================================

-- Drop existing table if needed (optional)
-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users (
    id          SERIAL PRIMARY KEY,
    fullname    VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    username    VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(50)  NOT NULL CHECK (role IN ('tourist', 'admin', 'establishment')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.users OWNER TO postgres;

-- ================================================
-- Sample admin user (password: basta2024)
-- Note: In real use, password must be hashed
-- ================================================
-- INSERT INTO public.users (fullname, email, username, password, role)
-- VALUES ('Admin User', 'admin@bastaai.com', 'admin', 'basta2024', 'admin');