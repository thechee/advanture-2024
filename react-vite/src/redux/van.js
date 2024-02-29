const GET_VANS = 'van/GET_VANS'

const getVans = (vans) => ({
  type: GET_VANS,
  vans
})

export const thunkGetVans = () => async dispatch => {
  const response = await fetch('/api/vans')

  if (response.ok) {
    const vans = await response.json()
    dispatch(getVans(vans))
    return vans
  } else {
    const errors = await response.json()
    return errors
  }
}

const initialState = {}

export const vanReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VANS: {
      const newState = {};
      action.vans.forEach(van => {
        newState[van.id] = van
      })
      return newState;
    }
    default:
      return state;
  }
}