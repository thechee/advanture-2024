const GET_VANS = 'van/GET_VANS'
const GET_ONE_VAN = 'van/GET_ONE_VAN'

const getVans = (vans) => ({
  type: GET_VANS,
  vans
})

const getOneVan = (van) => ({
  type: GET_ONE_VAN,
  van
})

export const thunkGetVans = () => async dispatch => {
  const response = await fetch('/api/vans/')

  if (response.ok) {
    const vans = await response.json()
    dispatch(getVans(vans))
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkGetOneVan = (vanId) => async dispatch => {
  const response = await fetch(`/api/vans/${vanId}`)

  if (response.ok) {
    const van = await response.json()
    dispatch(getOneVan(van))
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
    case GET_ONE_VAN: {
      const newState = { ...state }
      newState[action.van.id] = action.van
      return newState;
    }
    default:
      return state;
  }
}