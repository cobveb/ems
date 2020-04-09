import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import renderer from 'react-test-renderer';
import Modules from 'components/modules/modules/moduleList';
import ModuleContainer from 'containers/modules/modules/moduleContainer';
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import{ MemoryRouter } from "react-router-dom";

describe('Modules components', () => {
    let shallow;
    let mount;

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore({})

    beforeEach(() => {
        shallow = createShallow();
        mount = createMount();
    });

    afterEach(() => {
            mount.cleanUp();
    });

    const modulesData = [
        {
            id: 1,
            code: 'accountant',
            name: 'Księgowy',
        },
        {
            id: 2,
            code: 'coordinator',
            name: 'Koordynator',
        }
    ]

    it('it should renders Modules components', () => {
        const wrapper = shallow(<Modules modules={modulesData} updateHeader="Title"/>)
        expect(wrapper).toMatchSnapshot();
    })

    it('it should update application header',() => {
        const updateHeader = jest.fn();
        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                    <Modules modules={modulesData} updateHeader={updateHeader}/>
                </Provider>
            </MemoryRouter>
        )
        expect(updateHeader).toBeCalled()
    })

    it('it should render module component',() => {
        const updateHeader = jest.fn();
        const wrapper = mount(
            <MemoryRouter>
                <Provider store={store}>
                    <Modules modules={modulesData} updateHeader={updateHeader}/>
                </Provider>
            </MemoryRouter>
        )

        expect(wrapper.find(ModuleContainer).length).toBeGreaterThanOrEqual(1)
    })
})