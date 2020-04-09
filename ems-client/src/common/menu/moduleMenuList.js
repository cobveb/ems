import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModuleMenu from 'common/menu/moduleMenu';

class ModuleMenuList extends Component {

    render(){
        const { menus, open} = this.props

        return(
            <>
                {menus.map((menu, index) => (
                    <ModuleMenu
                        key={index}
                        name={menu.name}
                        icon={menu.icon}
                        menuItems={menu.items}
                        defaultExpanded={menu.defaultExpanded}
                        open={open}
                    />
                ))}

            </>
        )
    }
}

ModuleMenuList.propTypes = {
    defaultExpanded: PropTypes.string,
};

export default (ModuleMenuList);