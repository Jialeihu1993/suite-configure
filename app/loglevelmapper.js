const _get = require('lodash/get');
const _keys = require('lodash/keys');

const paramMap = {
"sqllimit":[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"},{label:"5",value:"5"},{label:"10",value:"10"},{label:"20",value:"20"},{label:"30",value:"30"},{label:"60",value:"60"}],
"debugdbquery":[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"},{label:"5",value:"5"},{label:"10",value:"10"},{label:"20",value:"20"},{label:"999",value:"999"}],
"cache_clean_interval":[{label:"1800",value:"1800"},{label:"2700",value:"2700"},{label:"3600",value:"3600"}],
"webservices_sessiontimeout":[{label:"15",value:"15"},{label:"30",value:"30"},{label:"60",value:"60"},{label:"120",value:"120"},{label:"300",value:"300"},{label:"600",value:"600"},{label:"900",value:"900"},{label:"1800",value:"1800"},{label:"3600",value:"3600"}],
"connectionTimeout":[{label:"45000",value:"45000"},{label:"60000",value:"60000"},{label:"90000",value:"90000"},{label:"180000",value:"180000"}],
"smartemailTimeout":[{label:"30000",value:"30000"},{label:"45000",value:"45000"},{label:"60000",value:"60000"},{label:"90000",value:"90000"},{label:"180000",value:"180000"}],
"sqldebug":[{label:"0",value:"0"},{label:"1",value:"1"}],
"debughttp":[{label:"0",value:"0"},{label:"1",value:"1"}],
"debugjavascript":[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"}],
"debugrest":[{label:"0",value:"0"},{label:"1",value:"1"}],
"logdebuglevel":[{label:"0",value:"0"},{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"}],
"debugjni":[{label:"0",value:"0"},{label:"1",value:"1"}],
"log4jDebug":[{label:"com.hp.ov.sm.common.oom.LowMemoryHandler",value:"com.hp.ov.sm.common.oom.LowMemoryHandler"}],
"enablecoredump":[{label:"0",value:"0"},{label:"1",value:"1"}],
"rtm":[{label:"0",value:"0"},{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"},{label:"5",value:"5"}],
"maxlogsize":[{label:"5",value:"5"},{label:"10",value:"10"},{label:"20",value:"20"},{label:"40",value:"40"},{label:"60",value:"60"},{label:"80",value:"80"},{label:"100",value:"100"}],
"numberoflogfiles":[{label:"1",value:"1"},{label:"5",value:"5"},{label:"10",value:"10"},{label:"20",value:"20"},{label:"40",value:"40"},{label:"60",value:"60"},{label:"80",value:"80"},{label:"100",value:"100"}],
"session-timeout":[{label:"",value:""}],
"viewrecordlist":[{label:"true",value:"true"},{label:"false",value:"false"}],
"querysecurity":[{label:"true",value:"true"},{label:"false",value:"false"}],
"jsDebug":[{label:"true",value:"true"},{label:"false",value:"false"}],
"ucmdb-api.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"mam.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"security.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"cmdb-framework.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"cmdb.properties.cla.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"cmdb.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"logstash.statistics.properties.loglevel.history":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"cmdb.properties.notification.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"reconciliation.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"cmdb.properties.tqlscheduler.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"cmdb-framework.properties.urmLogLevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"cmdb_soaapi.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"security.properties.loglevel.cm":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"security.properties.loglevel.lwsso":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"ui-server.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"security.properties.loglevel.authorization":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"mam.web.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"cmdb.properties.search.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"fcmdb.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"cmdb.properties.downgrade.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"cmdb.properties.quota.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"logstash.statistics.properties.loglevel.datain":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"fcmdb.gdba.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"fcmdb.push.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"mam.properties.loglevel.monitoring":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"multiple.cmdb.properties.loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"security.properties.loglevel.wink":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"ui-server.properties.spring":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"logstash.statistics.properties.loglevel.search":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"logstash.statistics.properties.loglevel.tql":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"ucmdb_browser.level":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"ucmdb_browser_search.level":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"jvm_stats.level":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"statistics.level":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"rpcCalls.level":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"discovery.framework":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"discovery.library":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"discovery.probe.agents":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"discovery.library.results.resultprocess":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"discovery.library.dal":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"discovery.probe.agents.probemgr.workflow":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"},{label:"FATAL",value:"FATAL"},{label:"OFF",value:"OFF"}],
"propel_loglevel":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"}],
"smarta_loglevel":[{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"}],
"idm_auth_debug":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"}],
"idm_debug":[{label:"TRACE",value:"TRACE"},{label:"DEBUG",value:"DEBUG"},{label:"INFO",value:"INFO"},{label:"WARN",value:"WARN"},{label:"ERROR",value:"ERROR"}]
};

function getLogLevelValue(req, res){
    let paramName;
    try{
        let param = req.body;
        paramName = _keys(param)[0];
        let value = _get(paramMap,paramName);
        res.json(value);
    }catch(error){
        console.error(`get log level parameter value error for ${paramName}`);
        res.status(500).json({message:`fetch value for ${paramName} reqeust error`});
    }
}

module.exports = {
getLogLevelValue
}