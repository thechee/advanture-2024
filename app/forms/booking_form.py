from flask_wtf import FlaskForm
from wtforms import IntegerField, DateField
from wtforms.validators import DataRequired, ValidationError

class BookingForm(FlaskForm):
  van_id = IntegerField('van_id', validators=[DataRequired()])
  user_id = IntegerField('user_id', validators=[DataRequired()])
  start_date = DateField('start_date', format='%Y-%m-%d', validators=[DataRequired()])
  end_date = DateField('end_date', format='%Y-%m-%d', validators=[DataRequired()])

  def validate_date_range(self):
    if self.start_date.data >= self.end_date.data:
      raise ValidationError("End date must be after start date")