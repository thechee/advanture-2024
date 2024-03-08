import { useState } from "react";
import { useDispatch } from "react-redux";
import StarRatings from "react-star-ratings";
import "./Rating.css";
import { thunkCreateVanRating, thunkGetOneVan } from "../../../redux/van";

export const Rating = ({ vanId, setViewNewReview }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [cleanliness, setCleanliness] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [convenience, setConvenience] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    setSubmitted(true)
    
    const errors = {}
    if (!cleanliness) errors.cleanliness = "You must select at least 1 star";
    if (!maintenance) errors.maintenance = "You must select at least 1 star";
    if (!communication)
      errors.communication = "You must select at least 1 star";
    if (!convenience) errors.convenience = "You must select at least 1 star";
    if (!accuracy) errors.accuracy = "You must select at least 1 star";
    if (review.length < 30 && review.length > 0) errors.review = "Review should be at least 30 characters"
    
    if (Object.values(errors).length) {
      setValidationErrors(errors)
    } else {
      const rating = {
        cleanliness,
        maintenance,
        communication,
        convenience,
        accuracy,
        review
      }
      dispatch(thunkCreateVanRating(vanId, rating))
      dispatch(thunkGetOneVan(vanId))

      setViewNewReview(false)
    }
  };

  return (
    <div className="new-review-div">
      <h3>Rate your experience with the van</h3>

      <form onSubmit={handleSubmit} className="review-form">
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
      <button onClick={() => setViewNewReview(false)} className="btn">
        Cancel
      </button>
    </div>
  );
};
