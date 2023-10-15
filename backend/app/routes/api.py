from flask import Blueprint, request, jsonify, redirect, g
from app.utils.errorHandlers import HTTP_406_NOT_ACCEPTABLE, HTTP_201_CREATED,HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND, HTTP_200_OK
import string
import random
from app.models import ShortenedURL, UrlCall
from app.extensions import db
from app.security.decorators import access_token_required
from app.security.tools import is_verified
from datetime import datetime


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
def createUrl():

    url = request.json['url']
    wish = request.json['urlWish']

    if wish and len(wish) <= 10:
        try:
            url_query = ShortenedURL.query.filter_by(short_url=wish).first()
            if url_query is None:
                new_url = ShortenedURL(original_url=url, short_url=wish)
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

        new_url = ShortenedURL(original_url=url, short_url=shortend_url)

        db.session.add(new_url)
        db.session.commit()

        return jsonify({"message": "Success, url created!", "short_url": shortend_url}), HTTP_201_CREATED


@api.route('/<short_url>')
def get_url(short_url):
    url_query = ShortenedURL.query.filter_by(short_url=short_url).first()

    newUrlCall = UrlCall(url_id=url_query.id, method=request.method, path=request.environ['RAW_URI'], ip=request.remote_addr, userAgent=request.headers.get("User-Agent"), timestamp=datetime.utcnow())

    g.newUrlCall = newUrlCall

    if url_query:
        if url_query.secured:
            current_user = is_verified()
            if current_user:
                newUrlCall.user_id = current_user.id

                return jsonify({"message": "Success", "url": url_query.original_url}), HTTP_200_OK
                
    
            else:
                return jsonify({"error": "url is secured"}), HTTP_403_FORBIDDEN

        return jsonify({"message": "Success", "url": url_query.original_url}), HTTP_200_OK

    return jsonify({"error": "url not found"}), HTTP_404_NOT_FOUND



@api.route('/available/<short_url>')
def check_available(short_url):
    url = ShortenedURL.query.filter_by(short_url=short_url).first()
    if url is None:
        return jsonify({"message": "Success", "available": True}), HTTP_200_OK
    return jsonify({"message": "Success", "available": False}), HTTP_200_OK
    


