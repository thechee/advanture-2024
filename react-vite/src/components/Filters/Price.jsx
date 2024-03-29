import ReactSlider from "react-slider"

export const Price = ({setShowPrice, setPrice, price, priceRef}) => {


  const handleReset = () => {
    setPrice([10, 250])
    setShowPrice(false)
  }

  const priceSubmitHandler = (e) => {
    e.preventDefault()
    setShowPrice(false)
    setPrice(price)
  }

  return (
    <div className="filters price-div" ref={priceRef}>
      <form id="price-form" onSubmit={priceSubmitHandler}>
        <div className="price-input-div">
          <label htmlFor="price">{`$${price[0]} - $${price[1]}+/day`}</label>
          <ReactSlider
            value={price}
            onChange={(value) => setPrice(value)}
            className="slider"
            thumbClassName="filters-thumb"
            trackClassName="price-track"
            min={10}
            max={250}
            step={5}
            defaultValue={price}
            pearling
            minDistance={1}
          />
        </div>
        <div className="filters-btns-div">
          <button className="white-btn" onClick={handleReset}>
            Reset
          </button>
          <button className="submit-btn">Apply</button>
        </div>
      </form>
    </div>
  )
}