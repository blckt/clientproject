import * as constants from '../constants';
import 'whatwg-fetch';
import { fetchUrl } from '../utils/fetchUrl';

export function login (form, redirect) {
  return dispatch => {
    fetch ('http://localhost:3000/auth/login', {
      method: 'POST',
      body: JSON.stringify (form)
    })
      .then (response => {
        return response.json ();
      })
      .catch (err => {
        let { message }=err;
        dispatch ({
          type: constants.SHOW_ERROR,
          payload: { message: message || err, code: 401 }
        });
      })
      .then (json => {
        if (json && json.token) {
          dispatch ({
            type: constants.LOGGED_IN,
            payload: { token: json.token }
          });
          dispatch ({
            type: constants.HIDE_ERROR
          });
        }
        if (json && json.error)
          dispatch ({
            type: constants.SHOW_ERROR,
            payload: { message: json.error.message, code: json.error.code }
          });
        if (redirect) redirect ('/');
      });
  };
}

export function pingAuth (state) {
  return dispatch=> {
    fetch ('http://localhost:3000/auth/ping', {
      headers: new Headers ({ 'Authorization': state.application.token })
    })
      .then (response => {
        if (response.status===500) {
          return dispatch({
            type:constants.LOG_OUT
          });
        }
        return response.json ();
      })
      .catch (err => {
        return dispatch({
          type:constants.LOG_OUT,
          error:err
        });
      })
      .then (response => {
        dispatch ({
          type: constants.PING_AUTH,
          payload: response.user
        });
      }).catch(()=>{
        dispatch({
          type:constants.LOG_OUT
        });
      });
  };
}
export function switchLocale (locale) {
  return { type: constants.LOCALE_SWITCHED, payload: locale };
}

export function hideError () {
  return { type: constants.HIDE_ERROR };
}
export function showError (error) {
  return {
    type: constants.SHOW_ERROR,
    payload: error
  };
}

export function fetchProfile(url) {
  return (dispatch)=>{
    fetchUrl(url,'GET').then(response=>{
      if (response.status!==200) {
        return dispatch({
          type:constants.SHOW_ERROR,
          payload:{
            message:'ERROR HAPPEND'
          }
        });
      }
      return response.json();
    })
    .then(profile=>{
      if (profile.student) {
        dispatch({
          type:constants.SET_STUDENT_PROFILE,
          payload:profile.student
        });
      }
    });
  };
}

export function registerUsers () {
  //REGISTER_USERS
}
