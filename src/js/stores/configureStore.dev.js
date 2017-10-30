import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import combineReducers from './combineReducers';
import accounts from '../reducers/accounts';
import message from '../reducers/message';
import apply from '../reducers/apply';
import navStyle from '../reducers/changeNav';
import email from '../reducers/email';
import logLevel from '../reducers/logLevel';


const loggerMiddleware = createLogger();

export default function configureStore(initialState) {
  let store;
  if (window.devToolsExtension) { //Enable Redux devtools if the extension is installed in developer's browser
    store = createStore(

      combineReducers,
      initialState,
      compose(
        applyMiddleware(thunkMiddleware),
        window.devToolsExtension()
      )
    );
  } else {
    store = createStore(
      combineReducers,
      initialState,
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      )
    );
  }

  if (module.hot) {
    module.hot.accept('../reducers/accounts', () => {
      const nextReducer = require('../reducers/accounts');
      store.replaceReducer(nextReducer);
    });
    module.hot.accept('../reducers/apply', () => {
      const nextReducer = require('../reducers/apply');
      store.replaceReducer(nextReducer);
    });
    module.hot.accept('../reducers/email', () => {
      const nextReducer = require('../reducers/email');
      store.replaceReducer(nextReducer);
    });
    module.hot.accept('../reducers/logLevel', () => {
      const nextReducer = require('../reducers/logLevel');
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
