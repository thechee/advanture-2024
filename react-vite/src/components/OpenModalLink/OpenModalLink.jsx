import { useModal } from '../../context/Modal';
import { Link } from 'react-router-dom';

export function OpenModalLink({
  modalComponent, // component to render inside the modal
  linkText, // text of the button that opens the modal
  className, // class name to apply styling
  onItemClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <Link onClick={onClick} className={className}>
      {linkText}
    </Link>
  );
}