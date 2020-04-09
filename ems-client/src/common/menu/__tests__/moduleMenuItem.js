import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import ModuleMenuItem from 'common/menu/moduleMenuItem';
import { Security } from '@material-ui/icons/';
import { Link } from 'react-router-dom';
import { ListItemText, ListItem } from '@material-ui/core/';


describe("ModuleMenuItem component", () => {
    let shallow;
    let mount;

    beforeEach(() => {
        mount = createMount();
        shallow = createShallow();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    const props = {
        item: {
            code: 'menuItem',
            name: 'Menu Item',
            path: 'menu/menuItem',
            icon: <Security />
        }
    }

    it("it should renders ModuleMenuItem component ", () => {
        const wrapper = shallow(<ModuleMenuItem {...props}/>)
        expect(wrapper).toMatchSnapshot();
    })

    it("it should render menu item name ", () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={['/modules']}>
                <ModuleMenuItem {...props} />
            </MemoryRouter>
        )

        const item = wrapper.find(ModuleMenuItem)

        expect(item.find(ListItemText).text()).toBe('Menu Item');

    })

    it("it should render menu item icon ", () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={['/modules']}>
                <ModuleMenuItem {...props} />
            </MemoryRouter>
        )

        const item = wrapper.find(ModuleMenuItem)

        expect(item.find(Security).exists()).toEqual(true);
    })

    it("it should render correct link ", () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={['/modules']}>
                <ModuleMenuItem {...props} />
            </MemoryRouter>
        )

        const item = wrapper.find(ModuleMenuItem)

        expect(item.find(ListItem).props().component).toEqual(Link);
        expect(item.find(ListItem).props().to).toEqual('menu/menuItem');
    })

})