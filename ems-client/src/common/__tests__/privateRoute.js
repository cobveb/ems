import React from 'react';
import { mount } from 'enzyme';
import{ MemoryRouter, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';
import PrivateRoute from 'common/privateRoute'
import Modules from 'components/modules/modules/modules';
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store';

describe("PrivateRoute component", () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares);

//    let store;

    it("renders Redirect when user NOT autheticated", () => {

        const store = mockStore({
            auth: {
                authenticated: false,
            }
        });


        const wrapper = mount(
            <MemoryRouter initialEntries={['/modules']}>
                <Provider store={store}>
                    <PrivateRoute path='/modules' component={Modules} />
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.find(PrivateRoute).length).toBe(1);
//        expect(wrapper.find(Redirect).props().to).toEqual("/");
        expect(wrapper.instance().history.location.pathname).toBe("/");

    });


    it("renders Modules when user autheticated", () => {
        const store = mockStore({
            auth: {
                authenticated: true,
                user: {
                    name: 'Test',
                    surname: 'test'
                }
            },
            ui: {
                header: {
                    name : 'Test',
                }
            },
            modules: {
                modules: []
            },
        });

        const wrapper = mount (
            <MemoryRouter initialEntries={['/modules']}>
                <Provider store={store}>
                    <PrivateRoute path='/modules' component={Modules} />
                </Provider>
            </MemoryRouter>
        );
        expect(wrapper.find(Modules).length).toBe(1);
        expect(wrapper.find(Modules).props(history).location.pathname).toEqual("/modules");
    });
});