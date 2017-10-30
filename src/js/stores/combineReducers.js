// configure reducers for both productino and dev enviornment
import {combineReducers} from 'redux';
import accounts from '../reducers/accounts';
import message from '../reducers/message';
import navStyle from '../reducers/changeNav';
import apply from '../reducers/apply';
import email from '../reducers/email';
import logLevel from '../reducers/logLevel';

const Reducers = {
  accounts,
  message,
  apply,
  email,
  navStyle,
  logLevel
};

export default combineReducers(Reducers);
