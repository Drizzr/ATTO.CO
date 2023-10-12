from flask import Blueprint, request, jsonify, redirect, current_app, abort, g, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from app.security.tools import login_user
from app.extensions import db
from app.utils.httpCodes import HTTP_401_UNAUTHORIZED, HTTP_406_NOT_ACCEPTABLE
import jwt
from secrets import token_hex
from app.models import User, Device, Role, ExpiredToken


auth = Blueprint('auth', __name__)

@auth.route("/refresh", methods=["GET"])
@cross_origin(supports_credentials=True, headers=["Content-Type", "Authorization"], origins="http://127.0.0.1:3000", with_credentials=True, expose_headers=["Content-Type", "Authorization", "Set-Cookie"], allow_headers=["Content-Type", "Authorization", "Set-Cookie"], allow_credentials=True)
def refresh():
    refreshToken = request.cookies.get("x_refresh_token")
    refreshTokenExpirationTime = None

    print(refreshToken)
    
    if refreshToken:
        try:
            refreshData = jwt.decode(algorithms=["HS256"], jwt=refreshToken, key=current_app.config["SECRET_KEY"],
                                    options={"verify_exp": True})
            if refreshData["scope"] == "api-token":
                token_query = ExpiredToken.query.filter_by(token=refreshToken, type="refresh").first()

                if not token_query:
                    user = User.query.filter_by(public_id=refreshData["public_id"]).first()
                    g.user_id = user.id
                    refreshTokenExpirationTime = refreshData["exp"]

                    #expired_refresh_token = ExpiredToken(token=refreshToken, type="refresh", expiration_date=refreshTokenExpirationTime, user_id=user.id)

                    #db.session.add(expired_refresh_token)
                    db.session.commit()

                    return login_user(user)

                    
            else:
                raise jwt.InvalidTokenError

        except Exception as e:
            abort(HTTP_401_UNAUTHORIZED)

    abort(HTTP_401_UNAUTHORIZED)


@auth.route("/login", methods=["POST"])
@cross_origin(supports_credentials=True, headers=["Content-Type", "Authorization"], origins="http://127.0.0.1:3000", with_credentials=True, expose_headers=["Content-Type", "Authorization", "Set-Cookie"], allow_headers=["Content-Type", "Authorization", "Set-Cookie"], allow_credentials=True)
def login():
    """
    This function implements login via api class f.E. for mobile devices using a future app.
    If all the credentials are valid the user server creates an access-token and a refresh-token
    with the help of the 'loginApiCall()' method
    """
    try:
        password = request.json["password"]
        email = request.json["email"]

        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):

                response = login_user(user)
                return response

            else:
                print(user.password, password)
                return make_response(jsonify({"message": "Wrong Password!"}), HTTP_406_NOT_ACCEPTABLE)

        else:
            return make_response(jsonify({"message": "Email does not exist!"}), HTTP_406_NOT_ACCEPTABLE)

    except KeyError as e:
        print(e)
        return make_response(jsonify({"message": "Wrong format!"}), HTTP_406_NOT_ACCEPTABLE)
    

@auth.route("/sign-up", methods=["POST"])
@cross_origin(supports_credentials=True, with_credentials=True)
def signUp():
    """
    This function implements sign-up via api class f.E. for mobile devices using a future app.
    If all the credentials are valid the user server creates an access-token and a refresh-token
    with the help of the 'loginApiCall()' method
    """
    try:
        password = request.json["password"]
        email = request.json["email"]

        user = User.query.filter_by(email=email).first()

        if user:
            return make_response(jsonify({"message": "Email already exists!"}), HTTP_406_NOT_ACCEPTABLE)

        else:
            public_id = token_hex(16)

            new_user = User(public_id=public_id, email=email, password=generate_password_hash(password, "scrypt", 10))
            db.session.add(new_user)
            db.session.commit()
            response = login_user(new_user)
            return response

    except KeyError as e:
        print(e)
        return make_response(jsonify({"message": "Wrong format!"}), HTTP_406_NOT_ACCEPTABLE)

