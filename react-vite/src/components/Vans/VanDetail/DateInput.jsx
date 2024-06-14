import { useEffect, useState } from "react";
import moment from "moment";
import { thunkCreateVanBooking } from "../../../redux/van";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export const DateInput = ({van, formRef}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [start, setStart] = useState(moment().format("YYYY-MM-DD"));
  const [end, setEnd] = useState(moment().add(3, "d").format("YYYY-MM-DD"));

  useEffect(() => {
    if (start > end) {
      setEnd(start);
    }
  }, [start, end]);

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