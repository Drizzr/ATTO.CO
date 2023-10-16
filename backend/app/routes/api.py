from flask import Blueprint, request, jsonify, redirect, g
from app.utils.errorHandlers import HTTP_406_NOT_ACCEPTABLE, HTTP_201_CREATED,HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND, HTTP_200_OK
import string
from flask_cors import cross_origin
import random
from app.models import URL, Log
from app.extensions import db
from app.security.decorators import access_token_required
from app.security.tools import is_verified
from datetime import datetime, timedelta


api = Blueprint('api', __name__)


import random
import string
from urllib.parse import quote

def generate_url_safe_sequence():
    # Define the set of URL-safe characters
    url_safe_characters = string.ascii_letters + string.digits + "-_.~"

    # Generate a 4-character sequence randomly
    sequence = ''.join(random.choice(url_safe_characters) for _ in range(4))

    # URL-encode the sequence to make it safe for URLs
    url_safe_sequence = quote(sequence)

    return url_safe_sequence


# implement url proposal
# adaptive 



@api.route('/create-url/', methods=['POST'])
@cross_origin(supports_credentials=True, headers=["Content-Type", "x_access_token"], origins=["http://127.0.0.1:5173", "http://localhost:5173"], with_credentials=True, expose_headers=["Content-Type", "x_access_token", "Set-Cookie"], allow_headers=["Content-Type", "x_access_token", "Set-Cookie"], allow_credentials=True)
@access_token_required()
def createUrl(current_user):

    url = request.json['url']
    wish = request.json['urlWish']

    if wish and len(wish) <= 10:
        try:
            url_query = URL.query.filter_by(short_url=wish).first()
            if url_query is None:
                new_url = URL(original_url=url, short_url=wish, user_id=current_user.id)
                db.session.add(new_url)
                db.session.commit()
                return jsonify({"message": "Success, url created!", "short_url": wish}), HTTP_201_CREATED
            raise Exception("URL-wish not available")
        except Exception as e:
            print(e)
            return jsonify({"message": "URL-wish not available"}), HTTP_406_NOT_ACCEPTABLE

    elif len(wish) > 10:
        return jsonify({"message": "URL-wish too long"}), HTTP_406_NOT_ACCEPTABLE
    
    else:
        
        # Generate a 4-character sequence randomly
        shortend_url = generate_url_safe_sequence()

        new_url = URL(original_url=url, short_url=shortend_url)

        db.session.add(new_url)
        db.session.commit()

        return jsonify({"message": "Success, url created!", "short_url": shortend_url}), HTTP_201_CREATED


@api.route('/<short_url>')
def get_url(short_url):
    url_query = URL.query.filter_by(short_url=short_url).first()

    if url_query:
        if url_query.secured:
            current_user = is_verified()
            if current_user:

                return jsonify({"message": "Success", "url": url_query.original_url}), HTTP_200_OK
                
    
            else:
                return jsonify({"error": "url is secured"}), HTTP_403_FORBIDDEN

        return jsonify({"message": "Success", "url": url_query.original_url}), HTTP_200_OK

    return jsonify({"error": "url not found"}), HTTP_404_NOT_FOUND



@api.route('/available/<short_url>')
def check_available(short_url):
    url = URL.query.filter_by(short_url=short_url).first()
    if url is None:
        return jsonify({"message": "Success", "available": True}), HTTP_200_OK
    return jsonify({"message": "Success", "available": False}), HTTP_200_OK
    


@api.route("/<short_url>/stats/<days>")
@cross_origin(supports_credentials=True, headers=["Content-Type", "Authorization"], origins=["http://127.0.0.1:5173", "http://localhost:5173"], with_credentials=True, expose_headers=["Content-Type", "Authorization", "Set-Cookie"], allow_headers=["Content-Type", "Authorization", "Set-Cookie"], allow_credentials=True)
@access_token_required()
def get_url_stats(current_user, short_url, days):
    url = URL.query.filter_by(short_url=short_url, user_id=current_user.id).first_or_404()
    logs = Log.query.filter(Log.url_id == url.id, Log.timestamp > datetime.utcnow() - timedelta(days=days)).all()
    total_calls = len(logs)
    unique_ips = len(set([log.device.ip for log in logs]))
    avg_speed = sum([log.speed for log in logs]) / total_calls

    stats_per_day = {}

    try:
        for i in range(int(days)):
            logs = Log.query.filter(Log.url_id == url.id, Log.timestamp > datetime.utcnow() - timedelta(days=i+1), Log.timestamp < datetime.utcnow() - timedelta(days=i)).all()
            stats_per_day[i] = {
                "total_calls": len(logs),
                "unique_ips": len(set([log.device.ip for log in logs])),
                "avg_speed": sum([log.speed for log in logs]) / total_calls
            }
        
    except Exception as e:
        print(e)
        return jsonify({"error": "invalid days"}), HTTP_406_NOT_ACCEPTABLE
    
    
    return jsonify({"message": "Success", "total_calls": total_calls, "unique_ips": unique_ips, "avg_speed": avg_speed, "stats_per_day": stats_per_day}), HTTP_200_OK

