import {polyfill} from 'es6-promise';
import axios from 'axios';
import {UPDATE_LDAP_PROPERTY, INIT_LDAP_SUCCESS, INIT_LDAP_FAILURE, UPDATE_ADMIN_PROPERTY,UPDATE_ADMIN_PROPERTY_OLD,TEST_LDAP,CLEAR_TEST_LDAP,CHANGE_PASSOWRD_SUCCESS,CHANGE_PASSOWRD_FAILURE, CLEAR_CHANGE_PASSWORD_RESULT,LDAP_TEST_SUCCESS,LDAP_REVERT} from '../constants/ActionTypes';
import {CONFIG_LOAD_DATA_URL,CONFIG_LOAD_DATA,CONFIG_TEST_LDAP_URL,CONFIG_CHANGE_PASSWORD_URL,CONFIG_LOAD_LDAP_URL} from '../constants/ServiceConfig';

// fix axios can't work issue in IE(https://github.com/stefanpenner/es6-promise)
polyfill();

export function loadData(isLoaded) {
  return function (dispatch) {
    if (!isLoaded) {
      axios.get(CONFIG_LOAD_LDAP_URL)
          .then(function (response) {
            console.log(response);
            dispatch(initDataSuccess(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }
}

export function testLDAP(data) {
  return function (dispatch) {
    axios.post(CONFIG_TEST_LDAP_URL, data)
        .then(function (response) {
          console.log(response);
          dispatch(testLDAPAction(response.data));
        })
        .catch(function (error) {
          console.log(error);
          dispatch(testLDAPAction(error));
        });
  }
}

export function testLDAPAction(value) {
  return {
    type: TEST_LDAP,
    value: value
  };
}

export function clearTestLDAPAction(){
  return {
    type: CLEAR_TEST_LDAP,
    value: null
  }
}

export function changePassword(oldPassword, newPassword) {
  var data = {
    admin: {
      oldPassword: oldPassword,
      newPassword: newPassword
    }
  };
  console.log(CONFIG_CHANGE_PASSWORD_URL);
  return function (dispatch) {
    axios.post(CONFIG_CHANGE_PASSWORD_URL, data)
        .then(function (response) {
          console.log(response);
          dispatch(changePasswordSuccessAction(response.data));
        })
        .catch(function (error) {
          console.log(error);
          dispatch(changePasswordFailureAction(error));
        });
  }
}

export function changePasswordSuccessAction(value){
  return {
    type: CHANGE_PASSOWRD_SUCCESS,
    value: value
  }
}

export function changePasswordFailureAction(value){
  return {
    type: CHANGE_PASSOWRD_FAILURE,
    value: value
  }
}

export function clearChangePassResult(){
  return {
    type: CLEAR_CHANGE_PASSWORD_RESULT,
    value: null
  }
}

// todo: page, perpertyName and value can be encapusulated into one Obj
export function updateLDAPProperty(value) {
  return {
    type: UPDATE_LDAP_PROPERTY,
    value: value
  }
}

export function initDataSuccess(value) {
  return {
    type: INIT_LDAP_SUCCESS,
    value: value
  }
}

export function initDataFailure(value) {
  return {
    type: INIT_LDAP_FAILURE,
    error: value
  }
}

export function updateAdminProperty(value) {
  return {
    type: UPDATE_ADMIN_PROPERTY,
    value: value
  }
}

export function updateAdminPropertyOld(value) {
  return {
    type: UPDATE_ADMIN_PROPERTY_OLD,
    value: value
  }
}
export function ldapTestSuccess(){
  return{
    type: LDAP_TEST_SUCCESS
  }
}

export function ldapRevert(){
  return{
    type:LDAP_REVERT
  }
}


