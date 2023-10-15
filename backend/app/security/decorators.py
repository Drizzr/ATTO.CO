from flask import  make_response, g, request, jsonify, current_app, request
from app.models import User, ExpiredToken, Role
from app.utils.httpCodes import HTTP_401_UNAUTHORIZED, HTTP_404_NOT_FOUND
from app.extensions import db
from functools import wraps
import jwt


class access_token_required(object):

    def __init__(self, logout: bool = False, cookie: bool = False, roles: list = ["User"]):
        self.logout = logout
        self.cookie = cookie

    def __call__(self, function):
        @wraps(function)
        def decorator(*args, **kwargs):
            key = current_app.config["SECRET_KEY"]  # SECRET KEY used for encrypting is stored in the config-object
            accessToken = None
            refreshToken = None

            try:
                # trying to load access and refresh tokens out of the request's http-header

                refreshToken = request.cookies.get("x_refresh_token")

                if self.cookie:
                    accessToken = request.cookies["x_access_token"]
                else:
                    accessToken = request.headers["x_access_token"]

                print(accessToken, refreshToken)
                
            except KeyError as e:
                # on of the two tokens cant be found in the request header
                return make_response(jsonify({"message": "Api-key is missing!", "http-code": "401"}),
                                     HTTP_401_UNAUTHORIZED)

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
                            # token is valid
                            # user is authorized
                            # this function tracks the amount of tokens created per day and increases the api_calls counter
                            #trackUserApiCalls(current_user)
                            g.user_id = current_user.id


                            if self.logout:  # checks whether the current user needs to be logged out

                                # current access-token is stored in the ExpiredToken-Tabel and is therefor invalid

                                new_expired_access_token = ExpiredToken(token=accessToken,
                                                                        type="access",
                                                                        expiration_date=expirationTime,
                                                                        user_id=current_user.id)

                                db.session.add(new_expired_access_token)
                                
                                #devalidate the refresh token 
                                refreshData = jwt.decode(algorithms=["HS256"], jwt=refreshToken, key=key,
                                             options={"verify_exp": True})
                                
                                if refreshData["scope"] == "api-token":
                                    token_query = ExpiredToken.query.filter_by(token=refreshToken, type="refresh").first()

                                    if not token_query:
                                        # decryption was succesfull, server now checks whether the token has already been used, thus checks for it
                                        # in the expired token list stored in the database
                                        current_user = User.query.filter_by(public_id=refreshData["public_id"]).first()
                                        expirationTime = refreshData["exp"]
                            
                                        new_expired_refresh_token = ExpiredToken(token=refreshToken,
                                                                                    type="refresh",
                                                                                    expiration_date=expirationTime,
                                                                                    )
                                        
                                        if current_user:
                                            # the token is valid, the user is therefore authorized
                                            # the refresh token is now stored in the expired token tabel, since it has been used
                                            # this code-snippet therefore implements the refresh-token-rotation
                                            # a new access and refresh-token pair is generated and send to the user

                                            new_expired_refresh_token.user_id = current_user.id

                                            db.session.add(new_expired_refresh_token)
                                       
                                        else:
                                            # user-id can't be found -> user got deleted, entire table got dropped or the SECRET KEY is public
                                            print(f"[MAJOR SECURTITY BREECH]: EITHER THE DATABASE HAS BEEN DELETED OR THE API-SECRET-KEY IS PUBLIC")


                            db.session.commit()

                            for role in self.roles:
                                role_query = Role.query.filter_by(name=role).first()
                                if role_query in current_user.roles:
                                    return function(current_user, *args, **kwargs)  # route function gets called
                            
                            return make_response(jsonify({"message": "Token is invalid!", "http-code": "401"}),
                                                    HTTP_401_UNAUTHORIZED)
                    
                    else:
                        return make_response(jsonify({"message": "Token is invalid!", "http-code": "401"}),
                                                    HTTP_401_UNAUTHORIZED)

                else:
                    return make_response(
                        jsonify({"message": "Woring token-scope!", "http-code": "401"}),
                            HTTP_404_NOT_FOUND)

            
            except Exception as e:
                # access-token did not expire, decryption still was not successfull
                # -> signature invalid etc. -> user cannot be authorized
                print(f"[API-LOGIN-EXCEPTION]: {e}")

                return make_response(jsonify({"message": "Token is invalid!", "http-code": "401"}),
                                     HTTP_401_UNAUTHORIZED)

        return decorator

