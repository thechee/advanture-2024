import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  leftSvg, // optional: left svg icon
  rightSvg, // optional: right svg icon
  className, // optional: class name of the button
  id, // optional: id of the button
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <button id={id} className={className} onClick={onClick}>{leftSvg}{buttonText}{rightSvg}</button>;
}

export default OpenModalButton;
