import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import AppHeaderMenu from 'common/menu/appHeaderMenu';
import AppHeaderMenuItem from 'common/menu/appHeaderMenuItem';
import { Button, Grow, Popper, MenuItem } from '@material-ui/core/';
import { MemoryRouter as Router } from 'react-router-dom';
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

describe("AppHeaderMenu component", () => {

    let shallow;
    let mount;

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore({
        auth: {
            user: {
                name: 'Test',
                surname: 'test'
            }
        },
    });

    beforeEach(() => {
        mount = createMount();
        shallow = createShallow();
    });

    afterEach(() => {
        mount.cleanUp();
    });


    it("it should renders AppHeaderMenu component ", () => {
        const wrapper = shallow(<AppHeaderMenu />)
        expect(wrapper).toMatchSnapshot();
    })

    it('it should open AppHeaderMenu ', () => {
        const wrapper = mount(
            <Router>
                <Provider store={store}>
                    <AppHeaderMenu />
                </Provider>
            </Router>
        )
        const button = wrapper.find(Button)

        expect(wrapper.find(AppHeaderMenuItem).length).toEqual(0);

        button.simulate('click');

        expect(wrapper.find(AppHeaderMenuItem).length).toBeGreaterThanOrEqual(1);
    })

    it('it should render Grow in right placement', () => {
        const wrapper = mount(
            <Router>
                <Provider store={store}>
                    <AppHeaderMenu />
                </Provider>
            </Router>
        )
        const button = wrapper.find(Button)
        const children = jest.fn()

        button.simulate('click');

        expect(wrapper.find(Grow).prop('style').transformOrigin).toEqual('center top')

        wrapper.setProps({
            children: wrapper.find(Popper).props().children(<Popper open={true} children={children}/>, { placement : "top" })
        });

        expect(wrapper.find(Grow).prop('style').transformOrigin).toEqual('center bottom')

    })

    it('it should close AppHeaderMenu on click menuItem', () => {

        const wrapper = mount(
            <Router>
                <Provider store={store}>
                    <AppHeaderMenu />
                </Provider>
            </Router>
        );
        const button = wrapper.find(Button)
        button.simulate('click');
        const menu = wrapper.find(MenuItem).at(0);

        menu.simulate('click')

        expect(wrapper.find(Popper).prop('open')).toEqual(false);
    })
})