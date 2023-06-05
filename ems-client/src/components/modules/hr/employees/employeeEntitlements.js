import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import Spinner from 'common/spinner';
import { Button, Table } from 'common/gui';
import { Work, Cancel, Add, Edit, Delete } from '@material-ui/icons/';
import EmploymentFormContainer from 'containers/modules/hr/employees/forms/employmentFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(25.1)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        maxWidth: '100%',
    },
    containerButtons: {
        maxWidth: '100%',
        paddingLeft: theme.spacing(10),
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(39.8)}px)`,
    },
});

class EmployeeEntitlementsForm extends Component {

    state = {
        tableHead: [
            {
                id: 'name',
                label: constants.EMPLOYEE_ENTITLEMENTS_SYSTEM_NAME,
                type: 'object',
            },
            {
                id: 'username',
                label: constants.EMPLOYEE_ENTITLEMENTS_SYSTEM_USERNAME,
                type: 'object',
            },
            {
                id: 'entitlementFrom',
                label: constants.EMPLOYEE_ENTITLEMENTS_SYSTEM_ENTITLEMENT_FROM,
                type: 'date',
            },
            {
                id: 'entitlementTo',
                label: constants.EMPLOYEE_ENTITLEMENTS_SYSTEM_ENTITLEMENT_TO,
                type: 'date',
            }
        ],
        rows: [],
        selected: null,
        openEntitlementDetails: null,
        opeDetailsAction: null,
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleOpenEntitlementDetails = (event, action) => {
        this.setState({openEntitlementDetails: !this.state.openEntitlementDetails, opeDetailsAction: action});
    };

    handleCloseEntitlementDetails = () => {
            this.setState({openEntitlementDetails: !this.state.openEntitlementDetails, selected: null});
    };

    render(){
        const { classes, action, initialValues, onClose, isLoading } = this.props;
        const { tableHead, rows, selected, openEntitlementDetails, opeDetailsAction } = this.state;
        return(
            <>
                { openEntitlementDetails &&
                    <EmploymentFormContainer
                        initialValues={opeDetailsAction==="add" ? {}: selected[0]}
                        action={opeDetailsAction}
                        open={openEntitlementDetails}
                        onClose={this.handleCloseEntitlementDetails}
                        onSubmit={this.handleSubmitEmployments}
                    />
                }
                <>
                    { isLoading && <Spinner /> }
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <Work className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.EMPLOYEE_ENTITLEMENTS_SYSTEMS}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={0} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={12} >
                                    <Table
                                        className={classes.tableWrapper}
                                        name="entitlements"
                                        headCells={tableHead}
                                        rows={rows}
                                        rowKey="id"
                                        defaultOrderBy="id"
                                        onSelect={this.handleSelect}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <div>
                        <Divider />
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-start"
                            className={classes.container}
                        >
                            <Grid item xs={10}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                    className={classes.containerButtons}
                                >
                                    <Button
                                        label={constants.BUTTON_ADD}
                                        icon=<Add/>
                                        iconAlign="right"
                                        variant="add"
                                        onClick = { (event) => this.handleOpenEntitlementDetails(event, 'add', )}
                                        data-action="add"
                                    />
                                    <Button
                                        label={constants.BUTTON_EDIT}
                                        icon=<Edit/>
                                        iconAlign="right"
                                        disabled={selected === null}
                                        variant="edit"
                                        onClick = { (event) => this.handleOpenEntitlementDetails(event, 'edit', )}
                                        data-action="edit"
                                    />
                                    <Button
                                        label={constants.BUTTON_DELETE}
                                        icon=<Delete/>
                                        iconAlign="right"
                                        disabled={selected === null}
                                        onClick = {this.handleDeleteEntitlement}
                                        variant="delete"
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={2}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-start"
                                    className={classes.container}
                                >
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel />
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={onClose}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </>
            </>
        );
    };
};

export default withStyles(styles)(EmployeeEntitlementsForm);