// backend/models/qrMonitoringModel.js
// Model — getters/setters only.

class QRMonitoringModel {
    constructor({ id=null, establishment_id=null, name=null, total_scans=0,
                  last_scan_at=null, is_active=false } = {}) {
        this._id               = id;
        this._establishment_id = establishment_id;
        this._name             = name;
        this._total_scans      = total_scans;
        this._last_scan_at     = last_scan_at;
        this._is_active        = is_active;
    }

    getId()              { return this._id; }
    getEstablishmentId() { return this._establishment_id; }
    getName()            { return this._name; }
    getTotalScans()      { return this._total_scans; }
    getLastScanAt()      { return this._last_scan_at; }
    getIsActive()        { return this._is_active; }

    setId(v)              { this._id               = v; }
    setEstablishmentId(v) { this._establishment_id = v; }
    setName(v)            { this._name             = v; }
    setTotalScans(v)      { this._total_scans      = v; }
    setLastScanAt(v)      { this._last_scan_at     = v; }
    setIsActive(v)        { this._is_active        = v; }

    toPlainObject() {
        return { id: this._id, establishment_id: this._establishment_id,
                 name: this._name, total_scans: this._total_scans,
                 last_scan_at: this._last_scan_at, is_active: this._is_active };
    }

    toString() {
        return `QRMonitoringModel{ id=${this._id}, totalScans=${this._total_scans} }`;
    }
}
module.exports = QRMonitoringModel;