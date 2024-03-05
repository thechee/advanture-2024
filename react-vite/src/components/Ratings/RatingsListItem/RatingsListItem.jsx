import StarRatings from "react-star-ratings";
import "./RatingsListItem.css";
import { useSelector } from "react-redux";
import OpenModalButton from "../../OpenModalButton";
import { DeleteRatingModal } from "../DeleteRatingModal/DeleteRatingModal";

export const RatingsListItem = ({ rating }) => {
  const user = useSelector(state => state.session.user)

  function formatLongDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getUTCDate();
    const month = date.toLocaleString("en-us", { month: "long" });
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
  }

  const reviewDate = formatLongDate(rating.createdAt)

  const updatedDate = formatLongDate(rating.updatedAt)

  const updated = rating.updatedAt > rating.createdAt

  const handleUpdate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // navigate(`/vans/${van.id}/update`);
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

            {updated ? 
            <span className="review-date">Reviewed: {reviewDate} Updated on: {updatedDate}</span>
            :
            <span className="review-date">{reviewDate}</span>}
          </span>
        </div>
        <div className="review-text-div">
          <p>{rating.review}</p>
        </div>
        {user?.id == rating.rater.id &&
                <div className="btns-div">
                <button onClick={handleUpdate} className="submit-btn">
                        Update
                      </button>
                  <OpenModalButton
                        className={"submit-btn"}
                        buttonText={"Remove"}
                        // onButtonClick={handleRemove}
                        modalComponent={<DeleteRatingModal rating={rating}/>}
                      />
                </div>}
      </div>
      </li>

  );
};
