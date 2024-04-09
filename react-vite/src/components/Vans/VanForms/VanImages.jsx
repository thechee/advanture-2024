import { useState, useEffect } from "react";
import { useVanFormContext } from "../../../hooks/useVanFormContext";
import Files from "react-butterfiles";
import { FaTimes, FaPlus } from "react-icons/fa";
import "./VanImages.css";

const imageTypes = ["image/jpg", "image/png", "image/jpeg"]

export const VanImages = () => {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState("")
  const { data, setData, validationErrors } = useVanFormContext()

  const handleErrors = (errors) => {
    switch (errors[0].type) {
      case "unsupportedFileType":
        setError("Image must be in .jpeg, .jpg, or .png format")
        break
      case "maxSizeExceeded":
        setError("Image exceeds the maximum file size of 2Mb")
        break
      default:
        setError("An error occurred. Please try again.")
    }
  }

  const handleImageChange = (files) => {
    const newFiles = files.map(file => ({
      ...file,
      preview: URL.createObjectURL(file.src.file)
    }));

    setData({ ...data, images: [...data.images, ...newFiles] });
    setError("")
  }

  const handleRemove = (e, image) => {
    e.stopPropagation()
    const newFiles = data.images.filter((file) => file !== image)
    setData({ ...data, images: newFiles })

    URL.revokeObjectURL(image.preview)
  }

  useEffect(() => {
    return () => {
      data.images.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [data.images]);


  return (
    <div className="van-images">
      <p>The first photo will be the preview image</p>
      <Files
        multiple
        accept={imageTypes}
        name="images" 
        onSuccess={handleImageChange}
        onError={handleErrors}
        maxSize="2mb"
      >
        {({ browseFiles, getDropZoneProps }) => (
          <div
            {...getDropZoneProps({
              className: 'gallery' + (dragging ? " dragging" : ""),
              onDragEnter: () => setDragging(true),
              onDragLeave: () => setDragging(false),
              onDrop: () => setDragging(false)
            })}
          >
            <ul>
              {data.images.map((image) => (
                <li
                  key={image.id}
                  className="image-preview"
                  onClick={browseFiles}
                >
                  {image.imageUrl ? <img src={image.imageUrl} /> : <img src={image.preview} />}
                  <div 
                    className="remove-image"
                    onClick={(e) => handleRemove(e, image)}
                  >
                    <FaTimes />
                  </div>
                </li>
              ))}
              <li
                className="new-image"
                onClick={browseFiles}
              >
                <div><FaPlus /></div>
              </li>
            </ul>
          </div>
        )}
      </Files>
      <div className="van-image-error">
      {error.length > 0 && <p className="errors">{error}</p>}
      {validationErrors.image && <p className="errors">{validationErrors.image}</p>}
      </div>
    </div>
  )
}