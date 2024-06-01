import { deleteUserVan } from './session'

const GET_VANS = 'van/GET_VANS';
const GET_ONE_VAN = 'van/GET_ONE_VAN';
const ADD_VAN = 'van/ADD_VAN';
const UPDATE_VAN = 'van/UPDATE_VAN';
const DELETE_VAN = 'van/DELETE_VAN';
const ADD_VAN_IMAGES = 'van/ADD_VAN_IMAGES';
const UPDATE_VAN_IMAGES = 'van/UPDATE_VAN_IMAGES';
const GET_VAN_RATINGS = 'van/GET_VAN_RATINGS';
const CREATE_VAN_RATING = 'van/CREATE_VAN_RATING';
const UPDATE_VAN_RATING = 'van/UPDATE_VAN_RATING';
const DELETE_VAN_RATING = 'van/DELETE_VAN_RATING';
const CREATE_VAN_BOOKING = 'van/CREATE_VAN_BOOKING';

/* ========== Action Creators ========== */

const getVans = (vans) => ({
  type: GET_VANS,
  vans
})

const getOneVan = (van) => ({
  type: GET_ONE_VAN,
  van
})

const addVan = (van) => ({
  type: ADD_VAN,
  van
})

const updateVan = (van) => ({
  type: UPDATE_VAN,
  van
})

const deleteVan = (vanId) => ({
  type: DELETE_VAN,
  vanId
})

const addVanImages = (vanId, images) => ({
  type: ADD_VAN_IMAGES,
  vanId,
  images
})

const updateVanImages = (vanId, images) => ({
  type: UPDATE_VAN_IMAGES,
  vanId,
  images
})

const getVanRatings = (vanId, ratings) => ({
  type: GET_VAN_RATINGS,
  vanId,
  ratings
})

const createVanRating = (vanId, rating) => ({
  type: CREATE_VAN_RATING,
  vanId,
  rating
})

const updateVanRating = (vanId, rating) => ({
  type: UPDATE_VAN_RATING,
  vanId,
  rating
})

const deleteVanRating = (vanId, ratingId) => ({
  type: DELETE_VAN_RATING,
  vanId,
  ratingId
})

const createVanBooking = (payload) => ({
  type: CREATE_VAN_BOOKING,
  payload
})

/* ========== Thunks ========== */

export const thunkGetVans = (price, make, years, seats, fuelTypes, miles) => async dispatch => {
  let url = "/api/vans?"
  // if (sort) url += `?sort=${sort}`
  if (price) url += `&price=${price}`
  if (make && make !== "placeholder") url += `&make=${make}`
  if (years) url += `&years=${years}`
  if (seats && seats !== "placeholder") url += `&seats=${seats}`
  if (fuelTypes) url += `&fuelTypes=${fuelTypes}`
  if (miles && miles !== "placeholder") url += `&miles=${miles}`
  
  const response = await fetch(url)

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

export const thunkAddVan = (vanData) => async dispatch => {
  const response = await fetch('/api/vans/new', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vanData)
  })

  if (response.ok) {
    const van = await response.json()
    dispatch(addVan(van))
    return van
  } else {
    const errors = await response.json()
    return errors
  }  
}

export const thunkUpdateVan = (vanData, vanId) => async dispatch => {
  const response = await fetch(`/api/vans/${vanId}/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vanData)
  })

  if (response.ok) {
    const van = await response.json()
    dispatch(updateVan(van))
    return van
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkDeleteVan = (vanId) => async dispatch => {
  const response = await fetch(`/api/vans/${vanId}`, {
    method: "DELETE"
  })

  if (response.ok) {
    const message = await response.json()
    dispatch(deleteVan(vanId))
    dispatch(deleteUserVan(vanId))
    return message
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkAddVanImages = (formData, vanId) => async dispatch => {
  const response = await fetch(`/api/vans/${vanId}/images`, {
    method: "POST",
    body: formData,
  })

  if (response.ok) {
    const images = await response.json()
    dispatch(addVanImages(vanId, images))
    return images
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkUpdateVanImages = (formData, vanId) => async dispatch => {
  const response = await fetch(`/api/vans/${vanId}/images`, {
    method: "PUT",
    body: formData,
  })

  if (response.ok) {
    const images = await response.json()
    dispatch(updateVanImages(vanId, images))
    return images
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkGetVanRatings = (vanId) => async dispatch => {
  const response = await fetch(`/api/vans/${vanId}/ratings`)

  if (response.ok) {
    const ratings = await response.json()
    dispatch(getVanRatings(vanId, ratings))
    return ratings
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkCreateVanRating = (vanId, rating) => async dispatch => {
  const response = await fetch(`/api/vans/${vanId}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rating)
  })

  if (response.ok) {
    const newRating = await response.json()
    dispatch(createVanRating(vanId, newRating))
    return newRating
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkUpdateVanRating = (vanId, rating) => async dispatch => {
  const response = await fetch(`/api/ratings/${rating.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rating)
  })

  if (response.ok) {
    const updatedRating = await response.json()
    dispatch(updateVanRating(vanId, updatedRating))
    return updatedRating
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkDeleteVanRating = (vanId, ratingId) => async dispatch => {
  const response = await fetch(`/api/ratings/${ratingId}`, {
    method: "DELETE"
  })

  if (response.ok) {
    const message = await response.json()
    dispatch(deleteVanRating(vanId, ratingId))
    // dispatch(deleteUserRating(ratingId))
    return message
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkCreateVanBooking = (bookingData, vanId) => async dispatch => {
  const response = await fetch(`/api/vans/${vanId}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData)
  })

  if (response.ok) {
    const newBooking = await response.json()
    dispatch(createVanBooking(newBooking))
    return newBooking
  } else {
    const errors = await response.json()
    return errors
  }
}


/* ========== Reducer ========== */

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
    case ADD_VAN: {
      const newState = { ...state }
      newState[action.van.id] = action.van
      return newState;
    }
    case ADD_VAN_IMAGES: {
      const newState = { ...state }
      action.images.forEach(image => newState[action.vanId].images = {...newState[action.vanId].images, [image.id]: image})
      return newState;
    }
    case UPDATE_VAN_IMAGES: {
      const newState = { ...state }
      newState[action.vanId].images = {}
      action.images.forEach(image => newState[action.vanId].images = { ...newState[action.vanId].images, [image.id]: image })
      return newState;
    }
    case UPDATE_VAN: {
      const newState = { ...state }
      newState[action.van.id] = action.van
      return newState;
    }
    case DELETE_VAN: {
      const newState = { ...state }
      delete newState[action.vanId]
      return newState;
    }
    case GET_VAN_RATINGS: {
      const newState = { ...state }
      newState[action.vanId].ratings = {}
      action.ratings.forEach(rating => newState[action.vanId].ratings[rating.id] = rating)
      return newState
    }
    case CREATE_VAN_RATING: {
      const newState = { 
        ...state,
        [action.vanId]: {
          ...state[action.vanId],
          ratings: {
            ...state[action.vanId].ratings,
            [action.rating.id]: action.rating
          }
        }
      }
      return newState;
    }
    case UPDATE_VAN_RATING: {
      const newState = { 
        ...state,
        [action.vanId]: {
          ...state[action.vanId],
          ratings: {
            ...state[action.vanId].ratings,
            [action.rating.id]: action.rating
          }
        }
      }
      return newState;
    }
    case DELETE_VAN_RATING: {
      const newState = { 
        ...state,
        [action.vanId]: {
          ...state[action.vanId],
          ratings: {
            ...state[action.vanId].ratings
          }
        }
      }
      delete newState[action.vanId].ratings[action.ratingId]
      return newState
    }
    case CREATE_VAN_BOOKING: {
      const newState = { 
        ...state,
        [action.payload.vanId]: {
          ...state[action.payload.vanId],
          bookings: {
            ...state[action.payload.vanId].bookings,
            [action.payload.id]: action.payload
          }
        }
      }
      return newState;
    }
    default:
      return state;
  }
}