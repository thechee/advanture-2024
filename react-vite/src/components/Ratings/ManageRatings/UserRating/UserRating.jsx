import { useState } from "react";
import StarRatings from "react-star-ratings";
import OpenModalButton from "../../../OpenModalButton";
import { DeleteRatingModal } from "../../DeleteRatingModal/DeleteRatingModal";
import "./UserRating.css";
import { UpdateRating } from "../../UpdateRating/UpdateRating";

export const UserRating = ({ rating }) => {
  const [update, setUpdate] = useState(false);

  function formatLongDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getUTCDate();
    const month = date.toLocaleString("en-us", { month: "long" });
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
  }

  const updated = rating.updatedAt > rating.createdAt

  const date =
    rating.createdAt == rating.updatedAt
      ? formatLongDate(rating.createdAt)
      : formatLongDate(rating.updatedAt);


  return (
    <li className="user-review-li">
      <div className="user-review-van-img-div">
        <img
          className="user-review-van-img"
          src={rating.vanPreviewImage}
          alt=""
        />
      </div>

      <div className="user-review-data-div">
        <div>
          <h2>
            {rating.vanMake} {rating.vanModel} {rating.vanYear}
          </h2>
        </div>
        <div className="review-stars-info-div">
          <div>
            <StarRatings
              starDimension="22px"
              starSpacing="1px"
              numberOfStars={5}
              starRatedColor="rgb(89, 60, 251)"
              starEmptyColor="#e0e0e0"
              rating={Math.round(rating.avgRating)}
            />
          </div>
          <div>
            {updated ? 
            <span className="user-review-date">Updated on: {date}</span>
            :
            <span className="user-review-date">Reviewed on: {date}</span>}
          </div>
        </div>
        <div className="user-review-text-div">
          <p>{rating.review}</p>
        </div>
          {!update && 
        <div className="user-rating-btns-div">
          <button className="submit-btn" onClick={() => setUpdate(true)}>Update</button>
          <OpenModalButton
                className={"btn"}
                buttonText={"Remove"}
                modalComponent={<DeleteRatingModal rating={rating} type="user"/>}
                />
          
        </div>
          }
          {update && <UpdateRating rating={rating} setUpdate={setUpdate} type="user"/>}
      </div>
    </li>
  );
};
