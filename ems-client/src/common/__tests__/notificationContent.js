import React from 'react';
import { render, cleanup, getByText } from 'react-testing-library';
import 'jest-dom/extend-expect';
import NotificationContent from 'common/notificationContent';

describe('Notification Content', () => {

        const close = jest.fn()
        const props = {
            message : "Test message",
            variant : "info",
            onClose : close
        }

    afterEach(cleanup)

	it('It should renders the message with class `info`', () => {
        const { container } = render(<NotificationContent { ...props } />);
        const notification = container.querySelector('[aria-describedby="notification-info"]')
        const msg = notification.querySelector('span')
        expect(msg).toHaveTextContent("Test message");
    })

    it('It should close the notification when close button is clicked', () => {


        const { getByLabelText } = render(<NotificationContent { ...props } />)
          const butClose = getByLabelText("Close")

        expect(butClose).not.toBeNull()

        butClose.click()

        expect(close).toHaveBeenCalledTimes(1);
    })
})