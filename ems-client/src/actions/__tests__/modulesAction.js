import mockAxios from 'axios'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as modules from 'actions/modulesAction';
import * as types from 'constants/actionTypes';
import { mount, shallow } from 'enzyme';
import { catchError } from 'utils/apiUtils';


const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore()

afterEach(() => {
    mockAxios.post.mockReset();
    mockAxios.get.mockReset();
});

describe('modules actions', () => {
    it('it should load all modules', () => {
        const accessToken = "Token";
        const fn = modules.loadModules(accessToken);
        expect( typeof  fn).toBe( 'function' );

        const mockData = {
            data: {
                "id": 1,
                "code": "administrator",
                "name": "Administrator"
            }
        }

        const expectedActions = [{ type: types.LOAD_MODULES_SUCCESS,  payload: {modules: mockData.data} }]

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({ data: mockData }),
        )

        return store.dispatch(fn).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
            expect(mockAxios.get.mock.calls.length).toBe(1);
            expect(mockAxios.get).toBeCalledWith("/api/modules");
        })
    });

    it('it should catch error',() =>{
        const accessToken = "Token";
        const fnDispatch = modules.loadModules(accessToken);

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

        return store.dispatch(fnDispatch)
            .then(() => {})
            .catch(error => {
                expect(showError).toThrowError('Error response data message')
            })
    });
});