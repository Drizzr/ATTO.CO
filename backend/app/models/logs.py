from app.extensions import db


class Log(db.Model):

    __name__ = "log"

    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(2048), nullable=False)
    method = db.Column(db.String(255), nullable=False)
    blueprint = db.Column(db.String(255))
    url_args = db.Column(db.JSON, nullable=False)
    speed = db.Column(db.Float, nullable=False)
    url = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    status_code = db.Column(db.Integer, nullable=False)

    device_id = db.Column(db.Integer, db.ForeignKey("device.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    shortend_url_id = db.Column(db.Integer, db.ForeignKey("url.id"))