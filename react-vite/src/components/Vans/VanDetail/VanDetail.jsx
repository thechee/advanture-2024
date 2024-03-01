import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { thunkGetOneVan } from '../../../redux/van'
import { FaRegHeart } from "react-icons/fa";
import './VanDetail.css'

export const VanDetail = () => {
  const dispatch = useDispatch()
  const { vanId } = useParams()
  const van = useSelector(state => state.vans[vanId])

  useEffect(() => {
    dispatch(thunkGetOneVan(vanId))
  }, [dispatch, vanId])

  if (!van) return <h1>404! VAN NOT FOUND</h1>

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.toLocaleString('en-us', { month: 'short' }); 
    const year = date.getUTCFullYear(); 
    return `${month} ${year}`; 
  }

  function favoriteHandler() {

  }

  const previewImage = van.images.find(image => image.preview == true).imageUrl
  const joinedDate = formatDate(van.owner.createdAt)

  return (
    <div>
      <div className='van-images-div'>
        <img src={previewImage} alt="" />
      </div>
      <div onClick={favoriteHandler} className='van-detail-heart-div'>
        <FaRegHeart />
      </div>
      <div className='van-detail-content'>
        <div className='van-detail-left-div'>
          <h1>{van.make} {van.model} {van.year}</h1>
        <div>
          <span>AVG RATING GOES HERE</span>
        </div>
        <div className='van-detail-details'>
          <ul className='details-ul'>
            {van.mpg && <li>{van.mpg} MPG</li>}
            <li>{van.fuelType}</li>
            <li>{van.doors} doors</li>
            <li>{van.seats} seats</li>
          </ul>
        </div>
        <h4>HOSTED BY</h4>
        <div className='van-detail-host-div'>
          <div className='van-detail-host-img-div'>
            <img src={van.owner.profileImage} alt="" />
          </div>
          <div className='van-detail-host-info'>
            <h3>{van.owner.firstName}</h3>
            <span>Joined {joinedDate}</span>
          </div>
        </div>
        <h4>DESCRIPTION</h4>
        <p className='van-description'>{van.description}</p>
        <h4>FEATURES</h4>
        <div className='van-details-features'>
          <ul className='feature-ul'>
            {van.features.map(feature => (
              <li key={feature}>{feature}</li>
              ))}
          </ul>
        </div>
        <h4>RATINGS AND REVIEWS</h4>
        <h4 style={{color: "#808080"}}>REVIEWS</h4>
      </div>



        <div className='van-detail-right-div'>
          <div>
            <p><span className='van-detail-price'>${van.rentalRate}</span> / day</p>
          </div>
          <div className='van-detail-trip-div'>
            <label>Trip Start</label>
            <input type="date" />
            <label>Trip End</label>
            <input type="date" />
            <button className='submit-btn'>Continue</button>
          </div>
          <div className='van-detail-distance-div'>
            <span>Distance included</span><span>{van.distanceAllowed ? van.distanceAllowed + " miles" : "Unlimited"}</span>
          </div>
          <div>
            <button className='add-to-favorites btn'><span><FaRegHeart /></span>Add to Favorites</button>
          </div>
        </div>
      </div>
    </div>
  );
}