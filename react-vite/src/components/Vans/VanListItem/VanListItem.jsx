import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DeleteVanModal } from "../DeleteVanModal/DeleteVanModal";
import { thunkAddFavorite, thunkDeleteFavorite } from "../../../redux/session";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import OpenModalButton from "../../OpenModalButton";
import { OpenModalDiv } from "../../OpenModalDiv/OpenModalDiv"
import LoginFormModal from "../../Auth/LoginFormModal"
import StarRatings from "react-star-ratings";
import "./VanListItem.css";

export const VanListItem = ({ van, hovered, setHoveredVan }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const isOwner = user?.id == van.owner.id;

  let previewImage;
  for (const image in van.images) {
    if (van.images[image].preview == true) {
      previewImage = van.images[image].imageUrl;
      break;
    }
  }

  let favorited;
  if (user) favorited = van.id in user.favorites;

  const handleUpdate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/vans/${van.id}/update`);
  };

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

  return (
    <Link to={`/vans/${van.id}`}>
      <li 
        className={`van-list-item-li ${hovered}`}
        onMouseEnter={() => setHoveredVan(van.id)}
        onMouseLeave={() => setHoveredVan(null)}
      >
        <div className="van-list-item-image-div">
          <img src={previewImage} alt="" />
        </div>
        <div className="van-list-item-info">
            <h2>
              {van.make} {van.model} {van.year}
            </h2>
          <div className="van-list-item-rating-div">
            {van.numRatings ? (
              <>
                <span id="van-list-item-overall-stars">
                  {van.vanAvgRating.toString().length <= 3
                    ? van.vanAvgRating.toFixed(1)
                    : van.vanAvgRating.toFixed(2)}{" "}
                </span>
                <StarRatings
                  rating={1}
                  starRatedColor="rgb(89, 60, 251)"
                  starEmptyColor="gray"
                  starDimension="20px"
                  numberOfStars={1}
                />
              </>
            ) : (
              <span>New Listing</span>
            )}
          </div>
          <div>
            <span className="van-list-item-location">
              {van.city}, {van.state}
            </span>
          </div>

          <div className="van-list-item-price-div">
            {isOwner && (
              <button onClick={handleUpdate} className="submit-btn">
                Update
              </button>
            )}
            {isOwner && (
              <OpenModalButton
                className={"btn"}
                buttonText={"Remove"}
                modalComponent={<DeleteVanModal van={van} />}
              />
            )}
            <span>${van.rentalRate}/day</span>
          </div>
          {!isOwner && (
            <div className="van-list-item-heart-div">

              {favorited ? 
                <FaHeart style={{ color: "red" }} onClick={handleUnfavorite} />
               : 
               <>
                 {user && (<FaRegHeart onClick={handleFavorite} />)}
                 {!user && 
                 (<OpenModalDiv 
                  modalComponent={<LoginFormModal />}
                  divText={<FaRegHeart />}
                  
                 />)}
               </>
              }


            </div>
          )}
        </div>
      </li>
    </Link>
  );
};
