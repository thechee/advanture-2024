import StarRatings from "react-star-ratings"
import './SmallVanCard.css'
import { FaHeart } from "react-icons/fa";
import { OpenModalDiv } from "../../OpenModalDiv/OpenModalDiv";
import { RemoveFavoritesModal } from "../../Favorites/RemoveFavoritesModal/RemoveFavoritesModal";
import { useNavigate } from "react-router-dom";

export const SmallVanCard = ({van}) => {
  const navigate = useNavigate()

  let previewImage;
  for (const image in van.images) {
    if (van.images[image].preview == true) {
      previewImage = van.images[image].imageUrl;
      break;
    }
  }

  const vanString = `${van.make} ${van.model} ${van.year}`.length > 22 ? 
  `${van.make} ${van.model} ${van.year}`.slice(0, 21) + "..." :
  `${van.make} ${van.model} ${van.year}`

  return (
    <li className="small-van-card" onClick={() => navigate(`/vans/${van.id}`)}>
      <div className="small-van-card-img-div">
        <img src={previewImage} alt="" />
      </div>
      <OpenModalDiv
      className="small-van-card-heart-div"
      divText={<FaHeart style={{ color: "red" }}/>}
      modalComponent={<RemoveFavoritesModal van={van}/>}
      />
      <div className="small-van-card-lower-div">
        <div>
        <h3>{vanString}</h3>
        </div>
        <div className="small-van-card-ratings-div">
        {van.vanAvgRating ? <>
        <span>{van.vanAvgRating.toString().length == 1 ? van.vanAvgRating.toFixed(1) : van.vanAvgRating}</span>
        <StarRatings
                rating={van.vanAvgRating}
                starRatedColor="rgb(89, 60, 251)"
                starEmptyColor="white"
                starDimension="25px"
                numberOfStars={1}
                />
                </>
              :
          <span>New listing</span>
  }
        </div>
      <div className="small-van-card-price-div">
        <span>${van.rentalRate}/day</span>
      </div>
      </div>
    </li>
  )
}