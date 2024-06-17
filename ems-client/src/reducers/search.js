import InitialState from './initialState';

export const search = (state = InitialState.search.searchConditions, action) => {
	switch (action.type) {
		case 'SET_SORT':
			return {
			    ...state,
			        sort: action.sort,
			}
	    case 'SET_PAGE' :
	        return {
	            ...state,
	                page: action.page,
	            }
        case 'SET_CONDITIONS':
			return {
			    ...state,
			        conditions: action.conditions,
			}
		case 'RESET_SEARCH_CONDITIONS':
            return {
                ...state,
                    page: 0,
                    rowsPerPage: 50,
                    sort: {},
                    conditions: [],
            }
	    default:
	      return state
	}
}