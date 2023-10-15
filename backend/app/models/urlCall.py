from app.extensions import db


class UrlCall(db.Model):

    __name__ = "url_call"
    
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(2048), nullable=False)
    url_id = db.Column(db.Integer, db.ForeignKey('url.id'), nullable=False)
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
    


class DailyUrlCall(db.Model):

    __name__ = "daily_url_call"

    total_calls = db.Column(db.Integer, nullable=False)
    successfull_calls = db.Column(db.Integer, nullable=False)
    failed_calls = db.Column(db.Integer, nullable=False)
    average_response_time = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, primary_key=True)
    url_id = db.Column(db.Integer, db.ForeignKey('url.id'), primary_key=True)
