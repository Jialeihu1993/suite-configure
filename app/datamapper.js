const config = require('./config.js');
const axios = require('axios');
const querystring = require('querystring');
const _invert = require('lodash/invert');
const _keys = require('lodash/keys');
const _values = require('lodash/values');
const _pickBy = require('lodash/pickBy');
const _mapKeys = require('lodash/mapKeys');
const _get = require('lodash/get');
const _merge = require('lodash/merge');
var cipher = require('./cipher.js');

const apiEndPoint = `${config.rest_protocol}://${config.rest_server}:${config.rest_port}`;
axios.defaults.baseURL = apiEndPoint;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const keyMap = {
    ldap:{
        'ip': 'ldap_server_ip',
        'port': 'ldap_server_port',
        'ssl': 'ldap_use_ssl',
        'userName': 'ldap_test_username',
        'password': 'ldap_test_password',
        'baseDN': 'ldap_base_dn',
        'uidName': 'ldap_mapattr'
    },
    admin:{
        'admin' : 'admin_password'
    },
    email:{
        'host': 'email_smtp_server_name',
        'port': 'email_smtp_server_port',
        'username': 'email_smtp_server_usrname',
        'password': 'email_smtp_server_password',
        'from': 'email_smtp_server_mail_from',
        'ssl': 'email_smtp_server_ssl'
    },
    logLevel:{
    sm_server_loglevel: {
        'sqllimit': 'sm_server_loglevel_sqllimit',
        'debugdbquery': 'sm_server_loglevel_debug_db_query',
        'cache_clean_interval': 'sm_server_loglevel_cache_clean_interval',
        'webservices_sessiontimeout': 'sm_server_loglevel_webservices_session_timeout',
        'connectionTimeout': 'sm_server_loglevel_conection_timeout',
        'smartemailTimeout': 'sm_server_loglevel_smart_email_timeout',
        'sqldebug': 'sm_server_loglevel_sql_debug',
        'debughttp': 'sm_server_loglevel_debug_http',
        'debugjavascript': 'sm_server_loglevel_debug_javascript',
        'debugrest': 'sm_server_loglevel_debug_rest',
        'logdebuglevel': 'sm_server_loglevel_log_debug_level',
        'debugjni': 'sm_server_loglevel_debug_jni',
        'log4jDebug': 'sm_server_loglevel_log4j_debug',
        'enablecoredump': 'sm_server_loglevel_enable_core_dump',
        'rtm': 'sm_server_loglevel_rtm',
        'maxlogsize': 'sm_server_loglevel_max_log_size',
        'numberoflogfiles': 'sm_server_loglevel_number_of_log_files'
    },
    sm_webtier_loglevel: {
        'session-timeout': 'sm_webtier_loglevel_session_timeout',
        'viewrecordlist': 'sm_webtier_loglevel_view_record_list',
        'querysecurity': 'sm_webtier_loglevel_query_security',
        'jsDebug': 'sm_webtier_loglevel_js_debug'
    },
    cmdb_server_loglevel: {
        'ucmdb-api.properties.loglevel': 'cmdb_server_loglevel_api',
        'mam.properties.loglevel': 'cmdb_server_loglevel_mam',
        'security.properties.loglevel': 'cmdb_server_loglevel_security',
        'cmdb-framework.properties.loglevel': 'cmdb_server_loglevel_framework',
        'cmdb.properties.cla.loglevel': 'cmdb_server_loglevel_cla',
        'cmdb.properties.loglevel': 'cmdb_server_loglevel_cmdb',
        'logstash.statistics.properties.loglevel.history': 'cmdb_server_loglevel_logstash_statistics_history',
        'cmdb.properties.notification.loglevel': 'cmdb_server_loglevel_notification',
        'reconciliation.properties.loglevel': 'cmdb_server_loglevel_reconciliation',
        'cmdb.properties.tqlscheduler.loglevel': 'cmdb_server_loglevel_tqlscheduler',
        'cmdb-framework.properties.urmLogLevel': 'cmdb_server_loglevel_framework_urmloglevel',
        'cmdb_soaapi.properties.loglevel': 'cmdb_server_loglevel_soaapi',
        'security.properties.loglevel.cm': 'cmdb_server_loglevel_security_cm',
        'security.properties.loglevel.lwsso': 'cmdb_server_loglevel_security_lwsso',
        'ui-server.properties.loglevel': 'cmdb_server_loglevel_ui_server',
        'security.properties.loglevel.authorization': 'cmdb_server_loglevel_security_authorization',
        'mam.web.properties.loglevel': 'cmdb_server_loglevel_mam_web',
        'cmdb.properties.search.loglevel': 'cmdb_server_loglevel_search',
        'fcmdb.properties.loglevel': 'cmdb_server_loglevel_fcmdb',
        'cmdb.properties.downgrade.loglevel': 'cmdb_server_loglevel_downgrade',
        'cmdb.properties.quota.loglevel': 'cmdb_server_loglevel_quota',
        'logstash.statistics.properties.loglevel.datain': 'cmdb_server_loglevel_logstash_statistics_datain',
        'fcmdb.gdba.properties.loglevel': 'cmdb_server_loglevel_fcmdb_gdba',
        'fcmdb.push.properties.loglevel': 'cmdb_server_loglevel_fcmdb_push',
        'mam.properties.loglevel.monitoring': 'cmdb_server_loglevel_mam_monitoring',
        'multiple.cmdb.properties.loglevel': 'cmdb_server_loglevel_cmdb_multiple',
        'security.properties.loglevel.wink': 'cmdb_server_loglevel_security_wink',
        'ui-server.properties.spring': 'cmdb_server_loglevel_uiserver_spring',
        'logstash.statistics.properties.loglevel.search': 'cmdb_server_loglevel_logstash_statistics_search',
        'logstash.statistics.properties.loglevel.tql': 'cmdb_server_loglevel_logstash_statistics_search_tql'
    },
    cmdb_browser_loglevel: {
        'statistics.level':'cmdb_browser_loglevel_log4j_statistics',
        'ucmdb_browser_search.level':'cmdb_browser_loglevel_log4j_ucmdb_browser_search',
        'ucmdb_browser.level':'cmdb_browser_loglevel_log4j_ucmdb_browser',
        'rpcCalls.level':'cmdb_browser_loglevel_log4j_rpccalls',
        'jvm_stats.level':'cmdb_browser_loglevel_log4j_jvm_stats'
    },
    cmdb_ud_loglevel: {
        'discovery.framework': 'cmdb_ud_loglevel_discovery_framework',
        'discovery.library': 'cmdb_ud_loglevel_discovery_library',
        'discovery.probe.agents': 'cmdb_ud_loglevel_discovery_agents',
        'discovery.library.results.resultprocess': 'cmdb_ud_loglevel_discovery_resultprocess',
        'discovery.library.dal': 'cmdb_ud_loglevel_discovery_dal',
        'discovery.probe.agents.probemgr.workflow': 'cmdb_ud_loglevel_discovery_workflow'
    },
    propel_loglevel: {
        'propel_loglevel': 'propel_loglevel'
    },
    smarta_loglevel: {
        'smarta_loglevel': 'smarta_loglevel'
    },
    idm_loglevel: {
        'idm_auth_debug': 'idm_auth_debug',
        'idm_debug': 'idm_debug'
    }
    }
    
};

function flattenKeyMap() {
    let flat = {};
    _keys(keyMap).forEach((key) => {
       Object.assign(flat, keyMap[key]);
    });
    return flat;
}

function assemblyObject(object, keys, keyFn) {
  let assembledObj = {};
  keys.forEach((key)=>{
    let newKey = key;
    if(keyFn) {
      newKey = keyFn(key);
    }
    if(newKey =='ldap_test_password'|| newKey =='email_smtp_server_password') {
        assembledObj[newKey] = cipher.decipher('AES',object[key],config.passwd_token_key);
    }else {
        assembledObj[newKey] = _trim(object[key]);
    }
    }
  );
  return assembledObj;
}

//replace the key to be recognized by rest server
//from {"ip":"10.0.0.1"} to {"ldap_server_ip":"10.0.0.1"}
function replaceKeyFromMapping(object,mappings) {
    return assemblyObject(object,_keys(object),(key)=>{return mappings[key]});
}

function _fetchAllProperties(req, res) {
    var fetchRequest = { action: 'get', status: 'saved' };
    return post('/configuration/config',fetchRequest).then(function (fetchResult) {
        if(fetchResult.errorCode == 'csrf-400'){
            res.status(500).json(fetchResult);
        }else{
             return fetchResult.properties; 
        }
        }).catch((response)=>{
      console.error(`fetch all properties from ${config.rest_server}:${config.rest_port}/configuration/config failed`);
      throw response;
    });
}

function fetchLDAPProperties(req,res) {
    _fetchAllProperties(req,res).then((properties) => {
          var ldapProps = extractLDAPDataForFront(properties);
          res.json(ldapProps);
    }).catch((response) => {
      console.error(`fetch ldap properties failed`,response);
      responseError(res,response,'fetch ldap properties failed');
    });
}

function extractLDAPDataForFront(flatProperties) {
    return assemblyObject(flatProperties,_values(keyMap.ldap),(key)=>{return _invert(keyMap.ldap)[key].replace('','')})
}

function fetchEmailServiceProperties(req,res) {
    _fetchAllProperties(req,res).then((properties) => {
          var emailServiceProps = extractEmailServiceDataForFront(properties);
          res.json(emailServiceProps);
    }).catch((response) => {
      console.error(`fetch email service properties failed`,response);
      responseError(res,response,'fetch email service properties failed');
    });
}

function extractEmailServiceDataForFront(flatProperties) {
    return assemblyObject(flatProperties,_values(keyMap.email),(key)=>{return _invert(keyMap.email)[key].replace('','')})
}

function fetchLogLevelProperties(req,res) {
    _fetchAllProperties(req,res).then((properties) => {
          //var loglevelProperties = _pickBy(properties, (value,key) => {return key.indexOf('_loglevel') > -1 ? true:false ;})
          var loglevelProperties = {};
          loglevelProperties["sm_server_loglevel"] = assemblyObject(properties,_values(keyMap.logLevel.sm_server_loglevel),(key)=>{return _invert(keyMap.logLevel.sm_server_loglevel)[key].replace('','')});
          loglevelProperties["sm_webtier_loglevel"] = assemblyObject(properties,_values(keyMap.logLevel.sm_webtier_loglevel),(key)=>{return _invert(keyMap.logLevel.sm_webtier_loglevel)[key].replace('','')});
          loglevelProperties["cmdb_server_loglevel"] = assemblyObject(properties,_values(keyMap.logLevel.cmdb_server_loglevel),(key)=>{return _invert(keyMap.logLevel.cmdb_server_loglevel)[key].replace('','')});
          loglevelProperties["cmdb_browser_loglevel"] = assemblyObject(properties,_values(keyMap.logLevel.cmdb_browser_loglevel),(key)=>{return _invert(keyMap.logLevel.cmdb_browser_loglevel)[key].replace('','')});
          loglevelProperties["cmdb_ud_loglevel"] = assemblyObject(properties,_values(keyMap.logLevel.cmdb_ud_loglevel),(key)=>{return _invert(keyMap.logLevel.cmdb_ud_loglevel)[key].replace('','')});
          loglevelProperties["propel_loglevel"] = assemblyObject(properties,_values(keyMap.logLevel.propel_loglevel),(key)=>{return _invert(keyMap.logLevel.propel_loglevel)[key].replace('','')});
          loglevelProperties["smarta_loglevel"] = assemblyObject(properties,_values(keyMap.logLevel.smarta_loglevel),(key)=>{return _invert(keyMap.logLevel.smarta_loglevel)[key].replace('','')});
          loglevelProperties["idm_loglevel"] = assemblyObject(properties,_values(keyMap.logLevel.idm_loglevel),(key)=>{return _invert(keyMap.logLevel.idm_loglevel)[key].replace('','')});
          res.json(loglevelProperties);
    }).catch((response) => {
      console.error(`fetch log level properties failed`,response);
      responseError(res,response,'fetch log level properties failed');
    });
}

function testLDAP(req, res) {
    var ldapTestInfo = req.body;
    let tranformedData = {};
    _keys(ldapTestInfo).forEach((ldapProperty) => {
        let transformedPropName = keyMap.ldap[`${ldapProperty}`];
        if(transformedPropName){
            if(transformedPropName == 'ldap_test_password') {
                tranformedData['ldap_test_password'] = cipher.decipher('AES',ldapTestInfo[ldapProperty].currentVal,config.passwd_token_key);
            }else{
                tranformedData[transformedPropName] = _trim(ldapTestInfo[ldapProperty].currentVal);
            }
        }
    });
    post('/configuration/connLdap',tranformedData).then(function (testLDAPResult) {
        res.json(testLDAPResult);
    }).catch((response) => {
        console.error('test LDAP failed',response);
        responseError(res,response,'test LDAP failed');
    });
}

function testSMTP(req, res) {
    var smtpTestInfo = req.body;
    let tranformedData = {};
    _keys(smtpTestInfo).forEach((smtpProperty) => {
        let transformedPropName = keyMap.email[`${smtpProperty}`];
        if(transformedPropName){
            if(transformedPropName == 'email_smtp_server_password') {
                tranformedData['email_smtp_server_password'] = cipher.decipher('AES',smtpTestInfo[smtpProperty].currentVal,config.passwd_token_key);
            }else{
                tranformedData[transformedPropName] = _trim(smtpTestInfo[smtpProperty].currentVal);
            }
        }
    });
    if(tranformedData['email_smtp_server_ssl'] == 'true' || tranformedData['email_smtp_server_ssl'] == true){
        tranformedData['email_smtp_server_ssl'] = 'true';
        tranformedData['email_smtp_server_tls'] = 'true';
        tranformedData['email_smtp_server_ssl_port'] = tranformedData['email_smtp_server_port'];
    }else{
        tranformedData['email_smtp_server_ssl'] = 'false';
        tranformedData['email_smtp_server_tls'] = 'false';
    }
    
    post('/configuration/connSMTPServer',tranformedData).then(function (testSMTPResult) {
        res.json(testSMTPResult);
    }).catch((response) => {
        console.error('test SMTP failed',response);
        responseError(res,response,'test SMTP failed');
    });
}

function changePassword(req, res) {
    var newPassword = req.body;
    var passObj = newPassword.admin;
    //var pass = replaceKeyFromMapping(newPassword,keyMap.admin);
    let reqJosnData = {
        idm : {
            original_password : cipher.decipher('AES',passObj.oldPassword,config.passwd_token_key),
            password : cipher.decipher('AES',passObj.newPassword,config.passwd_token_key)
        },
        sm : {
            Operator : {
                Name : "sysadmin",
                Password : cipher.decipher('AES',passObj.newPassword,config.passwd_token_key)
            }
        }
    }; 
    post('/configuration/password',reqJosnData).then(function (changePasswordResult) {
        res.json(changePasswordResult);
    }).catch((response) => {
        console.error('change password failed',response);
        responseError(res,response,'change password failed');
    });
}

function applyConfigChanges(req, res) {
    let changedItems = req.body;
    let applyingChangeRequest = {};
    _mapKeys(changedItems,function(value,key){
        if(key == "logLevel"){
            let tmpMap = {}; 
            Object.assign(tmpMap,keyMap.logLevel.sm_server_loglevel,keyMap.logLevel.sm_webtier_loglevel,
            keyMap.logLevel.cmdb_server_loglevel,keyMap.logLevel.cmdb_browser_loglevel,keyMap.logLevel.cmdb_ud_loglevel,
            keyMap.logLevel.propel_loglevel,keyMap.logLevel.smarta_loglevel,keyMap.logLevel.idm_loglevel);
            Object.assign(applyingChangeRequest,replaceKeyFromMapping(value,tmpMap));
        }else{
            Object.assign(applyingChangeRequest,replaceKeyFromMapping(value,keyMap[key]));
        }
    });
    applyingChangeRequest.action = 'apply';

    post('/configuration/config',applyingChangeRequest).then(function (applyingChangeResult) {
        res.json(applyingChangeResult);
    }).catch((response) => {
        console.error('apply change failed',response);
        responseError(res,response,'apply change failed');
    });
}

function responseError(frontResponse, apiResponse, message='common error') {
  let result = { message };
  switch(apiResponse.status) {
    case 404 : result.cause = `api server ${apiEndPoint} is not available`;break;
    default  : result.cause = `api server ${apiEndPoint} handle request error`;
  }
  frontResponse.status(apiResponse.status).json(result);
}

function revert(req, res){
    var revertAction = {action: 'rollback'};
    post('/configuration/config',revertAction).then(function (revertResult) {
        res.json(revertResult);
    }).catch((response) => {
        console.error('revert changes failed',response);
        responseError(res,response,'revert changes failed');
    });
}

function confirmApply(req, res){
    let confirmAction = {action: 'confirm'};
    post('/configuration/config',confirmAction).then(function (confirmResult) {
        res.json(confirmResult);
    }).catch((response) => {
        console.error('apply confirmation failed',response);
        responseError(res,response,'apply confirmation failed');
    });
}

function getStatus(req, res){
    get('/configuration/status').then(function (getStatusResult) {
        res.json(getStatusResult);
    }).catch((response) => {
        console.error('get status failed',response);
        responseError(res,response,'get status failed');
    });
}

function post(path,body) {
    return axios.post(path,body).then((response) => {return response.data;}).catch((error) => {
      throw error.response;
    });
}

function get(path) {
    return axios.get(path).then((response) => {return response.data;}).catch((error) => {
      throw error.response;
    });
}

function _trim(value){
    if(typeof value === "string"){
        return value.trim();
    }else{
        return value;
    }
}

module.exports = {
  applyConfigChanges,
  getStatus,
  testLDAP,
  testSMTP,
  changePassword,
  revert,
  confirmApply,
  fetchLDAPProperties,
  fetchEmailServiceProperties,
  fetchLogLevelProperties
};
