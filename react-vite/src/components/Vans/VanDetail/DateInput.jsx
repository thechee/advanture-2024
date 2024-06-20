import { useEffect, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { add } from "date-fns";
import { thunkCreateVanBooking } from "../../../redux/van";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../../OpenModalButton";
import LoginFormModal from "../../Auth/LoginFormModal";
import DatePicker from "react-datepicker";
import './DatePickerStyles.css';

export const DateInput = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(add(new Date(), { days: 3 }));
  const { van } = props;
  console.log('render')

  useEffect(() => {
    if (start > end) {
      setEnd(add(start, { days: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  const blockedDates = useMemo(() => { 
    return Object.values(van.bookings).map(booking => {
      return {
        start: new Date(new Date(booking.startDate).setHours(0, 0, 0, 0)),
        end: new Date(new Date(booking.endDate).setHours(0, 0, 0, 0))
      }
    })
  }, [van.bookings])


  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(thunkCreateVanBooking({ 
      start_date: start.toISOString().split('T')[0], 
      end_date: end.toISOString().split('T')[0] 
    }, van.id))

  }

  useImperativeHandle(ref, () => ({
    handleSubmit
  }));


  return (
    <form className="van-detail-trip-form" ref={ref} onSubmit={handleSubmit}>
      <label>Trip Start</label>
      <DatePicker 
        selected={start}
        onChange={date => setStart(new Date(date))}
        dateFormat="MM/dd/yyyy"
        excludeDateIntervals={blockedDates}
        startDate={start}
        endDate={end}
        minDate={new Date()}
      />
      <label>Trip End</label>
      <DatePicker 
        selected={end}
        onChange={date => setEnd(new Date(date))}
        dateFormat="MM/dd/yyyy"
        excludeDateIntervals={blockedDates}
        startDate={start}
        endDate={end}
        minDate={new Date()}
      />
      {user ? (<button
        onClick={handleSubmit}
        className="submit-btn"
        id="van-booking-submit"
      >
        Continue
      </button>)
      : 
      (<OpenModalButton
        modalComponent={<LoginFormModal />}
        buttonText="Continue"
        className="submit-btn"
        id="van-booking-submit"
      />)
      }
    </form>
  );
});

DateInput.displayName = "DateInput";
