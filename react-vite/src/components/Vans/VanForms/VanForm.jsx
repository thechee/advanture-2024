/* global google */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { thunkAddVan, thunkAddVanImage } from "../../../../redux/van";
import { useVanFormContext } from "../../../../hooks/useVanFormContext";
import "./CreateVan.css";


export const VanForm = () => {




  useEffect(() => {
    const mpgInput = document.querySelector("#MPG-input");
    if (fuelTypeId == 4) {
      mpgInput.setAttribute("disabled", "");
      setMpg("");
    } else {
      mpgInput.removeAttribute("disabled");
    }
  }, [fuelTypeId]);

  useEffect(() => {
    const distanceInput = document.querySelector("#distance-input");
    if (unlimited) {
      distanceInput.setAttribute("disabled", "");
      setDistanceIncluded("");
    } else {
      distanceInput.removeAttribute("disabled");
    }
  }, [unlimited]);

  useEffect(() => {
    if (image && typeof image === "object" && image.name) {
      if (
        !image.name.toLowerCase().endsWith(".jpeg") &&
        !image.name.toLowerCase().endsWith(".jpg") &&
        !image.name.toLowerCase().endsWith(".png")
      ) {
        validationErrors.image = "Image must be in .jpeg, .jpg, or .png format";
      }
    }
  }, [validationErrors, image]);



  return (
    <form
      className="create-van-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <div className="van-form-body">
        <div className="create-van-left-div">
          <label>Year</label>
          <div>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
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
          <select value={make} onChange={(e) => setMake(e.target.value)}>
            <option disabled value={"placeholder"}>
              Select your van&apos;s make
            </option>
            <option value="Ford">Ford</option>
            <option value="Dodge">Dodge</option>
            <option value="Ram">Ram</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Mercedes">Mercedes</option>
            <option value="Toyota">Toyota</option>
          </select>
          <div className="errors">
            {validationErrors.make && <p>{validationErrors.make}</p>}
          </div>

          <label>Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <div className="errors">
            {validationErrors.model && <p>{validationErrors.model}</p>}
          </div>

          <label>Miles</label>
          <input
            type="number"
            value={miles}
            onChange={(e) => setMiles(e.target.value)}
          />
          <div className="errors">
            {validationErrors.miles && <p>{validationErrors.miles}</p>}
          </div>

          <label>Doors</label>
          <select value={doors} onChange={(e) => setDoors(e.target.value)}>
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
          <select value={seats} onChange={(e) => setSeats(e.target.value)}>
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
            value={fuelTypeId}
            onChange={(e) => setFuelTypeId(e.target.value)}
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
            {validationErrors.fuelTypeId ||
              (validationErrors.fuel_type_id && (
                <p>{validationErrors.fuelTypeId}</p>
              ))}
          </div>

          <label>
            MPG <span>(leave blank for electric vehicles)</span>
          </label>
          <input
            type="number"
            id="MPG-input"
            value={mpg}
            onChange={(e) => setMpg(e.target.value)}
          />
          <div className="errors">
            {validationErrors.mpg && <p>{validationErrors.mpg}</p>}
          </div>
        </div>

        <div className="create-van-right-div">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="errors">
            {validationErrors.address && <p>{validationErrors.address}</p>}
          </div>

          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <div className="errors">
            {validationErrors.city && <p>{validationErrors.city}</p>}
          </div>

          <label>State</label>
          <select
            name="state"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option disabled value={"placeholder"}>
              Select your state
            </option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
          <div className="errors">
            {validationErrors.state && <p>{validationErrors.state}</p>}
          </div>

          <label>Zip code</label>
          <input
            type="text"
            value={zipCode}
            minLength={5}
            maxLength={5}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <div className="errors">
            {validationErrors.zipCode ||
              (validationErrors.zip_code && <p>{validationErrors.zipCode}</p>)}
          </div>

          <label>Daily rental rate</label>
          <input
            type="number"
            value={rentalRate}
            onChange={(e) => setRentalRate(e.target.value)}
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
            value={distanceIncluded}
            onChange={(e) => setDistanceIncluded(e.target.value)}
          />
          <label id="unlimited-label">
            Unlimited
            <input
              id="unlimited-checkbox"
              type="checkbox"
              checked={unlimited}
              onChange={() => setUnlimited(!unlimited)}
            ></input>
          </label>
          <div className="errors">
            {validationErrors.distanceIncluded ||
              (validationErrors.distance_allowed && (
                <p>{validationErrors.distanceIncluded}</p>
              ))}
          </div>
        </div>

        <div className="create-van-bottom-div">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="errors">
            {validationErrors.description && (
              <p>{validationErrors.description}</p>
            )}
          </div>

          <div>
            <label>Main image</label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={fileWrap}
            />
          </div>
          <div className="errors">
            {fileName === maxFileError && <p>{fileName}</p>}
            {fileName !== maxFileError && (
              <p style={{ color: "#B7BBBF" }}>
                {fileName.length < 45
                  ? fileName
                  : fileName.slice(0, 45) + "..."}
              </p>
            )}
            {validationErrors.image && <p>{validationErrors.image}</p>}
          </div>
          <div>
            {imageURL && (
              <img src={imageURL} className="van-upload-thumbnail"></img>
            )}
          </div>
        </div>
      </div>
      <div className="van-form-btns-div">
        <button className="submit-btn" disabled={loading}>{loading ? "Loading..." : "Add van"}</button>
      </div>
    </form>
  );
};
