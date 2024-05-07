from flask import Blueprint, request, abort, redirect, session
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from .aws_helpers import get_unique_filename, upload_file_to_s3
import os
import pathlib
import requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
from tempfile import NamedTemporaryFile
import json


""" 
  Note: As the flow object requires a file path to load the configuration from AND
	we want to keep our credentials safe (out of our github repo!!).
	We will create a temporary file to hold our values as json.
	Some of these values will come from our .env file.
"""
	
# Import our credentials from the .env file
CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
BASE_URL = os.environ.get('BASE_URL')

client_secrets = {
    "web": {
      "client_id": CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_secret": CLIENT_SECRET,
      "redirect_uris": [
        f"{BASE_URL}/api/auth/callback"
      ]
    }
}

# Here we are generating a temporary file as the google oauth package requires a file for configuration!
secrets = NamedTemporaryFile()
with open(secrets.name, "w") as output:
    json.dump(client_secrets, output)

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # to allow Http traffic for local dev

flow = Flow.from_client_secrets_file(
    client_secrets_file=secrets.name,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri=f"{BASE_URL}/api/auth/callback"
)

secrets.close()

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401

@auth_routes.route("/oauth_login")
def oauth_login():
    authorization_url, state = flow.authorization_url()
    print("AUTH URL: ", authorization_url) 
    referrer = request.headers.get('Referer')
    session["referrer"] = referrer
    session["state"] = state
    return redirect(authorization_url)

@auth_routes.route("/callback")
def callback():
    flow.fetch_token(authorization_response=request.url)

    if not session["state"] == request.args["state"]:
        abort(500)

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)


    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=CLIENT_ID
    )

    temp_email = id_info.get('email')

    user_exists = User.query.filter(User.email == temp_email).first()

    if not user_exists:
        full_name = id_info.get("name")
        first_name, last_name = full_name.split(' ', 1) if ' ' in full_name else (full_name, "")

        user_exists = User(
            first_name=first_name,
            last_name=last_name,
            email=temp_email,
            password='OAUTH',
            profile_image_url=id_info.get("picture")
        )

        db.session.add(user_exists)
        db.session.commit()

    login_user(user_exists)

    return redirect(session['referrer'])

@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        
      profile_image = form.data["profile_image"]

      profile_image.filename = get_unique_filename(profile_image.filename)
      upload = upload_file_to_s3(profile_image)
      print(upload)

      if "url" not in upload:
        return upload

      user = User(
          first_name=form.data['first_name'],
          last_name=form.data['last_name'],
          email=form.data['email'],
          password=form.data['password'],
          profile_image_url=upload["url"]
      )
      db.session.add(user)
      db.session.commit()
      login_user(user)
      return user.to_dict()
    return form.errors, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401