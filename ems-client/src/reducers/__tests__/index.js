import * as types from 'constants/actionTypes';
import * as constants from 'constants/uiNames'
import rootReducer from 'reducers/';

describe('rootReducer ', () => {
    it('should return the initial state on logout', () => {
        expect(rootReducer(undefined, {
            type: types.AUTH_LOGOUT,
        })).toEqual({
            auth: {
                authenticated: false,
                user: {}
            },
            form: {},
            modules: {
                modules: []
            },
            ui: {
                loading: false,
                error: null,
                header: {
                    name: constants.MODULES_TITLE
                },
            }
        })
    })

    it('should return the state after action execution', () => {

        expect(rootReducer({}, {
            type: types.LOAD_ACCESS_TOKENS_SUCCESS,
        })).toEqual({
            auth: {
                authenticated: true,
                user: {}
            },
            form: {},
            modules: {
                modules: []
            },
            ui: {
                loading: false,
                error: null,
                header: {
                    name: constants.MODULES_TITLE
                },
            }
        })
    })

});