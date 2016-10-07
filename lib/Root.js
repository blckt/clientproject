/* global __DEVTOOLS__ */
import '../assets/stylesheets/index.css';
import React, { PropTypes } from 'react';
import {
    Router,
  browserHistory
} from 'react-router';

import { connect } from 'react-redux';
import {
  IntlProvider
} from 'react-intl';
import configureStore from './utils/configure-store';
import * as storage from './persistence/storage';
import * as components from './components';
import * as constants from './constants';
import * as i18n from './i18n';
import 'whatwg-fetch';
import { requireAuth } from './utils/requireAuth';
import { syncHistoryWithStore } from 'react-router-redux';

const {
  About,
  Account,
  AccountHome,
  Application,
  Home,
  Login,
  ControlPanel,
  UsersRegistration,
  XlsPage,
  UsersViewComponent,
} = components;

const initialState = {
  application: {
    token: storage.get('token'),
    locale: storage.get('locale') || 'en',
    user: { permissions: [/*'manage_account'*/] },
    pinged: false,
  }
};

export const store = configureStore(initialState);

const history = syncHistoryWithStore(browserHistory, store);

function getRootChildren(props) {
  const intlData = {
    locale: props.application.locale,
    messages: i18n[props.application.locale]
  };
  const rootChildren = [
    <IntlProvider key="intl" {...intlData}>
      {renderRoutes() }
    </IntlProvider>
  ];

  if (__DEVTOOLS__) {
    const DevTools = require('./components/DevTools').default;
    rootChildren.push(<DevTools key="devtools"/>);
  }
  return rootChildren;
}

const routes={
  path:'/',
  component:Application,
  childRoutes:[
    {
      indexRoute:{ component:Home },
      onEnter:requireAuth,
    },
    {
      path:'/profile',
      onEnter:(nextState,replace)=>replace('/account/profile'),
      onEnter:requireAuth,
    },
    {
      path:'dashboard',
      component:ControlPanel,
      onEnter:requireAuth,
      childRoutes:[
        {
          indexRoute:{
            component:UsersRegistration,
          },
          onEnter:requireAuth,
        },
        require('./routes/GroupPage'),
        {
          path:'register',
          component:UsersRegistration,
          onEnter:requireAuth,
        },
        {
          path:'tables',
          component:XlsPage,
          onEnter:requireAuth,
        },
        {
          path:'groups',
          component:UsersViewComponent,
          onEnter:requireAuth,
        },
        {
          path:'student/:userId',
          onEnter:requireAuth,
          getComponent:(nextState,cb)=>{
            require.ensure([],(require)=>{
              cb(null,require('./routes/Profile/ProfileInfo'));
            });
          }
        }
      ]
    },
    {
      path:'about',
      component:About,
      onEnter:requireAuth
    },
    {
      path:'/account',
      component:Account,
      onEnter:requireAuth,

      childRoutes:[
        {
          indexRoute:{ component:AccountHome },
        }
      ]
    },
    {
      path:'login',
      component:Login
    },
    {
      path:'logout',
      onEnter:logout
    }
  ]
};
function renderRoutes() {
  return (
    <Router history={history} routes={routes}/>
  );
}



function logout(nextState, replaceState) {
  store.dispatch({ type: constants.LOG_OUT });
  replaceState({ pathname:'/login' });
}

class Root extends React.Component {
  static propTypes = {
    application: PropTypes.object.isRequired
  };

  render() {

    return (
      <div className="container">{ getRootChildren(this.props) }</div>
    );
  }
}

export default connect(({ application }) => ({ application }))(Root);

/*
      <Route component={Application}>
        <Route path="/" component={Home} onEnter={requireAuth}/>
        <Redirect from="/account" to="/account/profile"/>
        <Route path="dashboard" component={ControlPanel}  onEnter={requireAuth}>
          <IndexRoute component={UsersRegistration}/>
          <Route path="register" component={UsersRegistration}/>
          <Route path="tables" component={XlsPage}/>
          <Route path="groups" component={UsersViewComponent}/>
          <Route path="group/:id" component={UsersViewComponent}/>
          <Route path="student/:userId" onEnter={requireAuth}  getComponent={(nextState,cb)=>{
            require.ensure([],(require)=>{
              cb(null,require('./routes/Profile/ProfileInfo'));
            });
          }}/>
        </Route>
        <Route path="about" component={About} onEnter={requireAuth}/>
        <Route path="account" component={Account} onEnter={requireAuth}>
          <Route path="profile" component={AccountHome}/>
          <Route path="secret-area" component={SuperSecretArea}/>
        </Route>
        <Route path="login" component={Login}/>
        <Route path="logout" onEnter={logout}/>
      </Route>
*/
