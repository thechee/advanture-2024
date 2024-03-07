import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { thunkGetOneVan } from "../../../redux/van";
import { DeleteVanModal } from "../DeleteVanModal/DeleteVanModal.jsx";
import { RatingsBar } from "../../Ratings/RatingsBar/RatingsBar.jsx";
import { RatingsListItem } from "../../Ratings/RatingsListItem/RatingsListItem.jsx";
import { Rating } from "../../Ratings/Rating/Rating.jsx";
import {
  thunkAddFavorite,
  thunkDeleteFavorite,
} from "../../../redux/session.js";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import OpenModalButton from "../../OpenModalButton";
import StarRatings from "react-star-ratings";
import moment from "moment";
import "./VanDetail.css";

export const VanDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { vanId } = useParams();
  const van = useSelector((state) => state.vans[vanId]);
  const user = useSelector((state) => state.session.user);
  const ratingsObj = useSelector((state) => state.vans[vanId]?.ratings);
  const [viewNewReview, setViewNewReview] = useState(false);
  const [from, setFrom] = useState(moment().format("YYYY-MM-DD"));
  const [until, setUntil] = useState(moment().add(3, "d").format("YYYY-MM-DD"));

  useEffect(() => {
    dispatch(thunkGetOneVan(vanId));
  }, [dispatch, vanId]);

  if (!van) return null;
  if (!ratingsObj) return null;

  const ratings = Object.values(ratingsObj);

  function formatShortDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.toLocaleString("en-us", { month: "short" });
    const year = date.getUTCFullYear();
    return `${month} ${year}`;
  }

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatch(thunkAddFavorite(van.id));
  };

  const handleUnfavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await dispatch(thunkDeleteFavorite(van.id));
  };

  let previewImage;
  for (const image in van.images) {
    if (van.images[image].preview == true) {
      previewImage = van.images[image].imageUrl;
      break;
    }
  }

  const joinedDate = formatShortDate(van.owner.createdAt);
  const owner = user?.id == van.owner.id;
  const favorited = van.id in user.favorites;

  return (
    <div>
      <div className="van-images-div">
        <img src={previewImage} alt="" />
      </div>
      {!owner && <div>
      {favorited ? (
        <div onClick={handleUnfavorite} className="van-detail-heart-div">
          <FaHeart style={{ color: "red" }} />
        </div>
      ) : (
        <div onClick={handleFavorite} className="van-detail-heart-div">
          <FaRegHeart />
        </div>
      )}
      </div>
      }
      <div className="van-detail-content">
        <div className="van-detail-left-div">
          <h1>
            {van.make} {van.model} {van.year}
          </h1>
          {ratings.length > 0 && (
            <div className="van-overall-ratings-div">
              <span id="van-overall-stars">
                {van.vanAvgRating.toString().length <= 3
                  ? van.vanAvgRating.toFixed(1)
                  : van.vanAvgRating.toFixed(2)}{" "}
              </span>
              <StarRatings
                rating={van.vanAvgRating}
                starRatedColor="rgb(89, 60, 251)"
                starEmptyColor="white"
                starDimension="25px"
                numberOfStars={1}
              />
            </div>
          )}
          <div className="van-detail-details">
            <ul className="details-ul">
              {van.mpg && <li>{van.mpg} MPG</li>}
              <li>{van.fuelType}</li>
              <li>{van.doors} doors</li>
              <li>{van.seats} seats</li>
            </ul>
          </div>
          <h4>HOSTED BY</h4>
          <div className="van-detail-host-div">
            <div className="van-detail-host-img-div">
              <img src={van.owner.profileImage} alt="" />
            </div>
            <div className="van-detail-host-info">
              <h3>{van.owner.firstName}</h3>
              <span>Joined {joinedDate}</span>
            </div>
          </div>
          <h4>DESCRIPTION</h4>
          <p className="van-description">{van.description}</p>
          <h4>FEATURES</h4>
          <div className="van-details-features">
            <ul className="feature-ul">
              {van.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <h4>RATINGS AND REVIEWS</h4>

          {ratings.length ? (
            <div>
              <div className="overall-ratings-stars-div">
                <span>
                  {van.vanAvgRating.toString().length == 1
                    ? van.vanAvgRating.toFixed(1)
                    : van.vanAvgRating.toFixed(2)}
                  <StarRatings
                    rating={van.vanAvgRating}
                    starRatedColor="rgb(89, 60, 251)"
                    starEmptyColor="white"
                    starDimension="25px"
                    numberOfStars={1}
                  />
                </span>
                <span>({ratings.length} ratings)</span>
              </div>
              <div>
                <div className="rating">
                  <span>Cleanliness</span>
                  <RatingsBar ratingAvg={van.vanAvgCleanliness} />
                  <span className="avg-rating-num">
                    {van.vanAvgCleanliness.toFixed(1)}
                  </span>
                </div>
                <div className="rating">
                  <span>Maintenance</span>
                  <RatingsBar ratingAvg={van.vanAvgMaintenance} />
                  <span className="avg-rating-num">
                    {van.vanAvgMaintenance.toFixed(1)}
                  </span>
                </div>
                <div className="rating">
                  <span>Communication</span>
                  <RatingsBar ratingAvg={van.vanAvgCommunication} />
                  <span className="avg-rating-num">
                    {van.vanAvgCommunication.toFixed(1)}
                  </span>
                </div>
                <div className="rating">
                  <span>Convenience</span>
                  <RatingsBar ratingAvg={van.vanAvgConvenience} />
                  <span className="avg-rating-num">
                    {van.vanAvgConvenience.toFixed(1)}
                  </span>
                </div>
                <div className="rating">
                  <span>Accuracy</span>
                  <RatingsBar ratingAvg={van.vanAvgAccuracy} />
                  <span className="avg-rating-num">
                    {van.vanAvgAccuracy.toFixed(1)}
                  </span>
                </div>
              </div>
              <div>
                <h4 style={{ color: "#808080" }}>REVIEWS</h4>
                <ul>
                  {ratings.map((rating) => {
                    // if (rating.review) {
                    return <RatingsListItem key={rating.id} rating={rating} />;
                    // }
                  })}
                </ul>

                {viewNewReview && (
                  <div>
                    <Rating vanId={vanId} setViewNewReview={setViewNewReview} />
                  </div>
                )}
                {!viewNewReview && user && !owner && (
                  <button
                    onClick={() => setViewNewReview(true)}
                    id="add-a-review-btn"
                    className="submit-btn"
                  >
                    Add a review
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3>This van is not yet rated or reviewed!</h3>
              {viewNewReview && (
                <div>
                  <Rating vanId={vanId} setViewNewReview={setViewNewReview} />
                </div>
              )}
              {!viewNewReview && user && !owner && (
                <button
                  onClick={() => setViewNewReview(true)}
                  id="add-a-review-btn"
                  className="submit-btn"
                >
                  Add a review
                </button>
              )}
            </div>
          )}
        </div>

        <div className="van-detail-right-div">
          <div>
            <p>
              <span className="van-detail-price">${van.rentalRate}</span> / day
            </p>
          </div>
          {!owner && (
            <div className="van-detail-trip-div">
              <label>Trip Start</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <label>Trip End</label>
              <input
                type="date"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
              />
              <button className="submit-btn">Continue</button>
            </div>
          )}
          <div className="van-detail-distance-div">
            <span>Distance included</span>
            <span>
              {van.distanceAllowed
                ? van.distanceAllowed + " miles"
                : "Unlimited"}
            </span>
          </div>

          {owner ? (
            <div className="owner-div">
              <button onClick={() => navigate(`/vans/${vanId}/update`)}>
                Update Van
              </button>
              <OpenModalButton
                buttonText="Remove Van"
                modalComponent={<DeleteVanModal van={van} />}
              />
            </div>
          ) : (
            <div className="favorite-div">
              {favorited ? (
                <button className="add-to-favorites" onClick={handleUnfavorite}>
                  <span>
                    <FaHeart style={{ color: "red" }} />
                  </span>
                  Remove from favorites
                </button>
              ) : (
                <button className="add-to-favorites" onClick={handleFavorite}>
                  <span>
                    <FaRegHeart />
                  </span>
                  Add to Favorites
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
