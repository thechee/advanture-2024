import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetVans } from "../../redux/van"


export const VanList = () => {
  const dispatch = useDispatch()
  const vansObj = useSelector(state => state.vans)
  
  useEffect(() => {
    dispatch(thunkGetVans())
  }, [dispatch])
  
  if (!vansObj) return null
  const vans = Object.values(vansObj)
  console.log(vans)
  
  return (
    <ul>
      {vans.map(van => (
        van.model
      ))}
    </ul>
  )
}