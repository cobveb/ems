import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import Administrator from 'components/modules/administrator/administrator';
import DrawerMenu from 'common/menu/drawerMenu';

describe("Administrator component", () => {
    let shallow;
    let mount;

    beforeEach(() => {
        mount = createMount();
        shallow = createShallow();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    it("it should renders Administrator component ", () => {
        const wrapper = shallow(<Administrator />)
        expect(wrapper).toMatchSnapshot();
    });

    it("it should contains DrawerMenu components ", () => {
        const wrapper = mount(
            <MemoryRouter>
                <Administrator />
            </MemoryRouter>
        )
        expect(wrapper.find(DrawerMenu).length).toEqual(1);
    });
})