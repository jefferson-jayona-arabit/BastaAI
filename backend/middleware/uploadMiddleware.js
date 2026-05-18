// backend/middleware/uploadMiddleware.js
//
// Multer configuration for multi-image uploads.
// Stores files in /uploads/establishments/<establishment_id>/
// ─────────────────────────────────────────────────────────────────

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ── Storage engine ──────────────────────────────────────────────
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        // Use establishment_id from route param, fallback to 'temp'
        const estId  = req.params.id || 'temp';
        const folder = path.join(__dirname, '..', 'uploads', 'establishments', String(estId));

        // Create folder if it doesn't exist
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const ext      = path.extname(file.originalname).toLowerCase();
        const safeName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        cb(null, safeName);
    },
});

// ── File filter — images only ───────────────────────────────────
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extOk   = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk  = allowed.test(file.mimetype);

    if (extOk && mimeOk) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and WebP images are allowed.'));
    }
};

// ── Multer instance ─────────────────────────────────────────────
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize:  5 * 1024 * 1024,  // 5 MB per file
        files:     10,                // max 10 images per upload
    },
});

// ── Named exports for use in routes ────────────────────────────
// upload.array('images', 10)  → field name "images", max 10 files
module.exports = upload;