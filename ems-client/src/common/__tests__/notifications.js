import React from 'react';
import { shallow, mount } from 'enzyme';
import Notification from 'common/notification';
import NotificationContent from 'common/notificationContent';

describe('Notification component', () => {

	it('it should open Notification', () => {

        const props = {
            message : "Test message",
            variant : "info",
        }

        const wrapper = shallow(<Notification { ...props } />)
        const wrapperContent = wrapper.find(NotificationContent)

        expect(wrapper.exists()).toBe(true)
        expect(wrapperContent.prop('message')).toEqual('Test message');
        expect(wrapperContent.prop('variant')).toEqual('info');
    })

    it('it should close Notification', () => {
        const props = {
            message : "Test message",
            variant : "info",
        }
        const wrapper = mount(<Notification { ...props } />);
        const wrapperContent = wrapper.find(NotificationContent)

        expect(wrapper.exists()).toBe(true);
        const button = wrapperContent.find('button')

        button.simulate('click')


        expect(wrapper.state().open).toBe(false)

    })

    it('it should not close Notification when click outside component', () => {

        const props = {
            message : "Test message",
            variant : "info",
        }
        const wrapper = mount(<Notification { ...props } />);
        const instance = wrapper.instance()

        instance.handleClose('click', 'clickaway')

        expect(wrapper.state().open).toBe(true)
    })

})