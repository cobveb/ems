import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import { Description } from '@material-ui/icons/';
import ApplicationsContainer from 'containers/modules/applicant/applicationsContainer';
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

class Applicant extends Component {
    state = {
        open: true,
        menus: [
            {
                name: constants.MENU_APPLICATION,
                icon: <Description />,
                defaultExpanded: true,
                items:  [
                    {
                        code: 'application',
                        name: constants.SUBMENU_APPLICATIONS,
                        path: '/modules/applicant',
                        icon: <Description />
                    },
                ],
            },
        ]
    };

    render(){
        const { classes } = this.props;
        const {menus} = this.state;
        return(
            <>
                <div className={classes.root}>
                    <CssBaseline />
                    <DrawerMenu menus={menus} />
                    <main className={classes.content}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Switch>
                                    <PrivateRoute exact path='/modules/applicant/' component={ApplicationsContainer}/>
                                </Switch>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </>
        )
    }
}

Applicant.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Applicant);