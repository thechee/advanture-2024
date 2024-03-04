export const RatingsListItem = ({ rating }) => {

  function formatLongDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getUTCDate();
    const month = date.toLocaleString("en-us", { month: "long" });
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
  }

  const date = rating.createdAt == rating.updatedAt ? formatLongDate(rating.createdAt) : formatLongDate(rating.updatedAt)

  return (
    <li>
      <div className="reviewer-img-div">
        <img src={rating.rater.profileImage} alt="" />
      </div>
      <div>
        <div className="review-stars-info-div">
          <span>STARS GO HERE</span>
          <span>{rating.rater.firstName} {date}</span>
        </div>
        <div className="review-text-div">
          <p>{rating.review}</p>
        </div>
      </div>
    </li>
  )
}