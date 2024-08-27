import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetUserBookings } from "../../../redux/session";

export const TripDetail = () => {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const booking = useSelector(
    (state) => state.session.user?.bookings?.[bookingId]
  );

  useEffect(() => {
    dispatch(thunkGetUserBookings());
  }, [dispatch]);

  console.log(booking);
  if (!booking) return null;

  const now = new Date();
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  let placeInTime;
  if (endDate < now) placeInTime = "Past";
  else if (startDate > now) placeInTime = "Future";
  else placeInTime = "Current";

  return (
    <div>
      <div className="profile-banner"></div>
      <h1>{placeInTime} Trip</h1>
    </div>
  );
};
