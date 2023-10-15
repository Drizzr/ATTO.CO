from app.extensions import db
from app.models.user_role_link import userRoleLink

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))
    email = db.Column(db.String(50))
    urls = db.relationship('ShortenedURL', backref='user', lazy=True)
    roles = db.relationship('Role', secondary=userRoleLink)
    calls = db.relationship('UrlCall', backref='user', lazy=True)

    expired_tokens = db.relationship('ExpiredToken', backref='user', lazy=True)


class ExpiredToken(db.Model):

    __name__ = "expired_token"

    id : int = db.Column(db.Integer, primary_key=True)
    user_id : int = db.Column(db.Integer, db.ForeignKey("user.id", ondelete='CASCADE')) 
    token : str = db.Column(db.String(250))
    expiration_date : float = db.Column(db.Float) # stored in utc-float timestamp
    type : str = db.Column(db.String(15))

    def to_json(self):
        return dict(user=self.user_id, type=self.type, token=self.token, exp=self.expiration_date)
