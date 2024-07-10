export const TripCard = ({ booking }) => {
    console.log(booking)
    return (
    <li>
        <p>{booking.startDate} - {booking.endDate}</p>
    </li>
    )
}