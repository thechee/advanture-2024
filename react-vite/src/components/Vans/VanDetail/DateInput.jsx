import { useEffect, useState } from "react";
import { format, add } from "date-fns";
import { thunkCreateVanBooking } from "../../../redux/van";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export const DateInput = ({van, formRef}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [start, setStart] = useState(format(new Date(), "yyyy-MM-dd"));
  const [end, setEnd] = useState(format(add(new Date(), { days: 3 }), "yyyy-MM-dd"));

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

  console.log("start:", start, "end:", end)

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