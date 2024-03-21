import ReactSlider from 'react-slider';
import { useModal } from '../../context/Modal';
import './FiltersModal.css';
import { useSelector } from 'react-redux';
import { useVanListContext } from '../../context/VanListContext';

export const FiltersModal = () => {
  const { closeModal } = useModal();
  const vans = useSelector(state => state.vans)
  const { make, setMake, years, setYears, seats, setSeats, fuelTypes, setFuelTypes, mileage, setMilage, handleReset, count, allYears } = useVanListContext()


  const handleFuelTypes = (fuelType) => {
    if (fuelTypes.includes(fuelType)) {
      setFuelTypes(fuelTypes.filter(type => type !== fuelType))
    } else {
      setFuelTypes([...fuelTypes, fuelType])
    }
  }

  return (
    <div className="more-filters-div">
      <div className='more-filters-header'>
        <div className='more-filters-header-title'>
          <h3>More Filters</h3>
          <div id='more-filters-count'>
            {count ? <span>{count}</span> : null}
          </div>
        </div>
      <span id='reset-span' onClick={handleReset}>Reset</span>
      </div>
      <div>
      <h4>Vehicle attributes</h4>
      <label htmlFor="">Make</label>
      <select className="more-filters-select" value={make} o onChange={e => setMake(e.target.value)}>
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
        thumbClassName="filters-thumb"
        trackClassName="year-track"
        min={1950}
        max={new Date().getFullYear() + 1}
        step={1}
        defaultValue={years}
        pearling
        minDistance={1}
        />
      <label htmlFor="">Number of seats</label>
      <select className="more-filters-select" value={seats} onChange={e => setSeats(e.target.value)}>
        <option value="placeholder" disabled>- Select -</option>
        <option value="2">2 +</option>
        <option value="3">3 +</option>
        <option value="4">4 +</option>
        <option value="5">5 +</option>
        <option value="6">6 +</option>
        <option value="7">7 +</option>
        <option value="8">8 +</option>
        <option value="9">9 +</option>
      </select>
      </div>
      <div>
        <h4>Fuel type</h4>
        <div className='fuel-types'>
        <div className={'fuel-type-filter' + (fuelTypes.includes(1) ? " active" : "")} onClick={() => handleFuelTypes(1)}><span>Gasoline</span></div>
        <div className={'fuel-type-filter' + (fuelTypes.includes(2) ? " active" : "")} onClick={() => handleFuelTypes(2)}><span>Diesel</span></div>
        <div className={'fuel-type-filter' + (fuelTypes.includes(3) ? " active" : "")} onClick={() => handleFuelTypes(3)}><span>Bio-diesel</span></div>
        <div className={'fuel-type-filter' + (fuelTypes.includes(4) ? " active" : "")} onClick={() => handleFuelTypes(4)}><span>Electric</span></div>
        <div className={'fuel-type-filter' + (fuelTypes.includes(5) ? " active" : "")} onClick={() => handleFuelTypes(5)}><span>Hybrid</span></div>
        </div>
      </div>
      <div>
        <h4>Mileage included</h4>
        <label htmlFor="">{mileage}mi/day +</label>
        <ReactSlider
          value={mileage}
          onChange={(value) => setMilage(value)}
          className="mileage-slider"
          thumbClassName="filters-thumb"
          trackClassName="mileage-track"
          min={100}
          max={500}
          step={50}
        />
      </div>
      <div className="more-filters-btns">
        <button className="submit-btn" onClick={closeModal}>{vans ? `View ${Object.values(vans).length} results` : "No vans available"}</button>
        </div>
    </div>
  )
};