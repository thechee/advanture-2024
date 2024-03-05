import StarRatings from "react-star-ratings";
import "./RatingsListItem.css";

export const RatingsListItem = ({ rating }) => {
  function formatLongDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getUTCDate();
    const month = date.toLocaleString("en-us", { month: "long" });
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
  }

  const date =
    rating.createdAt == rating.updatedAt
      ? formatLongDate(rating.createdAt)
      : formatLongDate(rating.updatedAt);

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
            {rating.rater.firstName} <span className="review-date">{date}</span>
          </span>
        </div>
        <div className="review-text-div">
          <p>{rating.review}</p>
        </div>
      </div>
    </li>
  );
};
