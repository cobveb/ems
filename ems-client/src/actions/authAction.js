import * as types from 'constants/actionTypes';
import AuthApi from 'api/authApi';
import {catchError, setTokens, getRefreshToken} from 'utils/apiUtils';

export function loadAccessTokensSuccess(tokens) {
    return {
        type: types.LOAD_ACCESS_TOKENS_SUCCESS,
    };
}

export function logoutSuccess() {
    return {
        type: types.AUTH_LOGOUT,
    };
}

export function loadUserDetailsSuccess(userDetails) {
    return {
        type: types.LOAD_USER_DETAILS,
        payload: {
            userDetails: userDetails,
        }
    };
}

export function loadAccessTokens(params){
    return function(dispatch) {
        return AuthApi.loadAccessTokens(params)
        .then(response => {
            setTokens(response.data);
            dispatch(loadAccessTokensSuccess(response.data));
        })
        .catch(error => {
            return catchError(error);
        });
    }
}

export function logout(){
    return function (dispatch){
        return AuthApi.deleteRefreshToken(getRefreshToken())
        .then(response => {
            dispatch(logoutSuccess());
        })
        .catch(error => {
            //return catchError(error);
        });
    }
}

export function loadUserDetails(){
    return function(dispatch) {
        return AuthApi.loadUserDetails()
        .then(response => {
            dispatch(loadUserDetailsSuccess(response.data));
        })
        .catch(error => {
            return catchError(error);
        });
    }
}