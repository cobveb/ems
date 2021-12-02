import * as types from 'constants/actionTypes'
import UiActionApi from 'api/action/uiActionApi';
import {catchError} from 'utils/apiUtils';

export function updateHeaderName (name){
	 return {
	    type: types.UPDATE_HEADER_NAME,
	    updateName: name
	 }
};

export function loading (isLoading){
	 return {
	    type: types.IS_LOADING,
	    loading: isLoading
	 }
};

export function setError (error){
	 return {
	    type: types.SET_ERROR,
	    error: error
	 }
};

export function setEuroExchangeRate(euroRate){
    return{
        type: types.SET_EURO_RATE,
        euroRate: euroRate
    }
}

export function getEuroExchangeRate(){
    return function(dispatch) {
        return UiActionApi.getEuroExchangeRate()
        .then(response => {
            dispatch(setEuroExchangeRate(response.data.data.value));
        })
        .catch(error => {
            return catchError(error);
        });
    }
}