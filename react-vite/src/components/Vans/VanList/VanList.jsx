import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetVans } from "../../../redux/van";
import { VanListItem } from "../VanListItem/VanListItem";
import "./VanList.css";
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";

export const VanList = () => {
  const dispatch = useDispatch();
  const vansObj = useSelector((state) => state.vans);
  const userFavorites = useSelector((state) => state.session.user?.favorites);
  const mapId = useSelector(state => state.maps.mapId)
  const [latLng, setLatLng] = useState({});
  const [vanPositions, setVanPositions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSort, setShowSort] = useState(false)
  const [showPrice, setShowPrice] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort] = useState("")
  const divRef = useRef()

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

  useEffect(() => {
    if (!showSort) return;

    const closeMenu = (e) => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        setShowSort(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showSort]);

  const handleFiltersClick = (e, filter) => {
    e.stopPropagation();
    if (filter == "sort") setShowSort(true)
    if (filter == "price") setShowPrice(true)
    if (filter == "filters") setShowFilters(true)
  }

  if (!vansObj) return null;
  let vans = Object.values(vansObj);
  if (sort == "low") vans = vans.sort((a, b) => (a.rentalRate - b.rentalRate))
  if (sort == "high") vans = vans.sort((a, b) => (b.rentalRate - a.rentalRate))

  const handleReset = (e) => {
    // e.preventDefault()
    // e.stopPropagation();
    const form = document.getElementById("sort-form")
    form.reset()
    setSort("")
    setShowSort(false)
    dispatch(thunkGetVans())
  }

  const sortSubmitHandler = (e) => {
    e.preventDefault()
    dispatch(thunkGetVans(sort))
  }

  return (
    <>
      <div className="filters-nav">
        {showSort ? 
        <button className="white-btn">Sort by <FaChevronUp /></button>
        :
        <button className="white-btn" onClick={(e) => handleFiltersClick(e, "sort")}>Sort by <FaChevronDown /></button>}
        <button className="white-btn" onClick={(e) => handleFiltersClick(e, "price")}>Daily price <FaChevronDown /></button>
        <button className="white-btn" onClick={(e) => handleFiltersClick(e, "filters")}>More filters <FaChevronDown /></button>
      </div>
      {showSort && <div className="sort-div" ref={divRef}>
        <form id="sort-form" onSubmit={sortSubmitHandler}>
        <div className="sort-choice-radios">
        <input type="radio" name="sort" value="low" id="sort-choice-low"
        onChange={() => setSort("low")}/>
        <label htmlFor="sort-choice-low">Daily price: low to high</label>
        </div>
        <div className="sort-choice-radios">
        <input type="radio" name="sort" value="high" id="sort-choice-high"
        onChange={() => setSort("high")}/>
        <label htmlFor="sort-choice-high">Daily price: high to low</label>
        </div>
        <div className="sort-btns-div">
          <button className="white-btn" onClick={handleReset}>Reset</button>
          <button className="submit-btn">Apply</button>
        </div>
        </form>
        </div>}
      {showFilters && <div className="more-filters-div">

        </div>}
      {isLoaded && (
        <div className="van-list-content">
          <ul className="van-list-ul">
            <h3>{vans.length} vans available</h3>
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
                style={{WebkitBoxShadow: "0 0 1px 3px #000 inset"}}
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
        </div>
      )}
      </>
  );
};
