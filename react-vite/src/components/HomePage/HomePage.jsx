import { useNavigate } from "react-router";
import { FaSearch } from "react-icons/fa";
import "./HomePage.css";
import { useState } from "react";
import moment from 'moment';
import { useVanListContext } from "../../context/VanListContext";

export const HomePage = () => {
  const navigate = useNavigate();
  const [where, setWhere] = useState("")
  const [from, setFrom] = useState(moment().format("YYYY-MM-DD"))
  const [until, setUntil] = useState(moment().add(3, "d").format("YYYY-MM-DD"))

  const {setMake} = useVanListContext()

  return (
    <div className="home-page">
      <div className="splash-image-div">
        <form className="home-page-search" onSubmit={e => e.preventDefault()}>
          <div id="where-div">
            <label>Where</label> 
            <input type="text" placeholder="City, address or airport" value={where} onChange={e => setWhere(e.target.value)}/>
          </div>
          <div id="from-div">
            <label>From</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)}/>
          </div>
          <div id="until-div">
          <label>Until</label>
            <input type="date" value={until} onChange={e => setUntil(e.target.value)}/>
          </div>
          <button className="home-page-search-btn" onClick={() => alert("Feature coming soon!")}><FaSearch /></button>
        </form>
        <img
          src="https://advanture-capstone.s3.us-west-1.amazonaws.com/fe3d192c918c49a38377d564bfeff287.webp"
          alt=""
        />
      </div>

      <div className="home-page-catchphrases">
        <h1>Escape in Style</h1>
        <h2>Van rentals for the adventurous</h2>
        <div className="purple-bar">
        </div>
        <button id="view-vans-btn" onClick={() => navigate("/vans")}>View Advanture Vans</button>
      </div>

      <div className="home-page-makes-div">
      <h3>Vans by make</h3>
      <div className="makes-cards-div">
        <div className="home-page-make-card" onClick={() => {
          setMake("Mercedes")
          navigate("/vans")
        }}>
          <img src="https://advanture-capstone.s3.us-west-1.amazonaws.com/outside-van-mercedes-sprinter-camper.jpeg" alt="" />
          <h4>Mercedes</h4>
        </div>
        <div className="home-page-make-card" onClick={() => {
          setMake("Ford")
          navigate("/vans")
        }}>
          <img src="https://advanture-capstone.s3.us-west-1.amazonaws.com/20-Caravan-Outfitter-Free-Bird-Ford-Transit-Connect-Camper-Van-Conversion.webp" alt="" />
          <h4>Ford</h4>
        </div>
        <div className="home-page-make-card" onClick={() => {
          setMake("Ram")
          navigate("/vans")
        }}>
          <img src="https://advanture-capstone.s3.us-west-1.amazonaws.com/rrrrr.webp" alt="" />
          <h4>Ram</h4>
        </div>
        <div className="home-page-make-card" onClick={() => {
          setMake("Volkswagen")
          navigate("/vans")
        }}>
          <img src="https://advanture-capstone.s3.us-west-1.amazonaws.com/What%2Byou%2Bneed%2Bto%2Bknow%2Bbefore%2Binvesting%2Bin%2Ba%2Bcamper%2Bvan.jpeg" alt="" />
          <h4>Volkswagen</h4>
        </div>
        <div className="home-page-make-card" onClick={() => {
          setMake("Chevy")
          navigate("/vans")
        }}>
          <img src="https://advanture-capstone.s3.us-west-1.amazonaws.com/1997%2BChevy%2BExpress%2BGeneva%2BConversion%2BVan%2BClark%2BFork%2BRiver.jpeg" alt="" />
          <h4>Chevy</h4>
        </div>
        </div>
      </div>
      {/* <div className="home-page-hosts-div">
        <h3>Meet the hosts</h3>
        <div className="home-page-host-card">
          <div className="home-page-host-top-div">
            <img src="" alt="" />
            <div className="home-page-host-name-date">
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="home-page-host-bottom-div">
            <StarRatings />

          </div>
        </div>
      </div> */}
    </div>
  );
};
