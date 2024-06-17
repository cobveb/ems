import * as types from 'constants/actionTypes'

export function setSort(sort){
    return {
        type: types.SEARCH_SET_SORT,
        sort: sort,
    }
};

export function setPage(page){
    return {
        type: types.SEARCH_SET_PAGE,
        page: page,
    }
};

export function setConditions(conditions){
    return {
        type: types.SEARCH_SET_CONDITIONS,
        conditions: conditions,
    }
}

export function resetSearchConditions(){
    return {
        type: types.RESET_SEARCH_CONDITIONS,
    }
}


