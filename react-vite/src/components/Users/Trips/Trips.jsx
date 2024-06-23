import { useEffect } from 'react';
import './Trips.css';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetUserBookings } from '../../../redux/session';

export const Trips = () => {
  const dispatch = useDispatch();
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
    <div>
      <h1>Trips</h1>
      <div>

      </div>
    </div>
  )
}