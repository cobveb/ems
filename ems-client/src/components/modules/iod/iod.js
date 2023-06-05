import React, { Component } from 'react';
import { withStyles, CssBaseline, Card, CardContent } from '@material-ui/core/';
import DrawerMenu from 'common/menu/drawerMenu';
import PropTypes from 'prop-types';
import { LibraryBooks, FormatListBulleted, } from '@material-ui/icons/';
import * as constants from 'constants/uiNames'
import PrivateRoute from 'common/privateRoute';
import { Switch } from 'react-router-dom';
import RegistersContainer from 'containers/modules/iod/registers/registersContainer';

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

class Iod extends Component {

    state = {
        menus: [
            {
                name: constants.IOD_MENU_REGISTERS,
                icon: <LibraryBooks />,
                items: [
                    {
                        code:'registers',
                        name: constants.IOD_MENU_REGISTERS,
                        path: '/modules/iod/registers/registers',
                        icon: <FormatListBulleted />
                    },
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
                                    <PrivateRoute exact path='/modules/iod/' component={RegistersContainer}/>
                                    <PrivateRoute exact path='/modules/iod/registers/registers' component={RegistersContainer}/>
                                </Switch>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </>
        );
    };
};

Iod.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Iod);
