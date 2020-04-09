import React from 'react';
import { mount, shallow } from 'enzyme';
import InstitutionContainer from 'containers/modules/administrator/institutionContainer';
import Institution from 'components/modules/administrator/institution';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import mockAxios from 'axios'
import AdministratorApi from 'api/modules/administrator/administratorApi';
import { catchError } from 'utils/apiUtils';
import InstitutionFormContainer from 'containers/modules/administrator/institutionFormContainer';


describe("InstitutionContainer component", () => {

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore({
        auth: {
            tokens: {
                accessToken: "Token",
            }
        },
        ui: {
            loading: false,
        }
    })

    afterEach(() => {
        mockAxios.get.mockReset();
        mockAxios.put.mockReset();
    });

    it("it should renders InstitutionContainer component ", () => {
        const wrapper = shallow(<InstitutionContainer />)
        expect(wrapper).toMatchSnapshot();
    })

    it("should contains Institution component", () => {
        mockAxios.get.mockImplementation(() =>
            Promise.resolve({
                data: {
                    data: {code: "uck"}
                }
            })
        )

        const wrapper = mount(
            <Provider store={store}>
                <InstitutionContainer />
            </Provider>
        )

        expect(wrapper.find(Institution).exists()).toEqual(true)
    })

    it("it should catch response api call getMainOu", () => {
        mockAxios.get.mockImplementation(() =>
            Promise.resolve({
                data: {
                    data: {code: "uck"}
                }
            })
        )


        const wrapper = mount(
            <Provider store={store}>
                <InstitutionContainer />
            </Provider>
        )

        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith("/api/ou/getMainOu");

    })

    it("it should catch error response api call getMainOu", () => {
        const error = "Error response data message1"

        mockAxios.get.mockImplementation(() =>
            Promise.reject(error)
            .then(function() {
            }, function(error) {
                throw new Error();
            })
        )
        const wrapper = mount(
            <Provider store={store}>
                <InstitutionContainer />
            </Provider>
        )

        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get.mock.results[0].value).rejects.toThrowError()

    })

    it("it should catch response api call saveOu", () => {
        mockAxios.get.mockImplementation(() =>
            Promise.resolve({
                data: {
                    data: {code: "uck"}
                }
            })
        )

        mockAxios.put.mockImplementation(() =>
            Promise.resolve({
                data: {
                    data: {code: "uck"}
                }
            })
        )

        const data = {
            code: "uck",
	        name: "uck",
	        shortName: "uck",
	        email: "uck@uck.pl"
        }

        const wrapper = mount(
            <Provider store={store}>
                <InstitutionContainer />
            </Provider>
        )

        const form = wrapper.find(InstitutionFormContainer)
        form.simulate('submit')

        expect(mockAxios.put).toHaveBeenCalledTimes(1);
        expect(mockAxios.put.mock.calls[0][0]).toEqual("/api/ou/saveOu");
    })

    it("it should catch error response api call saveOu", () => {
        mockAxios.get.mockImplementation(() =>
            Promise.resolve({
                data: {
                    data: {code: "uck"}
                }
            })
        )

        const error = "Error response data message1"

        mockAxios.put.mockImplementation(() =>
            Promise.reject(error)
            .then(function() {
            }, function(error) {
                throw new Error();
            })
        )

        const wrapper = mount(
            <Provider store={store}>
                <InstitutionContainer />
            </Provider>
        )

        const form = wrapper.find(InstitutionFormContainer)
        form.simulate('submit')
        expect(mockAxios.put).toHaveBeenCalledTimes(1);
        expect(mockAxios.put.mock.results[0].value).rejects.toThrowError()

    })

});