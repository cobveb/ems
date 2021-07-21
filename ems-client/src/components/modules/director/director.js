import React, { Component } from 'react';
import * as constants from 'constants/uiNames';
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import { Timeline, HowToReg } from '@material-ui/icons/';
import DrawerMenu from 'common/menu/drawerMenu';
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import PlansContainer from 'containers/modules/director/coordinator/plans/plansContainer';

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

class Director extends Component {
    state = {
        menus: [
            {
                name: constants.DIRECTOR_MENU_PLANS,
                icon: <Timeline />,
                defaultExpanded: true,
                items:  [
                    {
                        code: 'plans',
                        name: constants.DIRECTOR_MENU_COORDINATOR_PLANS,
                        path: '/modules/director/plans/coordinators',
                        icon: <HowToReg />
                    },
                ],
            },
        ]
    };

    render(){

        const {classes} = this.props;
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
                                    <PrivateRoute exact path='/modules/director/' component={PlansContainer}/>
                                    <PrivateRoute exact path='/modules/director/plans/coordinators' component={PlansContainer}/>
                                </Switch>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </>
        );
    };
}

Director.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Director);