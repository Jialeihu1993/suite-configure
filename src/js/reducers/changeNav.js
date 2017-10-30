import {NAV_MODE_CHANGE, NAV_CURRENT} from '../constants/ActionTypes';
//1: navigation narrow mode  2: navigation wide mode
const initialState = {
  nav: {
    navMode: 2,
    currentNav: ' '
  }
};

const handlers = {
  [NAV_MODE_CHANGE]: (state, action) => {
    if (action.type == NAV_MODE_CHANGE) {
      var newState = Object.assign({}, state.nav);
      var value = action.value;
      if (newState[value.propName]) {
        newState[value.propName] = value.value;
      }
      return {nav: newState};

    } else return state;
  },
  [NAV_CURRENT]: (state, action) => {
    if (action.type == NAV_CURRENT) {
      var newState = Object.assign({}, state.nav);
      var value = action.value;
      if (newState[value.propName]) {
        newState[value.propName] = value.value;
      }
      return {nav: newState};

    } else return state;
  }

};

export default function mainReducers(state = initialState, action) {
  //console.log(action);
  let handler = handlers[action.type];
  if (!handler) return state;
  return {...state, ...handler(state, action)
};
}