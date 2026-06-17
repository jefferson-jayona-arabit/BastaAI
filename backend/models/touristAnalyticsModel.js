// backend/models/touristAnalyticsModel.js
// Model — getters/setters only.

class TouristAnalyticsModel {
    constructor({ id=null, name=null, total_scans=0, label=null,
                  unique_visitors=0 } = {}) {
        this._id              = id;
        this._name            = name;
        this._total_scans     = total_scans;
        this._label           = label;
        this._unique_visitors = unique_visitors;
    }

    getId()             { return this._id; }
    getName()           { return this._name; }
    getTotalScans()     { return this._total_scans; }
    getLabel()          { return this._label; }
    getUniqueVisitors() { return this._unique_visitors; }

    setId(v)             { this._id              = v; }
    setName(v)           { this._name            = v; }
    setTotalScans(v)     { this._total_scans     = v; }
    setLabel(v)          { this._label           = v; }
    setUniqueVisitors(v) { this._unique_visitors = v; }

    toPlainObject() {
        return { id: this._id, name: this._name, total_scans: this._total_scans,
                 label: this._label, unique_visitors: this._unique_visitors };
    }

    toString() {
        return `TouristAnalyticsModel{ id=${this._id}, totalScans=${this._total_scans} }`;
    }
}
module.exports = TouristAnalyticsModel;