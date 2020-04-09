import * as types from 'constants/actionTypes'

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