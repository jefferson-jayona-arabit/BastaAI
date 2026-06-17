// backend/models/establishmentModel.js
// Model — getters/setters only.

class EstablishmentModel {
    constructor({ id=null, user_id=null, name=null, type=null, owner_name=null,
                  address=null, description=null, latitude=null, longitude=null,
                  accreditation='None', status='New', rating=null,
                  submitted_at=null, created_at=null } = {}) {
        this._id            = id;
        this._user_id       = user_id;
        this._name          = name;
        this._type          = type;
        this._owner_name    = owner_name;
        this._address       = address;
        this._description   = description;
        this._latitude      = latitude;
        this._longitude     = longitude;
        this._accreditation = accreditation;
        this._status        = status;
        this._rating        = rating;
        this._submitted_at  = submitted_at;
        this._created_at    = created_at;
    }

    getId()             { return this._id; }
    getUserId()         { return this._user_id; }
    getName()           { return this._name; }
    getType()           { return this._type; }
    getOwnerName()      { return this._owner_name; }
    getAddress()        { return this._address; }
    getDescription()    { return this._description; }
    getLatitude()       { return this._latitude; }
    getLongitude()      { return this._longitude; }
    getAccreditation()  { return this._accreditation; }
    getStatus()         { return this._status; }
    getRating()         { return this._rating; }
    getSubmittedAt()    { return this._submitted_at; }
    getCreatedAt()      { return this._created_at; }

    setId(v)            { this._id            = v; }
    setUserId(v)        { this._user_id       = v; }
    setName(v)          { this._name          = v; }
    setType(v)          { this._type          = v; }
    setOwnerName(v)     { this._owner_name    = v; }
    setAddress(v)       { this._address       = v; }
    setDescription(v)   { this._description   = v; }
    setLatitude(v)      { this._latitude      = v; }
    setLongitude(v)     { this._longitude     = v; }
    setAccreditation(v) { this._accreditation = v; }
    setStatus(v)        { this._status        = v; }
    setRating(v)        { this._rating        = v; }
    setSubmittedAt(v)   { this._submitted_at  = v; }
    setCreatedAt(v)     { this._created_at    = v; }

    toPlainObject() {
        return { id: this._id, user_id: this._user_id, name: this._name,
                 type: this._type, owner_name: this._owner_name, address: this._address,
                 description: this._description, latitude: this._latitude,
                 longitude: this._longitude, accreditation: this._accreditation,
                 status: this._status, rating: this._rating,
                 submitted_at: this._submitted_at, created_at: this._created_at };
    }

    toString() {
        return `EstablishmentModel{ id=${this._id}, status='${this._status}' }`;
    }
}
module.exports = EstablishmentModel;