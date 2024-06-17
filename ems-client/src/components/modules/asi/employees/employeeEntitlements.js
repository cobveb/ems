import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { ModalDialog, Spinner } from 'common/';
import { Button, Table } from 'common/gui';
import { Work, Cancel, Add, Edit, Delete } from '@material-ui/icons/';
import EntitlementFormContainer from 'containers/modules/asi/employees/forms/entitlementFormContainer';

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

class EmployeeEntitlements extends Component {

    state = {
        tableHead: [
            {
                id: 'entitlementSystem.name',
                label: constants.EMPLOYEE_ENTITLEMENT_SYSTEM_NAME,
                type: 'object',
            },
            {
                id: 'username',
                label: constants.EMPLOYEE_ENTITLEMENT_SYSTEM_USERNAME,
            },
            {
                id: 'dateFrom',
                label: constants.EMPLOYEE_ENTITLEMENT_FROM,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'dateTo',
                label: constants.EMPLOYEE_ENTITLEMENT_TO,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            }
        ],
        rows: [],
        selected: null,
        openEntitlementDetails: false,
        openDetailsAction: null,
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) => {
        this.setState({
            selected: row,
            openEntitlementDetails: !this.state.openEntitlementDetails,
            openDetailsAction: 'edit',
        });
        this.props.getEntitlementDetails("edit", row);
    }

    handleOpenEntitlementDetails = (event, action) => {
        this.setState({openEntitlementDetails: !this.state.openEntitlementDetails, openDetailsAction: action});
    };

    handleCloseEntitlementDetails = () => {
        this.setState({openEntitlementDetails: !this.state.openEntitlementDetails, selected: null});
    };

    handleDeleteEntitlement = () =>{
        this.setState(state => ({ openDetailsAction: "delete"}));
    }

    handleConfirmDelete = () => {
        this.props.onDeleteEntitlement(this.state.selected);
        this.setState({
            openDetailsAction: null,
            selected: null,
        });
    }

    handleCloseDialog = () =>{
        if(this.props.error !== null){
            this.props.clearError(null);
        }
        this.setState(state => ({
                openDetailsAction: null,
            })
        );
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState(prevState => {
                let rows = [...prevState.rows];
                rows = this.props.initialValues;
                return {rows}
            });
        }
        if(this.props.entitlement !== null && this.props.entitlement !== prevProps.entitlement){
            /* If submit entitlement on add action */
            this.setState(prevState => {
                let selected = {...prevState.selected};
                let openDetailsAction = prevState.openDetailsAction;
                selected = this.props.entitlement;
                openDetailsAction = 'edit';
                return {selected, openDetailsAction}
            });
        } else if(this.state.selected && this.props.entitlement === null ){
            /* If submit entitlement on edit action */
            const idx = this.props.initialValues.findIndex(entitlement => entitlement.id === this.state.selected.id);

            if(idx !== null && this.state.selected !== this.props.initialValues[idx]){
                this.setState(prevState => {
                    let selected = {...prevState.selected};
                    selected = this.props.initialValues[idx];
                    return {selected}
                });
            }
        }
    }


    render(){
        const { classes, onClose, isLoading, error } = this.props;
        const { tableHead, rows, selected, openEntitlementDetails, openDetailsAction } = this.state;
        return(
            <>
                {openDetailsAction === "delete" &&
                    <ModalDialog
                        message={constants.EMPLOYEE_ENTITLEMENTS_DELETE_MSG}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                { openEntitlementDetails ?
                    <EntitlementFormContainer
                        initialValues={openDetailsAction==="add" ? {} : selected}
                        action={openDetailsAction}
                        open={openEntitlementDetails}
                        employments={this.props.employments}
                        systems={this.props.systems}
                        systemPermissions={this.props.systemPermissions}
                        organizationUnits={this.props.organizationUnits}
                        getSystemPermissions={this.props.getSystemPermissions}
                        getOrganizationUnits={this.props.getOrganizationUnits}
                        onClose={this.handleCloseEntitlementDetails}
                        onSubmit={(values) => this.props.onSubmitEntitlement(values, openDetailsAction)}
                        onSubmitEntitlementPermission={this.props.onSubmitEntitlementPermission}
                        onDeleteEntitlementPermission={this.props.onDeleteEntitlementPermission}
                    />
                :
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
                                            onDoubleClick={this.handleDoubleClick}
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
                }
            </>
        );
    };
};

export default withStyles(styles)(EmployeeEntitlements);