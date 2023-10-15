from app.extensions import db


class UrlCall(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(2048), nullable=False)
    url_id = db.Column(db.Integer, db.ForeignKey('shortened_url.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    method = db.Column(db.String(255), nullable=False)
    ip = db.Column(db.String(255), nullable=False)
    country = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(255), nullable=True)
    region = db.Column(db.String(255), nullable=True)
    userAgent = db.Column(db.String(255), nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False)
    status_code = db.Column(db.Integer, nullable=False)
    response_time = db.Column(db.Float, nullable=False)

