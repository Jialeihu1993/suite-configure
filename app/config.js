// init variables from properties
var fs = require('fs');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('itsma-config-ui.properties.default');
if (fs.existsSync('itsma-config-ui.properties')) {
  properties.append('itsma-config-ui.properties');
}

module.exports = {
  // node server
  node_protocol: properties.get('node.protocol'),
  node_server: properties.get('node.server'),
  node_port: properties.get('node.port'),
  node_https_port: properties.get('node.https_port'),
  node_base: properties.get('node.base') || '/',
  // debug
  isDebug: properties.get('node.is_debug'),
  // session
  session_max_age: properties.get('node.session_max_age'),
  session_secret: properties.get('node.session_secret'),
  // token
  jwt_max_age: properties.get('node.jwt_max_age'),
  idm_token_signingkey: properties.get('node.idm_token_signingkey'),
  passwd_token_key: properties.get('node.passwd_token_key'),
  ignore_expiration: properties.get('node.ignore_expiration'),
  clock_tolerance: properties.get('node.clock_tolerance'),
  enableIDM: properties.get('node.enable_idm'),
  // rest server
  rest_protocol: properties.get('rest.protocol'),
  rest_server: properties.get('rest.server'),
  rest_port: properties.get('rest.port'),
  // # 2 minutes
  proxy_timeout: properties.get('rest.proxy_timeout'),
  // admin user
  admin_user: properties.get('user.admin_user'),
  // log
  logging_level: properties.get('logging.level')
};
