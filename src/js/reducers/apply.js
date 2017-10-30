import {APPLY_CONFIG,APPLY_STATUS,APPLY_REVERT,APPLY_EROOR,APPLY_SERVICE_CONFIRM,APPLY_REVERT_STATUS,APPLY_ENTRY,APPLY_RESET} from '../constants/ActionTypes';
import {SUCCESS,CONFIRM,CONFIRMED,REVERT,ERROR,RESTART,APPLY,CANCEL,REVERTED,REVERT_ERROR,REVERT_CONFIRM,REVERT_SUCCESS,CODE_200,CODE_201,CODE_204} from '../constants/Constants';

const initialState = {
  
};

function convert(serviceList,complete,succeed) {

    var rtnVal = {services:[]};

    if(serviceList) {
      for(var i in serviceList) {
        var service = {},childStatusList = [];
        
        service.name = i;
        service.status = 'change-item-loading';
        service.itemList = [];
        for (var j in serviceList[i]) {
          if(j == 'succeed') {
            if(complete=='false' && succeed=='false') {
              service.status = serviceList[i]['succeed'] == 'true'?'change-item-ok':'change-item-loading';
            }else {
              service.status = serviceList[i]['succeed'] == 'true'?'change-item-ok':'change-item-warnning';
            }
            
            continue;
          }
          var childService = {};
          childService.name = j;
          var childStatus = serviceList[i][j];
          childStatusList.push(childStatus.phase);
          if(childStatus) {
            if(complete=='true' && succeed=='false') {
              if (childStatus.succeed =='true') {
                childService.status = 'change-item-ok';
              } else {
                childService.status = 'change-item-warnning';
              }
              service.status = serviceList[i]['succeed'] == 'true'?'change-item-ok':'change-item-warnning';
            } else if(complete=='false' && succeed=='false'){
              if (childStatus.succeed =='true') {
                childService.status = 'change-item-ok';
              }
              if(!childService.status || childService.status =='') {
                childService.status = 'change-item-loading';
              }

            } else if (complete=='true' && succeed=='true') {
              if(!childStatus.succeed || !childStatus.phase) {
                childService.status = 'change-item-loading';
              }
              if (childStatus.succeed =='true') {
                childService.status = 'change-item-ok';
              }
              service.status = serviceList[i]['succeed'] == 'true'?'change-item-ok':'change-item-warnning';
            }
          }
          service.itemList.push(childService);
        }
        
        rtnVal.services.push(service);
      }
    }
    return rtnVal;
}

const handlers = {
   [APPLY_ENTRY]: (state, action) => {
        var value = action.value;
        
        if(value.ready=='false') {
          return {
            serverStatus: RESTART,
            showModal: true
          }
        }else if(value.ready=='true') {
          return {
            serverStatus: APPLY,
            showModal: true
          }
        }
        
    },
    [APPLY_STATUS]: (state, action) => {
        var newState = Object.assign({}, state.config);
        var value = action.value;
        
        var rtnService = convert(value.service,value.complete,value.succeed);
        var configLists = rtnService.services;
        if (newState[value.propName])
          newState[value.propName].currentVal = value.value;

        if(action.value.complete=='false' && action.value.succeed=='false') {
            return {
                  configList: configLists,
                  serverStatus: CONFIRM,
                  showModal: true
            };
        } else if (action.value.complete=='true' && action.value.succeed=='false'){
          return {
            configList: configLists,
            serverStatus: REVERT,
            showModal: true
          };
        }else if (action.value.complete=='true' && action.value.succeed=='true'){
          return {
            configList: configLists,
            serverStatus: SUCCESS,
            showModal: true
          };
        } else {
            return {
                  configList: configLists,
                  serverStatus: CONFIRM,
                  showModal: true
            };
        }
    },
    [APPLY_CONFIG]: (state, action) => {
        var newState = Object.assign({}, state.config);
        var value = action.value;
        if (newState[value.propName])
          newState[value.propName].currentVal = value.value;

        if(value.code) {
            if(value.code == CODE_201) {
              return {
                message: value,
                serverStatus: CONFIRM,
                showModal: true
              };
            }else if(value.code == CODE_204) {
              return {
                message: value,
                serverStatus: RESTART,
                showModal: true
              };
            }
            
        } else {
            return {
              message: value,
              serverStatus: ERROR,
              showModal: true
            };
        }
    },
    [APPLY_REVERT]: (state, action) => {
        var value = action.value;
        
        if(value && value.code == CODE_201) {
            return {
                serverStatus: REVERTED,
                showModal: true
            };
        }else {
            return {
                serverStatus: ERROR,
                showModal: true
            };
        }
        
    },
    [APPLY_REVERT_STATUS]: (state, action) => {
        var newState = Object.assign({}, state.config);
        var value = action.value;
        var rtnService = convert(value.service,value.complete,value.succeed);
        var configLists = rtnService.services;
        if (newState[value.propName])
          newState[value.propName].currentVal = value.value;

        if(action.value.complete=='false' && action.value.succeed=='false') {
          return {
                configList: configLists,
                serverStatus: REVERT_CONFIRM,
                showModal: true
          };
            
        } else if (action.value.complete=='true' && action.value.succeed=='false'){
          return {
            configList: configLists,
            serverStatus: REVERT_ERROR,
            showModal: true
          };
        }else if (action.value.complete=='true' && action.value.succeed=='true'){
          return {
            configList: configLists,
            serverStatus: REVERT_SUCCESS,
            showModal: true
          };
        } else {
            return {
                configList: configLists,
                serverStatus: REVERT_CONFIRM,
                showModal: true
            };
        }
    },
    [APPLY_SERVICE_CONFIRM]: (state, action) => {
        var value = action.value;
        
        if(value.code== CODE_201) {
            return {
                serverStatus: CONFIRMED,
                showModal: true
            };
        }else {
            return {
                serverStatus: ERROR,
                showModal: true
            };
        }
        
    },
    [APPLY_EROOR]: (state, action) => {
        var value = action.value;
        var errorMessage = {id:'common.error',defaultMessage:'Internal Server Error!'}
        if(value.response){
           errorMessage.id = 'code.' + value.response.status;
           errorMessage.defaultMessage = value.response.statusText;
        }

        return {
              serverStatus: ERROR,
              errorMessage: errorMessage,
              showModal: true
        };
    },
    [APPLY_RESET]: (state, action) => {
        return {
              serverStatus: CANCEL,
              errorMessage: null,
              showModal: false
        };
    }
};

export default function applyReducers(state = initialState, action) {
  let handler = handlers[action.type];
  if (!handler) return state;
  return {...state, ...handler(state, action)
};
}