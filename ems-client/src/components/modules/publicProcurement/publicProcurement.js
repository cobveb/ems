import React, { Component } from 'react';
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import DrawerMenu from 'common/menu/drawerMenu';
import PropTypes from 'prop-types';
import { LibraryBooks, Style, HowToReg, Timeline } from '@material-ui/icons/';
import * as constants from 'constants/uiNames'
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import PlansContainer from 'containers/modules/publicProcurement/coordinator/plans/plansContainer';
import DictionariesContainer from 'containers/modules/publicProcurement/dictionaries/dictionariesContainer';

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

class PublicProcurement extends Component {

    state = {
        menus: [
            {
                name: constants.PUBLIC_MENU_COORDINATOR,
                icon: <HowToReg />,
                defaultExpanded: true,
                items:  [
                    {
                        code: 'plans',
                        name: constants.PUBLIC_SUBMENU_COORDINATOR_PLANS,
                        path: '/modules/public/coordinator/plans',
                        icon: <Timeline />
                    },
                ],
            },
            {
                name: constants.PUBLIC_MENU_DICTIONARIES,
                icon: <LibraryBooks />,
                items: [
                    {
                        code:'assortmentsGroups',
                        name: constants.PUBLIC_SUBMENU_DICTIONARIES,
                        path: '/modules/public/dictionaries',
                        icon: <Style />
                    }
                ],
            }
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
                                    <PrivateRoute exact path='/modules/public/' component={PlansContainer}/>
                                    <PrivateRoute exact path='/modules/public/coordinator/plans' component={PlansContainer}/>
                                    <PrivateRoute exact path='/modules/public/dictionaries' component={DictionariesContainer}/>
                                </Switch>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </>
        );
    };
};

PublicProcurement.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PublicProcurement);