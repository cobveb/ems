import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import DrawerMenu from 'common/menu/drawerMenu';
import { Drawer, IconButton } from '@material-ui/core/';

describe("DrawerMenu component", () => {
    let shallow;
    let mount;

    beforeEach(() => {
        mount = createMount();
        shallow = createShallow();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    const menus = [];
    const props = {
        menus: menus,
    };

    it("it should renders DrawerMenu component ", () => {
        const wrapper = shallow(<DrawerMenu {...props}/>)
        expect(wrapper).toMatchSnapshot();
    });

    it("it should render Drawer menu open ", () => {
        const wrapper = mount(
            <MemoryRouter>
                <DrawerMenu {...props} />
            </MemoryRouter>
        )
        expect(wrapper.find(Drawer).props().open).toEqual(true);
    });

    it("it should toggle Drawer menu open ", () => {
        const wrapper = mount(
            <MemoryRouter>
                <DrawerMenu {...props} />
            </MemoryRouter>
        )
        expect(wrapper.find(Drawer).props().open).toEqual(true);
        wrapper.find(IconButton).simulate('click')
        expect(wrapper.find(Drawer).props().open).toEqual(false);
    });
});