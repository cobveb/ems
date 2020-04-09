import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import LoginScreen from 'components/login/loginScreen';
import LoginForm from 'components/login/loginForm';
import renderer from 'react-test-renderer';
import { AppBar, Typography } from '@material-ui/core/';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import{ MemoryRouter } from "react-router-dom";

describe("LoginScreen component", () => {
    let shallow;
    let mount;

    beforeEach(() => {
        mount = createMount();
        shallow = createShallow();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    beforeEach(() => {
        shallow = createShallow();
    });

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore({
        auth: {
            authenticated: false,
            tokens:{},
        },
        ui: {
            loading: false,
        },
    });

    it("it should renders LoginScreen component ", () => {
        const wrapper = shallow(<LoginScreen />)
        expect(wrapper).toMatchSnapshot();
    })

    it("it should contain AppBar component ", () => {
        const wrapper = mount(
            <MemoryRouter>
            <Provider store={store}>
                <LoginScreen />
            </Provider>
            </MemoryRouter>
        )
        expect(wrapper.find('AppBar').exists()).toEqual(true);
        expect(wrapper.find(Typography).text()).toEqual('Logowanie');
    })

    it("it should contain LoginForm component ", () => {
        const wrapper = mount(
            <MemoryRouter>
            <Provider store={store}>
                <LoginScreen />
            </Provider>
            </MemoryRouter>
        )
        expect(wrapper.find('LoginForm').exists()).toEqual(true);
    })
});