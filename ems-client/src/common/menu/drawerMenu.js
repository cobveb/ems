import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Drawer, IconButton, Tooltip } from '@material-ui/core/';
import { ChevronLeft, Menu } from '@material-ui/icons/';
import ModuleMenuList from 'common/menu/moduleMenuList';
import * as constants from 'constants/uiNames'

const styles = theme => ({
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: `0 ${theme.spacing(2)}px`,
    },
    drawer: {
        overflow: 'auto',
    },
    drawerPaper: {
        position: 'relative',
        height: `calc(100vh - ${theme.spacing(6)}px)`,
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
})

const drawerWidth = 250;

class DrawerMenu extends Component {
    state = {
        open: true,
    };

    handleDrawerToogle= () => {
        this.setState({ open: !this.state.open });
    };

    render(){
        const { classes, menus } = this.props;
        return(
            <Drawer
                variant="permanent"
                className={classes.drawer}
                classes={{
                    paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                }}
                open={this.state.open}
            >
                <div className={classes.toolbarIcon}>
                    <Tooltip title={this.state.open ? constants.DRAWER_MENU_HIDE : constants.DRAWER_MENU_SHOW}>
                        <IconButton onClick={this.handleDrawerToogle}>
                            {this.state.open ? <ChevronLeft /> : <Menu />}
                        </IconButton>
                    </Tooltip>
                </div>
                <ModuleMenuList
                    menus={menus}
                    open={this.state.open}
                />
            </Drawer>
        )
    }
}

DrawerMenu.propTypes = {
    classes: PropTypes.object.isRequired,
    menus: PropTypes.array.isRequired,
};

export default withStyles(styles)(DrawerMenu);