
import { UPDATE_LOG_PROPERTY, INIT_LOGLEVEL_SUCCESS } from '../constants/ActionTypes';
import Property from '../stores/Property';

const initialState = {
  isLoaded: false,
  sm_server_loglevel: {
    sqllimit: new Property(),
    debugdbquery: new Property(),
    //queryhashcode: new Property(),
    //dashboard_export_path: new Property(),
    // 'report.export': new Property(),
    cache_clean_interval: new Property(),
    webservices_sessiontimeout: new Property(),
    connectionTimeout: new Property(),
    smartemailTimeout: new Property(),
    sqldebug: new Property(),
    debughttp: new Property(),
    debugjavascript: new Property(),
    debugrest: new Property(),
    logdebuglevel: new Property(),
    debugjni: new Property(),
    log4jDebug: new Property(),
    enablecoredump: new Property(),
    rtm: new Property(),
    maxlogsize: new Property(),
    numberoflogfiles: new Property()
  },
  sm_webtier_loglevel: {
    'session-timeout': new Property(),
    viewrecordlist: new Property(),
    // 'customize-folder': new Property(),
    querysecurity: new Property(),
    jsDebug: new Property()
  },
  cmdb_ud_loglevel: {
    'discovery.framework': new Property(),
    'discovery.library': new Property(),
    'discovery.probe.agents': new Property(),
    'discovery.library.results.resultprocess': new Property(),
    'discovery.library.dal': new Property(),
    'discovery.probe.agents.probemgr.workflow': new Property()
  },
  cmdb_server_loglevel: {
    'ucmdb-api.properties.loglevel': new Property(),
    'mam.properties.loglevel': new Property(),
    'security.properties.loglevel': new Property(),
    'cmdb-framework.properties.loglevel': new Property(),
    'cmdb.properties.cla.loglevel': new Property(),
    'cmdb.properties.loglevel': new Property(),
    'logstash.statistics.properties.loglevel.history': new Property(),
    'cmdb.properties.notification.loglevel': new Property(),
    'reconciliation.properties.loglevel': new Property(),
    'cmdb.properties.tqlscheduler.loglevel': new Property(),
    'cmdb-framework.properties.urmLogLevel': new Property(),
    'cmdb_soaapi.properties.loglevel': new Property(),
    'security.properties.loglevel.cm': new Property(),
    'security.properties.loglevel.lwsso': new Property(),
    'ui-server.properties.loglevel': new Property(),
    'security.properties.loglevel.authorization': new Property(),
    'mam.web.properties.loglevel': new Property(),
    'cmdb.properties.search.loglevel': new Property(),
    'fcmdb.properties.loglevel': new Property(),
    'cmdb.properties.downgrade.loglevel': new Property(),
    'cmdb.properties.quota.loglevel': new Property(),
    'logstash.statistics.properties.loglevel.datain': new Property(),
    'fcmdb.gdba.properties.loglevel': new Property(),
    'fcmdb.push.properties.loglevel': new Property(),
    'mam.properties.loglevel.monitoring': new Property(),
    'multiple.cmdb.properties.loglevel': new Property(),
    'security.properties.loglevel.wink': new Property(),
    'ui-server.properties.spring': new Property(),
    'logstash.statistics.properties.loglevel.search': new Property(),
    'logstash.statistics.properties.loglevel.tql': new Property()
  },
  cmdb_browser_loglevel: {
    'ucmdb_browser.level': new Property(),
    'ucmdb_browser_search.level': new Property(),
    'jvm_stats.level': new Property(),
    'statistics.level': new Property(),
    'rpcCalls.level': new Property()
  },
  propel_loglevel: {
    propel_loglevel: new Property()
  },
  smarta_loglevel: {
    smarta_loglevel: new Property()
  },
  idm_loglevel: {
    idm_auth_debug: new Property(),
    idm_debug: new Property()
  }
};



const handlers = {
  [UPDATE_LOG_PROPERTY]: (state, action) => {
    var newState = Object.assign({}, state);
    var value = action.value;
    if (newState[value.propName])
      //  transfer  jsonStr  to json Object
      var valueJson;
    try {
      valueJson = JSON.parse('{' + value.value.replace(/\n/g, ',') + '}');
    } catch (err) {
      return state;
    }

    for (var key in valueJson) {
      //   invalid value can not write store
      try {
        if (newState[value.propName][key].currentVal == undefined && valueJson[key] == '') {

        } else if (newState[value.propName][key].currentVal != valueJson[key]) {
          newState[value.propName][key].currentVal = valueJson[key];
        }

      } catch (err) {

      }
    }
    return {
      ...newState
    }
  },

  [INIT_LOGLEVEL_SUCCESS]: (state, action) => {
    var newState = Object.assign({}, state);
    var value = action.value;
    for (var prop in newState) {
      for (var key in newState[prop]) {
        newState[prop][key] = newState[prop][key] || {};
        newState[prop][key].originalVal = value[prop][key];
        newState[prop][key].currentVal = value[prop][key];
      }
    }
    return {
      ...newState,
      isLoaded: true
    };
  }
};

export default function logLevelReducers(state = initialState, action) {
  let handler = handlers[action.type];
  if (!handler) return state;
  return {
    ...state, ...handler(state, action)
  };
}
