import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetVans } from "../../../redux/van";
import { VanListItem } from "../VanListItem/VanListItem";
import "./VanList.css";
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaSlidersH } from "react-icons/fa";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { Sort } from "../../Filters/Sort";
import { FiltersModal } from "../../Filters/FiltersModal";
import OpenModalButton from "../../OpenModalButton";

export const VanList = () => {
  const dispatch = useDispatch();
  const vansObj = useSelector((state) => state.vans);
  const userFavorites = useSelector((state) => state.session.user?.favorites);
  const mapId = useSelector(state => state.maps.mapId)
  const [latLng, setLatLng] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSort, setShowSort] = useState(false)
  const [showPrice, setShowPrice] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort] = useState("")
  const [tempSort, setTempSort] = useState("")
  const sortRef = useRef()
  const filterRef = useRef()

  useEffect(() => {
    if (sort) {
      dispatch(thunkGetVans(sort))
    } else {
      dispatch(thunkGetVans());
    }
  }, [dispatch, sort]);

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
    if (!showFilters) return;

    const closeMenu = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showFilters]);

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
      setShowFilters(false)
      setShowPrice(false)
    }
    if (filter == "price") {
      setShowPrice(true)
      setShowFilters(false)
      setShowSort(false)
    }
    if (filter == "filters") {
      setShowFilters(true)
      setShowSort(false)
      setShowPrice(false)
    }
  }

  if (!vansObj) return null;
  let vans = Object.values(vansObj);
  if (sort == "low") vans = vans.sort((a, b) => (a.rentalRate - b.rentalRate))
  if (sort == "high") vans = vans.sort((a, b) => (b.rentalRate - a.rentalRate))

  return (
    <>
      <div className="filters-nav">
        {showSort ? 
          <button className="white-btn">Sort by <FaChevronUp /></button>
          :
          <button className="white-btn" onClick={(e) => handleFiltersClick(e, "sort")}>Sort by <FaChevronDown /></button>
        }
        <button className="white-btn" onClick={(e) => handleFiltersClick(e, "price")}>Daily price <FaChevronDown /></button>
        <OpenModalButton
          className={"white-btn"}
          buttonText={"More filters"}
          leftSvg={<FaSlidersH />}
          rightSvg={<FaChevronDown />}
          modalComponent={<FiltersModal />}
          id={"more-filters-btn"}
        />
        {/* {showFilters ? 
        <button className="white-btn" id="more-filters-btn"><FaSlidersH /> More filters <FaChevronUp /></button>
        :
        <button className="white-btn" id="more-filters-btn" onClick={(e) => handleFiltersClick(e, "filters")}><FaSlidersH /> More filters <FaChevronDown /></button>
        } */}
      </div>
      {showSort && <Sort tempSort={tempSort} setTempSort={setTempSort} setSort={setSort} setShowSort={setShowSort} sortRef={sortRef}/>}
      {/* {showFilters && <Filters filterRef={filterRef}/>} */}
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
                {vans.map(van => (
                  <>
                  <AdvancedMarker key={van.id} position={{lat: van.lat, lng: van.lng}} className="price-marker" onClick={() => {}}>
                  <div>
                    <span>${van.rentalRate}</span>
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
