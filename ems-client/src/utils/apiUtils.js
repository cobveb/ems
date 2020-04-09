import Axios from 'axios';
import AuthApi from 'api/authApi';
import {loading, setError} from 'actions/uiAction';

let isAlreadyFetchingAccessToken = false;
// This is the list of waiting requests that will retry after the JWT refresh complete
let subscribers = [];

// This is reference to application store
let store;


Axios.interceptors.response.use(
    function(response) {
        // If the request succeeds, we don't have to do anything and just return the response
        return response
    },
    function(error) {
        const errorResponse = error.response
        if (isTokenExpiredError(errorResponse)) {
            return resetTokenAndReattemptRequest(error)
        }
        // If the error is due to other reasons, we just throw it back to axios
        store.dispatch(setError(catchMessageError(error)))
        store.dispatch(loading(false))
        return Promise.reject(error)
    }
)

Axios.interceptors.request.use(
    function(config) {
        let originalRequest = config;

        // If the request api url is different that login then set accessToken
        if(originalRequest.url !== '/api/auth/login'){
           originalRequest.headers.Authorization = 'Bearer ' + getAccessToken();
           return  Promise.resolve(originalRequest);
        }

        return config
    },
    function(error) {
        // If the error is due to other reasons, we just throw it back to axios
        store.dispatch(setError(catchMessageError(error)))
        store.dispatch(loading(false))
        return Promise.reject(error)
    }
)

export function setStore(appStore){
    store = appStore;
}

export function setTokens(tokens){
    for (let k in tokens) {
        sessionStorage.setItem(k, tokens[k]);
    }
};

export function getRefreshToken(){
    return sessionStorage.getItem('refreshToken');
};

export function getAccessToken(){
    return sessionStorage.getItem('accessToken');
};

export function updateStorageTokens(tokens){
    for (let k in tokens) {
        sessionStorage.setItem(k, tokens[k]);
    }
};

export function removeToken(token){
    sessionStorage.removeItem(token);
};


// This function is used in redux dispatch action
export function catchError(error){
      if (error.response) {
          if(error.response.data.message){
              throw(error.response.data.message);
          } else {
              throw(error.response.data.statusText);
          }
      } else if (error.request) {
          throw(error.request.statusText);
      } else {
          throw(error.message);
      }
  };

// This function is used in containers components api call
export function catchMessageError(error){
    if (error.response) {
        if(error.response.data.message){
            return(error.response.data.message);
        } else {
            return(error.response.statusText);
        }
    } else if (error.request) {
        return(error.request.statusText);
    } else {
        return(error.message);
    }
};

function isTokenExpiredError(errorResponse) {
    // Logic to determine if the error is due to JWT token expired returns a boolean value

    let isTokenExpired = false;

    if(errorResponse.status === 401 && errorResponse.config.headers.Authorization){
        isTokenExpired = true;
    }
    return isTokenExpired
}

function updateTokens(refreshToken){

    const token = {
        refreshToken : refreshToken,
    }
    AuthApi.updateTokens(token)
    .then(response => {
        console.log("update token")
        updateStorageTokens(response.data);
        isAlreadyFetchingAccessToken = false;
        onAccessTokenFetched(getAccessToken());
    })
    .catch(error => {
        removeToken('refreshToken');
        store.dispatch(loading(false))
    });
}

function resetTokenAndReattemptRequest(error) {

    const { response: errorResponse } = error;
    const refreshToken = getRefreshToken(); // Get the refresh token to refresh the JWT token
    if (!refreshToken) {
        // If can't refresh, throw the error anyway
        store.dispatch(loading(false))
        return Promise.reject(error);
    }

    const retryOriginalRequest = new Promise(resolve => {
    /* We need to add the request retry to the queue
    since there another request that already attempt to
    refresh the token */
        addSubscriber(accessToken => {
            errorResponse.config.headers.Authorization = 'Bearer ' + accessToken;
            // Checking if access token expired in logout. If yes deleted refreshed token on logout.
            if(errorResponse.config.url === `/api/auth/token/delete/${refreshToken}`){
                errorResponse.config.url = `/api/auth/token/delete/${getRefreshToken()}`;
            }
            resolve(Axios(errorResponse.config));
        });
    });

    if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;
        updateTokens(refreshToken);
    }
    return retryOriginalRequest;
}

function onAccessTokenFetched(accessToken) {
	// When the refresh is successful, start retrying the requests one by one and empty the queue
    subscribers.forEach(callback => callback(accessToken));
    subscribers = [];
}

function addSubscriber(callback) {
    subscribers.push(callback);
}