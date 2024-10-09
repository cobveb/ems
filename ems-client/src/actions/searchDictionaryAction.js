import * as types from 'constants/actionTypes'

export function setDictionarySort(sort){
    return {
        type: types.DICTIONARY_TABLE_SET_SORT,
        sort: sort,
    }
};

export function setDictionaryPage(page){
    return {
        type: types.DICTIONARY_TABLE_SET_PAGE,
        page: page,
    }
};

export function setDictionaryName(name){
    return {
        type: types.DICTIONARY_SET_NAME,
        name: name,
    }
};

export function setDictionaryConditions(conditions){
    return {
        type: types.DICTIONARY_SET_SEARCH_CONDITIONS,
        conditions: conditions,
    }
}

export function resetDictionarySearchConditions(){
    return {
        type: types.DICTIONARY_RESET_SEARCH_CONDITIONS,
    }
}


