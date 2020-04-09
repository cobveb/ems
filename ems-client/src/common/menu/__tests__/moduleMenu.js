import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import ModuleMenu from 'common/menu/moduleMenu';
import ModuleMenuItem from 'common/menu/moduleMenuItem';
import { List, Typography, ExpansionPanel } from '@material-ui/core/';
import { LocationCity } from '@material-ui/icons/';

describe("ModuleMenu component", () => {
    let shallow;
    let mount;

    beforeEach(() => {
        mount = createMount();
        shallow = createShallow();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    const dataItems = [
        {
            code: 'institutionDetail',
            name: 'Dane Instytucji',
            icon: <LocationCity />,
            path: '/modules/administrator/institution',
        },
        {
            code:'structure',
            name: 'Struktura organizacyjna',
            icon: <LocationCity />,
            path: '/modules/administrator/structure',
        }
    ]


    const props = {
        name: 'Menu Test',
        icon: <LocationCity />,
        menuItems: dataItems,
    };

    it("it should renders ModuleMenu component ", () => {
        const wrapper = shallow(<ModuleMenu {...props}/>)
        expect(wrapper).toMatchSnapshot();
    });


    it("it should contains ModuleMenuItem components ", () => {
        const wrapper = mount(
            <MemoryRouter>
                <ModuleMenu {...props}/>
            </MemoryRouter>
        )
        expect(wrapper.find(ModuleMenuItem).length).toBeGreaterThanOrEqual(1);
    });

    it("it should contains Module menu name ", () => {
        const wrapper = mount(
            <MemoryRouter>
                <ModuleMenu {...props}/>
            </MemoryRouter>
        )
        expect(wrapper.find(Typography).first().text()).toBe('Menu Test');
    });

    it("it should contains Module menu icon ", () => {
        const wrapper = mount(
            <MemoryRouter>
                <ModuleMenu {...props}/>
            </MemoryRouter>
        )
        expect(wrapper.find(LocationCity).exists()).toEqual(true);
    });

    it("it should render Module menu open ", () => {
        const wrapper = mount(
            <MemoryRouter>
                <ModuleMenu {...props} defaultExpanded={true} />
            </MemoryRouter>
        )
        expect(wrapper.find(ExpansionPanel).props().expanded).toEqual(true);
    });


    it("it should toggle open Module menu  ", () => {
        const wrapper = mount(
            <MemoryRouter>
                <ModuleMenu {...props} />
            </MemoryRouter>
        )
        expect(wrapper.find('ModuleMenu').state().expanded).toEqual(false);
        const componentInstance = wrapper.find('ModuleMenu').instance();
        componentInstance.handleChange()
        expect(wrapper.find('ModuleMenu').state().expanded).toEqual(true);

    });
})