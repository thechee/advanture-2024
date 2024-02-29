import { Link } from 'react-router-dom';
import './VanListItem.css'
import { FaRegHeart } from "react-icons/fa";


export const VanListItem = ({ van }) => {
  const previewImage = van.images.find(image => image.preview == true).imageUrl

  return (
    <Link to={`/vans/${van.id}`}>
    <li className="van-list-item-li">
      
      <div className="van-list-item-image-div">
        <img src={previewImage} alt="" />
      </div>
      <div className='van-list-item-info'>
        <div>
          <h2>{van.make} {van.model} {van.year}</h2>
        </div>
        <div>
          <span>This is where the rating will go</span>
        </div>
        <div>
          <span className='van-list-item-location'>{van.city}, {van.state}</span>
        </div>
        
        <div className='van-list-item-heart-div'>
        <FaRegHeart />
        </div>
        <div className='van-list-item-price-div'>
            <span>${van.rentalRate}/day</span>
        </div>
      </div>
    </li>
    </Link>
  )
}