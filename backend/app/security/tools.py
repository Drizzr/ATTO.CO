from app.models import Device, Role, ExpiredToken
from app.utils.httpCodes import HTTP_201_CREATED, HTTP_401_UNAUTHORIZED, HTTP_404_NOT_FOUND
from flask import request, jsonify, abort, make_response, redirect, current_app
import jwt
from datetime import datetime, timedelta
from ..extensions import db
from app.models import User, Device, Role, ExpiredToken




def createJwtToken(key, user=None, request_verify_token : bool = False, verify_token : bool = False, access_token: bool = False, refresh_token : bool = False):

    # generates jwt-tokens for the mobile api (updating data send by sensors), expiration varies betwen access and refresh-tokens
    if access_token or refresh_token:
        exp = datetime.utcnow() + timedelta(minutes=3) if access_token and not refresh_token else datetime.utcnow() + timedelta(days=30)
        api_key = jwt.encode({"public_id": user.public_id,
                            "exp": exp,
                            "scope": "api-token"}, key)

        return (api_key, exp)
    elif request_verify_token:
        exp = datetime.utcnow() + timedelta(minutes=15) 
        request_verify_token = jwt.encode({"public_id": user.public_id, "exp": exp, "scope": "request-verify-token"}, key)
        return (request_verify_token, exp)
    else:
        exp = datetime.utcnow() + timedelta(minutes=5) 
        verify_token = jwt.encode({"public_id": user.public_id, "exp": exp, "scope": "verify-token"}, key)
        return (verify_token, exp)



def login_user(user):
    accessToken, accessExpirationTime = createJwtToken(current_app.config["SECRET_KEY"], user=user, access_token=True)
    refreshToken, refreshExpirationTime = createJwtToken(current_app.config["SECRET_KEY"], user=user, refresh_token=True)
    response = make_response({"x_access_token": accessToken,
                              })

    try:
        response.set_cookie("x_access_token", accessToken, httponly=True, expires=accessExpirationTime, secure=False, domain='127.0.0.1', samesite=None)
        response.set_cookie("x_refresh_token", refreshToken, httponly=True, expires=refreshExpirationTime, secure=False, domain='127.0.0.1', path="/api/auth/refresh/", samesite=None)
    except Exception as e:
        print(e)

    return response


def is_verified(cookie=False):

    key = current_app.config["SECRET_KEY"]

    try:
                # trying to load access and refresh tokens out of the request's http-header
        if cookie:
            accessToken = request.cookies["x_access_token"]
        else:
            accessToken = request.headers["x_access_token"]

                
    except KeyError as e:
        # on of the two tokens cant be found in the request header
        return False

    try:
        # trying to extract the token-data in order to identify the user
        accessData = jwt.decode(algorithms=["HS256"], jwt=accessToken, key=key, options={"verify_exp": True})
        if accessData["scope"] == "api-token":
            token_query = ExpiredToken.query.filter_by(token=accessToken, type="access",).first()
            if not token_query:
                current_user = User.query.filter_by(public_id=accessData["public_id"]).first()
                expirationTime = accessData["exp"]
                # if the extraction was successful the server checks whether the token has been labeled expired

                # the server deletes every token that is stored despite being expired
                
                if current_user:

                    return current_user
                return False


            else:
                raise jwt.ExpiredSignatureError  # access token has been labled as expired -> refresh token has to be checked

        else:
            return make_response(
                jsonify({"message": "Woring token-scope!", "http-code": "401"}),
                    HTTP_404_NOT_FOUND)

    except jwt.ExpiredSignatureError:
        return False
