import React, { Component } from 'react';
import { LibraryBooks, Style, Timeline, HowToReg, LocationCity, PeopleAlt, EuroSymbol, Assignment, DynamicFeed } from '@material-ui/icons/';
import * as constants from 'constants/uiNames';
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import DrawerMenu from 'common/menu/drawerMenu';
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import CostsTypesContainer from 'containers/modules/accountant/dictionary/costsTypesContainer';
import ContractorsContainer from 'containers/modules/accountant/dictionary/contractorsContainer';
import PlansContainer from 'containers/modules/accountant/coordinator/plans/plansContainer';
import PublicProcurementApplicationsContainer from 'containers/modules/accountant/coordinator/publicProcurement/applicationsContainer';
import PublicProcurementProtocolsContainer from 'containers/modules/accountant/coordinator/publicProcurement/protocolsContainer';
import InstitutionPlansContainer from 'containers/modules/accountant/institution/plans/plansContainer';
import PlansUpdatesContainer from 'containers/modules/accountant/coordinator/plans/plansUpdatesContainer';
import PropTypes from 'prop-types';

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

class Accountant extends Component {
    state = {
        menus: [
            {
                name: constants.ACCOUNTANT_MENU_COORDINATOR,
                icon: <HowToReg />,
                defaultExpanded: false,
                items:  [
                    {
                        code: 'plans',
                        name: constants.ACCOUNTANT_SUBMENU_COORDINATOR_PLANS,
                        path: '/modules/accountant/coordinator/plans',
                        icon: <Timeline />
                    },
                    {
                        code: 'publicApplications',
                        name: constants.ACCOUNTANT_SUBMENU_COORDINATOR_PUBLIC_APPLICATIONS,
                        path: '/modules/accountant/coordinator/publicApplications',
                        icon: <EuroSymbol />
                    },
                    {
                        code: 'publicProtocols',
                        name: constants.ACCOUNTANT_SUBMENU_COORDINATOR_PUBLIC_PROTOCOLS,
                        path: '/modules/accountant/coordinator/publicProtocols',
                        icon: <Assignment />
                    },
                    {
                        code: 'updates',
                        name: constants.ACCOUNTANT_SUBMENU_COORDINATOR_UPDATES,
                        path: '/modules/accountant/coordinator/plans/updates',
                        icon: <DynamicFeed />
                    },
                ],
            },
            {
                name: constants.ACCOUNTANT_MENU_INSTITUTION,
                icon: <LocationCity />,
                defaultExpanded: true,
                items:  [
                    {
                        code: 'plans',
                        name: constants.ACCOUNTANT_SUBMENU_INSTITUTION_PLANS,
                        path: '/modules/accountant/institution/plans',
                        icon: <Timeline />
                    },
                ],
            },
            {
                name: constants.ACCOUNTANT_MENU_DICTIONARIES,
                icon: <LibraryBooks />,
                items: [
                    {
                        code:'costTypes',
                        name: constants.ACCOUNTANT_SUBMENU_DICTIONARIES_COST_TYPES,
                        path: '/modules/accountant/dictionaries/costs',
                        icon: <Style />
                    },
                    {
                        code:'contractor',
                        name: constants.ACCOUNTANT_SUBMENU_DICTIONARIES_CONTRACTORS,
                        path: '/modules/accountant/dictionaries/contractors',
                        icon: <PeopleAlt />
                    }
                ],
            }
        ],
    }

    showInstitutionPlans = () =>{
        return(
            <InstitutionPlansContainer
                levelAccess="accountant"
            />
        )
    }

    showPublicProcurementProtocol = () =>{
        return(
            <PublicProcurementProtocolsContainer
                levelAccess="accountant"
            />
        )
    }

    showCoordinatorPlansUpdates = () =>{
        return(
            <PlansUpdatesContainer
                levelAccess="accountant"
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
                                    <PrivateRoute exact path='/modules/accountant/' component={this.showInstitutionPlans}/>
                                    <PrivateRoute exact path='/modules/accountant/coordinator/plans' component={PlansContainer}/>
                                    <PrivateRoute exact path='/modules/accountant/coordinator/plans/updates' component={this.showCoordinatorPlansUpdates}/>
                                    <PrivateRoute exact path='/modules/accountant/coordinator/publicApplications' component={PublicProcurementApplicationsContainer}/>
                                    <PrivateRoute exact path='/modules/accountant/coordinator/publicProtocols' component={this.showPublicProcurementProtocol}/>
                                    <PrivateRoute exact path='/modules/accountant/institution/plans' component={this.showInstitutionPlans}/>
                                    <PrivateRoute path='/modules/accountant/dictionaries/costs' component={CostsTypesContainer}/>
                                    <PrivateRoute path='/modules/accountant/dictionaries/contractors' component={ContractorsContainer}/>
                                </Switch>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </>
        )
    }
}

Accountant.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Accountant);