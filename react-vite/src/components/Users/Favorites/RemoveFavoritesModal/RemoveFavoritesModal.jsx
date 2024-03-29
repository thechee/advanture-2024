import { useDispatch } from "react-redux";
import { useModal } from "../../../../context/Modal";
import './RemoveFavoritesModal.css'
import { thunkDeleteFavorite } from "../../../../redux/session";

export const RemoveFavoritesModal = ({ van }) => {
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(thunkDeleteFavorite(van.id))
    closeModal()
  }

  const handleCancel = (e) => {
    e.preventDefault()
    closeModal()
  }

  return (
    <div className='remove-favorites-modal'>
      <h2>Remove from favorites</h2>
      <p>Are you sure you want to remove this <span>{van.make} {van.model}</span> from your favorites?</p>
      <button className="submit-btn" onClick={handleDelete}>Confirm</button>
      <button className="btn cancel" onClick={handleCancel}>Cancel</button>
    </div>
  );
}