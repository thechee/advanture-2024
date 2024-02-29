from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileField, FileRequired
from wtforms import BooleanField, IntegerField
from wtforms.validators import DataRequired
from app.api.aws_helpers import ALLOWED_EXTENSIONS

class VanImage(FlaskForm):
  van_id = IntegerField("van id", validators=[DataRequired()])
  image = FileField("image", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
  preview = BooleanField("preview image", validators=[DataRequired()])