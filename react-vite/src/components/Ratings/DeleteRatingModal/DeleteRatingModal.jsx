import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkRemoveUserRating } from "../../../redux/session";
import './DeleteRatingModal.css'

export const DeleteRatingModal = ({ rating }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { closeModal } = useModal()

  const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(thunkRemoveUserRating(rating.id))
    closeModal()
    navigate('/reviews/manage')
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