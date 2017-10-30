import {UPDATE_EMAIL_PROPERTY, INIT_EMAIL_SUCCESS, TEST_SMTP, CLEAR_TEST_SMTP,SMTP_TEST_SUCCESS,SMTP_REVERT} from '../constants/ActionTypes';
import Property from '../stores/Property';
import updateProperty from './util';

const initialState = {
  isLoaded: false,
  isLoading: false,
  host: new Property('','','',''),
  port: new Property('','','',''),
  ssl:new Property('','','',''),
  password: new Property('','','',''),
  username: new Property('','','',''),
  from: new Property('','','','')
};

const handlers = {

  [TEST_SMTP]: (state, action) => {
  let newState = Object.assign({}, state);
  newState.testSMTPResult = action.value;
  return { ...newState, isLoading:false};
},

[CLEAR_TEST_SMTP]: (state,action) => {
  let newState = Object.assign({}, state);
  newState.testSMTPResult = null;
  return { ...newState};
},

	[UPDATE_EMAIL_PROPERTY]: (state, action) => {
    return {
      ...updateProperty(state, action)
    }
	},

  [INIT_EMAIL_SUCCESS]: (state, action) => {
  var newState = Object.assign({}, state);
  var value = action.value;
  for (var prop in value) {
    newState[prop] = newState[prop] || {};
    newState[prop].originalVal = value[prop];
    newState[prop].currentVal = value[prop];
    newState[prop].testVal = value[prop];
  }
  return {
    ...newState,
    isLoaded:true
  };
},

 [SMTP_TEST_SUCCESS]:(state, action) => {
    var newState = Object.assign({}, state);
    for (var prop in newState) {  
      if(prop == 'isLoaded' || prop == 'isLoading' || prop == 'testSMTPResult'){
        continue;
      }
      newState[prop].testVal = newState[prop].currentVal;
    }
    return {
      ...newState
    };
 },

 [SMTP_REVERT]:(state,action) => {
    var newState = Object.assign({}, state);
   for (var prop in newState) {
     if(prop == 'isLoaded' || prop == 'isLoading'|| prop == 'testSMTPResult'){
        continue;
      }
      newState[prop].currentVal = newState[prop].testVal;
    }
    return {
      ...newState
    };
 }

};

export default function emailReducers(state = initialState, action) {
  let handler = handlers[action.type];
  if (!handler) return state;
  return {...state, ...handler(state, action)
};
}