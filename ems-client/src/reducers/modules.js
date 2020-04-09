import InitialState from './initialState';

export const modules = (state = InitialState.modules, action) => {
 	switch (action.type) {
 		case 'LOAD_MODULES_SUCCESS':
 			return {
 			    ...state,
 			        modules: action.payload.modules
 			};
 	    default:
 	        return state
 	}
 }