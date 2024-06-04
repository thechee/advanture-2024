import { useEffect, useState } from "react";
import { add } from "date-fns";
import { thunkCreateVanBooking } from "../../../redux/van";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import './DatePickerStyles.css';

export const DateInput = ({van, formRef}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(add(new Date(), { days: 3 }));

  useEffect(() => {
    if (start > end) {
      setEnd(add(start, { days: 1 }));
    }
  }, [start, end]);

  const blockedDates = Object.values(van.bookings).map(booking => {
    return {
      start: new Date(new Date(booking.startDate).setHours(0, 0, 0, 0)),
      end: new Date(new Date(booking.endDate).setHours(0, 0, 0, 0))
    }
  })
  console.log(blockedDates)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(thunkCreateVanBooking({ start_date: start, end_date: end }, van.id))

    if (result.status === 401) {
      navigate("/login", { state: { from: location } });
    }
  }

  return (
    <form className="van-detail-trip-form" ref={formRef} onSubmit={handleSubmit}>
      <label>Trip Start</label>
      {/* <input
        type="date"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      /> */}
      <DatePicker 
        selected={start}
        selectsStart
        onChange={date => setStart(new Date(date))}
        dateFormat="MM/dd/yyyy"
        excludeDateIntervals={blockedDates}
        startDate={start}
        endDate={end}
      />
      <label>Trip End</label>
      {/* <input
        type="date"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      /> */}
      <DatePicker 
        selected={end}
        selectsEnd
        onChange={date => setEnd(new Date(date))}
        dateFormat="MM/dd/yyyy"
        excludeDateIntervals={blockedDates}
        startDate={start}
        endDate={end}
      />
      <button
        onClick={handleSubmit}
        className="submit-btn"
        id="van-booking-submit"
      >
        Continue
      </button>
    </form>
  );
}