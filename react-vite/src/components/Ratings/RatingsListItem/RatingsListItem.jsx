import StarRatings from "react-star-ratings";
import "./RatingsListItem.css";
import { useSelector } from "react-redux";
import OpenModalButton from "../../OpenModalButton";
import { DeleteRatingModal } from "../DeleteRatingModal/DeleteRatingModal";
import { UpdateRating } from "../UpdateRating/UpdateRating";
import { useState } from "react";


export const RatingsListItem = ({ rating }) => {

  const user = useSelector((state) => state.session.user);
  const [update, setUpdate] = useState(false);

  function formatLongDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getUTCDate();
    const month = date.toLocaleString("en-us", { month: "long" });
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
  }

  const reviewDate = formatLongDate(rating.createdAt);

  const updatedDate = formatLongDate(rating.updatedAt);

  const updated = rating.updatedAt > rating.createdAt;

  const handleUpdate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUpdate(true);
  };

  return (
    <li className="review-li">
      <div className="reviewer-img-div">
        <img src={rating.rater.profileImage} alt="" />
      </div>
      <div className="review-data-div">
        <div className="review-stars-info-div">
          <StarRatings
            starDimension="22px"
            starSpacing="1px"
            numberOfStars={5}
            starRatedColor="rgb(89, 60, 251)"
            starEmptyColor="#e0e0e0"
            rating={Math.round(rating.avgRating)}
          />
          <span className="reviewer-name">
            {rating.rater.firstName}

            {updated ? (
              <>
              <span className="review-date">
                {reviewDate} 
              </span>
              <span className="review-date">
                Updated: {updatedDate}</span>
              </>
            ) : (
              <span className="review-date">{reviewDate}</span>
            )}
          </span>
        </div>
        <div className="review-text-div">
          <p>{rating.review}</p>
        </div>
        {user?.id == rating.rater.id && !update && (
          <div className="rli-btns-div">
            <button onClick={handleUpdate} className="submit-btn">
              Update
            </button>
            <OpenModalButton
              className={"btn"}
              buttonText={"Remove"}
              modalComponent={<DeleteRatingModal rating={rating} type="van"/>}
            />
          </div>
        )}
        {user?.id == rating.rater.id && update && (
          <div>
            <UpdateRating rating={rating} setUpdate={setUpdate} type="van"/>
          </div>
        )}
      </div>
    </li>
  );
};
