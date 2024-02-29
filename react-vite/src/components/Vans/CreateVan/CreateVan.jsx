import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import "./CreateVan.css";
import { states } from "../../../../states";

export const CreateVan = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [year, setYear] = useState("")
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [miles, setMiles] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [rentalRate, setRentalRate] = useState("")
  const [description, setDescription] = useState("")
  const [distanceIncluded, setDistanceIncluded] = useState("")
  const [unlimited, setUnlimited] = useState(false)
  const [mpg, setMpg] = useState("")
  const [doors, setDoors] = useState("")
  const [seats, setSeats] = useState("")
  const [fuelTypeId, setFuelTypeId] = useState("")
  const [validationErrors, setValidationErrors] = useState({})

  const automotiveYear = new Date().getFullYear() + 1
  const makes = ["Ford", "Dodge", "Ram", "Volkswagen", "Mercedes", "Toyota"]
  const zipCodeRegex = /\d{5}/

  useEffect(() => {
    const mpgInput = document.querySelector("#MPG-input")
    if (fuelTypeId == 4) {
      mpgInput.setAttribute("disabled", "")
    } else {
      mpgInput.removeAttribute("disabled")
    }
  }, [fuelTypeId])

  useEffect(() => {
    const distanceInput = document.querySelector("#distance-input")
    if (unlimited) {
      distanceInput.setAttribute("disabled", "")
    } else {
      distanceInput.removeAttribute("disabled")
    }
  }, [unlimited])

  // useEffect(() => {
  //   if (typeof image === 'object' && image.name) {
  //     if (!image.name.endsWith('.jpeg') && !image.name.endsWith('.jpg') && !image.name.endsWith('.png') && !image.name.endsWith('.gif')) {
  //         validationErrors.image = 'Image must be in .jpeg, .jpg, .png, or .gif format';
  // }, [])

  const handleSubmit = (e) => {
    e.preventDefault();

    setValidationErrors({})
    const errors = {}
    if (!year) errors.year = "Van year is required"
    if (year > automotiveYear) errors.year = "Van year can not be after the current automotive year"
    if (year && year < 1950) errors.year = "We do not accept vans this old on Advanture"
    if (!make) errors.make = "Van make is required"
    if (!makes.includes(make)) errors.make = "YOU ARE UP TO NO GOOD!"
    if (!model) errors.model = "Van model is required"
    if (model.length > 30) errors.model = "Van model must be shorter than 30 characters"
    if (!miles) errors.miles = "Milage is required"
    if (miles < 1) errors.miles = "Milage must be a positive number"
    if (miles > 500000) errors.miles = "YOU ARE LYING"
    if (!address) errors.address = "Address is required"
    if (!city) errors.city = "City is required"
    if (city.length < 3) errors.city = "City name must be at least 3 characters"
    if (city.length > 30) errors.city = "City name must less than 30 characters"
    if (!state) errors.state = "State is required"
    if (!states.includes(state)) errors.state = "YOU ARE UP TO NO GOOD!"
    if (!zipCode) errors.zipCode = "Zip code is required"
    if (!zipCodeRegex.test(zipCode)) errors.zipCode = "Must be a valid zip code"
    if (!rentalRate) errors.rentalRate = "Daily rental rate is required"
    if (rentalRate < 1) errors.rentalRate = "Daily rental rate must be a positive number"
    if (rentalRate > 500) errors.rentalRate = "We do not accept rental rates greater than $500/day"
    if (!description) errors.description = "Description is required"
    if (description.length < 50) errors.description = "Description must be at least 50 characters"
    if (description.length > 9999) errors.description = "Description must not be a book"
    if (!distanceIncluded && unlimited == false) errors.distanceIncluded = "Distance included is required"
    if (!mpg && fuelTypeId !== 4) errors.mpg = "MPG is required for non-electric vehicles"
    if (!doors) errors.doors = "Doors is required"
    if (doors < 1) errors.doors = "Van must have at least 1 door!"
    if (doors > 9) errors.doors = "Your van has too many doors"
    if (!seats) errors.seats = "Seats is required"
    if (seats < 1) errors.seats = "Van must have at least 1 seat"
    if (seats > 30) errors.seats = "This is a website for vans, not buses"
    if (!fuelTypeId) errors.fuelTypeId = "Fuel type is required"
    if (fuelTypeId > 5) errors.fuelTypeId = "YOU ARE UP TO NO GOOD!"

    if (Object.values(errors).length) {
      setValidationErrors(errors)
    } else {
      dispatch()
    }
  };


  return (
    <form
      className="create-van-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <label>Year</label>
      <div>
        <input value={year} onChange={e => setYear(e.target.value)} type="number" />
      </div>
      <div className="errors">
        {validationErrors.year && <p>{validationErrors.year}</p>}
      </div>

      <label>Make</label>
      <select value={make} onChange={e => setMake(e.target.value)}>
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
      <input type="text" value={model} onChange={e => setModel(e.target.value)}/>
      <div className="errors">
        {validationErrors.model && <p>{validationErrors.model}</p>}
      </div>

      <label>Miles</label>
      <input type="number" value={miles} onChange={e => setMiles(e.target.value)}/>
      <div className="errors">
        {validationErrors.miles && <p>{validationErrors.miles}</p>}
      </div>

      <label>Address</label>
      <input type="text" value={address} onChange={e => setAddress(e.target.value)}/>
      <div className="errors">
        {validationErrors.address && <p>{validationErrors.address}</p>}
      </div>

      <label>City</label>
      <input type="text" value={city} onChange={e => setCity(e.target.value)}/>
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
          State
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
      <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)}/>
      <div className="errors">
        {validationErrors.zipCode && <p>{validationErrors.zipCode}</p>}
      </div>

      <label>Daily rental rate</label>
      <input type="number" value={rentalRate} onChange={e => setRentalRate(e.target.value)}/>
      <div className="errors">
        {validationErrors.rentalRate && <p>{validationErrors.rentalRate}</p>}
      </div>      

      <label>Distance included</label>
      <input type="number" id="distance-input" value={distanceIncluded} onChange={e => setDistanceIncluded(e.target.value)}/>
      <label>Unlimited</label>
      <input type="checkbox" checked={unlimited} onChange={() => setUnlimited(!unlimited)}></input>
      <div className="errors">
        {validationErrors.distanceIncluded && <p>{validationErrors.distanceIncluded}</p>}
      </div>
      
      <label>Fuel type</label>
      <select value={fuelTypeId} onChange={(e) => setFuelTypeId(e.target.value)}>
        <option value="1">Gasoline</option>
        <option value="2">Diesel</option>
        <option value="3">Bio-Diesel</option>
        <option value="4">Electric</option>
        <option value="5">Hybrid</option>
      </select>
      <div className="errors">
        {validationErrors.fuelTypeId && <p>{validationErrors.fuelTypeId}</p>}
      </div>

      <label>MPG <span>(leave blank for electric vehicles)</span></label>
      <input type="number" id="MPG-input" value={mpg} onChange={e => setMpg(e.target.value)}/>
      <div className="errors">
        {validationErrors.mpg && <p>{validationErrors.mpg}</p>}
      </div>

      <label>Doors</label>
      <input type="number" value={doors} onChange={e => setDoors(e.target.value)}/>
      <div className="errors">
        {validationErrors.doors && <p>{validationErrors.doors}</p>}
      </div>

      <label>Seats</label>
      <input type="number" value={seats} onChange={e => setSeats(e.target.value)}/>
      <div className="errors">
        {validationErrors.seats && <p>{validationErrors.seats}</p>}
      </div>

      <label>Description</label>
      <textarea name="" id="" cols="30" rows="10" 
      value={description} 
      onChange={e => setDescription(e.target.value)}
      />
      <div className="errors">
        {validationErrors.description && <p>{validationErrors.description}</p>}
      </div>

      <button className="submit-btn btn">Add van</button>
    </form>
  );
};
