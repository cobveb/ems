import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import ModuleMenuList from 'common/menu/moduleMenuList';
import ModuleMenu from 'common/menu/moduleMenu';
import { LocationCity, Business, ViewQuilt } from '@material-ui/icons/';

describe("ModuleMenuList component", () => {
    let shallow;
    let mount;

    beforeEach(() => {
        shallow = createShallow();
    });

    const menus =
        [
             {
                 name: 'Instytucja',
                 icon: <LocationCity />,
                 defaultExpanded: true,
                 items:  [
                     {
                         code: 'institutionDetail',
                         name: 'Dane Instytucji',
                         path: '/modules/administrator/institution',
                         icon: <Business />
                     },
                     {
                         code:'structure',
                         name: 'Struktura organizacyjna',
                         path: '/modules/administrator/structure',
                         icon: <ViewQuilt />
                     }
                 ],
             },
        ]

    const props = {
        menus: menus,
    };

    it("it should renders ModuleMenuList component ", () => {
        const wrapper = shallow(<ModuleMenuList {...props}/>)
        expect(wrapper).toMatchSnapshot();
    });

    it("it should contains ModuleMenu component ", () => {
            const wrapper = shallow(<ModuleMenuList {...props} />)
            expect(wrapper.find(ModuleMenu).length).toBeGreaterThanOrEqual(1);
    });

})