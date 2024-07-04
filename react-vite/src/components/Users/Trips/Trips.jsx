import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Trips.css';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetUserBookings } from '../../../redux/session';
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

  if (!user) {
    return (
      <h1>Not logged in</h1>
    )
  }
  
  return (
    <div className='trips-content'>
      <h1>Trips</h1>
      <div>
        <img src="https://resources.turo.com/client/v2/builds/assets/il_car_on_the_desert_@2xc6729191106bba04b948.png" alt="" />
        <h2>No upcoming trips yet</h2>
        <p>Explore incredible camper vans and book your next trip.</p>
        <button className='submit-btn' onClick={() => navigate('/')}>Start searching</button>
      </div>
      <h3>History</h3>
      <div>
        
      </div>
    </div>
  )
}