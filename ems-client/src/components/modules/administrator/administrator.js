import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import { LocationCity, Person, Business, LibraryBooks, SettingsEthernet, Settings, Security, DeviceHub } from '@material-ui/icons/';
import GroupIcon from '@material-ui/icons/Group';
import InstitutionContainer from 'containers/modules/administrator/institutionContainer';
import OrganizationUnitContainer from 'containers/modules/administrator/organizationUnitContainer';
import StructureContainer from 'containers/modules/administrator/structureContainer';
import UsersContainer from 'containers/modules/administrator/usersContainer';
import UserContainer from 'containers/modules/administrator/userContainer';
import GroupsContainer from 'containers/modules/administrator/groupsContainer';
import ParametersContainer from 'containers/modules/administrator/parametersContainer';
import DictionariesContainer from 'containers/modules/administrator/dictionariesContainer';
import DrawerMenu from 'common/menu/drawerMenu';
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import * as constants from 'constants/uiNames'

const styles = theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(6)}px)`,
        maxHeight: `calc(100vh - ${theme.spacing(6)}px)`,
        minHeight: `calc(100vh - ${theme.spacing(6)}px)`,
        padding: `0 0 0 ${theme.spacing(0.8)}px`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: 1300,
    },
    card: {
        minHeight: "100%",
    },
});


class Administrator extends Component {
    state = {
        open: true,
        menus: [
            {
                name: constants.MENU_INSTITUTION,
                icon: <LocationCity />,
                items:  [
                    {
                        code: 'institutionDetail',
                        name: constants.SUBMENU_INSTITUTION_DETAIL,
                        path: '/modules/administrator/institution',
                        icon: <Business />
                    },
                    {
                        code:'structure',
                        name: constants.SUBMENU_INSTITUTION_STRUCTURE,
                        path: '/modules/administrator/structure',
                        icon: <DeviceHub />
                    }
                ],
            },
            {
                name: constants.MENU_ACCESS_CONTROL,
                icon: <Security />,
                defaultExpanded: true,
                items: [
                    {
                        code: 'users',
                        name: constants.SUBMENU_ACCESS_CONTROL_USERS,
                        path: '/modules/administrator',
                        icon: <Person />
                    },
                    {
                        code:'groups',
                        name: constants.SUBMENU_ACCESS_CONTROL_GROUPS,
                        path: '/modules/administrator/groups',
                        icon: <GroupIcon />
                    }
                ],
            },
            {
                name: constants.MENU_CONFIGURATIONS,
                icon: <Settings />,
                items: [
                    {
                        code: 'parameters',
                        name: constants.SUBMENU_CONFIGURATIONS_PARAMETERS,
                        path: '/modules/administrator/parameters',
                        icon: <SettingsEthernet />
                    },
                    {
                        code:'dictionaries',
                        name: constants.SUBMENU_CONFIGURATIONS_DICTIONARIES,
                        path: '/modules/administrator/dictionaries',
                        icon: <LibraryBooks />
                    }
                ],
            }
        ],
    }

    render(){
        const { classes } = this.props;
        const { menus} = this.state;
        return(
            <>
                <div className={classes.root}>
                    <CssBaseline />
                    <DrawerMenu menus={menus} />
                    <main className={classes.content}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Switch>
                                    <PrivateRoute exact path='/modules/administrator/' component={UsersContainer}/>
                                    <PrivateRoute path='/modules/administrator/institution' component={InstitutionContainer}/>
                                    <PrivateRoute exact path='/modules/administrator/structure' component={StructureContainer}/>
                                    <PrivateRoute path='/modules/administrator/structure/:action/:ou?' component={OrganizationUnitContainer}/>
                                    <PrivateRoute exact path='/modules/administrator/users' component={UsersContainer}/>
                                    <PrivateRoute path='/modules/administrator/users/:action/:userId?' component={UserContainer}/>
                                    <PrivateRoute path='/modules/administrator/groups' component={GroupsContainer}/>
                                    <PrivateRoute path='/modules/administrator/parameters' component={ParametersContainer}/>
                                    <PrivateRoute path='/modules/administrator/dictionaries' component={DictionariesContainer}/>
                                    </Switch>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </>
        )
    }
}

Administrator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Administrator);