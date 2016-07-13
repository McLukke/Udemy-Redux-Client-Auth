import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
} from './types';

export const signinUser = ({ email, password }) => {
  const ROOT_URL = 'http://localhost:3090';
  
  return function(dispatch) {
    // Submit email/password to server
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        // If request is good,
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - Save JWT token
        // response.data.token is set from the server
        localStorage.setItem('token', response.data.token);
        // - redirect to the route '/feature'
        browserHistory.push('/feature');
      })
      .catch(response => {
        // If request is bad,
        // - Show an error to the user
        dispatch(authError(response.data.error));
;      });
  }
}

export const authError = (error) => ({
  type: AUTH_ERROR,
  payload: error
});

export const signoutUser = () => {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
};

export const signupUser = ({ email, password }) => {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/feature');
      })
      .catch(response => dispatch(authError(response.data.error)));
  };
};

export const fetchMessage = () => {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        // console.log(response);
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  }
};
