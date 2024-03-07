import { useSelector } from "react-redux"
import { SmallVanCard } from "../Vans/SmallVanCard/SmallVanCard"
import { FaSearch } from "react-icons/fa";
import './Favorites.css'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Favorites = () => {
  const navigate = useNavigate()
  const user = useSelector(state => state.session.user)
  const [favorites, setFavorites] = useState([])
  
  useEffect(() => {
    async function fetchVans() {
      const data = await fetch(`/api/users/favorites`)
      const vans = await data.json()
      setFavorites(vans)
    }
    
    fetchVans()
  }, [user])
  
  if (!user) return null
  
  return (
    <div className="favorites-div">
      <h1>{user.firstName}&apos;s favorites</h1>
      <div>
        {favorites.length ? <ul className="favorites-list">
        {favorites.map(van => {
          return <SmallVanCard key={van.id} van={van}/>
          })}
        </ul> : 
        <div className="no-favorites">
        <h2>No favorites</h2>
        <p>You&apos;ll be able to access your favorited vans here.</p>
        <button onClick={() => navigate('/vans')} className="white-btn"><FaSearch />Find new favorites</button>
        </div>
        }
      </div>
    </div>
  )
}