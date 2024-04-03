import { useVanFormContext } from '../../../hooks/useVanFormContext';
import { useEffect } from 'react';

export const VanInfo = () => {
  const { data, setData, handleChange, yearsOptions, makesOptions, seatsOptions, doorsOptions, validationErrors } = useVanFormContext();

  useEffect(() => {
    const mpgInput = document.querySelector("#MPG-input");
    if (data.fuelTypeId == 4) {
      mpgInput.setAttribute("disabled", "");
      setData({...data, mpg: ""});
    } else {
      mpgInput.removeAttribute("disabled");
    }
  }, [data.fuelTypeId]);

  useEffect(() => {
    const distanceInput = document.querySelector("#distance-input");
    if (data.unlimited) {
      distanceInput.setAttribute("disabled", "");
      setData({...data, distanceIncluded: ""});
    } else {
      distanceInput.removeAttribute("disabled");
    }
  }, [data.unlimited]);

  return (
    <div className="van-form-info-div">
          <label>Year</label>
          <div>
            <select value={data.year} name='year' onChange={handleChange}>
              <option disabled value={"placeholder"}>
                Select year
              </option>
              {yearsOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="errors">
            {validationErrors.year && <p>{validationErrors.year}</p>}
          </div>

          <label>Make</label>
          <select value={data.make} name='make' onChange={handleChange}>
            <option disabled value={"placeholder"}>
              Select your van&apos;s make
            </option>
            {makesOptions.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
          <div className="errors">
            {validationErrors.make && <p>{validationErrors.make}</p>}
          </div>
          <label>Model</label>
          <input
            type="text"
            value={data.model}
            name='model'
            onChange={handleChange}
          />
          <div className="errors">
            {validationErrors.model && <p>{validationErrors.model}</p>}
          </div>

          <label>Miles</label>
          <input
            type="number"
            value={data.miles}
            name='miles'
            onChange={handleChange}
          />
          <div className="errors">
            {validationErrors.miles && <p>{validationErrors.miles}</p>}
          </div>

          <label>Doors</label>
          <select value={data.doors} name='doors' onChange={handleChange}>
            <option disabled value={"placeholder"}>
              Select doors
            </option>
            {doorsOptions.map((door) => (
              <option key={door} value={door}>
                {door}
              </option>
            ))}
          </select>
          <div className="errors">
            {validationErrors.doors && <p>{validationErrors.doors}</p>}
          </div>

          <label>Seats</label>
          <select value={data.seats} name='seats' onChange={handleChange}>
            <option disabled value={"placeholder"}>
              Select seats
            </option>
            {seatsOptions.map((seat) => (
              <option key={seat} value={seat}>
                {seat}
              </option>
            ))}
          </select>
          <div className="errors">
            {validationErrors.seats && <p>{validationErrors.seats}</p>}
          </div>

          <label>Fuel type</label>
          <select
            value={data.fuelTypeId}
            onChange={handleChange}
            name="fuelTypeId"
          >
            <option disabled value={"placeholder"}>
              Select a fuel type
            </option>
            <option value="1">Gasoline</option>
            <option value="2">Diesel</option>
            <option value="3">Bio-Diesel</option>
            <option value="4">Electric</option>
            <option value="5">Hybrid</option>
          </select>
          <div className="errors">
            {validationErrors.fuelTypeId || (validationErrors.fuel_type_id && (<p>{validationErrors.fuelTypeId}</p>))}
          </div>

          <label>
            MPG <span>(leave blank for electric vehicles)</span>
          </label>
          <input
            type="number"
            id="MPG-input"
            value={data.mpg}
            name='mpg'
            onChange={handleChange}
          />
          <div className="errors">
            {validationErrors.mpg && <p>{validationErrors.mpg}</p>}
          </div>

          <label>Daily rental rate</label>
          <input
            type="number"
            value={data.rentalRate}
            name='rentalRate'
            onChange={handleChange}
          />
          <div className="errors">
            {validationErrors.rentalRate ||
              (validationErrors.rental_rate && (
                <p>{validationErrors.rentalRate}</p>
              ))}
          </div>

          <label>Distance included</label>
          <input
            type="number"
            id="distance-input"
            value={data.distanceIncluded}
            name='distanceIncluded'
            onChange={handleChange}
          />
          <label id="unlimited-label">
            Unlimited
            <input
              id="unlimited-checkbox"
              type="checkbox"
              checked={data.unlimited}
              name='unlimited'
              onChange={handleChange}
            ></input>
          </label>
          <div className="errors">
            {validationErrors.distanceIncluded ||
              (validationErrors.distance_allowed && (
                <p>{validationErrors.distanceIncluded}</p>
              ))}
          </div>
        </div>
  )
}