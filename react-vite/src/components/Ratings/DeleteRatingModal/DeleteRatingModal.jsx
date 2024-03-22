import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import './DeleteRatingModal.css'
import { thunkDeleteVanRating, thunkGetOneVan } from "../../../redux/van";
import { thunkDeleteUserRating } from "../../../redux/session";

export const DeleteRatingModal = ({ rating, type }) => {
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const handleDelete = async (e) => {
    e.preventDefault()
    if (type == "user") await dispatch(thunkDeleteUserRating(rating.id))
    if (type == "van") {
      await dispatch(thunkDeleteVanRating(rating.vanId, rating.id))
    .then(async () => await dispatch(thunkGetOneVan(rating.vanId)))}
    closeModal()
  }

  const handleCancel = (e) => {
    e.preventDefault()
    closeModal()
  }

  return (
    <div className='delete-rating-modal'>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove your rating for the <span>{rating.vanYear} {rating.vanMake} {rating.vanModel}</span>?</p>
      <button className="submit-btn" onClick={handleDelete}>Confirm</button>
      <button className="btn cancel" onClick={handleCancel}>Cancel</button>
    </div>
  );
}