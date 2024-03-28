import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetVans } from "../../../redux/van";
import { VanListItem } from "../VanListItem/VanListItem";
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaSlidersH, FaCheck } from "react-icons/fa";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { Sort } from "../../Filters/Sort";
import { FiltersModal } from "../../Filters/FiltersModal";
import OpenModalButton from "../../OpenModalButton";
import "./VanList.css";
import { useVanListContext } from "../../../context/VanListContext";
export const VanList = () => {
  const dispatch = useDispatch();
  const vansObj = useSelector((state) => state.vans);
  const userFavorites = useSelector((state) => state.session.user?.favorites);
  const mapId = useSelector(state => state.maps.mapId)
  const [latLng, setLatLng] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSort, setShowSort] = useState(false)
  const [showPrice, setShowPrice] = useState(false)
  const [sort, setSort] = useState("")
  const [tempSort, setTempSort] = useState("")
  const [center, setCenter] = useState(null)
  const sortRef = useRef()
  const { make, years, seats, fuelTypes, mileage, handleReset, count } = useVanListContext()

  useEffect(() => {
    // if (sort) {
    //   dispatch(thunkGetVans(sort))
    // } else {
    // }
    const timer = setTimeout(() => {
    dispatch(thunkGetVans(make, years, seats, fuelTypes, mileage));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, make, years, seats, fuelTypes, mileage]);

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
    if (!showSort) return;

    const closeMenu = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showSort]);

  const handleFiltersClick = (e, filter) => {
    e.stopPropagation();
    if (filter == "sort") {
      setShowSort(true)
      setShowPrice(false)
    }
    if (filter == "price") {
      setShowPrice(true)
      setShowSort(false)
    }
  }

  let vans = useMemo(() => {
    let vansArray = Object.values(vansObj);
    if (sort === "low") return vansArray.sort((a, b) => (a.rentalRate - b.rentalRate));
    if (sort === "high") return vansArray.sort((a, b) => (b.rentalRate - a.rentalRate));
    return vansArray;
  }, [vansObj, sort]);


  return (
    
    <>
      <div className="filters-nav">
        {showSort ? 
          sort ? 
            (<button className="filters-active-btn">Sort • Daily price: {sort} to {sort == 'high' ? "low" : "high"} <FaChevronUp /></button>) 
            : 
            (<button className="white-btn">Sort by <FaChevronUp /></button>)
          :
          <button className={sort ? "filters-active-btn" : "white-btn"} onClick={(e) => handleFiltersClick(e, "sort")}>{sort ? `Sort • Daily price: ${sort} to ${sort == 'high' ? "low" : "high"}` : "Sort by" }<FaChevronDown /></button>
        }
        <button className="white-btn" onClick={(e) => handleFiltersClick(e, "price")}>Daily price <FaChevronDown /></button>
        {count ? 
        <OpenModalButton
          className={"filters-active-btn"}
          buttonText={`More filters (${count})`}
          leftSvg={<FaCheck />}
          rightSvg={<FaChevronDown />}
          modalComponent={<FiltersModal />}
          id={"more-filters-btn"}
        />
        :
        <OpenModalButton
          className={"white-btn"}
          buttonText={"More filters"}
          leftSvg={<FaSlidersH />}
          rightSvg={<FaChevronDown />}
          modalComponent={<FiltersModal />}
          id={"more-filters-btn"}
        />}
      </div>
      {showSort && <Sort tempSort={tempSort} setTempSort={setTempSort} setSort={setSort} setShowSort={setShowSort} sortRef={sortRef}/>}
      {isLoaded && (
        <div className="van-list-content">
          {vans.length ? 
          <ul className="van-list-ul">
            <h3>{vans.length} vans available</h3>
            {vans.map((van) => (
              <VanListItem key={van.id} van={van} />
            ))}
          </ul> :
          <div className="no-vans-found">
            <h3>No vans found</h3>
            <p>Try changing your filters</p>
            <button className="submit-btn" onClick={handleReset}>Reset filters</button>
          </div>
          }


          <div className="van-list-map-div">
            {Object.values(latLng).length > 0 && (
              <Map
                key={mapId}
                defaultCenter={center || latLng}
                // center={center || latLng}
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
                {vans.map(van => (
                  <div key={van.id}>
                    <AdvancedMarker position={{lat: van.lat, lng: van.lng}} className="price-marker" onClick={() => {setCenter({lat: van.lat, lng: van.lng})}}>
                      <div>
                        <span>${van.rentalRate}</span>
                      </div>
                    </AdvancedMarker>
                  </div>
                ))}
                
                </Map>
            )}
          </div>
        </div>
      )}
</>
  );
};
