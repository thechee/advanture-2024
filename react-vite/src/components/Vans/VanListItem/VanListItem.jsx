import { Link, useNavigate } from "react-router-dom";
import "./VanListItem.css";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import OpenModalButton from "../../OpenModalButton";
import { DeleteVanModal } from "../DeleteVanModal/DeleteVanModal";

export const VanListItem = ({ van }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.session.user);
  const isOwner = user?.id == van.owner.id;

  let previewImage;
  for (const image in van.images) {
    if (van.images[image].preview == true) {
      previewImage = van.images[image].imageUrl
      break;
    }
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/vans/${van.id}/update`)
  }

  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Link to={`/vans/${van.id}`}>
      <li className="van-list-item-li">
        <div className="van-list-item-image-div">
          <img src={previewImage} alt="" />
        </div>
        <div className="van-list-item-info">
          <div>
            <h2>
              {van.make} {van.model} {van.year}
            </h2>
          </div>
          <div>
            <span>This is where the rating will go</span>
          </div>
          <div>
            <span className="van-list-item-location">
              {van.city}, {van.state}
            </span>

          </div>

          <div className="van-list-item-price-div">
          {isOwner && <button onClick={handleUpdate} className="submit-btn">Update</button>}
          {isOwner && 
          <OpenModalButton className={"submit-btn"} buttonText={"Remove"} onButtonClick={handleRemove} modalComponent={<DeleteVanModal van={van} />}/>
          }
            <span>${van.rentalRate}/day</span>
          </div>
          <div className="van-list-item-heart-div">
            <FaRegHeart />
          </div>
        </div>
      </li>
    </Link>
  );
};
