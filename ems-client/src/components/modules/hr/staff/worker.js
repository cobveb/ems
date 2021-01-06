import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Tabs, Tab, TabPanel } from 'common/gui';
import { ModalDialog, Spinner} from 'common/';
import { Info, RecentActors, Work } from '@material-ui/icons/';
import WorkerBasicInfoFormContainer from 'containers/modules/hr/staff/forms/workerBasicInfoFormContainer';
import WorkerEmploymentsFormContainer from 'containers/modules/hr/staff/forms/workerEmploymentsFormContainer';
import WorkerFunctionsFormContainer from 'containers/modules/hr/staff/forms/workerFunctionsFormContainer';

const styles = theme => ({
    root: {
        margin: 0,
        padding: 0,
        width: '100%',
        height: `calc(100vh - ${theme.spacing(11)}px)`,
        overflow: 'auto',
    },
});

class Worker extends Component {
    state = {
        numTab: 0,
    };

    handleChangeTabs = (event, numTab) => {
        this.setState({ numTab });
        if(numTab === 1){
            //this.props.handleUserPermissions()
        } else if (numTab === 2){
            //this.props.handleUserGroups(this.props.basicInfo);
        }
    };


    render(){
        const {classes, initialValues, changeVisibleDetails, action, error, isLoading, onClose, employments, functions} = this.props;
        const { numTab } = this.state;

        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <Grid container spacing={0} direction="column">
                    <div className={classes.root}>
                        <Typography
                            variant="h6"
                        >
                            { action === "add" ?
                                constants.WORKER_CREATE_NEW_WORKER_TITLE
                                    :  constants.WORKER_EDIT_WORKER_TITLE + ` ${initialValues.name} ${initialValues.surname}`
                            }
                        </Typography>
                        <Divider />
                        <Tabs
                            value={numTab}
                            onChange={this.handleChangeTabs}
                            variant="fullWidth"
                            scrollButtons="on"
                        >
                            <Tab label={constants.WORKER_BASIC_INFORMATION} icon={<Info />} index={0} />
                            <Tab label={constants.WORKER_EMPLOYMENTS} icon={<Work />} index={1} disabled={action==="hhh"}/>
                            <Tab label={constants.WORKER_FUNCTION} icon={<RecentActors />} index={2} disabled={action==="hhh"}/>
                        </Tabs>
                        <TabPanel value={numTab} index={0}>
                            <WorkerBasicInfoFormContainer
                                onSubmit={this.handleSubmitBasic}
                                initialValues={initialValues}
                                ous={[]}
                                action={action}
                                onClose={() => onClose(initialValues)}
                            />
                        </TabPanel>
                        <TabPanel value={numTab} index={1}>
                            <WorkerEmploymentsFormContainer
                                initialValues={employments}
                                onSubmit={this.handleSubmitEmployments}
                                error = {error}
                                onClose={() => onClose(initialValues)}
                            />
                        </TabPanel>
                        <TabPanel value={numTab} index={2}>
                            <WorkerFunctionsFormContainer
                                initialValues={functions}
                                onSubmit={this.handleSubmitFunctions}
                                error = {error}
                                onClose={() => onClose(initialValues)}
                            />
                        </TabPanel>
                    </div>
                </Grid>
            </>
        );
    };
};
Worker.propTypes = {
    classes: PropTypes.object,
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    error: PropTypes.string,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
}
export default withStyles(styles)(Worker);