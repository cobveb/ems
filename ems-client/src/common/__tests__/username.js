import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import Username from 'common/username';
import renderer from 'react-test-renderer';

describe("Username component", () => {
    let shallow;

    beforeEach(() => {
        shallow = createShallow();
    });

    it("it should renders Username component ", () => {
        const wrapper = shallow(<Username />)
        expect(wrapper).toMatchSnapshot();
    })
});