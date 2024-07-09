import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import DrawerMenu from 'common/menu/drawerMenu';
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import * as constants from 'constants/uiNames'
import { People, LibraryBooks, Airplay, AllInbox } from '@material-ui/icons/';
import EmployeesContainer from 'containers/modules/hr/employees/employeesContainer';
import EntitlementSystemsContainer from 'containers/modules/asi/dictionary/employees/entitlementSystemsContainer';
import DictionaryRegistersContainer from 'containers/modules/asi/dictionary/registers/registersContainer';
import RegistersContainer from 'containers/modules/asi/registers/registersContainer';
import DictionariesContainer from 'containers/modules/asi/dictionary/dictionariesContainer';

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
        padding: `0 0 0 ${theme.spacing(0.5)}px`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: 1300,
    },
    card: {
        height: "100%",
    },
});

class Asi extends Component {
    state = {
        menus: [
            {
                name: constants.HR_MENU_EMPLOYEES,
                icon: <People />,
                defaultExpanded: true,
                items:  [
                    {
                        code: 'employees',
                        name: constants.HR_MENU_EMPLOYEES_EMPLOYEES,
                        path: '/modules/asi',
                        icon: <People />
                    },
                ],
            },
            {
                name: constants.ASI_MENU_REGISTERS,
                icon: <AllInbox />,
                defaultExpanded: false,
                items:  [
                    {
                        code: 'registers',
                        name: constants.ASI_MENU_REGISTERS,
                        path: '/modules/asi/registers',
                        icon: <AllInbox />
                    },
                ],
            },
            {
                name: constants.MENU_DICTIONARIES,
                icon: <LibraryBooks />,
                items: [
                    {
                        code:'dictionaries',
                        name: constants.MENU_DICTIONARIES,
                        path: '/modules/asi/dictionaries',
                        icon: <LibraryBooks />
                    },
                    {
                        code:'systems',
                        name: constants.ASI_MENU_DICTIONARY_SYSTEMS,
                        path: '/modules/asi/dictionaries/systems',
                        icon: <Airplay />
                    },
                    {
                        code:'registers',
                        name: constants.ASI_MENU_DICTIONARY_REGISTERS,
                        path: '/modules/asi/dictionaries/registers',
                        icon: <AllInbox />
                    },
                ],
            }
        ]
    };


    showEmployeeDetails = () =>{
        return(
            <EmployeesContainer
                levelAccess="asi"
            />
        )
    }

    render(){
        const { classes } = this.props;
        const { menus } = this.state;
        return(
            <>
                <div className={classes.root}>
                    <CssBaseline />
                    <DrawerMenu menus={menus} />
                    <main className={classes.content}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Switch>
                                    <PrivateRoute exact path='/modules/asi/' component={this.showEmployeeDetails}/>
                                    <PrivateRoute exact path='/modules/asi/registers' component={RegistersContainer}/>
                                    <PrivateRoute exact path='/modules/asi/dictionaries' component={DictionariesContainer}/>
                                    <PrivateRoute exact path='/modules/asi/dictionaries/systems' component={EntitlementSystemsContainer}/>
                                    <PrivateRoute exact path='/modules/asi/dictionaries/registers' component={DictionaryRegistersContainer}/>
                                </Switch>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </>
        )
    }
}

Asi.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Asi);