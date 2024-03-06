import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetVans } from "../../../redux/van"
import { VanListItem } from "../VanListItem/VanListItem"
import './VanList.css'


export const VanList = () => {
  const dispatch = useDispatch()
  const vansObj = useSelector(state => state.vans)
  const userFavorites = useSelector(state => state.session.user.favorites)
  
  useEffect(() => {
    dispatch(thunkGetVans())
  }, [dispatch])

  useEffect(() => {

  }, [userFavorites])
  
  if (!vansObj) return null
  const vans = Object.values(vansObj)
  
  return (
    <ul className="van-list-ul">
      {vans.map(van => (
        <VanListItem key={van.id} van={van}/>
      ))}
    </ul>
  )
}