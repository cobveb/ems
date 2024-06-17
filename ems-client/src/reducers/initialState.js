import * as constants from 'constants/uiNames'

export default {
    auth: {
        authenticated: false,
        user:{},
    },
    ui: {
        loading: false,
        error:null,
        header: {
            name: constants.MODULES_TITLE
        },
        euroRate:null,
        pageableTableProperties:{
            totalElements:0,
            lastPage: false,
            firstPage: false,
        }
    },
    modules: {
        modules: [],
    },
    search:{
        searchConditions:{
            page: 0,
            rowsPerPage: 50,
            sort: {},
            conditions: [],
        },
    },
}