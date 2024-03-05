import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetUserRatings } from "../../../redux/session"
import { UserRating } from "./UserRating/UserRating"
import './ManageRatings.css'

export const ManageRatings = () => {
  const dispatch = useDispatch()
  const userRatingsObj = useSelector(state => state.session.user.ratings)
  const user = useSelector(state => state.session.user)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (loggedIn) dispatch(thunkGetUserRatings())
  }, [loggedIn, dispatch])

  useEffect(() => {
    if (user) setLoggedIn(true)
    if (!user) setLoggedIn(false)
  }, [user])

  if (!userRatingsObj) return null

  const userRatings = Object.values(userRatingsObj)

  return (
    <div className="manage-ratings">
    <h2>Reviews you&apos;ve left</h2>
      {userRatings.length ? 
        (<ul>
        {userRatings.map(rating => (
          <UserRating rating={rating} key={rating.id}/>
        ))}
      </ul>) :
      (<h2>You have no reviews</h2>)
    }
    </div>
  )
}