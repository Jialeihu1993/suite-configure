import axios from 'axios';
import {UPDATE_EMAIL_PROPERTY, INIT_EMAIL_SUCCESS, TEST_SMTP, CLEAR_TEST_SMTP, SMTP_TEST_SUCCESS, SMTP_REVERT} from '../constants/ActionTypes';
import {CONFIG_LOAD_EMAIL_URL,CONFIG_TEST_SMTP_URL} from '../constants/ServiceConfig';

export function updateProperty(value) {
  return {
    type: UPDATE_EMAIL_PROPERTY,
    value: value
  };
}

export function loadEmail() {
  return function (dispatch) {
      axios.get(CONFIG_LOAD_EMAIL_URL)
          .then(function (response) {
            dispatch(initDataSuccess(response.data));
          })
          .catch(function (error) {
             console.log(error);
          });
  }
}

export function initDataSuccess(value){
  return {
    type : INIT_EMAIL_SUCCESS,
    value : value
  }
}

export function testSMTPServer(data) {
  return function (dispatch) {
      axios.post(CONFIG_TEST_SMTP_URL,data)
          .then(function (response) {
            dispatch(testSMTPAction(response.data));
          })
          .catch(function (error) {
            dispatch(testSMTPAction(error));
          });
  }
}

export function testSMTPAction(value) {
  return {
    type: TEST_SMTP,
    value: value
  }
}

export function clearTestSMTPAction(){
  return {
    type: CLEAR_TEST_SMTP,
    value: null
  }
}

export function smtpTestSuccess(){
  return {
    type: SMTP_TEST_SUCCESS
  }
}

export function smtpRevert(){
  return {
    type: SMTP_REVERT
  }
}
