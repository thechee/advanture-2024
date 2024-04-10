import { useVanFormContext } from "../../../hooks/useVanFormContext";

export const VanDescription = () => {
  const { data, handleChange, validationErrors } = useVanFormContext();

  return (
    <div className="van-form-description-div">
    {/* <label>Description</label> */}
          <textarea
            value={data.description}
            name="description"
            onChange={handleChange}
            placeholder="Add a description of your van"
          />
          <div className="errors">
            {validationErrors.description && (
              <p>{validationErrors.description}</p>
            )}
          </div>
    </div>
  )
}