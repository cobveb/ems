import mockAxios from 'axios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as auth from 'actions/authAction';
import * as types from 'constants/actionTypes';
import { mount, shallow } from 'enzyme';
import {catchError} from 'utils/apiUtils'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore()

afterEach(() => {
    mockAxios.post.mockReset();
    mockAxios.get.mockReset();
    mockAxios.delete.mockReset();
    store.clearActions();
});

describe('auth actions', () => {

    it('it should load tokens on signup', () => {
        const mockData = {
            "accessToken": "test",
            "refreshToken": "refreshToken",
            "tokenType": "Bearer"
        }
        const params = {user: 'user', passwd: 'user'}
        const fn = auth.loadAccessTokens(params);

        expect( typeof  fn).toBe( 'function' );

        mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({ data: mockData }),
        )

        const expectedActions = [{ type: types.LOAD_ACCESS_TOKENS_SUCCESS }]

        return store.dispatch(fn).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(mockAxios.post.mock.calls.length).toBe(1);
            expect(mockAxios.post).toBeCalledWith("/api/auth/login", params);
        })

    });

    it('it should catch error on loadAccessTokens', () => {

        const fn = auth.loadAccessTokens()

        const error = {
            response: {
                status: 401,
                data : {
                    statusText : "Error response statusText"
                }
            }
        };

        mockAxios.post.mockImplementation(() =>
            Promise.reject(error)
                .then(function() {
                }, function(error) {
                    throw error;
            })
        )

        return store.dispatch(fn)
            .then(() => {})
            .catch(error => {
                expect(error).toBe('Error response statusText')
            })
    })

    it('it should load user detail on login', () => {
        const accessToken = "Token";
        const fn = auth.loadUserDetails();
        const mockData = {
            "id": 1,
            "name": "User",
            "surname": "Name",
            "username": "user",
        }

        const expectedActions = [{ type: types.LOAD_USER_DETAILS,  payload: {userDetails: mockData} }]


        expect( typeof  fn).toBe( 'function' );

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({ data: mockData }),
        )

        return store.dispatch(fn).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(mockAxios.get.mock.calls.length).toBe(1);
            expect(mockAxios.get).toBeCalledWith("/api/user");
        })
    })

    it('it should catch error on load user detail', () => {
        const accessToken = "Token";
        const fn = auth.loadUserDetails(accessToken);

        const error = {
            response : {
                status: 401,
                data: {
                    message: 'Error response data message',
                }
           }
        };

        function showError(){
            catchError(error)
        }

        mockAxios.get.mockImplementation(() =>
            Promise.reject(error)
                .then(function() {
                }, function(error) {
                    throw error;
                })
        )

        return store.dispatch(fn)
            .then(() => {
            })
            .catch(error => {
                expect(showError).toThrowError('Error response data message')
            })
    })

    it('it should delete token on logout', () => {

        const fn = auth.logout();

        const expectedActions = [{ type: types.AUTH_LOGOUT, }]

        expect( typeof  fn).toBe( 'function' );

        mockAxios.delete.mockImplementationOnce(() =>
            Promise.resolve({}),
        )

        return store.dispatch(fn).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(mockAxios.delete.mock.calls.length).toBe(1);
            expect(mockAxios.delete).toBeCalledWith("/api/auth/token/delete/refreshToken");
        })
    })

    it('it should catch error on delete refresh token', () => {

        const fn = auth.logout();

        const error = {
            response : {
                status: 401,
                data: {
                    message: 'Error response data message',
                }
           }
        };

        function showError(){
            catchError(error)
        }

        mockAxios.delete.mockImplementation(() =>
            Promise.reject(error)
                .then(function() {
                }, function(error) {
                    throw error;
                })
        )

        return store.dispatch(fn)
            .then(() => {
            })
            .catch(error => {
                expect(showError).toThrowError('Error response data message')
            })
    })

});



