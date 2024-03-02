import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkDeleteVan } from "../../../redux/van";
import './DeleteVanModal.css'

export const DeleteVanModal = ({ van }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { closeModal } = useModal()

  const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(thunkDeleteVan(van.id))
    // dispatch(clearUserProjects())
    closeModal()
    navigate('/vans/manage')
  }

  const handleCancel = (e) => {
    e.preventDefault()
    closeModal()
  }

  return (
    <div className='delete-van-modal'>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this <span>{van.year} {van.make} {van.model}</span> from Advanture?</p>
      <button className="submit-btn" onClick={handleDelete}>Confirm</button>
      <button className="btn cancel" onClick={handleCancel}>Cancel</button>
    </div>
  );
}