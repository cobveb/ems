import React from 'react';
import { mount, shallow } from 'enzyme';
import thunk from 'redux-thunk'
import{ MemoryRouter, Redirect, Route } from "react-router-dom";
import Logout from 'components/logout/logout';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import * as types from 'constants/actionTypes';
import mockAxios from 'axios';


describe("Logout component", () => {

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore({
        auth: {
            tokens: {
                accessToken: "accessToken",
                refreshToken: "refreshToken",
            }
        },
    })

    afterEach(() => {
        mockAxios.delete.mockReset();
    });

    it("it should renders AppHeader component ", () => {
        const wrapper = shallow(<Logout />)
        expect(wrapper).toMatchSnapshot();
    })

    it("it should redirect on logout", () => {

        mockAxios.delete.mockImplementationOnce(() =>
            Promise.resolve({}),
        )

        const wrapper = mount(
            <MemoryRouter initialEntries={['/modules']}>
                <Provider store={store}>
                    <Route path="/modules"><Logout /></Route>
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.instance().history.location.pathname).toEqual("/");
    });

    it("should call logout action reducer during componentWillMount", () => {

        mockAxios.delete.mockImplementationOnce(() =>
            Promise.resolve({}),
        )

        const logoutAction = jest.fn()
        Logout.prototype.componentWillMount = logoutAction;

        const wrapper = mount(
            <MemoryRouter initialEntries={['/modules']}>
                <Provider store={store}>
                    <Route path="/logout"><Logout /></Route>
                </Provider>
            </MemoryRouter>
        );

        expect(logoutAction).toHaveBeenCalled()
    });
});
