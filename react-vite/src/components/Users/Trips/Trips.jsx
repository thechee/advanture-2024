import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetUserBookings } from '../../../redux/session';
import { TripCard } from './TripCard';
import './Trips.css';

export const Trips = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(thunkGetUserBookings())
  }, [dispatch])
  
  useEffect(() => {
    document.title = 'Trips | Advanture'

    return () => {    
      document.title = 'Advanture';
    }
  }, [])

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname }})
    }
  }, [user])

  const now = useMemo(() => new Date(), []);
  
  const pastBookings = useMemo(() => 
    user && user.bookings ? Object.values(user.bookings).filter(booking => new Date(booking.startDate) < now) : [],
    [user, now]
  );
  const futureBookings = useMemo(() =>
      user && user.bookings ? Object.values(user.bookings).filter(booking => new Date(booking.startDate) >= now) : [],
    [user, now]
  );

  if (!user) {
    return null;
  }

  // if (!user.bookings) {
  //   return (
  //     <div className='trips-content'>
  //     <h1>Trips</h1>
  //       <div>
  //         <img src="https://resources.turo.com/client/v2/builds/assets/il_car_on_the_desert_@2xc6729191106bba04b948.png" alt="" />
  //         <h2>No trips yet</h2>
  //         <p>Explore incredible camper vans and book your next trip.</p>
  //         <button className='submit-btn' onClick={() => navigate('/')}>Start searching</button>
  //       </div>
  //   </div>
  //   )
  // }


  console.log("past:", pastBookings, "future:", futureBookings)
  
  return (
    <div className='trips-content'>
      <h1>Trips</h1>
      {!futureBookings.length && 
        <div>
          <img id='trip-img' src="https://resources.turo.com/client/v2/builds/assets/il_car_on_the_desert_@2xc6729191106bba04b948.png" alt="" />
          <h2>No upcoming trips yet</h2>
          <p>Explore incredible camper vans and book your next trip.</p>
          <button className='submit-btn' onClick={() => navigate('/')}>Start searching</button>
        </div>}
      {pastBookings.length && 
      <>
        <h3>History</h3>
          <ul>
            {pastBookings.map(booking => (
              <TripCard key={booking.id} booking={booking} />
            ))}
          </ul>
      </>}
    </div>
  )
}