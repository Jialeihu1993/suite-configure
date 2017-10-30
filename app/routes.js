var util = require('util');
var pug = require('pug');
var jwt = require('express-jwt');
var logger = require('./logger.js');
var config = require('./config.js');
var path = require('path');
var dataMapper = require('./datamapper.js');
var loglevelmapper = require('./loglevelmapper.js');

const JWT_COOKIE_NAME = '_IDM_X_AUTH_TOKEN_';
const mockData = {
  external: true,
  ip: 'openldap-svc.itsma.svc.cluster.local',
  port: '389',
  ssl: false,
  userName: 'cn=admin,dc=itsma,dc=com',
  password: 'secret',
  baseDN: 'dc=itsma,dc=com',
  uidName: 'f53550f9-31c6-4fd6-ba1f-a804f9538919',
  groupBaseFilter: '(objectclass=groupOfUniqueNames)',
  rootGroupFilter: '&((objectclass=groupOfUniqueNames)(cn=Group*))',
  defaultGroup: false,
  userFilter: '(&(uid=*)(objectclass=inetOrgPerson))',
  groupClass: 'groupOfUniqueNames',
  userClass: 'inetOrgPerson'
};

// genereate index.html dynamically accroding application name
var html;
var getHtml = function() {
  if (!html) {
    html = pug.renderFile(path.resolve(path.join(__dirname, '/../dist/index.pug')), {
      baseName: config.node_base == '/' ? '' : config.node_base
    });
  }

  return html;
};

module.exports = function (app) {
  var rest_protocol = config.rest_protocol;
  var rest_server = config.rest_server;
  var rest_port = config.rest_port;
  var enableIDM = config.enableIDM;
  var idm_token_signingkey = config.idm_token_signingkey;
  var ignore_expiration = config.ignore_expiration;
  var clock_tolerance = config.clock_tolerance;

  var httpProxy = require('http-proxy');
  var apiProxy = httpProxy.createProxyServer({
    proxyTimeout: config.proxy_timeout
  });

  apiProxy.on('proxyReq', function (proxyReq, req, res) {
    logger.debug(`[proxy] [${req.sessionID}] [request] ${req.method} ${req.originalUrl}`);
  });

  apiProxy.on('proxyRes', function (proxyRes, req, res) {
    logger.debug(`[proxy] [${req.sessionID}] [response] ${req.method} ${req.originalUrl} ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
  });

  apiProxy.on('error', function (e, req, res) {
    logger.error(`[proxy] [${req.sessionID}] [error] ${req.method} ${req.originalUrl}`, util.inspect(e));
    res.status(500).end();
  });

  /**
  // to fetch data from rest server=====================================================
  app.use('/api/config/ldap', function (req, res, next) {
    // simulate delay request to rest server for 5 second
    setTimeout(function () {
      if (req.headers['x-api-version']) {
        //apiProxy.web(req, res, { target: `${rest_protocol}://${rest_server}:${rest_port}`});
        res.json(mockData);
      } else {
        next();
      }
    }, 1000);
  });
  **/

  if (enableIDM) {
    app.use(jwt({
      secret: idm_token_signingkey,
      credentialsRequired: false,
      requestProperty: 'jwt',
      ignoreExpiration: ignore_expiration,
      clockTolerance: clock_tolerance,
      getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
      }
    }));
    app.all("/*", function (req, res, next) {
      if (!req.jwt || req.jwt.prn !== config.admin_user) {
        res.sendFile(path.join(__dirname, '/../dist/403.html'));
      } else {
        res.cookie('user', req.jwt.prn);
        next();
      }
    });
  }

  app.use('/api/config/ldap', function(req, res, next) {
    res.json(mockData);
   // dataMapper.fetchLDAPProperties(req,res);
  });

  app.use('/api/config/email', function(req, res, next) {
    dataMapper.fetchEmailServiceProperties(req,res);
  });

  app.use('/api/config/loglevel', function(req, res, next) {
    dataMapper.fetchLogLevelProperties(req,res);
  });

  //proxy route rule for SmartA
  app.use('/api/smarta/getcontent', function (req, res, next) {
    apiProxy.web(req, res, { target: 'http://smarta-idolfarm-config-svc:8080/itom-sma-smarta-configuration/api/classic/retrieveContentStatus/v1'});
  });

  app.use('/api/smarta/addcontent', function (req, res, next) {
    apiProxy.web(req, res, { target: 'http://smarta-installer-svc:8080/smartanalytics/scale'});
  });

  app.use('/api/smarta/getaddresult', function (req, res, next) {
    apiProxy.web(req, res, { target: 'http://smarta-installer-svc:8080/smartanalytics/status/scale'});
  });

  app.use('/api/smarta/distributecontent', function (req, res, next) {
    apiProxy.web(req, res, { target: 'http://smarta-idolfarm-config-svc:8080/itom-sma-smarta-configuration/api/redistribute'});
  });

//===================================================================================

app.use('/api/config/testldap', function(req, res, next) {
    dataMapper.testLDAP(req,res);
});

app.use('/api/config/testsmtp', function(req, res, next) {
    dataMapper.testSMTP(req,res);
});

app.use('/api/config/changepassword', function(req, res, next) {
    dataMapper.changePassword(req,res);
});

app.use('/api/config/apply', function(req, res, next) {
    dataMapper.applyConfigChanges(req,res);
});

app.use('/api/config/status', function(req, res, next) {
  // apiProxy.web(req, res, { target: 'http://16.155.194.11:8081/configuration/status'});
  dataMapper.getStatus(req,res);

});

app.use('/api/config/revert', function(req, res, next) {
    dataMapper.revert(req,res);
});

app.use('/api/config/confirmapply', function(req, res, next) {
    dataMapper.confirmApply(req,res);
});

app.use('/api/config/logparamvalue', function(req, res, next) {
    loglevelmapper.getLogLevelValue(req,res);
});

app.use('/api/init/locale', function(req, res, next) {

    let acceptlanguage = req.headers['accept-language'];
    let languages = acceptlanguage.split(',');
    if(languages && languages.length > 0) {
      let init = {
       'code': '201',
       'locale':languages[0].split(';')[0] 
     }
     res.json(init);
    }else{
      let init = {
       'code': '201',
       'locale':'en' 
      }
      res.json(init);
    }    
});

app.get('/*', function (req, res) {
    res.send(getHtml());
  });
};
