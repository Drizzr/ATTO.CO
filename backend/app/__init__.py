from flask import Flask, g, request, abort
from flask_admin import Admin
from app.extensions import db, migrate
from app.config import DevelopmentConfig
from app.utils.errorHandlers import pageNotFound, unauthorizedUser, internalServerError, methodNotAllowed, tooManyRequests
from app.utils.httpCodes import HTTP_404_NOT_FOUND, HTTP_401_UNAUTHORIZED, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_405_METHOD_NOT_ALLOWED, HTTP_403_FORBIDDEN
from app.utils.logging import logging_backref, logging

from os import path
from datetime import datetime



from app.admin import (MyAdminIndexView, ModelView, UserView, RoleView, ExpiredTokenView)


def create_app(developing=True):
    app = Flask(__name__)

    app.config.from_object(DevelopmentConfig())
    
    db.init_app(app)

    from app.routes.api import api
    app.register_blueprint(api, url_prefix="/api")

    from app.routes.auth import auth
    app.register_blueprint(auth, url_prefix="/api/auth")

    migrate.init_app(app, db)

    app.register_error_handler(HTTP_404_NOT_FOUND, pageNotFound)
    app.register_error_handler(HTTP_401_UNAUTHORIZED, unauthorizedUser)
    app.register_error_handler(HTTP_500_INTERNAL_SERVER_ERROR, internalServerError)
    app.register_error_handler(HTTP_405_METHOD_NOT_ALLOWED, methodNotAllowed)
    app.register_error_handler(HTTP_403_FORBIDDEN, tooManyRequests)


    from app.models import User, Role, ExpiredToken, URL, Log, Device

    admin = Admin(app, index_view=MyAdminIndexView(), template_mode="bootstrap4")  # initialize the admin dashboard, somehow not possible to do that in the extensions.py file
    admin.add_view(UserView(User, db.session))
    admin.add_view(RoleView(Role, db.session))
    admin.add_view(ExpiredTokenView(ExpiredToken, db.session))
    admin.add_view(ModelView(URL, db.session))
    admin.add_view(ModelView(Log, db.session))
    admin.add_view(ModelView(Device, db.session))



    with app.app_context():
        if not path.exists('app/' + app.config["DB_NAME"]):
            db.create_all()
            print('Created Database!')

    # the admin dashboard gets initialized

    @app.before_request
    def request_before():
        logging()
    
    

    @app.after_request
    def request_after(response):
        logging_backref(response)
        return response
    

    return app