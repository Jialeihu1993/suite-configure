import axios from 'axios';
import {APPLY_CONFIG,APPLY_REVERT,APPLY_STATUS,APPLY_EROOR,APPLY_SERVICE_CONFIRM,APPLY_REVERT_STATUS,APPLY_ENTRY,APPLY_RESET} from '../constants/ActionTypes';
import {CONFIG_APPLY_DEF_URL,CONFIG_APPLY_STATUS_DEF_URL,CONFIG_REVERT_URL,CONFIG_CONFIRM_APPLY_URL} from '../constants/ServiceConfig';


export function applyEntry(value) {
  return function (dispatch) {
      axios.post(CONFIG_APPLY_STATUS_DEF_URL,value)
          .then(function (response) {
            dispatch(applyConfigEntry(response.data));
          })
          .catch(function (error) {
            dispatch(applyError(error));
          });
    }
}

export function applyConfigEntry(value) {
  return {
    type: APPLY_ENTRY,
    value: value
  };
}

export function applyConfig(value) {
  return function (dispatch) {
      axios.post(CONFIG_APPLY_DEF_URL,value)
          .then(function (response) {
            dispatch(applyConfigService(response.data));
          })
          .catch(function (error) {
            dispatch(applyError(error));
          });
    }
}

export function applyConfigService(value) {
  return {
    type: APPLY_CONFIG,
    value: value
  };
}

export function getStatus() {
  return function (dispatch) {
      axios.get(CONFIG_APPLY_STATUS_DEF_URL)
          .then(function (response) {
            dispatch(applyStatus(response.data));
          }).catch(function (error) {
            dispatch(applyError(error));
          });
    }
}

export function applyStatus(value) {
  return {
    type: APPLY_STATUS,
    value: value
  };
}

export function getRevertStatus() {
  return function (dispatch) {
      axios.get(CONFIG_APPLY_STATUS_DEF_URL)
          .then(function (response) {
            dispatch(applyRevertStatus(response.data));
          }).catch(function (error) {
            dispatch(applyError(error));
          });
    }
}

export function applyRevertStatus(value) {
  return {
    type: APPLY_REVERT_STATUS,
    value: value
  };
}

export function revertConfig() {
  return function (dispatch) {
      axios.get(CONFIG_REVERT_URL)
          .then(function (response) {
              dispatch(revertService(response.data));
          }).catch(function (error) {
              dispatch(applyError(error));
          });
    }
}

export function revertService(value) {
  return {
    type: APPLY_REVERT,
    value: value
  };
}

export function confirmApply() {
  return function () {
      axios.get(CONFIG_CONFIRM_APPLY_URL)
          .then(function (response) {
            window.location.reload();
          }).catch(function (error) {
            window.location.reload();
          });
    }
}

export function confirmApplyService(value) {
  return {
    type: APPLY_SERVICE_CONFIRM,
    value: value
  };
}

export function applyError(value) {
  return {
    type: APPLY_EROOR,
    value: value
  };
}

export function resetApply() {
  return {
    type: APPLY_RESET
  }
}