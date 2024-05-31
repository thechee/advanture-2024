import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { thunkGetOneVan } from "../../../redux/van";
import { thunkAddFavorite, thunkDeleteFavorite } from "../../../redux/session.js";

import { DeleteVanModal } from "../DeleteVanModal/DeleteVanModal.jsx";
import { RatingsBar } from "../../Ratings/RatingsBar/RatingsBar.jsx";
import { RatingsListItem } from "../../Ratings/RatingsListItem/RatingsListItem.jsx";
import { Rating } from "../../Ratings/Rating/Rating.jsx";
import LoginFormModal from "../../Auth/LoginFormModal";
import OpenModalButton from "../../OpenModalButton";
import { OpenModalDiv } from "../../OpenModalDiv/OpenModalDiv.jsx";
import { VanFeature } from "../VanFeature/VanFeature.jsx";
import { CarDoor, GasStation, CarSeat, Gasoline, Hybrid, Electric } from '../../Icons'

import { AdvancedMarker, Map, useApiIsLoaded } from "@vis.gl/react-google-maps";
import { FaRegHeart, FaHeart } from "react-icons/fa";

import Carousel from "react-multi-carousel";
import StarRatings from "react-star-ratings";
import "react-multi-carousel/lib/styles.css";
import "./VanDetail.css";
import { DateInput } from "./DateInput.jsx";

export const VanDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { vanId } = useParams();
  const van = useSelector((state) => state.vans[vanId]);
  const user = useSelector((state) => state.session.user);
  const ratingsObj = useSelector((state) => state.vans[vanId]?.ratings);
  const mapId = useSelector((state) => state.maps.mapId);
  const [viewNewReview, setViewNewReview] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showDescriptionButton, setShowDescriptionButton] = useState(true);
  
  const descriptionRef = useRef(null);
  const apiIsLoaded = useApiIsLoaded();

  useEffect(() => {
    dispatch(thunkGetOneVan(vanId));
  }, [dispatch, vanId]);

  useEffect(() => {
    if (van && descriptionRef.current.offsetHeight < 96) {
      setShowDescription(true);
      setShowDescriptionButton(false)
    }
  }, [van]);

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

  const handleBeforeChange = (currentSlide) => {
    setCurrentSlide(currentSlide);
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
          {van.avgRating && (
            <div className="van-overall-ratings-div">
              <span id="van-overall-stars">
                {van.avgRating.toString().length <= 3
                  ? van.avgRating.toFixed(1)
                  : van.avgRating.toFixed(2)}{" "}
              </span>
              <StarRatings
                rating={van.avgRating}
                starRatedColor="rgb(89, 60, 251)"
                starEmptyColor="white"
                starDimension="25px"
                numberOfStars={1}
              />
            </div>
          )}

        <div className="van-detail-inner-right-div-repeat">
          {!owner && <DateInput van={van}/>}
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
                      <span><FaRegHeart /></span>
                      Add to Favorites
                    </button>
                  )}
                  {!user && (
                    <OpenModalButton
                      modalComponent={<LoginFormModal />}
                      buttonText={
                        <>
                          <span><FaRegHeart /></span>
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
          <div style={{position: "relative"}}>
          {!showDescription && <div className="gradient-overlay"></div>}
          <p 
            className={`van-description ${showDescription ? "show" : "hide"}`}
            ref={descriptionRef}
          >
            {van.description}</p>
          </div>
          {showDescriptionButton && <button 
            className="collapse-btn white-square-btn" 
            onClick={() => setShowDescription(!showDescription)}
          >
            {showDescription ? "Less" : "More"}
          </button>}

          {!!Object.values(van.features).length && (
          <div className="van-details-features">
          <h4>FEATURES</h4>
            <ul className="feature-ul">
              {van.features.map((feature) => 
                <VanFeature key={feature} feature={feature} />
              )}
            </ul>
          </div>)}

          <h4>RATINGS AND REVIEWS</h4>

          {van.avgRating ? (
            <div>
              <div className="overall-ratings-stars-div">
                <span>
                  {van.avgRating
                  .toString().length == 1
                    ? van.avgRating.toFixed(1)
                    : van.avgRating
                    }
                  <StarRatings
                    rating={van.avgRating}
                    starRatedColor="rgb(89, 60, 251)"
                    starEmptyColor="white"
                    starDimension="25px"
                    numberOfStars={1}
                  />
                </span>
                <span>({ratings.length} ratings)</span>
              </div>
              <div>
                <RatingsBar ratingAvg={van.avgCleanliness} name="Cleanliness"/>
                <RatingsBar ratingAvg={van.avgMaintenance} name="Maintenance"/>
                <RatingsBar ratingAvg={van.avgCommunication} name="Communication"/>
                <RatingsBar ratingAvg={van.avgConvenience} name="Convenience"/>
                <RatingsBar ratingAvg={van.avgAccuracy} name="Accuracy"/>
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
              <div style={{marginBottom: "1rem"}}>
                <span>(0 ratings)</span>
              </div>
              <RatingsBar ratingAvg={0} name="Cleanliness"/>
              <RatingsBar ratingAvg={0} name="Maintenance"/>
              <RatingsBar ratingAvg={0} name="Communication"/>
              <RatingsBar ratingAvg={0} name="Convenience"/>
              <RatingsBar ratingAvg={0} name="Accuracy"/>
              <div style={{marginBottom: "2rem", fontSize: "12px", color: "gray"}}>
                <span>More guest ratings needed</span>
              </div>
              <p>Book this van and be the first to review it.</p>
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
          {!owner && <DateInput van={van}/>}
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
          !apiIsLoaded ? (
            <div>Loading...</div>
          ) : (
          <Map
            center={{lat: van.lat, lng: van.lng }}
            zoom={13}
            gestureHandling={"greedy"}
            controlled={true}
            disableDefaultUI={true}
            style={{ height: "700px" }}
            mapId={mapId}
          >
            <AdvancedMarker position={{lat: van.lat, lng: van.lng }} className={"custom-marker"}>
              <div></div>
            </AdvancedMarker>
          </Map>
        )
        )}
      </div>
    </div>
  );
};