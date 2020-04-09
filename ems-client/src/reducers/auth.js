import InitialState from './initialState';

export const auth = (state = InitialState.auth, action) => {
	switch (action.type) {
		case 'LOAD_ACCESS_TOKENS_SUCCESS':
			return {
			    ...state,
			        authenticated: true,
			};
		case 'LOAD_USER_DETAILS':
		    return {
		        ...state,
		            user: action.payload.userDetails,
		    };
	    default:
	        return state
	}
}