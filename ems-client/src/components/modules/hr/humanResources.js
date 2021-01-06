import React, { Component } from 'react';
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import DrawerMenu from 'common/menu/drawerMenu';
import PropTypes from 'prop-types';
import { People } from '@material-ui/icons/';
import * as constants from 'constants/uiNames'
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import WorkersContainer from 'containers/modules/hr/staff/workersContainer';

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
                name: constants.HR_MENU_STAFF,
                icon: <People />,
                defaultExpanded: true,
                items:  [
                    {
                        code: 'workers',
                        name: constants.HR_MENU_STAFF_WORKERS,
                        path: '/modules/hr',
                        icon: <People />
                    },
                ],
            },
        ]
    };

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
                                    <PrivateRoute exact path='/modules/hr/' component={WorkersContainer}/>
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
