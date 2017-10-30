/**
 * Created by bu on 3/15/2017.
 */
import {RECEIVE_ERROR, RECEIVE_INFO, RECEIVE_WARNING, MESSAGE_SUCCESS, CLEAR_MESSAGE } from '../constants/ActionTypes';

const initialState = {
  status: null,
  msg: null
};

const handlers = {
  [RECEIVE_ERROR]: (state, action) => {
    return {
      status: 'danger',
      msg: action.msg
    };
  },
  [RECEIVE_INFO]: (state, action) => {
    return {
      status: 'info',
      msg: action.msg
    };
  },
  [RECEIVE_WARNING]: (state, action) => {
    return {
      status: 'warning',
      msg: action.msg
    };
  },
  [MESSAGE_SUCCESS]: (state, action) => {
    return {
      status: 'success',
      msg: action.msg
    };
  },
  [CLEAR_MESSAGE]: (state, action) => {
    return {
      msg: null
    };
  }

};

export default function messageReducer(state = initialState, action) {
  let handler = handlers[action.type];
  if (!handler) return state;
  return {...state, ...handler(state, action)
};
}

