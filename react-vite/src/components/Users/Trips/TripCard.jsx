import { dateRangeFormatter } from "../../../utils/dateRangeFormatter"
import { format } from 'date-fns'
import './TripCard.css';

export const TripCard = ({ booking }) => {
  // console.log(booking)
  const cancelled = booking.status == 'cancelled';
  const dateRange = dateRangeFormatter(booking.startDate, booking.endDate)

  return (
    <li className="trip-card" style={cancelled ? {backgroundColor: '#F4F4F4'} : {}}>
      <div className="trip-card-info">
          <p style={cancelled ? {textDecorationLine: 'line-through'}: {}}>{dateRange}</p>
          <h4>{booking.vanInfo.make} {booking.vanInfo.model} {booking.vanInfo.year}</h4>
          <p>{booking.vanInfo.city}, {booking.vanInfo.state}</p>
          {/* <p>{booking.status}</p> */}
      {!cancelled ? 
        <div className="trip-card-owner">
          <img className="trip-card-owner-img" src={booking.ownerInfo.profileImage} alt="" />
          <p>{booking.ownerInfo.firstName} {booking.ownerInfo.lastName[0]}.</p>
        </div>
        :
        <div className="trip-card-cancelled">
          <p>Cancelled on {format(booking.updatedAt, 'MMM d')}</p>
        </div>
      }
      </div>
      <div className="trip-card-img">
          <img src={booking.vanInfo.previewImage} alt="" />
      </div>
    </li>
  )
}