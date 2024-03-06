import StarRatings from "react-star-ratings"
import './SmallVanCard.css'

export const SmallVanCard = ({van}) => {

  let previewImage;
  for (const image in van.images) {
    if (van.images[image].preview == true) {
      previewImage = van.images[image].imageUrl;
      break;
    }
  }

  return (
    <li>
      <div>
        <img src={previewImage} alt="" />
      </div>
      <div>
        <div>
        <h3>{van.make} {van.model} {van.year}</h3>
        </div>
        <div>
        <span>{van.avgRating}</span>
        <StarRatings />
        </div>

      </div>
      <div>
        <span>${van.rentalRate}/day</span>
      </div>
    </li>
  )
}