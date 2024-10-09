import InitialState from './initialState';

export const dictionarySearch = (state = InitialState.dictionarySearch.searchConditions, action) => {
	switch (action.type) {
		case 'SET_DICTIONARY_SORT':
			return {
			    ...state,
			        sort: action.sort,
			}
	    case 'SET_DICTIONARY_PAGE' :
	        return {
	            ...state,
	                page: action.page,
	            }
        case 'SET_DICTIONARY_NAME' :
	        return {
	            ...state,
	                dictionaryName: action.name,
	            }
        case 'SET_DICTIONARY_SEARCH_CONDITIONS':
			return {
			    ...state,
			        conditions: action.conditions,
			}
		case 'RESET_DICTIONARY_SEARCH_CONDITIONS':
            return {
                ...state,
                    page: 0,
                    rowsPerPage: 50,
                    sort: {},
                    dictionaryName: null,
                    conditions: [],
            }
	    default:
	      return state
	}
}