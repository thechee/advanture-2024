const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const GET_USER_VANS = 'session/GET_USER_VANS';
const DELETE_USER_VAN = 'session/DELETE_USER_VAN';
const GET_USER_RATINGS = 'session/GET_USER_RATINGS';
const UPDATE_USER_RATING = 'session/UPDATE_USER_RATING';
const DELETE_USER_RATING = 'session/DELETE_USER_RATING';
const ADD_FAVORITE = 'session/ADD_FAVORITE';
const DELETE_FAVORITE = 'session/DELETE_FAVORITE';
const GET_USER_BOOKINGS = 'session/GET_USER_BOOKINGS';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

const getUserVans = (vans) => ({
  type: GET_USER_VANS,
  vans
})

export const deleteUserVan = (vanId) => ({
  type: DELETE_USER_VAN,
  vanId
})

const getUserRatings = (ratings) => ({
  type: GET_USER_RATINGS,
  ratings
})

const updateUserRating = (rating) => ({
  type: UPDATE_USER_RATING,
  rating
})

export const deleteUserRating = (ratingId) => ({
  type: DELETE_USER_RATING,
  ratingId
})

const addFavorite = (vanId) => ({
  type: ADD_FAVORITE,
  vanId
})

const deleteFavorite = (vanId) => ({
  type: DELETE_FAVORITE,
  vanId
})

const getUserBookings = (bookings) => ({
  type: GET_USER_BOOKINGS,
  bookings
})


export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (formData) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};


export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

export const thunkGetUserVans = () => async dispatch => {
  const response = await fetch('/api/vans/manage')
  
  if (response.ok) {
    const vans = await response.json()
    dispatch(getUserVans(vans))
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkGetUserRatings = () => async dispatch => {
  const response = await fetch('/api/ratings/manage')

  if (response.ok) {
    const ratings = await response.json()
    dispatch(getUserRatings(ratings))
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkUpdateUserRatings = (rating) => async dispatch => {
  const response = await fetch(`/api/ratings/${rating.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rating)
  })

  if (response.ok) {
    const updatedRating = await response.json()
    dispatch(updateUserRating(updatedRating))
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkDeleteUserRating = (ratingId) => async dispatch => {
  const response = await fetch(`/api/ratings/${ratingId}`, {
    method: "DELETE"
  })

  if (response.ok) {
    const message = await response.json()
    dispatch(deleteUserRating(ratingId))
    return message
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkAddFavorite = (vanId) => async dispatch => {
  const response = await fetch(`/api/users/favorites/${vanId}`, {
    method: "POST"
  })

  if (response.ok) {
    const newFavorite = await response.json()
    dispatch(addFavorite(newFavorite.vanId))
    return newFavorite
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkDeleteFavorite = (vanId) => async dispatch => {
  const response = await fetch(`/api/users/favorites/${vanId}`, {
    method: "DELETE"
  })

  if (response.ok) {
    const message = await response.json()
    dispatch(deleteFavorite(vanId))
    return message
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkGetUserBookings = () => async dispatch => {
  const response = await fetch(`/api/users/bookings`)

  if (response.ok) {
    const bookings = await response.json()
    dispatch(getUserBookings(bookings))
  } else {
    const errors = await response.json()
    return errors
  }
}


const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case GET_USER_VANS: {
      const newState = { ...state }
      newState.user.vans = {};
      action.vans.forEach(van => newState.user.vans[van.id] = van)
      return newState;
    }
    case DELETE_USER_VAN: {
      const newState = { 
        ...state,
        user: {
          ...state.user,
          vans: {
            ...state.user.vans
          }
        }
      }
      delete newState.user.vans[action.vanId]
      return newState;
    }
    case GET_USER_RATINGS: {
      const newState = { 
        ...state,
        user: {
          ...state.user
        }
      }
      newState.user.ratings = {};
      action.ratings.forEach(rating => newState.user.ratings[rating.id] = rating)
      return newState;
    }
    case UPDATE_USER_RATING: {
      const newState = {
        ...state,
        user: {
          ...state.user,
          ratings: {
            ...state.user.ratings
          }
        }
      }
      newState.user.ratings[action.rating.id] = action.rating
      return newState
    }
    case DELETE_USER_RATING: {
      const newState = { 
        ...state,
        user: {
          ...state.user,
          ratings: {
            ...state.user.ratings
          }
        }
      }
      delete newState.user.ratings[action.ratingId]
      return newState;
    }
    case ADD_FAVORITE: {
      const newState = { 
        ...state,
        user: {
          ...state.user,
          favorites: {
            ...state.user.favorites,
            [action.vanId]: action.vanId
          }
        }
       }
      return newState
    }
    case DELETE_FAVORITE: {
      const newState = { 
        ...state,
        user: {
          ...state.user,
          favorites: {
            ...state.user.favorites
          }
        }
       }
      delete newState.user.favorites[action.vanId]
      return newState
    }
    case GET_USER_BOOKINGS: {
      const newState = {
        ...state,
        user: {
          ...state.user,
          bookings: action.bookings
        }
      }
      return newState
    }
    default:
      return state;
  }
}

export default sessionReducer;
