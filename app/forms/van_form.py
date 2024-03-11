from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, IntegerField, TextAreaField
from wtforms.validators import DataRequired, NumberRange, Length, Optional
from datetime import datetime

current__automotive_year = datetime.now().year + 1
makes = ["Ford", "Dodge", "Ram", "Volkswagen", "Mercedes", "Toyota"]
fuel_types = [(1, "Gasoline"), (2, "Diesel"), (3, "Bio-Diesel"), (4, "Electric"), (5, "Hybrid")]

class VanForm(FlaskForm):
  year = IntegerField('year', validators=[DataRequired(), NumberRange(min=1950, max=current__automotive_year)])
  make = SelectField('make', validators=[DataRequired()], choices=makes)
  model = StringField('model', validators=[DataRequired()])
  miles = IntegerField('miles', validators=[DataRequired(), NumberRange(min=0, max=500000)])
  address = StringField('address', validators=[DataRequired()])
  city = StringField('city', validators=[DataRequired(), Length(min=3, max=30, message="City name must be between 3 and 30 characters")])
  state = StringField('state', validators=[DataRequired()])
  zip_code = StringField('zip code', validators=[DataRequired(), Length(min=5, max=5)])
  rental_rate = IntegerField('rental rate', validators=[DataRequired(), NumberRange(min=1, max=500)])
  description = TextAreaField('description', validators=[DataRequired(), Length(min=50, max=9999, message="Please enter at least 50 characters describing the van")])
  distance_allowed = IntegerField('distance allowed', validators=[Optional(), NumberRange(min=0, max=9999)])
  mpg = IntegerField('mpg', validators=[Optional(), NumberRange(min=1, max=150)])
  doors = IntegerField('doors', validators=[DataRequired(), NumberRange(min=1, max=9)])
  seats = IntegerField('seats', validators=[DataRequired(), NumberRange(min=1, max=12)])
  fuel_type_id = SelectField('fuel type', validators=[DataRequired()], choices=fuel_types)