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
    },
    modules: {
        modules: [],
    },
}