import InitialState from './initialState';

export const ui = (state = InitialState.ui, action) => {
	switch (action.type) {
		case 'IS_LOADING':
			return {
			    ...state,
			        loading: action.loading,
			}
	    case 'UPDATE_HEADER_NAME' :
	        return {
	            ...state,
	                header: {
                        name: action.updateName,
	                }
	            }
        case 'SET_ERROR':
			return {
			    ...state,
			        error: action.error,
			}
	    default:
	      return state
	}
}