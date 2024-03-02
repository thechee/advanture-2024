const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const ADD_USER_VANS = 'session/ADD_USER_VANS'

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

export const thunkAddUserVans = () => async dispatch => {
  const response = await fetch('/api/vans/manage')
  
  if (response.ok) {
    const vans = await response.json()
    dispatch(addUserVans(vans))
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
    default:
      return state;
  }
}

export default sessionReducer;
