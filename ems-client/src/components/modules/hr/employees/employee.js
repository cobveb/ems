import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Tabs, Tab, TabPanel } from 'common/gui';
import { Spinner } from 'common/';
import { Info, RecentActors, Work, VerifiedUser } from '@material-ui/icons/';
import EmployeeBasicInfoFormContainer from 'containers/modules/hr/employees/forms/employeeBasicInfoFormContainer';
import EmployeeEmploymentsContainer from 'containers/modules/hr/employees/employeeEmploymentsContainer';
import EmployeeEntitlementsContainer from 'containers/modules/hr/employees/employeeEntitlementsContainer';
import EmployeeTrainingsContainer from 'containers/modules/hr/employees/employeeTrainingsContainer';

const styles = theme => ({
    root: {
        margin: 0,
        padding: 0,
        width: '100%',
        height: `calc(100vh - ${theme.spacing(11)}px)`,
    },
    tabPanel: {
        padding: 0,
    }
});

class Employee extends Component {
    state = {
        numTab: 0,
    };

    handleChangeTabs = (event, numTab) => {
        this.setState({ numTab });
    };

    handleSubmitBasic = (values) => {
        this.props.onSubmitBasic(values);
    }




    render(){
        const { classes, initialValues, action, error, isLoading, onClose, levelAccess } = this.props;
        const { numTab } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                <Grid container spacing={0} direction="column">
                    <div className={classes.root}>
                        <Typography
                            variant="h6"
                        >
                            { action === "add" ?
                                constants.EMPLOYEE_CREATE_NEW_EMPLOYEE_TITLE
                                    :  constants.EMPLOYEE_EDIT_EMPLOYEE_TITLE + ` ${initialValues.name} ${initialValues.surname}`
                            }
                        </Typography>
                        <Divider />
                        <Tabs
                            value={numTab}
                            onChange={this.handleChangeTabs}
                            variant="fullWidth"
                            scrollButtons="on"
                        >
                            <Tab label={constants.EMPLOYEE_BASIC_INFORMATION} icon={<Info />} index={0} />
                            {levelAccess === 'hr' &&
                                <Tab label={constants.EMPLOYEE_EMPLOYMENTS} icon={<Work />} index={1} disabled={action==="add"}/>
                            }
                            {/*
                                <Tab label={constants.EMPLOYEE_TRAINING} icon={<RecentActors />} index={3} disabled={action==="add"}/>
                            */}
                            {levelAccess === 'asi' &&
                                <Tab label={constants.EMPLOYEE_ENTITLEMENTS} icon={<VerifiedUser />} index={2} disabled={action==="add"} />
                            }
                        </Tabs>
                        <TabPanel value={numTab} index={0} className={classes.tabPanel}>
                            <EmployeeBasicInfoFormContainer
                                onSubmit={this.handleSubmitBasic}
                                initialValues={initialValues}
                                action={action}
                                onClose={() => onClose(initialValues)}
                            />
                        </TabPanel>

                        <TabPanel value={numTab} index={1} className={classes.tabPanel}>
                            <EmployeeEmploymentsContainer
                                initialValues={initialValues}
                                hrNumber={initialValues.hrNumber}
                                error = {error}
                                onSubmit={this.handleSubmitEmployment}
                                onClose={() => onClose(initialValues)}
                            />
                        </TabPanel>
                        {/*
                        <TabPanel value={numTab} index={2} className={classes.tabPanel}>
                            <EmployeeEntitlementsContainer
                                initialValues={initialValues}
                                error = {error}
                                onClose={() => onClose(initialValues)}
                            />
                        </TabPanel>
                        <TabPanel value={numTab} index={3} className={classes.tabPanel}>
                            <EmployeeTrainingsContainer
                                initialValues={initialValues}
                                error = {error}
                                onClose={() => onClose(initialValues)}
                            />
                        </TabPanel>
                        */}
                    </div>
                </Grid>
            </>
        );
    };
};

Employee.propTypes = {
    classes: PropTypes.object,
    initialValues: PropTypes.object,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    levelAccess: PropTypes.string.isRequired,
    error: PropTypes.string,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
}
export default withStyles(styles)(Employee);