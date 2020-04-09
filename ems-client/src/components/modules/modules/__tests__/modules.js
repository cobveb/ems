import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import{ MemoryRouter } from "react-router-dom";
import Modules from 'components/modules/modules/modules';

describe('Modules components', () => {
	
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
	
	it('it should renders Modules components', () => {
	    const wrapper = shallow(<Modules />)
        expect(wrapper).toMatchSnapshot();
	})
})