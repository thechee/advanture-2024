import './RatingsBar.css'

export const RatingsBar = ({ ratingAvg }) => {

  const innerBar = {
    width: `${ratingAvg * 20}%`
  }

  return (
    <div className='ratings-bar'>
      <span style={innerBar}></span>
    </div>
  );
}