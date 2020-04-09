import * as types from 'constants/actionTypes';
import * as ui from 'actions/uiAction';

describe('ui actions', () => {
    it('should create an action to update header name', () => {
    const text = 'Title'
        const expectedAction = {
            type: types.UPDATE_HEADER_NAME,
            updateName: text
        }
        expect(ui.updateHeaderName(text)).toEqual(expectedAction)
    });

    it('should create an action to is loading', () => {
        const loading = false
            const expectedAction = {
                type: types.IS_LOADING,
                loading: loading
            }
        expect(ui.loading(loading)).toEqual(expectedAction)
    })

    it('should create an action to set error', () => {
        const error = "Test error"
            const expectedAction = {
                type: types.SET_ERROR,
                error: error
            }
        expect(ui.setError(error)).toEqual(expectedAction)
    })
})