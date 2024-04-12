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
    const zipCode = splitAddress[2].split(" ")[1].slice(0,5);


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
    </div>
  )
}