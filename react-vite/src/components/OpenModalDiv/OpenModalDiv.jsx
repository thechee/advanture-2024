import { useModal } from '../../context/Modal';

export function OpenModalDiv({
  modalComponent, // component to render inside the modal
  divText, // text of the button that opens the modal
  className,
  onDivClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onDivClick === "function") onDivClick();
  };

  return <div className={className} onClick={onClick}>{divText}</div>;
}