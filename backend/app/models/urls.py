
from app import db

class ShortenedURL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(2048), nullable=False, unique=False)
    short_url = db.Column(db.String(10), nullable=False, unique=True)
    secured = db.Column(db.Boolean, default=False)

    users_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    calls = db.relationship('UrlCall', backref='shortened_url', lazy=True)