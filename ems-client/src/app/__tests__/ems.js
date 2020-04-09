import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import Ems from 'app/ems';
import renderer from 'react-test-renderer';

describe("EMS main component", () => {
    let shallow;

    beforeEach(() => {
        shallow = createShallow();
    });

    it("it should renders Ems component ", () => {
        const wrapper = shallow(<Ems />)
        expect(wrapper).toMatchSnapshot();
    })
});