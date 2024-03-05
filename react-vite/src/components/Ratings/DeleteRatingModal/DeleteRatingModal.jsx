import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import './DeleteRatingModal.css'
import { thunkDeleteVanRating } from "../../../redux/van";

export const DeleteRatingModal = ({ rating }) => {
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(thunkDeleteVanRating(rating.vanId, rating.id))
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
      <button className="submit-btn btn" onClick={handleDelete}>Confirm</button>
      <button className="btn cancel" onClick={handleCancel}>Cancel</button>
    </div>
  );
}