import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Description, LibraryBooks, EventNote, Timeline, EuroSymbol, FolderOpen, PeopleAlt } from '@material-ui/icons/';
import * as constants from 'constants/uiNames'
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import DrawerMenu from 'common/menu/drawerMenu';
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import PlansContainer from 'containers/modules/coordinator/plans/plansContainer';
import PublicProcurementRegisterContainer from 'containers/modules/coordinator/publicProcurement/register/registerContainer';
import PublicProcurementApplicationsContainer from 'containers/modules/coordinator/publicProcurement/applications/applicationsContainer';
import DictionariesContainer from 'containers/modules/coordinator/dictionariesContainer';
import ContractorsContainer from 'containers/modules/accountant/dictionary/contractorsContainer';
import ContractsContainer from 'containers/modules/coordinator/realization/contracts/contractsContainer';
import InvoicesContainer from 'containers/modules/coordinator/realization/invoices/invoicesContainer';

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


class Coordinator extends Component {
    state = {
        menus: [
            {
                name: constants.COORDINATOR_MENU_PLANS,
                icon: <EventNote />,
                defaultExpanded: true,
                items: [
                    {
                        code: 'plans',
                        name: constants.COORDINATOR_SUBMENU_PLANS,
                        path: '/modules/coordinator/plans',
                        icon: <Timeline />
                    },
                ],
            },
            {
                name: constants.COORDINATOR_MENU_PUBLIC_PROCUREMENT,
                icon: <EuroSymbol />,
                items: [
                    {
                        code: 'applications',
                        name: constants.COORDINATOR_SUBMENU_PUBLIC_APPLICATION,
                        path: '/modules/coordinator/public/applications',
                        icon: <Description />
                    },
                ],
            },
            {
                name: constants.COORDINATOR_MENU_REALIZATION,
                icon: <FolderOpen />,
                items: [
                    {
                        code: 'contracts',
                        name: constants.COORDINATOR_SUBMENU_REALIZATION_CONTRACTS,
                        path: '/modules/coordinator/realization/contracts',
                        icon: <Description />
                    },
                    {
                        code: 'invoices',
                        name: constants.COORDINATOR_SUBMENU_REALIZATION_INVOICES,
                        path: '/modules/coordinator/realization/invoices',
                        icon: <Description />
                    },

                ],
            },
            {
                name: constants.COORDINATOR_MENU_DICTIONARIES,
                icon: <LibraryBooks />,
                items: [
                    {
                        code:'dictionaries',
                        name: constants.COORDINATOR_SUBMENU_DICTIONARIES,
                        path: '/modules/coordinator/dictionaries',
                        icon: <LibraryBooks />
                    },
                    {
                        code:'contractor',
                        name: constants.ACCOUNTANT_SUBMENU_DICTIONARIES_CONTRACTORS,
                        path: '/modules/coordinator/dictionaries/contractors',
                        icon: <PeopleAlt />
                    }
                ],
            }
        ],
    }


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
                                    <PrivateRoute exact path='/modules/coordinator/' component={PlansContainer}/>
                                    <PrivateRoute exact path='/modules/coordinator/plans' component={PlansContainer}/>
                                    <PrivateRoute exact path='/modules/coordinator/public/applications' component={PublicProcurementApplicationsContainer}/>
                                    <PrivateRoute exact path='/modules/coordinator/public/register' component={PublicProcurementRegisterContainer}/>
                                    <PrivateRoute exact path='/modules/coordinator/public/realization' component={PublicProcurementRegisterContainer}/>
                                    <PrivateRoute exact path='/modules/coordinator/realization/contracts' component={ContractsContainer}/>
                                    <PrivateRoute exact path='/modules/coordinator/realization/invoices' component={InvoicesContainer}/>
                                    <PrivateRoute exact path='/modules/coordinator/dictionaries' component={DictionariesContainer}/>
                                    <PrivateRoute exact path='/modules/coordinator/dictionaries/contractors' component={ContractorsContainer}/>
                                </Switch>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </>
        )
    }
}

Coordinator.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Coordinator);