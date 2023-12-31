from app.extensions import db
from app.models.user_role_link import userRoleLink
from app.models.device_user_link import deviceUserLink
from .role import Role

class User(db.Model):
    __name__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))
    email = db.Column(db.String(50))
    roles = db.relationship('Role', secondary=userRoleLink)

    expired_tokens = db.relationship('ExpiredToken', backref='user', lazy=True)
    urls = db.relationship('URL', backref='user', lazy=True)
    devices = db.relationship('Device', secondary=deviceUserLink, backref='user', lazy=True)
    loggs = db.relationship('Log', backref='user', lazy=True)

    def set_role(self, role):
        self.roles.append(Role.query.filter_by(name=role).first())


class ExpiredToken(db.Model):


    id : int = db.Column(db.Integer, primary_key=True)
    user_id : int = db.Column(db.Integer, db.ForeignKey("user.id", ondelete='CASCADE')) 
    token : str = db.Column(db.String(250))
    expiration_date : float = db.Column(db.Float) # stored in utc-float timestamp
    type : str = db.Column(db.String(15))

    def to_json(self):
        return dict(user=self.user_id, type=self.type, token=self.token, exp=self.expiration_date)
