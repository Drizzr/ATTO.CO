from ..extensions import db

class Device(db.Model):

    __tablename__ = "device"

    # device properties
    id  = db.Column(db.Integer, primary_key=True)
    ip : str = db.Column("ip", db.String(50))
    country : str  = db.Column(db.String(20))
    region : str = db.Column(db.String(20))
    city : str = db.Column(db.String(20))
    calls_all_time : int = db.Column(db.Integer)
    last_call : str = db.Column(db.String(50))
    flagged : bool = db.Column(db.Boolean)

    loggs = db.relationship('Log', backref='device', lazy=True)

    def __repr__(self):
        return f'<Device {self.ip}>'
    
    def to_json(self):
        return dict(ip=self.ip, userAgent=self.user_agent, flagged=self.flagged, last_call=self.last_call, country=self.country, region=self.region)

    
