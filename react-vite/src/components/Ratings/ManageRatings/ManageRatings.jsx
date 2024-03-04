import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetUserRatings } from "../../../redux/session"

export const ManageRatings = () => {
  const dispatch = useDispatch()
  // const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(thunkGetUserRatings())
  }, [dispatch])

  return null
}