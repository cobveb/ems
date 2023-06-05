import React, { Component } from 'react';
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import DrawerMenu from 'common/menu/drawerMenu';
import PropTypes from 'prop-types';
import { People, LibraryBooks, Domain, Work } from '@material-ui/icons/';
import * as constants from 'constants/uiNames'
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import EmployeesContainer from 'containers/modules/hr/employees/employeesContainer';
import DictionariesContainer from 'containers/modules/hr/dictionary/dictionariesContainer';
import PlacesContainer from 'containers/modules/hr/dictionary/placesContainer';
import WorkplacesContainer from 'containers/modules/hr/dictionary/workplacesContainer';

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

class HumanResources extends Component {

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
                        path: '/modules/hr',
                        icon: <People />
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
                        path: '/modules/hr/dictionaries',
                        icon: <LibraryBooks />
                    },
                    {
                        code:'places',
                        name: constants.HR_MENU_EMPLOYEES_DICTIONARIES_PLACES,
                        path: '/modules/hr/dictionaries/places',
                        icon: <Domain />
                    },
                    {
                        code:'workplaces',
                        name: constants.HR_MENU_EMPLOYEES_DICTIONARIES_WORKPLACES,
                        path: '/modules/hr/dictionaries/workplaces',
                        icon: <Work />
                    },
                ],
            }
        ]
    };

    showEmployeeDetails = () =>{
        return(
            <EmployeesContainer
                levelAccess="hr"
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
                                    <PrivateRoute exact path='/modules/hr/' component={this.showEmployeeDetails}/>
                                    <PrivateRoute exact path='/modules/hr/dictionaries' component={DictionariesContainer}/>
                                    <PrivateRoute exact path='/modules/hr/dictionaries/places' component={PlacesContainer}/>
                                    <PrivateRoute exact path='/modules/hr/dictionaries/workplaces' component={WorkplacesContainer}/>
                                </Switch>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </>
        );
    };
};

HumanResources.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HumanResources);
