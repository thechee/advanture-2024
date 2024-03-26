import { useSelector } from 'react-redux'
import './Profile.css'

export const Profile = () => {
  const user = useSelector(state => state.session.user)

  return (
    <div>
      <div className='profile-banner'>
      </div>
      <h1>{user.firstName} {user.lastName.slice(0, 1)}.</h1>
    </div>
  )
}