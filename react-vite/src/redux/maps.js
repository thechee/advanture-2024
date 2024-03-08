const LOAD_API_KEY = 'maps/LOAD_API_KEY';


const loadApiKey = (data) => ({
  type: LOAD_API_KEY,
  data
});


export const getKey = () => async (dispatch) => {
  const res = await fetch('/api/maps/key', {
    method: 'POST',
  });
  const data = await res.json();

  dispatch(loadApiKey(data));
};


const initialState = { key: null };

export const mapsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_API_KEY:
      return { key: action.data.key, mapId: action.data.mapId };
    default: 
      return state
  }
}