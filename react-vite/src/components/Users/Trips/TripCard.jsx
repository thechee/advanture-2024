export const TripCard = ({ booking }) => {
    console.log(booking)
    return (
    <li>
        <div>
            <p>{booking.startDate} - {booking.endDate}</p>
            <h2>{booking.vanInfo.make} {booking.vanInfo.model} {booking.vanInfo.year}</h2>
            <p>{booking.vanInfo.city}, {booking.vanInfo.state}</p>
            <p>{booking.status}</p>
            <img src={booking.ownerInfo.profileImage} alt="" />
            <p>{booking.ownerInfo.firstName} {booking.ownerInfo.lastName[0]}.</p>
        </div>
        <div>
            <img src={booking.vanInfo.previewImage} alt="" />
        </div>
    </li>
    )
}