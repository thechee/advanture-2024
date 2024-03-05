const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const ADD_USER_VANS = 'session/ADD_USER_VANS';
const ADD_USER_RATINGS = 'session/ADD_USER_RATINGS';
const REMOVE_USER_RATING = 'session/REMOVE_USER_RATING';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

const addUserVans = (vans) => ({
  type: ADD_USER_VANS,
  vans
})

const addUserRatings = (ratings) => ({
  type: ADD_USER_RATINGS,
  ratings
})

const removeUserRating = (ratingId) => ({
  type: REMOVE_USER_RATING,
  ratingId
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

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

export const thunkGetUserVans = () => async dispatch => {
  const response = await fetch('/api/vans/manage')
  
  if (response.ok) {
    const vans = await response.json()
    dispatch(addUserVans(vans))
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkGetUserRatings = () => async dispatch => {
  const response = await fetch('/api/ratings/manage')

  if (response.ok) {
    const ratings = await response.json()
    dispatch(addUserRatings(ratings))
  } else {
    const errors = await response.json()
    return errors
  }
}

export const thunkRemoveUserRating = (ratingId) => async dispatch => {
  const response = await fetch(`/api/ratings/${ratingId}`, {
    method: "DELETE"
  })

  if (response.ok) {
    const message = await response.json()
    dispatch(removeUserRating(ratingId))
    return message
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
    case ADD_USER_VANS: {
      const newState = { ...state }
      newState.user.vans = {};
      action.vans.forEach(van => newState.user.vans[van.id] = van)
      return newState;
    }
    case ADD_USER_RATINGS: {
      const newState = { ...state }
      newState.user.ratings = {};
      action.ratings.forEach(rating => newState.user.ratings[rating.id] = rating)
      return newState;
    }
    case REMOVE_USER_RATING: {
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
    default:
      return state;
  }
}

export default sessionReducer;
