from flask import jsonify, render_template, make_response, request
from ..httpCodes import *


def pageNotFound(e):
    resp = make_response(jsonify({"message": "page not found"}), HTTP_404_NOT_FOUND)
    return resp

def csrfError(e):
    resp =  make_response(jsonify({"message": "CSRF-Token missing"}), HTTP_401_UNAUTHORIZED)
    return resp

def tooManyRequests(e):
    resp =  make_response(jsonify({"message": "This ip has been permanently banned by the admin! Please contact the support!"}), HTTP_403_FORBIDDEN)
    return resp

def methodNotAllowed(e):
    resp =  make_response(jsonify({"message": "method not allowed"}), HTTP_405_METHOD_NOT_ALLOWED)
    return resp   

def internalServerError(e):
    resp =  make_response(jsonify({"message": "An errror occured we are working on it!"}), HTTP_500_INTERNAL_SERVER_ERROR)
    return resp

def unauthorizedUser(e):
    resp =  make_response(jsonify({"message": "unauthorized to access this page"}), HTTP_401_UNAUTHORIZED)
    return resp