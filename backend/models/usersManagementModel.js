// backend/models/usersManagementModel.js
// Model — getters/setters only.

class UsersManagementModel {
    constructor({ id=null, fullname=null, email=null, role=null,
                  status=null, created_at=null, visit_count=0 } = {}) {
        this._id          = id;
        this._fullname    = fullname;
        this._email       = email;
        this._role        = role;
        this._status      = status;
        this._created_at  = created_at;
        this._visit_count = visit_count;
    }

    getId()         { return this._id; }
    getFullname()   { return this._fullname; }
    getEmail()      { return this._email; }
    getRole()       { return this._role; }
    getStatus()     { return this._status; }
    getCreatedAt()  { return this._created_at; }
    getVisitCount() { return this._visit_count; }

    setId(v)          { this._id          = v; }
    setFullname(v)    { this._fullname    = v; }
    setEmail(v)       { this._email       = v; }
    setRole(v)        { this._role        = v; }
    setStatus(v)      { this._status      = v; }
    setCreatedAt(v)   { this._created_at  = v; }
    setVisitCount(v)  { this._visit_count = v; }

    toPlainObject() {
        return { id: this._id, fullname: this._fullname, email: this._email,
                 role: this._role, status: this._status,
                 created_at: this._created_at, visit_count: this._visit_count };
    }

    toString() {
        return `UsersManagementModel{ id=${this._id}, role='${this._role}' }`;
    }
}
module.exports = UsersManagementModel;