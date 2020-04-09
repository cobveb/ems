import React, { Component } from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import PropTypes from 'prop-types';
import AppHeader from 'common/appHeader';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import{ MemoryRouter } from "react-router-dom";
import { Typography } from '@material-ui/core/';

describe("AppHeader component", () => {
    let shallow;
    let mount;

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)

    beforeEach(() => {
        shallow = createShallow();
        mount = createMount();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    it("it should renders AppHeader component ", () => {
        const wrapper = shallow(<AppHeader />)
        expect(wrapper).toMatchSnapshot();
    })

    it("is should show AppHeader title", () => {
        const store = mockStore({
            auth: {
                user: {
                    name: 'Test',
                    surname: 'test'
                }
            },
            ui: {
                header: {
                    name : 'Test',
                }
            }
        });

        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                    <AppHeader />
                </Provider>
            </MemoryRouter>
        );
        const title = wrapper.find(Typography).first()
        expect(title.text()).toBe('Test');
    })
});