import React from 'react';
import { createMount, createShallow  } from '@material-ui/core/test-utils';
import LoginFormContainer from 'containers/login/loginFormContainer';
import renderer from 'react-test-renderer';

describe("LoginFormContainer component", () => {
    let shallow;

    beforeEach(() => {
        shallow = createShallow();
    });

    it("it should renders LoginFormContainer component ", () => {
        const wrapper = shallow(<LoginFormContainer isLoading={false}/>)
        expect(wrapper).toMatchSnapshot();
    })
});