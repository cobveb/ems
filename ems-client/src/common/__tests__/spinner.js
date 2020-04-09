import React from 'react';
import { shallow, mount } from 'enzyme';
import Spinner from 'common/spinner'
import { CircularProgress } from '@material-ui/core/';

jest.useFakeTimers();

describe("Spinner component", () => {
    it("renders Spinner component ", () => {
        const wrapper = mount(<Spinner />);

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('.spinner')).toBeDefined();
        expect(wrapper.find(CircularProgress)).toHaveLength(1);
    })

    it('should call method during componentDidMount', () => {

        const wrapper = shallow(<Spinner />);

        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 20);
    })

    it('should change CircularProgress state', () => {

        const wrapper = mount(shallow(<Spinner />).get(0))

        expect(wrapper.state().completed).toEqual(0);

        wrapper.instance().progress();

        expect(wrapper.state().completed).toEqual(1);
        wrapper.setState({completed: 101})

        wrapper.instance().progress();
        expect(wrapper.state().completed).toEqual(0);
    })

    it('should call clearInterval during componentWillUnmount', () => {

        const wrapper = mount(<Spinner />);
        wrapper.unmount();

        expect(clearInterval).toHaveBeenCalledWith(expect.any(Number));
        expect(clearInterval).toHaveBeenCalledTimes(1);
    })
});