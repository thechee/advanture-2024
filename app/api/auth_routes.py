from flask import Blueprint, request, abort, redirect
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
        "http://localhost:8000/api/auth/callback"
      ]
    }
}

# Here we are generating a temporary file as the google oauth package requires a file for configuration!
secrets = NamedTemporaryFile()
# Note that the property '.name' is the file PATH to our temporary file!
# The command below will write our dictionary to the temp file AS json!
with open(secrets.name, "w") as output:
    json.dump(client_secrets, output)

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # to allow Http traffic for local dev

flow = Flow.from_client_secrets_file(
    client_secrets_file=secrets.name,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://localhost:8000/api/auth/callback"
)

secrets.close() # This method call deletes our temporary file from the /tmp folder! We no longer need it as our flow object has been configured!

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
    print("AUTH URL: ", authorization_url) # I recommend that you print this value out to see what it's generating.
    # Ex: https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=NICE TRY&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fcallback&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&state=A0eZyFD4WH6AfqSj7XcdypQ0cMhwr9&access_type=offline
    # It SHOULD look a lot like the URL in the SECOND or THIRD line of our flow chart!
    # Note that in the auth url above the value 'access_type' is set to 'offline'. If you do not send this, the user will NOT see the Google Login screen!!
    # Additionally, note that this URL does NOT contain the 'code_challenge_method' value NOR the 'code_challenge' that can be seen in our flow chart.
    # This package may have been created BEFORE the official Oauth2 consortium began recommending PKCE even for back channel flows...
    # While implementation details are completely obscured by the method .authorization_url() let's note 2 things here.
    # 1) We ARE generating a random value for the 'state' variable. We save it to the session on the line below to compare later.
    # 2) The authorization URL
    referrer = request.headers.get('Referer') # The Referer Header will contain the URL from which the GET was sent! We can use this in our final redirect to navigate the user back to that page!
    session["referrer"] = referrer
    session["state"] = state
    return redirect(authorization_url) # This line technically will enact the SECOND and THIRD lines of our flow chart.


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
        # Add the user to the session, we are logged in!
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