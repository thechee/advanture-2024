import { useEffect, useState } from "react";
import moment from "moment";
import { thunkCreateVanBooking } from "../../../redux/van";
import { useDispatch } from "react-redux";

export const DateInput = ({van}) => {
  const dispatch = useDispatch();
  const [start, setStart] = useState(moment().format("YYYY-MM-DD"));
  const [end, setEnd] = useState(moment().add(3, "d").format("YYYY-MM-DD"));

  useEffect(() => {
    if (start > end) {
      setEnd(start);
    }
  }, [start, end]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(thunkCreateVanBooking({ start_date: start, end_date: end }, van.id))
  }

  return (
    <form className="van-detail-trip-form">
      <label>Trip Start</label>
      <input
        type="date"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <label>Trip End</label>
      <input
        type="date"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
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