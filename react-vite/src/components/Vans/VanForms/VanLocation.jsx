import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useVanFormContext } from "../../../hooks/useVanFormContext";
import { PlaceAutocompleteClassic } from "./AddressAutocomplete";
import { useSelector } from "react-redux";

export const VanLocation = ({ type }) => {
  const { data, validationErrors, setData, setValidAddressSelected } = useVanFormContext();
  const mapId = useSelector((state) => state.maps.mapId);

  const handlePlaceSelect = (place) => {
    setValidAddressSelected(true);

    const splitAddress = place.formatted_address.split(", ");
    const address = splitAddress[0];
    const city = splitAddress[1];
    const state = splitAddress[2].split(" ")[0];
    const zipCode = splitAddress[2].split(" ")[1];


    setData((prevData) => {
      return {
        ...prevData,
        address,
        city,
        state,
        zipCode,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
    })
  }

  return (
    <div className="van-form-location-div">
      <PlaceAutocompleteClassic 
        onPlaceSelect={handlePlaceSelect} 
        address={type == "update" ? 
        `${data.address}, ${data.city}, ${data.state} ${data.zipCode}` : 
        ""}
      />
      <div className="errors">
        {validationErrors.address && <p>{validationErrors.address}</p>}
      </div>

      <Map
        center={data.lat && data.lng ? {lat: data.lat, lng: data.lng} :  {lat: 39.50, lng: -98.35}}
        zoom={data.lat && data.lng ? 13 : 4}
        gestureHandling={"greedy"}
        controlled={true}
        disableDefaultUI={true}
        style={{ height: "500px", marginTop: "1rem", marginBottom: "3rem" }}
        mapId={mapId}
      >
        {data.lat && data.lng && <AdvancedMarker position={{lat: data.lat, lng: data.lng }} className={"custom-marker"}>
          <div></div>
        </AdvancedMarker>}
      </Map>
    {/* <label>Address</label>
    <input
      type="text"
      value={data.address}
      name="address"
      onChange={handleChange}
    />

    <label>City</label>
    <input
      type="text"
      value={data.city}
      name="city"
      onChange={handleChange}
    />
    <div className="errors">
      {validationErrors.city && <p>{validationErrors.city}</p>}
    </div>

    <label>State</label>
    <select
      name="state"
      id="state"
      value={data.state}
      onChange={handleChange}
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
      value={data.zipCode}
      minLength={5}
      maxLength={5}
      name="zipCode"
      onChange={handleChange}
    />
    <div className="errors">
      {validationErrors.zipCode ||
        (validationErrors.zip_code && <p>{validationErrors.zipCode}</p>)}
    </div> */}
    </div>
  )
}