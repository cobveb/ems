import { ui } from 'reducers/ui';
import * as types from 'constants/actionTypes';

describe('UI reducer', () => {
    it('should return the initial state', () => {
        expect(ui(undefined, {})).toEqual({
            loading: false,
            error: null,
            header: {
                name: 'Moduły',
            }
        })
    });

    it('should handle IS_LOADING', () => {
        expect(ui({
            loading: false,
        },{
            type: types.IS_LOADING,
            loading: true
        })).toEqual({
            loading: true,
        })
    });

    it('should handle UPDATE_HEADER_NAME', () => {
        const updateHeader = 'Test header';

        expect(ui({},{
            type: types.UPDATE_HEADER_NAME,
            updateName: updateHeader

        })).toEqual({
            header: {
                name: 'Test header',
            }
        })
    })
    it('should handle SET_ERROR', () => {
        const error = 'Test error';
        expect(ui({
            error: null,
        },{
            type: types.SET_ERROR,
            error: error
        })).toEqual({
            error: 'Test error',
        })
    });
});