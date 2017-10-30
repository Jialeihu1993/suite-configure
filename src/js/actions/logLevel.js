import axios from 'axios';
import {UPDATE_LOG_PROPERTY, INIT_LOGLEVEL_SUCCESS} from '../constants/ActionTypes';
import {CONFIG_LOAD_LOGLEVEL_URL, CONFIG_GET_LOGLEVEL_PARAM_VALUE_URL} from '../constants/ServiceConfig';

export function updateProperty(value) {
  return {
    type: UPDATE_LOG_PROPERTY,
    value: value
  };
}

export function loadLogLevel(isLoaded) {
  return function (dispatch) {
    if(!isLoaded){
      axios.get(CONFIG_LOAD_LOGLEVEL_URL)
          .then(function (response) {
            dispatch(initDataSuccess(response.data));
          })
          .catch(function (error) {
             console.log(error);
          });
    }
  }
}

export function initDataSuccess(value){
  return {
    type : INIT_LOGLEVEL_SUCCESS,
    value : value
  }
}

export function getLogLevelParamValue(param){
  return axios.post(CONFIG_GET_LOGLEVEL_PARAM_VALUE_URL,param)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
}
