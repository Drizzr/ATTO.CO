
from app import db

class ShortenedURL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(2048), nullable=False, unique=False)
    short_url = db.Column(db.String(10), nullable=False, unique=True)
