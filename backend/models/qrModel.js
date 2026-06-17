// backend/models/qrModel.js
// Model — getters/setters only.

class QRModel {
    constructor({ id=null, establishment_id=null, code=null,
                  is_active=true, created_at=null } = {}) {
        this._id               = id;
        this._establishment_id = establishment_id;
        this._code             = code;
        this._is_active        = is_active;
        this._created_at       = created_at;
    }

    getId()               { return this._id; }
    getEstablishmentId()  { return this._establishment_id; }
    getCode()             { return this._code; }
    getIsActive()         { return this._is_active; }
    getCreatedAt()        { return this._created_at; }

    setId(v)              { this._id               = v; }
    setEstablishmentId(v) { this._establishment_id = v; }
    setCode(v)            { this._code             = v; }
    setIsActive(v)        { this._is_active        = v; }
    setCreatedAt(v)       { this._created_at       = v; }

    toPlainObject() {
        return { id: this._id, establishment_id: this._establishment_id,
                 code: this._code, is_active: this._is_active, created_at: this._created_at };
    }

    toString() {
        return `QRModel{ id=${this._id}, is_active=${this._is_active} }`;
    }
}
module.exports = QRModel;