import {RECEIVE_ERROR, RECEIVE_WARNING, RECEIVE_INFO, RECEIVE_SUCCESS, CLEAR_MESSAGE} from '../constants/ActionTypes';

export function showWarning(msg) {
  return {
    type: RECEIVE_WARNING,
    msg: msg
  };
}

export function showError(msg) {
  return {
    type: RECEIVE_ERROR,
    msg: msg
  };
}

export function showInfo(msg) {
  return {
    type: RECEIVE_INFO,
    msg: msg
  };
}

export function showSuccess(msg) {
  return {
    type: RECEIVE_SUCCESS,
    msg: msg
  };
}

export function clearMessage() {
  return {
    type: CLEAR_MESSAGE
  };
}

