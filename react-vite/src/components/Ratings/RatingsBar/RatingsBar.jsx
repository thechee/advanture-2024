import './RatingsBar.css'

export const RatingsBar = ({ ratingAvg, name }) => {

  const innerBar = {
    width: `${ratingAvg * 20}%`
  }

  return (
    <div className="rating">
      <span className='rating-name'>{name}</span>
      <div className='ratings-bar'>
        <span style={innerBar}></span>
      </div>
      <span className='avg-rating-num'>
        {ratingAvg !== 0 ? ratingAvg.toFixed(1) : "--"}
      </span>
    </div>
  );
}