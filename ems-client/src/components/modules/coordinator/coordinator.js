import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Description, LibraryBooks, EventNote, AccountBalanceWallet } from '@material-ui/icons/';
import * as constants from 'constants/uiNames'
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import DrawerMenu from 'common/menu/drawerMenu';
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import FinancialPlansContainer from 'containers/modules/accountant/dictionary/costsTypesContainer';
import DictionariesContainer from 'containers/modules/accountant/dictionary/costsTypesContainer';

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
                name: constants.COORDINATOR_MENU_APPLICATIONS,
                icon: <Description />,
                items:  [
                    {
                        code: 'applications',
                        name: constants.COORDINATOR_SUBMENU_APPLICATIONS,
                        path: '/modules/coordinator/applications',
                        icon: <Description />
                    },
                ],
            },
            {
                name: constants.COORDINATOR_MENU_PLANS,
                icon: <EventNote />,
                defaultExpanded: true,
                items: [
                    {
                        code: 'financialPlans',
                        name: constants.COORDINATOR_SUBMENU_PLANS_FINANCIAL,
                        path: '/modules/coordinator/plans/financial',
                        icon: <AccountBalanceWallet />
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
                                    <PrivateRoute exact path='/modules/coordinator/' component={FinancialPlansContainer}/>
                                    <PrivateRoute exact path='/modules/coordinator/plans/financial' component={FinancialPlansContainer}/>
                                    <PrivateRoute exact path='/modules/coordinator/dictionaries' component={DictionariesContainer}/>
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