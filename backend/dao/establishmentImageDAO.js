// backend/dao/establishmentImageDAO.js
//
// Data Access Object for the `establishment_images` table.
// Responsible ONLY for executing SQL — no business logic here.
// ─────────────────────────────────────────────────────────────────

const pool = require('../config/db');

const EstablishmentImageDAO = {

    // ── Get all images for an establishment ─────────────────────
    findByEstablishment: async (establishment_id) => {
        const { rows } = await pool.query(
            `SELECT id, establishment_id, image_url, is_primary, sort_order, uploaded_at
             FROM establishment_images
             WHERE establishment_id = $1
             ORDER BY sort_order ASC, uploaded_at ASC`,
            [establishment_id]
        );
        return rows;
    },

    // ── Get primary image only ──────────────────────────────────
    findPrimaryByEstablishment: async (establishment_id) => {
        const { rows } = await pool.query(
            `SELECT id, image_url, is_primary
             FROM establishment_images
             WHERE establishment_id = $1 AND is_primary = TRUE
             LIMIT 1`,
            [establishment_id]
        );
        return rows[0] ?? null;
    },

    // ── Insert one image row ────────────────────────────────────
    insert: async ({ establishment_id, image_url, is_primary, sort_order }) => {
        const { rows } = await pool.query(
            `INSERT INTO establishment_images
                (establishment_id, image_url, is_primary, sort_order)
             VALUES ($1, $2, $3, $4)
             RETURNING id, establishment_id, image_url, is_primary, sort_order, uploaded_at`,
            [establishment_id, image_url, is_primary ?? false, sort_order ?? 0]
        );
        return rows[0];
    },

    // ── Insert multiple images at once ──────────────────────────
    insertMany: async (establishment_id, images) => {
        // images = [{ image_url, is_primary, sort_order }, ...]
        const inserted = [];
        for (const [i, img] of images.entries()) {
            const row = await EstablishmentImageDAO.insert({
                establishment_id,
                image_url:  img.image_url,
                is_primary: img.is_primary ?? i === 0, // first = primary by default
                sort_order: img.sort_order ?? i,
            });
            inserted.push(row);
        }
        return inserted;
    },

    // ── Set a specific image as primary ─────────────────────────
    setPrimary: async (establishment_id, image_id) => {
        // Clear existing primary
        await pool.query(
            `UPDATE establishment_images
             SET is_primary = FALSE
             WHERE establishment_id = $1`,
            [establishment_id]
        );
        // Set new primary
        const { rows } = await pool.query(
            `UPDATE establishment_images
             SET is_primary = TRUE
             WHERE id = $1 AND establishment_id = $2
             RETURNING id, image_url, is_primary`,
            [image_id, establishment_id]
        );
        return rows[0] ?? null;
    },

    // ── Delete one image by ID ──────────────────────────────────
    deleteById: async (id) => {
        const { rows } = await pool.query(
            `DELETE FROM establishment_images
             WHERE id = $1
             RETURNING id, image_url`,
            [id]
        );
        return rows[0] ?? null;
    },

    // ── Delete all images for an establishment ──────────────────
    deleteByEstablishment: async (establishment_id) => {
        const { rows } = await pool.query(
            `DELETE FROM establishment_images
             WHERE establishment_id = $1
             RETURNING id, image_url`,
            [establishment_id]
        );
        return rows;
    },
};

module.exports = EstablishmentImageDAO;