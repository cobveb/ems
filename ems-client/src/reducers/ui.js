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
        case 'SET_EURO_RATE':
			return {
			    ...state,
			        euroRate: action.euroRate,
			}
		case 'SET_PAGEABLE_TABLE_PROPERTIES':
		    return{
		        ...state,
		            pageableTableProperties: action.pageableTableProperties,
		    }
        case 'SET_DICTIONARY_PAGEABLE_TABLE_PROPERTIES':
		    return{
		        ...state,
		            dictionaryPageableTableProperties: action.dictionaryPageableTableProperties,
		    }
	    default:
	      return state
	}
}