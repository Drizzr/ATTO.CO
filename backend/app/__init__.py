from flask import Flask

from app.extensions import db, cors, migrate
from app.config import DevelopmentConfig
from app.utils.errorHandlers import pageNotFound, unauthorizedUser, internalServerError, methodNotAllowed, tooManyRequests
from app.utils.httpCodes import HTTP_404_NOT_FOUND, HTTP_401_UNAUTHORIZED, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_405_METHOD_NOT_ALLOWED, HTTP_403_FORBIDDEN
from os import path


def create_app(developing=True):
    app = Flask(__name__)

    app.config.from_object(DevelopmentConfig())
    
    db.init_app(app)

    from app.routes.api import api
    app.register_blueprint(api, url_prefix="/api")


    cors.init_app(app)

    app.register_error_handler(HTTP_404_NOT_FOUND, pageNotFound)
    app.register_error_handler(HTTP_401_UNAUTHORIZED, unauthorizedUser)
    app.register_error_handler(HTTP_500_INTERNAL_SERVER_ERROR, internalServerError)
    app.register_error_handler(HTTP_405_METHOD_NOT_ALLOWED, methodNotAllowed)
    app.register_error_handler(HTTP_403_FORBIDDEN, tooManyRequests)


    with app.app_context():
        if not path.exists('app/' + app.config["DB_NAME"]):
            db.create_all()
            print('Created Database!')

    # the admin dashboard gets initialized
    

    return app