from app import db
from app.models import Device, Log
from flask import g, request, abort, current_app
from datetime import datetime
import json



def logging():        

    
    start_time = datetime.utcnow()
    client_ip = request.environ['REMOTE_ADDR']

    device_query = Device.query.filter_by(ip=client_ip).first()

    if not device_query:
        device_query = Device(
                            ip = client_ip, 
                            calls_all_time = 1, 
                            last_call = start_time,
                            flagged = False,
                            )
        
        db.session.add(device_query)
    else:
        device_query.calls_all_time += 1
    device_query.last_call = start_time
    
    g.device = device_query


    
    new_log = Log(
            url = request.url,
            method = request.method,
            blueprint = request.blueprint,
            path = request.path,
            url_args = request.args,
            timestamp = start_time,
            device = device_query,
        )
    
    g.start_time = start_time
    g.new_log = new_log

def logging_backref(response):
    diff = datetime.utcnow() - g.start_time

    try:
        new_log = g.new_log
        new_log.speed = diff.total_seconds()
        new_log.status_code = response.status_code
        db.session.add(new_log)
        db.session.commit()
    except AttributeError:
        pass
        

    return response