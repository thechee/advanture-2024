import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { thunkGetOneVan } from "../../../redux/van";
import { FaRegHeart } from "react-icons/fa";
import OpenModalButton from "../../OpenModalButton";
import { DeleteVanModal } from "../DeleteVanModal/DeleteVanModal.jsx";
import "./VanDetail.css";
import { RatingsBar } from "../../Ratings/RatingsBar/RatingsBar.jsx";
import { RatingsListItem } from "../../Ratings/RatingsListItem/RatingsListItem.jsx";

export const VanDetail = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { vanId } = useParams();
  const van = useSelector(state => state.vans[vanId]);
  const user = useSelector(state => state.session.user);
  const ratingsObj = useSelector(state => state.vans[vanId]?.ratings)

  useEffect(() => {
    dispatch(thunkGetOneVan(vanId));
  }, [dispatch, vanId]);

  if (!van) return null;

  function formatShortDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.toLocaleString("en-us", { month: "short" });
    const year = date.getUTCFullYear();
    return `${month} ${year}`;
  }

  function favoriteHandler() {}

  let previewImage;
  for (const image in van.images) {
    if (van.images[image].preview == true) {
      previewImage = van.images[image].imageUrl
      break;
    }
  }

  const joinedDate = formatShortDate(van.owner.createdAt);
  const owner = user?.id == van.owner.id;
  const ratings = Object.values(ratingsObj)

  const ratingsTotals = {
    cleanliness: 0,
    maintenance: 0,
    communication: 0,
    convenience: 0,
    accuracy: 0,
  }

  for (const rating in ratingsObj) {
    for (const [key, value] of Object.entries(ratingsObj[rating])) {
      if (key == "cleanliness") ratingsTotals.cleanliness += value
      if (key == "maintenance") ratingsTotals.maintenance += value
      if (key == "communication") ratingsTotals.communication += value
      if (key == "convenience") ratingsTotals.convenience += value
      if (key == "accuracy") ratingsTotals.accuracy += value}
  }
  const avgCleanliness = ratingsTotals.cleanliness / ratings.length
  const avgMaintenance = ratingsTotals.maintenance / ratings.length
  const avgCommunication = ratingsTotals.communication / ratings.length
  const avgConvenience = ratingsTotals.convenience / ratings.length
  const avgAccuracy = ratingsTotals.accuracy / ratings.length
  const ratingsSum = (avgCleanliness + avgMaintenance + avgCommunication + avgConvenience + avgAccuracy) / 5

  return (
    <div>
      <div className="van-images-div">
        <img src={previewImage} alt="" />
      </div>
      <div onClick={favoriteHandler} className="van-detail-heart-div">
        <FaRegHeart />
      </div>
      <div className="van-detail-content">
        <div className="van-detail-left-div">
          <h1>
            {van.make} {van.model} {van.year}
          </h1>
          <div>
            <span>{ratingsSum.toString().length == 1 ? ratingsSum.toFixed(1) : ratingsSum.toFixed(2)}</span>
          </div>
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

          {ratings.length ? 
            <div>
              <div>
                <p>
                  {ratingsSum.toString().length == 1 ? ratingsSum.toFixed(1) : ratingsSum.toFixed(2)}
                </p>
                <p>({ratings.length} ratings)</p>
              </div>
              <div>
                <div className="rating"><span>Cleanliness</span><RatingsBar ratingAvg={avgCleanliness}/><span>{avgCleanliness.toFixed(1)}</span></div>
                <div className="rating"><span>Maintenance</span><RatingsBar ratingAvg={avgMaintenance}/><span>{avgMaintenance.toFixed(1)}</span></div>
                <div className="rating"><span>Communication</span><RatingsBar ratingAvg={avgCommunication}/><span>{avgCommunication.toFixed(1)}</span></div>
                <div className="rating"><span>Convenience</span><RatingsBar ratingAvg={avgConvenience}/><span>{avgConvenience.toFixed(1)}</span></div>
                <div className="rating"><span>Accuracy</span><RatingsBar ratingAvg={avgAccuracy}/><span>{avgAccuracy.toFixed(1)}</span></div>
              </div>
              <div>
                <h4 style={{ color: "#808080" }}>REVIEWS</h4>
                <ul>
                  {ratings.map(rating => (
                    <RatingsListItem key={rating.id} rating={rating}/>
                  ))}
                </ul>
              </div>
            </div> :
            <div>
              <h3>This van is not yet rated or reviewed!</h3>  
            </div>}
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
              <input type="date" />
              <label>Trip End</label>
              <input type="date" />
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
              <button onClick={() => navigate(`/vans/${vanId}/update`)}>Update Van</button>
              <OpenModalButton
                buttonText="Remove Van"
                modalComponent={<DeleteVanModal van={van} />}
              />
            </div>
          ) : (
            <div className="favorite-div">
              <button className="add-to-favorites btn">
                <span>
                  <FaRegHeart />
                </span>
                Add to Favorites
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
