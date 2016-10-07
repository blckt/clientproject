import * as constants from '../constants';
import createReducer from '../utils/create-reducer';

const initialState = {
  token: null,
  locale: 'en',
  user: {
    // TODO: have a checkbox to update the state
    // e.g.: on the login page and/or menu
    // permissions: ['manage_account']
    permissions: []
  },
  studentProfile:null,
  error: null,
  pinged: false
};

const actionHandlers = {
  [constants.LOGGED_IN]: (_, action) => action.payload,
  [constants.LOG_OUT]: () => ({ token: null,user:null }),
  [constants.LOCALE_SWITCHED]: (_, action) => ({ locale: action.payload }),
  [constants.LOGIN_ERROR]: (_, action) => ({ error: action.payload }),
  [constants.PING_AUTH]: (_, action) => Object.assign({},_,{ user:action.payload,pinged:true }),
  [constants.SET_STUDENT_PROFILE]:(_,action)=>Object.assign({},{ studentProfile:action.payload }),
  //ERRORS HANDLERS GOES DOWN
  [constants.SHOW_ERROR]: (state, action) => {
    const { payload, source } = action;
    return Object.assign ({}, state, {
      error: {
        source,
        message: payload.message,
        statusCode: payload.statusCode || payload.code,
        body: payload.body || (payload instanceof Error ?
                               (payload.toString () + '\n' + payload.stack) : payload)
      }
    });
  },
  [constants.HIDE_ERROR]: state => ({ ...state, ...{ error: null } }),
};

export default createReducer (initialState, actionHandlers);
