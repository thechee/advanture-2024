export const Sort = ({ tempSort, setTempSort, setSort, setShowSort, sortRef }) => {

  const handleReset = () => {
    // e.preventDefault()
    // e.stopPropagation();
    const form = document.getElementById("sort-form")
    form.reset()
    setSort("")
    setTempSort("")
    setShowSort(false)
  }

  const sortSubmitHandler = (e) => {
    e.preventDefault()
    setShowSort(false)
    setSort(tempSort)
  }

  return (
    <div className="filters sort-div" ref={sortRef}>
      <form id="sort-form" onSubmit={sortSubmitHandler}>
        <div className="sort-choice-radios">
          <input
            type="radio"
            name="sort"
            value="low"
            checked={tempSort === "low"}
            id="sort-choice-low"
            onChange={() => setTempSort("low")}
          />
          <label htmlFor="sort-choice-low">Daily price: low to high</label>
        </div>
        <div className="sort-choice-radios">
          <input
            type="radio"
            name="sort"
            value="high"
            checked={tempSort === "high"}
            id="sort-choice-high"
            onChange={() => setTempSort("high")}
          />
          <label htmlFor="sort-choice-high">Daily price: high to low</label>
        </div>
        <div className="filters-btns-div">
          <button className="white-btn" onClick={handleReset}>
            Reset
          </button>
          <button className="submit-btn">Apply</button>
        </div>
      </form>
    </div>
  );
};
