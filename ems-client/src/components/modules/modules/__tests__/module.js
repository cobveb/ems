import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import renderer from 'react-test-renderer';
import{ MemoryRouter } from "react-router-dom";
import Module from 'components/modules/modules/module';
import { Button } from '@material-ui/core/';

describe('Module components', () => {
    let shallow;
    let mount;

    const updateHeader = jest.fn();
    const props = {
        name: 'Test',
        code: 'applicant',
        updateHeader: updateHeader
    };

    beforeEach(() => {
        shallow = createShallow();
        mount = createMount();
    });

    afterEach(() => {
        mount.cleanUp();
    });

    it('it should renders Module components', () => {
        const wrapper = shallow(<Module  {...props}/>)
        expect(wrapper).toMatchSnapshot();
    })

    it('it should update header title on click', () => {

        const wrapper = mount(<MemoryRouter><Module {...props}/></MemoryRouter>)
        const button = wrapper.find(Button)

        button.simulate('click')

        expect(updateHeader).toBeCalled()
        expect(updateHeader).toBeCalledWith('Test')
    })
});