// frontend/src/pages/establishments/AddEstablishmentModal.jsx
import { useState, useRef } from "react";
import { createEstablishment } from "../../services/establishmentService";
import "../../styles/AddEstablishmentModal.css";

const TYPES = [
    "Accommodation","Agriculture & Learning","Bakery","Cafe",
    "Dining","Local Products","Nature & Gardens",
    "Resort & Recreation","Other",
];
const ACCREDITATIONS = ["None","Primary","Secondary"];
const EMPTY_FORM = {
    name:"", type:"", owner_name:"", address:"",
    description:"", latitude:"", longitude:"", accreditation:"None",
};

export default function AddEstablishmentModal({ onClose, onSuccess }) {
    const [form,      setForm]      = useState(EMPTY_FORM);
    const [images,    setImages]    = useState([]);   // File objects
    const [previews,  setPreviews]  = useState([]);   // Object URLs
    const [primaryIdx,setPrimaryIdx]= useState(0);    // which preview is primary
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState("");
    const fileRef = useRef();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    // ── Image picker ─────────────────────────────────────────────
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const total = images.length + files.length;
        if (total > 10) {
            setError("Maximum 10 images allowed.");
            return;
        }

        const newPreviews = files.map(f => URL.createObjectURL(f));
        setImages(prev => [...prev, ...files]);
        setPreviews(prev => [...prev, ...newPreviews]);
        e.target.value = ""; // reset input so same file can be re-added
    };

    const removeImage = (idx) => {
        URL.revokeObjectURL(previews[idx]);
        setImages(prev  => prev.filter((_, i) => i !== idx));
        setPreviews(prev => prev.filter((_, i) => i !== idx));
        if (primaryIdx >= idx && primaryIdx > 0) setPrimaryIdx(p => p - 1);
    };

    // ── Submit ───────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.type || !form.owner_name) {
            setError("Name, type, and owner are required."); return;
        }
        setLoading(true); setError("");
        try {
            // 1. Create establishment (returns { establishment: { id, ... } })
            const res = await createEstablishment({
                name:          form.name,
                type:          form.type,
                owner_name:    form.owner_name,
                address:       form.address     || null,
                description:   form.description || null,
                latitude:      form.latitude    || null,
                longitude:     form.longitude   || null,
                accreditation: form.accreditation,
            });

            // 2. Upload images if any
            if (images.length > 0) {
                const fd = new FormData();
                images.forEach(img => fd.append("images", img));

                // Mark which index is primary (send as query param)
                await fetch(
                    `http://localhost:5000/api/establishments/${res.establishment.id}/images?primary=${primaryIdx}`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        body: fd,
                    }
                );
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="aem-overlay" onClick={onClose}>
            <div className="aem-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="aem-header">
                    <div>
                        <h2 className="aem-title">Add Establishment</h2>
                        <p className="aem-sub">Fill in the details to register a new establishment</p>
                    </div>
                    <button className="aem-close-btn" onClick={onClose}>✕</button>
                </div>

                {error && <div className="aem-error">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="aem-form">

                    {/* ── Basic Info ── */}
                    <div className="aem-section-label">Basic Information</div>

                    <div className="aem-field">
                        <label className="aem-label">Establishment Name <span className="aem-req">*</span></label>
                        <input className="aem-input" type="text" name="name"
                            placeholder="e.g. Gementiza Inland Resort"
                            value={form.name} onChange={handleChange} />
                    </div>

                    <div className="aem-grid-2">
                        <div className="aem-field">
                            <label className="aem-label">Type <span className="aem-req">*</span></label>
                            <select className="aem-input" name="type"
                                value={form.type} onChange={handleChange}>
                                <option value="">Select type...</option>
                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="aem-field">
                            <label className="aem-label">Accreditation</label>
                            <select className="aem-input" name="accreditation"
                                value={form.accreditation} onChange={handleChange}>
                                {ACCREDITATIONS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="aem-field">
                        <label className="aem-label">Owner / Company Name <span className="aem-req">*</span></label>
                        <input className="aem-input" type="text" name="owner_name"
                            placeholder="e.g. Gementiza Resort Inc."
                            value={form.owner_name} onChange={handleChange} />
                    </div>

                    <div className="aem-field">
                        <label className="aem-label">Address</label>
                        <input className="aem-input" type="text" name="address"
                            placeholder="e.g. Barotac Nuevo, Iloilo"
                            value={form.address} onChange={handleChange} />
                    </div>

                    <div className="aem-field">
                        <label className="aem-label">Description</label>
                        <textarea className="aem-input aem-textarea" name="description"
                            placeholder="Brief description of the establishment..."
                            value={form.description} onChange={handleChange} rows={3} />
                    </div>

                    {/* ── Location ── */}
                    <div className="aem-section-label">Location Coordinates</div>
                    <div className="aem-grid-2">
                        <div className="aem-field">
                            <label className="aem-label">Latitude</label>
                            <input className="aem-input" type="number" step="any"
                                name="latitude" placeholder="e.g. 11.2245"
                                value={form.latitude} onChange={handleChange} />
                        </div>
                        <div className="aem-field">
                            <label className="aem-label">Longitude</label>
                            <input className="aem-input" type="number" step="any"
                                name="longitude" placeholder="e.g. 122.8936"
                                value={form.longitude} onChange={handleChange} />
                        </div>
                    </div>

                    {/* ── Images ── */}
                    <div className="aem-section-label">
                        Photos
                        <span className="aem-img-count">{images.length}/10</span>
                    </div>

                    {/* Drop zone */}
                    <div className="aem-dropzone" onClick={() => fileRef.current.click()}>
                        <span className="aem-dropzone-icon">🖼️</span>
                        <p className="aem-dropzone-text">Click to upload photos</p>
                        <p className="aem-dropzone-hint">JPEG, PNG, WebP · max 5 MB each · up to 10 images</p>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Preview grid */}
                    {previews.length > 0 && (
                        <div className="aem-preview-grid">
                            {previews.map((src, i) => (
                                <div
                                    key={i}
                                    className={`aem-preview-item ${primaryIdx === i ? "primary" : ""}`}
                                    onClick={() => setPrimaryIdx(i)}
                                    title="Click to set as primary photo"
                                >
                                    <img src={src} alt={`preview-${i}`} className="aem-preview-img" />
                                    {primaryIdx === i && (
                                        <span className="aem-primary-badge">⭐ Primary</span>
                                    )}
                                    <button
                                        type="button"
                                        className="aem-remove-img"
                                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                        title="Remove image"
                                    >✕</button>
                                </div>
                            ))}
                            {/* Add more button */}
                            {images.length < 10 && (
                                <div className="aem-preview-add" onClick={() => fileRef.current.click()}>
                                    <span>＋</span>
                                    <p>Add more</p>
                                </div>
                            )}
                        </div>
                    )}
                    {previews.length > 0 && (
                        <p className="aem-img-tip">
                            💡 Click a photo to set it as the <strong>primary</strong> cover image.
                        </p>
                    )}

                    {/* Footer */}
                    <div className="aem-footer">
                        <button type="button" className="aem-cancel-btn"
                            onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className="aem-submit-btn" disabled={loading}>
                            {loading ? "Saving..." : "+ Add Establishment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}