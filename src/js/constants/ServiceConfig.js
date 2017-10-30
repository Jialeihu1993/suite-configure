// CONFIG REST SERVICE
export const BASE_NAME = window.config_basename || '/';
export const CONFIG_LOAD_LDAP_URL = BASE_NAME + '/api/config/ldap';
export const CONFIG_APPLY_DEF_URL = BASE_NAME + '/api/config/apply';
export const CONFIG_APPLY_STATUS_DEF_URL = BASE_NAME + '/api/config/status';
export const CONFIG_TEST_LDAP_URL = BASE_NAME + '/api/config/testldap';
export const CONFIG_CHANGE_PASSWORD_URL = BASE_NAME + '/api/config/changepassword';
export const CONFIG_REVERT_URL = BASE_NAME + '/api/config/revert';
export const CONFIG_CONFIRM_APPLY_URL = BASE_NAME + '/api/config/confirmapply';
export const CONFIG_LOAD_EMAIL_URL  = BASE_NAME + '/api/config/email';
export const CONFIG_LOAD_LOGLEVEL_URL  = BASE_NAME + '/api/config/loglevel';
export const CONFIG_TEST_SMTP_URL = BASE_NAME + '/api/config/testsmtp';
export const CONFIG_GET_LOGLEVEL_PARAM_VALUE_URL = BASE_NAME + '/api/config/logparamvalue';
export const INIT_LOCALE = BASE_NAME + '/api/init/locale';
