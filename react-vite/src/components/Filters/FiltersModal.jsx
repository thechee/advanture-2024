import { useState } from 'react';
import ReactSlider from 'react-slider';
import { useModal } from '../../context/Modal';
import styled from 'styled-components';
import './FiltersModal.css';

export const FiltersModal = () => {
  const { closeModal } = useModal();
  const [make, setMake] = useState("placeholder")
  const [years, setYears] = useState([1950, new Date().getFullYear() + 1])
  const [seats, setSeats] = useState("placeholder")
  const [fuelType, setFuelType] = useState("")

  const allYears = JSON.stringify(years) === JSON.stringify([1950, new Date().getFullYear() + 1])

  return (
    <div className="more-filters-div">
      <h3>More Filters</h3>
      <div>
      <h4>Vehicle attributes</h4>
      <label htmlFor="">Make</label>
      <select className="more-filters-select" value={make} onChange={e => setMake(e.target.value)}>
        <option value="placeholder" disabled>- Select -</option>
        <option value="Chevy">Chevy</option>
        <option value="Dodge">Dodge</option>
        <option value="Ford">Ford</option>
        <option value="Mercedes">Mercedes</option>
        <option value="Ram">Ram</option>
        <option value="Volkswagen">Volkswagen</option>
      </select>
      <label htmlFor="">{allYears ? "All years" : <>{years[0]} - {years[1]}</>}</label>
      <ReactSlider 
        value={years}
        onChange={(value) => setYears(value)}
        className="year-slider"
        thumbClassName="year-thumb"
        trackClassName="year-track"
        min={1950}
        max={new Date().getFullYear() + 1}
        step={1}
        defaultValue={years}
        pearling
        minDistance={1}
        />
      <label htmlFor="">Number of seats</label>
      <select className="more-filters-select" value={seats}>
        <option value="placeholder" disabled>- Select -</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </select>
      </div>
      <div>
        <h4>Fuel type</h4>
        <div className='fuel-types'>
        <div className={'fuel-type-filter' + (fuelType == "gasoline" ? " active" : "")} onClick={() => setFuelType("gasoline")}><span>Gasoline</span></div>
        <div className={'fuel-type-filter' + (fuelType == "diesel" ? " active" : "")} onClick={() => setFuelType("diesel")}><span>Diesel</span></div>
        <div className={'fuel-type-filter' + (fuelType == "bio-diesel" ? " active" : "")} onClick={() => setFuelType("bio-diesel")}><span>Bio-diesel</span></div>
        <div className={'fuel-type-filter' + (fuelType == "electric" ? " active" : "")} onClick={() => setFuelType("electric")}><span>Electric</span></div>
        <div className={'fuel-type-filter' + (fuelType == "hybrid" ? " active" : "")} onClick={() => setFuelType("hybrid")}><span>Hybrid</span></div>
        </div>
      </div>
    </div>
  )
};