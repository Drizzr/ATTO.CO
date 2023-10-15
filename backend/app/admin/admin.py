#from app.security.tools import verify_user
from flask import redirect, url_for, abort, request, flash
from flask_admin.contrib.sqla import ModelView
from flask_admin import AdminIndexView, BaseView
from flask_admin.form import SecureForm
from wtforms import PasswordField
from wtforms.validators import InputRequired
from werkzeug.security import generate_password_hash

from app.security.tools import is_verified


# form exclude cols for more detailed access protocoll depending on role

class CustomPasswordField(PasswordField): 

    # creates a custom password field for the admin edit page
    # it hashes the input via the sh256 algorythm

    def populate_obj(self, obj, name):
        setattr(obj, name, generate_password_hash(self.data, "scrypt", 10)) 

            
class ModelView(ModelView):
    form_base_class = SecureForm
    
    column_display_pk = True
    column_hide_backrefs = False
    can_export = True
    can_view_details = True
    details_modal = True
    edit_modal = True
    create_modal = True
    export_types = ["csv"]
    can_set_page_size = True

    access_roles = ["Admin", "Admin-Editor", "Admin-Analyst"]
    roles_can_edit = ["Admin"]
    roles_can_create = ["Admin"]
    roles_can_delete = ["Admin"]
    

    def is_accessible(self):
        access = False
        self.can_delete = True
        self.can_create = True
        self.can_edit = True

        user = is_verified(cookie=True)

        if user:
            for role in user.roles:
                
                if role.name in self.roles_can_edit:
                    self.can_edit = True 
                if role.name in self.roles_can_create:
                    self.can_create = True
                if role.name in self.roles_can_delete:
                    self.can_delete = True
                if role.name in self.access_roles:
                    access = True
                
        return True

    def inaccessible_callback(self, name, **kwargs):

        abort(401)

    
class MyAdminIndexView(AdminIndexView):
    
    access_roles = ["Admin", "Admin-Editor", "Admin-Analyst"]
    


    def is_accessible(self):
        access = False

        current_user = is_verified(cookie=True)

        if current_user:
            return True
            for role in current_user.roles:
                if role.name in self.access_roles:
                    access = True
        
        
        return True

    def inaccessible_callback(self, name, **kwargs):

        # if a user is unauthorized to access the db-models he gets redirected via the referrerRequest() function
        abort(401)
    
class UserView(ModelView):
    #inline_models = ['post', ]

    column_list = ["public_id", "email", "expired_tokens", "password"]
    form_columns = ["email", "password"]
    column_searchable_list = ['public_id', 'email']
    roles_can_edit = ["Admin", "Admin-Editor"]
    column_editable_list = ["email"]
    
    form_extra_fields = {
        'password': CustomPasswordField('Password'),
    }

    

class ExpiredTokenView(ModelView):
    # changes role-accessability -> only Admins and Admin-Editors are allowed to access the page
    access_roles = ["Admin", "Admin-Editor"]
    
    column_list = ['user', "expiration_date", "type"]
    column_searchable_list = ['user_id']
    column_filters = ["user", "type"]

 
    
class RoleView(ModelView):
    # only the admin can edit log entries
    roles_can_edit = ["Admin"]
    
    # ensures that only the admin can create or delete roles by hand
    roles_can_create = ["Admin"] 
    roles_can_delete = ["Admin"]
    
    # only the admin has access to the log entries
    access_roles = ["Admin"]
    

    column_searchable_list = ['name']







