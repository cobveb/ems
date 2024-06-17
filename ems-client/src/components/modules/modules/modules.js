import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { withStyles, Grid  } from '@material-ui/core/';
import AppHeader from 'common/appHeader';
import PrivateRoute from 'common/privateRoute';
import ModuleListContainer  from 'containers/modules/modules/moduleListContainer';
import Administrator from 'components/modules/administrator/administrator';
import Applicant from 'components/modules/applicant/applicant';
import Coordinator from 'components/modules/coordinator/coordinator';
import Accountant from 'components/modules/accountant/accountant';
import Director from 'components/modules/director/director';
import HumanResources from 'components/modules/hr/humanResources';
import PublicProcurement from 'components/modules/publicProcurement/publicProcurement';
import Iod from 'components/modules/iod/iod';
import Asi from 'components/modules/asi/asi';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        height: `calc(100vh - ${theme.spacing(6)}px)`,
        overflow: 'auto',
    },
});

class Modules extends Component {
    render(){
        const { classes } = this.props;
        return(
            <>
                <div className={classes.root}>
                <Grid container spacing={0}>
                    <AppHeader />
                </Grid>
                <main className={classes.content}>
                    <Switch>
                        <PrivateRoute exact path='/modules' component={ModuleListContainer}/>
                        <PrivateRoute path='/modules/administrator' component={Administrator}/>
                        <PrivateRoute path='/modules/director' component={Director}/>
                        <PrivateRoute path='/modules/accountant' component={Accountant}/>
                        <PrivateRoute path='/modules/applicant' component={Applicant}/>
                        <PrivateRoute path='/modules/coordinator' component={Coordinator}/>
                        <PrivateRoute path='/modules/hr' component={HumanResources}/>
                        <PrivateRoute path='/modules/public' component={PublicProcurement}/>
                        <PrivateRoute path='/modules/iod' component={Iod}/>
                        <PrivateRoute path='/modules/asi' component={Asi}/>
                    </Switch>
                </main>
                </div>
            </>
        )
    }
}

Modules.propTypes = {
		classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Modules);