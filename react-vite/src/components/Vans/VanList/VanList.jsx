import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetVans } from "../../../redux/van";
import { VanListItem } from "../VanListItem/VanListItem";
import "./VanList.css";
import { Map } from "@vis.gl/react-google-maps";

export const VanList = () => {
  const dispatch = useDispatch();
  const vansObj = useSelector((state) => state.vans);
  const userFavorites = useSelector((state) => state.session.user?.favorites);
  const mapId = useSelector(state => state.maps.mapId)
  const [latLng, setLatLng] = useState({});
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

  if (!vansObj) return null;
  const vans = Object.values(vansObj);

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
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
