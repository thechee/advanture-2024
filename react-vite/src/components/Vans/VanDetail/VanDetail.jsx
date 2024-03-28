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
import LoginFormModal from "../../LoginFormModal";
import StarRatings from "react-star-ratings";
import moment from "moment";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import "./VanDetail.css";
import { OpenModalDiv } from "../../OpenModalDiv/OpenModalDiv.jsx";
import { CarDoor } from '../../Icons/CarDoor.jsx'
import { GasStation } from "../../Icons/GasStation.jsx";
import { CarSeat } from "../../Icons/CarSeat.jsx";
import { Gasoline } from "../../Icons/Gasoline.jsx";
import { Hybrid } from "../../Icons/Hybrid.jsx";
import { Electric } from "../../Icons/Electric.jsx";
import { MiscFeature } from "../../Icons/MiscFeature.jsx";
import { AutomaticTrans } from "../../Icons/AutomaticTrans.jsx";
import { Aux } from "../../Icons/Aux.jsx";
import { BikeRack } from "../../Icons/BikeRack.jsx";
import { USBCharger } from "../../Icons/USBCharger.jsx";
import { Bluetooth } from "../../Icons/Bluetooth.jsx";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const VanDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { vanId } = useParams();
  const van = useSelector((state) => state.vans[vanId]);
  const user = useSelector((state) => state.session.user);
  const ratingsObj = useSelector((state) => state.vans[vanId]?.ratings);
  const mapId = useSelector((state) => state.maps.mapId);
  const [viewNewReview, setViewNewReview] = useState(false);
  const [from, setFrom] = useState(moment().format("YYYY-MM-DD"));
  const [until, setUntil] = useState(moment().add(3, "d").format("YYYY-MM-DD"));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDescription, setShowDescription] = useState(false);

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

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const joinedDate = formatShortDate(van.owner.createdAt);
  const owner = user?.id == van.owner.id;

  let favorited;
  if (user) favorited = van.id in user.favorites;

  const handleBeforeChange = (currentSlide) => {
    setCurrentSlide(currentSlide);
  };


  return (
    <div>
      <div className="van-images-div">
        <Carousel
        responsive={responsive}
        beforeChange={handleBeforeChange}
        >
          {Object.values(van.images).map((image) => (
            <img key={image.id} src={image.imageUrl} alt="" />
          ))}
        </Carousel>
        <div className="current-slide-display">{currentSlide + 1} of {Object.values(van.images).length}</div>
      </div>
      {!owner && (
        <div>
          {favorited ? (
            <div onClick={handleUnfavorite} className="van-detail-heart-div">
              <FaHeart style={{ color: "red" }} />
            </div>
          ) : (
            <>
              {user && (
                <div onClick={handleFavorite} className="van-detail-heart-div">
                  <FaRegHeart />
                </div>
              )}
              {!user && (
                <OpenModalDiv
                  modalComponent={<LoginFormModal />}
                  divText={<FaRegHeart />}
                  className={"van-detail-heart-div"}
                />
              )}
            </>
          )}
        </div>
      )}
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

        <div className="van-detail-inner-right-div-repeat">
          {/* {!owner && (
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
              <button
                onClick={() => alert("Feature coming soon!")}
                className="submit-btn"
              >
                Continue
              </button>
            </div>
          )} */}
          <div className="van-detail-distance-right-div">
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
                <>
                  {user && (
                    <button
                      className="add-to-favorites"
                      onClick={handleFavorite}
                    >
                      <span>
                        <FaRegHeart />
                      </span>
                      Add to Favorites
                    </button>
                  )}
                  {!user && (
                    <OpenModalButton
                      modalComponent={<LoginFormModal />}
                      buttonText={
                        <>
                          <span>
                            <FaRegHeart />
                          </span>
                          Add to Favorites
                        </>
                      }
                      className={"add-to-favorites"}
                    />
                  )}
                </>
              )}
            </div>
          )}
          </div>


          <div className="van-detail-details">
            <ul className="details-ul">
              {van.mpg && <li><GasStation /> {van.mpg} MPG</li>}
              {van.fuelType == 'Gasoline' && <li><Gasoline />{van.fuelType}</li>}
              {van.fuelType == 'Diesel' && <li><Gasoline />{van.fuelType}</li>}
              {van.fuelType == 'Bio-Diesel' && <li><Gasoline />{van.fuelType}</li>}
              {van.fuelType == 'Electric' && <li><Electric />{van.fuelType}</li>}
              {van.fuelType == 'Hybrid' && <li><Hybrid />{van.fuelType}</li>}
              <li><CarDoor />{van.doors} doors</li>
              <li><CarSeat />{van.seats} seats</li>
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
          <p className={showDescription ? "van-description show" : "van-description hide"} >
            {!showDescription && <div className="gradient-overlay"></div>}
            {van.description}</p>
          <button className="collapse-btn white-square-btn" onClick={() => setShowDescription(!showDescription)}>{showDescription ? "Less" : "More"}</button>

          <h4>FEATURES</h4>
          <div className="van-details-features">
            <ul className="feature-ul">
              {van.features.map((feature) => 
                feature == 'Automatic transmission' ? <li key={feature}><AutomaticTrans /> {feature}</li>
                :
                feature == 'AUX input' ? <li key={feature}><Aux /> {feature}</li>
                :
                feature == "Bike rack" ? <li key={feature}><BikeRack /> {feature}</li>
                :
                feature == "USB charger" ? <li key={feature}><USBCharger /> {feature}</li>
                :
                feature == "Bluetooth" ? <li key={feature}><Bluetooth /> {feature}</li>
                : <li key={feature}><MiscFeature /> {feature}</li>
              )}
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
                  <span className="rating-name">Cleanliness</span>
                  <RatingsBar ratingAvg={van.vanAvgCleanliness} />
                  <span className="avg-rating-num">
                    {van.vanAvgCleanliness.toFixed(1)}
                  </span>
                </div>
                <div className="rating">
                  <span className="rating-name">Maintenance</span>
                  <RatingsBar ratingAvg={van.vanAvgMaintenance} />
                  <span className="avg-rating-num">
                    {van.vanAvgMaintenance.toFixed(1)}
                  </span>
                </div>
                <div className="rating">
                  <span className="rating-name">Communication</span>
                  <RatingsBar ratingAvg={van.vanAvgCommunication} />
                  <span className="avg-rating-num">
                    {van.vanAvgCommunication.toFixed(1)}
                  </span>
                </div>
                <div className="rating">
                  <span className="rating-name">Convenience</span>
                  <RatingsBar ratingAvg={van.vanAvgConvenience} />
                  <span className="avg-rating-num">
                    {van.vanAvgConvenience.toFixed(1)}
                  </span>
                </div>
                <div className="rating">
                  <span className="rating-name">Accuracy</span>
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
                    return <RatingsListItem key={rating.id} rating={rating} />;
                  })}
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <h3>This van is not yet rated or reviewed!</h3>
            </div>
          )}
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
        <div className="van-detail-right-div">
          <div className="van-detail-price-div">
            <div className="van-detail-price-gradient"></div>
            <div className="van-detail-price-inner-div">
              <span className="van-detail-price">${van.rentalRate}</span> / day
            </div>
            <div className="van-detail-price-bottom-blocker"></div>
          </div>

          <div className="van-detail-inner-right-div">
          {/* {!owner && (
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
              <button
                onClick={() => alert("Feature coming soon!")}
                className="submit-btn"
              >
                Continue
              </button>
            </div>
          )} */}
          <div className="van-detail-distance-right-div">
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
                <>
                  {user && (
                    <button
                      className="add-to-favorites"
                      onClick={handleFavorite}
                    >
                      <span>
                        <FaRegHeart />
                      </span>
                      Add to Favorites
                    </button>
                  )}
                  {!user && (
                    <OpenModalButton
                      modalComponent={<LoginFormModal />}
                      buttonText={
                        <>
                          <span>
                            <FaRegHeart />
                          </span>
                          Add to Favorites
                        </>
                      }
                      className={"add-to-favorites"}
                    />
                  )}
                </>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
      <div className="van-detail-map-div">
        {van && (
          <Map
            center={{lat: van.lat, lng: van.lng }}
            zoom={15}
            gestureHandling={"greedy"}
            controlled={true}
            disableDefaultUI={true}
            style={{ height: "700px" }}
            mapId={mapId}
          >
            <AdvancedMarker position={{lat: van.lat, lng: van.lng }} className={"custom"}>
              <div></div>
            </AdvancedMarker>
          </Map>
        )}
      </div>
    </div>
  );
};
//
