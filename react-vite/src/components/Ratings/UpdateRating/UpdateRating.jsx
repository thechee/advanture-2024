import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import StarRatings from "react-star-ratings";
import "../Rating/Rating.css";
import "./UpdateRating.css"
import { thunkUpdateVanRating, thunkGetOneVan } from "../../../redux/van";

export const UpdateRating = ({ rating, setUpdate }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState(rating.review);
  const [cleanliness, setCleanliness] = useState(rating.cleanliness);
  const [maintenance, setMaintenance] = useState(rating.maintenance);
  const [communication, setCommunication] = useState(rating.communication);
  const [convenience, setConvenience] = useState(rating.convenience);
  const [accuracy, setAccuracy] = useState(rating.accuracy);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (submitted) {
      const errors = {}
      if (!cleanliness) errors.cleanliness = "You must select at least 1 star";
      if (!maintenance) errors.maintenance = "You must select at least 1 star";
      if (!communication)
        errors.communication = "You must select at least 1 star";
      if (!convenience) errors.convenience = "You must select at least 1 star";
      if (!accuracy) errors.accuracy = "You must select at least 1 star";
      if (review.length < 30) errors.review = "Review should be at least 30 characters"

      setValidationErrors(errors)
    }
  }, [submitted, cleanliness, maintenance, communication, convenience, accuracy, review])

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true)
    
    const errors = {}
    if (review.length < 30 && review.length > 0) errors.review = "Review should be at least 30 characters"
    
    if (Object.values(errors).length) {
      setValidationErrors(errors)
    } else {
      const updatedRating = {
        id: rating.id,
        cleanliness,
        maintenance,
        communication,
        convenience,
        accuracy,
        review
      }

      dispatch(thunkUpdateVanRating(rating.vanId, updatedRating))
      dispatch(thunkGetOneVan(rating.vanId))

      setUpdate(false)
    }
  };

  return (
    <div className="update-review-div">
      <h3>Update your rating</h3>

      <form onSubmit={handleSubmit} className="new-review-form">
        <label>Cleanliness</label>
        <StarRatings
          starDimension="22px"
          starSpacing="1px"
          numberOfStars={5}
          starRatedColor="rgb(89, 60, 251)"
          starHoverColor="rgb(89, 60, 251)"
          starEmptyColor="#e0e0e0"
          rating={cleanliness}
          changeRating={setCleanliness}
        />
        <div className="errors">
          {submitted && validationErrors.cleanliness && <p>{validationErrors.cleanliness}</p>}
        </div>

        <label>Maintenance</label>
        <StarRatings
          starDimension="22px"
          starSpacing="1px"
          numberOfStars={5}
          starRatedColor="rgb(89, 60, 251)"
          starHoverColor="rgb(89, 60, 251)"
          starEmptyColor="#e0e0e0"
          rating={maintenance}
          changeRating={setMaintenance}
        />
        <div className="errors">
          {submitted && validationErrors.maintenance && <p>{validationErrors.maintenance}</p>}
        </div>


        <label>Communication</label>
        <StarRatings
          starDimension="22px"
          starSpacing="1px"
          numberOfStars={5}
          starRatedColor="rgb(89, 60, 251)"
          starHoverColor="rgb(89, 60, 251)"
          starEmptyColor="#e0e0e0"
          rating={communication}
          changeRating={setCommunication}
        />
        <div className="errors">
          {validationErrors.communication && <p>{validationErrors.communication}</p>}
        </div>


        <label>Convenience</label>
        <StarRatings
          starDimension="22px"
          starSpacing="1px"
          numberOfStars={5}
          starRatedColor="rgb(89, 60, 251)"
          starHoverColor="rgb(89, 60, 251)"
          starEmptyColor="#e0e0e0"
          rating={convenience}
          changeRating={setConvenience}
        />
        <div className="errors">
          {validationErrors.convenience && <p>{validationErrors.convenience}</p>}
        </div>

        <label>Accuracy</label>
        <StarRatings
          starDimension="22px"
          starSpacing="1px"
          numberOfStars={5}
          starRatedColor="rgb(89, 60, 251)"
          starHoverColor="rgb(89, 60, 251)"
          starEmptyColor="#e0e0e0"
          rating={accuracy}
          changeRating={setAccuracy}
        />
        <div className="errors">
          {validationErrors.accuracy && <p>{validationErrors.accuracy}</p>}
        </div>

        <label>
          Leave a Review <span className="optional">*Optional</span>
        </label>
        <textarea
          name=""
          id=""
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Leave your review here"
        ></textarea>
        <div className="errors">
          {validationErrors.review && <p>{validationErrors.review}</p>}
        </div>

        <button className="submit-btn">Submit</button>
      </form>
      <button onClick={() => setUpdate(false)} className="btn">
        Cancel
      </button>
    </div>
  );
};
