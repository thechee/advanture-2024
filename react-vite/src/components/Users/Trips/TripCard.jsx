import { dateRangeFormatter } from "../../../utils/dateRangeFormatter"
import './TripCard.css';

export const TripCard = ({ booking }) => {
    console.log(booking)

    const dateRange = dateRangeFormatter(booking.startDate, booking.endDate)

    return (
    <li className="trip-card">
        <div className="trip-card-info">
            <p>{dateRange}</p>
            <h3>{booking.vanInfo.make} {booking.vanInfo.model} {booking.vanInfo.year}</h3>
            <p>{booking.vanInfo.city}, {booking.vanInfo.state}</p>
            {/* <p>{booking.status}</p> */}
        <div className="trip-card-owner">
            <img className="trip-card-owner-img" src={booking.ownerInfo.profileImage} alt="" />
            <p>{booking.ownerInfo.firstName} {booking.ownerInfo.lastName[0]}.</p>
        </div>
        </div>
        <div className="trip-card-img">
            <img src={booking.vanInfo.previewImage} alt="" />
        </div>
    </li>
    )
}