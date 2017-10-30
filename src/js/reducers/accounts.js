import {UPDATE_LDAP_PROPERTY, INIT_LDAP_SUCCESS, INIT_LDAP_FAILURE, UPDATE_ADMIN_PROPERTY, UPDATE_ADMIN_PROPERTY_OLD, TEST_LDAP, CLEAR_TEST_LDAP, CHANGE_PASSOWRD_SUCCESS, CHANGE_PASSOWRD_FAILURE, CLEAR_CHANGE_PASSWORD_RESULT,LDAP_TEST_SUCCESS,LDAP_REVERT} from '../constants/ActionTypes';
import Property from 'stores/Property';
import { FIELD_TYPE_PASSWORD } from 'constants/Constants';
import updateProperty from './util';

const initialState = {
  isLoaded: false,
  isLoading: false,
  ldap: {
    ip: new Property('','','',''),
    port: new Property('','','',''),
    ssl: new Property('','','',''),
    userName: new Property('','','',''),
    password: new Property('','','',''),
    baseDN: new Property('','','',''),
    uidName: new Property('','','','')
  },

  admin:{
    password: new Property('','',FIELD_TYPE_PASSWORD,'')
  }
};




const handlers = {
  [TEST_LDAP]: (state, action) => {
  let newState = Object.assign({}, state.ldap);
  newState.testLDAPResult = action.value;
  return { ldap: newState, isLoading:false};
},

[CLEAR_TEST_LDAP]: (state,action) => {
  let newState = Object.assign({}, state.ldap);
  newState.testLDAPResult = null;
  return { ldap: newState};
},

  [UPDATE_LDAP_PROPERTY]: (state, action) => {
    return {
      ldap: updateProperty(state.ldap, action)
    };
  },

  [INIT_LDAP_SUCCESS]: (state, action) => {
    var newState = Object.assign({}, state.ldap);
    var value = action.value;
    for (var prop in value) {
      newState[prop] = newState[prop] || {};
      newState[prop].originalVal = value[prop];
      newState[prop].currentVal = value[prop];
      newState[prop].testVal = value[prop];
    }
    return {
      ldap: newState,
      isLoaded: true
    };
  },

  [INIT_LDAP_FAILURE]: (state, action) => {
    error: action.error
  },

  [UPDATE_ADMIN_PROPERTY]:(state, action) => {
    return {
      admin: updateProperty(state.admin, action)
    };
  },

  [UPDATE_ADMIN_PROPERTY_OLD]:(state, action) => {
    var newState = Object.assign({}, state.admin);
      var value = action.value;
      if (newState[value.propName])
        newState[value.propName].originalVal = value.value;
      return {
        admin: newState
      };
  },

  [CHANGE_PASSOWRD_SUCCESS]:(state, action) => {
    let newState = Object.assign({}, state.admin);
    newState.changePasswordResult = action.value;
    return { admin: newState, isLoading:false};
  },

  [CHANGE_PASSOWRD_FAILURE]:(state,action) => {
    let newState = Object.assign({}, state.admin);
    newState.changePasswordResult = action.value;
    return { admin: newState, isLoading:false};
  },

  [CLEAR_CHANGE_PASSWORD_RESULT]:(state, action) => {
    let newState = Object.assign({}, state.admin);
    newState.changePasswordResult = null;
    return { admin: newState};
  },

 [LDAP_TEST_SUCCESS]:(state,action) => {
    var newState = Object.assign({}, state.ldap);
    for (var prop in newState) {  
      if(prop == 'testLDAPResult'){
        continue;
      }
      newState[prop].testVal = newState[prop].currentVal;
    }
    return {
      ldap: newState
    };
 },

 [LDAP_REVERT]:(state,action) => {
   var newState = Object.assign({}, state.ldap);
   for (var prop in newState) {
     if(prop == 'testLDAPResult'){
        continue;
      }
      newState[prop].currentVal = newState[prop].testVal;
    }
    return {
      ldap: newState
    };
 }

};

export default function accountsReducers(state = initialState, action) {
  let handler = handlers[action.type];
  if (!handler) return state;
  return {...state, ...handler(state, action)};
}
