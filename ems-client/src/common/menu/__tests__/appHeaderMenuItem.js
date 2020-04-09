import React from 'react';
import { render, cleanup, fireEvent  } from 'react-testing-library';
import 'jest-dom/extend-expect';
import HeaderMenuItem from 'common/menu/appHeaderMenuItem';
import{ MemoryRouter } from "react-router-dom";
import LogoutIco from '@material-ui/icons/ExitToApp';

describe('HeaderMenuItem', () => {

    const setup = (code) => {
        const onClick = jest.fn()
        const props = {
            name : "Test",
            code : code,
            path : "/logout",
            icon : <LogoutIco />,
            onClick : onClick,
        }

        const headerMenuItem = render(
            <MemoryRouter>
                <HeaderMenuItem { ...props } />
            </MemoryRouter>);
        return {
            headerMenuItem
        }
    }

	afterEach(cleanup)

	it('it should be render', () => {
        const { headerMenuItem } = setup("test")
        const menuItem = headerMenuItem.getByTestId('menu-item')

        expect(menuItem).toHaveClass('AppHeaderMenuItem-menuItem-1')
        expect(menuItem).not.toHaveClass('AppHeaderMenuItem-logout-5')
        expect(headerMenuItem).not.toBeNull();
    })

    it('it should be render logout', () => {
        const { headerMenuItem } = setup("logout")
        const menuItem = headerMenuItem.getByTestId('menu-item')

        expect(menuItem).not.toHaveClass('AppHeaderMenuItem-menuItem-1')
        expect(menuItem).toHaveClass('AppHeaderMenuItem-logout-87')
        expect(headerMenuItem).not.toBeNull();
    })
})
