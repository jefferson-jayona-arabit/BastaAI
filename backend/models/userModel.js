// backend/models/userModel.js
// Model — getters/setters only (mirrors Java AdminModel pattern).
// No SQL, no business logic here.

class UserModel {
    constructor({ id=null, fullname=null, email=null, password=null,
                  role=null, status='active', created_at=null } = {}) {
        this._id         = id;
        this._fullname   = fullname;
        this._email      = email;
        this._password   = password;
        this._role       = role;
        this._status     = status;
        this._created_at = created_at;
    }

    getId()         { return this._id; }
    getFullname()   { return this._fullname; }
    getEmail()      { return this._email; }
    getPassword()   { return this._password; }
    getRole()       { return this._role; }
    getStatus()     { return this._status; }
    getCreatedAt()  { return this._created_at; }

    setId(v)          { this._id         = v; }
    setFullname(v)    { this._fullname   = v; }
    setEmail(v)       { this._email      = v; }
    setPassword(v)    { this._password   = v; }
    setRole(v)        { this._role       = v; }
    setStatus(v)      { this._status     = v; }
    setCreatedAt(v)   { this._created_at = v; }

    toPlainObject() {
        return { id: this._id, fullname: this._fullname, email: this._email,
                 password: this._password, role: this._role,
                 status: this._status, created_at: this._created_at };
    }

    toString() {
        return `UserModel{ id=${this._id}, role='${this._role}', status='${this._status}' }`;
    }
}
module.exports = UserModel;