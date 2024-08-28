import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { thunkGetUserBookings } from "../../../../redux/session";
import { format } from "date-fns";
import "./TripDetails.css";

export const TripDetails = () => {
  const dispatch = useDispatch();
  const { bookingId } = useParams();
  const booking = useSelector(
    (state) => state.session.user?.bookings?.[bookingId]
  );

  useEffect(() => {
    dispatch(thunkGetUserBookings());
  }, [dispatch]);

  if (!booking) return null;

  const now = new Date();
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  let placeInTime;
  if (endDate < now) placeInTime = "Past";
  else if (startDate > now) placeInTime = "Future";
  else placeInTime = "Current";

  console.log(booking);
  return (
    <div>
      <div className="profile-banner"></div>
      <div className="trip-content">
        <header className="trip-header">
          <h1>{placeInTime} Trip</h1>
          <div className="trip-header-details">
            <div className="trip-header-info">
              <p>
                {booking.vanInfo.make} {booking.vanInfo.model}{" "}
                {booking.vanInfo.year}
              </p>
              <Link
                className="link-to-details"
                to={`/vans/${booking.vanInfo.id}`}
              >
                View van details
              </Link>
            </div>
            <div className="trip-header-image-container">
              <img src={booking.vanInfo.previewImage} alt="" />
            </div>
          </div>
        </header>
        <div className="trip-details-content">
          <div className="trip-details">
            <h4>YOUR TRIP</h4>
            <div className="trip-details-dates">
              <div>
                <h2>{format(booking.startDate, "E, MMM d")}</h2>
              </div>
              <div className="spacer-arrow"></div>
              <div>
                <h2>{format(booking.endDate, "E, MMM d")}</h2>
              </div>
            </div>
          </div>
          <div className="trip-van-owner-details"></div>
        </div>
      </div>
    </div>
  );
};
