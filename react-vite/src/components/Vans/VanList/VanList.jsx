import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetVans } from "../../../redux/van";
import { VanListItem } from "../VanListItem/VanListItem";
import "./VanList.css";
import { FaMapMarkerAlt } from "react-icons/fa";

import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";

export const VanList = () => {
  const dispatch = useDispatch();
  const vansObj = useSelector((state) => state.vans);
  const userFavorites = useSelector((state) => state.session.user?.favorites);
  const mapId = useSelector(state => state.maps.mapId)
  const [latLng, setLatLng] = useState({});
  const [vanPositions, setVanPositions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(thunkGetVans());
  }, [dispatch]);

  useEffect(() => {}, [userFavorites]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLatLng(pos);
      });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    async function getVanLatLng(vans) {
      const { Geocoder } = await google.maps.importLibrary("geocoding");
  
      const geocoder = new Geocoder();
  
      vans.forEach(async van => {

        await geocoder.geocode(
          {
            address: `${van.address}, ${van.city}, ${van.state}`,
          },
          (results, status) => {
            if (status == "OK") {
              tempArr.push({
                van: van,
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              })
            }
          }
        );
      })
    }
    const tempArr = []
    getVanLatLng(Object.values(vansObj))
    setVanPositions(tempArr)

  }, [vansObj, ])

  if (!vansObj) return null;
  const vans = Object.values(vansObj);


  console.log("vanPositions", vanPositions)

  return (
    <div className="van-list-content">
      {isLoaded && (
        <>
          <ul className="van-list-ul">
            {vans.map((van) => (
              <VanListItem key={van.id} van={van} />
            ))}
          </ul>
          <div className="van-list-map-div">
            {!!Object.values(latLng).length && (
              <Map
                defaultCenter={latLng}
                defaultZoom={12}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                mapId={mapId}
                >
                  
                  <AdvancedMarker position={latLng} className="user-pos">
                    <div>
                    <FaMapMarkerAlt />
                    </div>
                  </AdvancedMarker>
                {vanPositions.map(van => (
                  <>
                  <AdvancedMarker key={van.van.id} position={{lat: van.lat, lng: van.lng}} className="price-marker" onClick={() => {}}>
                  <div>
                    <span>${van.van.rentalRate}</span>
                  </div>
                </AdvancedMarker>
                  </>
                ))}
                
                </Map>
            )}
          </div>
        </>
      )}
    </div>
  );
};
