from flask import Blueprint, request, jsonify, redirect
from app.utils.errorHandlers import HTTP_406_NOT_ACCEPTABLE, HTTP_201_CREATED, HTTP_404_NOT_FOUND, HTTP_200_OK
import string
import random
from app.models import ShortenedURL
from app.extensions import db

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



@api.route('/create-url/', methods=['POST'])
def createUrl():

    url = request.json['url']

    url_query = ShortenedURL.query.filter_by(original_url=url).first()
    if not url_query:
        

        # Generate a 4-character sequence randomly
        shortend_url = generate_url_safe_sequence()

        new_url = ShortenedURL(original_url=url, short_url=shortend_url)

        db.session.add(new_url)
        db.session.commit()

        return jsonify({"message": "Success, url created!", "short_url": shortend_url}), HTTP_201_CREATED

    return jsonify({"message": "Url already has a shortened version", "short_url": url_query.short_url}), HTTP_406_NOT_ACCEPTABLE



@api.route('/<short_url>')
def redirect_to_url(short_url):
    url = ShortenedURL.query.filter_by(short_url=short_url).first()
    if url is None:
        return jsonify({"error": "url not found"}), HTTP_404_NOT_FOUND
    return jsonify({"message": "Success", "url": url.original_url}), HTTP_200_OK
    
