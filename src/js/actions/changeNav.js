import {NAV_MODE_CHANGE,NAV_CURRENT} from '../constants/ActionTypes';

export function changeNavMode(value) {
  return {
    type: NAV_MODE_CHANGE,
    value: value
  };
}

export function changeCurrentNav(value) {
  return {
    type: NAV_CURRENT,
    value: value
  };
}


