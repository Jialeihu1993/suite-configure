import React from 'react';
import { Route, IndexRoute, Router, Redirect, browserHistory} from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './stores/configureStore';
import Main from './Main';
import ChangePassword from './pages/accounts/ChangePassword';
import LDAP from './pages/accounts/LDAP';
import EmailServer from './pages/emailServer/EmailServer';
import SmartAnalyticsOperation from './pages/operation/SmartAnalyticsOperation';
import Log from './pages/debug/Log';
import {BASE_NAME} from 'constants/ServiceConfig';
/**
 * Routes: https://github.com/reactjs/react-router/blob/master/docs/API.md#route
 *
 * Routes are used to declare your view hierarchy.
 *
 * Say you go to http://material-ui.com/#/components/paper
 * The react router will search for a route named 'paper' and will recursively render its
 * handler and its parent handler like so: Paper > Components > Master
 */
let store = configureStore();

class Routes extends React.Component {
  render() {
    return (
        <div>
          <Provider store={store}>
            <Router history={browserHistory}>
              <Route path={BASE_NAME} component={Main}>
                <IndexRoute component={LDAP}/>
                <Route path='itsma'>
                  <Route path='ldap' component={LDAP}/>
                  <Route path='password' component={ChangePassword}/>
                  <Route path='email' component={EmailServer}/>
                </Route>
                <Route path='operation'>
                  <Route path='smarta' component={SmartAnalyticsOperation}/>
                </Route>
                <Route path='debug'>
                  <Route path='log' component={Log}/>
                </Route>
                <Redirect from='/' to={BASE_NAME} />
                <Route path='*' component={LDAP}/>

              </Route>
            </Router>
          </Provider>
        </div>
    )
  }
}

export default Routes;
