import './FormBar.css'

export const FormBar = ({page}) => {

  const innerBar = {
    width: `${(page + 1) * 25}%`
  }

  return (
    <div className='form-bar'>
      <span style={innerBar}></span>
    </div>
);
}