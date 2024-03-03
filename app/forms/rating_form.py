from flask_wtf import FlaskForm
from wtforms import TextAreaField, IntegerField
from wtforms.validators import DataRequired, NumberRange, Length, Optional

class RatingForm(FlaskForm):
  review = TextAreaField('review', validators=[Optional(), Length(min=30, max=9999, message="Please enter at least 30 characters for a review")])
  overall_stars = IntegerField('overall stars', validators=[DataRequired(), NumberRange(min=1, max=5)])
  cleanliness = IntegerField('cleanliness', validators=[DataRequired(), NumberRange(min=1, max=5)])
  maintenance = IntegerField('maintenance', validators=[DataRequired(), NumberRange(min=1, max=5)])
  communication = IntegerField('communication', validators=[DataRequired(), NumberRange(min=1, max=5)])
  convenience = IntegerField('convenience', validators=[DataRequired(), NumberRange(min=1, max=5)])
  accuracy = IntegerField('accuracy', validators=[DataRequired(), NumberRange(min=1, max=5)])