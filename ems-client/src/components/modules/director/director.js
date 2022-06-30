import React, { Component } from 'react';
import * as constants from 'constants/uiNames';
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import { Timeline, HowToReg, LocationCity, EuroSymbol, Assignment, DynamicFeed } from '@material-ui/icons/';
import DrawerMenu from 'common/menu/drawerMenu';
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import PlansContainer from 'containers/modules/director/coordinator/plans/plansContainer';
import PublicProcurementApplicationsContainer from 'containers/modules/director/coordinator/publicProcurement/applicationsContainer';
import PublicProcurementProtocolsContainer from 'containers/modules/accountant/coordinator/publicProcurement/protocolsContainer';
import InstitutionPlansContainer from 'containers/modules/director/institution/plans/plansContainer';
import PlansUpdatesContainer from 'containers/modules/director/coordinator/plans/plansUpdatesContainer';

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
                name: constants.ACCOUNTANT_MENU_COORDINATOR,
                icon: <HowToReg />,
                defaultExpanded: true,
                items:  [
                    {
                        code: 'plans',
                        name: constants.DIRECTOR_MENU_COORDINATOR_PLANS,
                        path: '/modules/director/coordinator/plans',
                        icon: <Timeline />
                    },
                    {
                        code: 'publicApplications',
                        name: constants.ACCOUNTANT_SUBMENU_COORDINATOR_PUBLIC_APPLICATIONS,
                        path: '/modules/director/coordinator/publicApplications',
                        icon: <EuroSymbol />
                    },
                    {
                        code: 'publicProtocols',
                        name: constants.ACCOUNTANT_SUBMENU_COORDINATOR_PUBLIC_PROTOCOLS,
                        path: '/modules/director/coordinator/publicProtocols',
                        icon: <Assignment />
                    },
                    {
                        code: 'updates',
                        name: constants.ACCOUNTANT_SUBMENU_COORDINATOR_UPDATES,
                        path: '/modules/director/coordinator/plans/updates',
                        icon: <DynamicFeed />
                    },
                ],
            },
            {
                name: constants.ACCOUNTANT_MENU_INSTITUTION,
                icon: <LocationCity />,
                defaultExpanded: false,
                items:  [
                    {
                        code: 'plans',
                        name: constants.ACCOUNTANT_SUBMENU_INSTITUTION_PLANS,
                        path: '/modules/director/institution/plans',
                        icon: <Timeline />
                    },
                ],
            },
        ]
    };

    showInstitutionPlan = () =>{
        return(
            <InstitutionPlansContainer
                levelAccess="director"
            />
        )
    }

    showPublicProcurementProtocol = () =>{
        return(
            <PublicProcurementProtocolsContainer
                levelAccess="director"
            />
        )
    }

    showCoordinatorPlansUpdates = () =>{
        return(
            <PlansUpdatesContainer
                levelAccess="director"
            />
        )
    }

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
                                    <PrivateRoute exact path='/modules/director/coordinator/plans' component={PlansContainer}/>
                                    <PrivateRoute exact path='/modules/director/coordinator/plans/updates' component={this.showCoordinatorPlansUpdates}/>
                                    <PrivateRoute exact path='/modules/director/coordinator/publicApplications' component={PublicProcurementApplicationsContainer}/>
                                    <PrivateRoute exact path='/modules/director/coordinator/publicProtocols' component={this.showPublicProcurementProtocol}/>
                                    <PrivateRoute exact path='/modules/director/institution/plans' component={this.showInstitutionPlan}/>
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