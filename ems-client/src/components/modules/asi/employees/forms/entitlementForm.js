import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar } from '@material-ui/core';
import { Save, Cancel, Work, Edit, List } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormDateField, FormTextField, FormTableField, FormDictionaryField } from 'common/form';
import { ModalDialog, Spinner} from 'common/';
import EntitlementGroupFormContainer from 'containers/modules/asi/employees/forms/entitlementGroupFormContainer';
const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(25.1)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    container: {
        maxWidth: '100%',
    },
    active: {
        maxWidth: '100%',
        paddingRight: theme.spacing(2),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    tableWrapper: {
        overflow: 'auto',
        height: theme.spacing(30),
    },
    containerButtons: {
        maxWidth: '100%',
        paddingLeft: theme.spacing(20),
    },
});

class EntitlementForm extends Component {
    state = {
        selected: null,
        openDetails: false,
        detailsAction: null,
        formChanged: false,
        tableHead: [
            {
                id: 'entitlementSystemPermission.name',
                label: constants.EMPLOYEE_ENTITLEMENT_GROUP_NAME,
                type: 'object',
            },
        ],
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) => {
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let openDetails = prevState.openDetails;
            let detailsAction = prevState.detailsAction;
            selected[0] = row;
            openDetails = !this.state.openDetails;
            detailsAction = 'edit'
            return {selected, openDetails, detailsAction}
        });
        this.props.getOrganizationUnits();
    }

    handleClose = () =>{
        if(this.props.pristine === false){
            this.setState({formChanged: true});
        } else {
            this.props.onClose();
            this.props.reset();
        }
    };

    handleOpenDetails = (event, action) => {
        this.props.getOrganizationUnits();
        this.setState({openDetails: !this.state.openDetails, detailsAction: action});
    }

    handleCloseDetails = () => {
        this.setState({openDetails: !this.state.openDetails, detailsAction: null, selected: []});
    };

    handleSubmit = (values, type) =>{
        this.props.onSubmitEntitlementPermission(this.props.initialValues, values, this.state.detailsAction);
        this.handleCloseDetails();
    }

    handleDeleteGroup = () => {
        this.setState({ detailsAction: "delete"});
    }

    handleConfirmDelete = () =>{
        this.props.onDeleteEntitlementPermission(this.props.initialValues, this.state.selected[0])
        this.setState({ detailsAction: null, selected: null,});
    }

    handleCancelDelete = () =>{
        this.setState({ detailsAction: null, selected: null,});
    }

    componentDidUpdate(prevProps){
        if(this.props.entitlementSystem !== null && this.props.entitlementSystem !== prevProps.entitlementSystem){
            if(this.props.entitlementSystem.code !== "err"){
                this.props.getSystemPermissions(this.props.entitlementSystem);
            }
        }
    }

    render(){
        const {classes, initialValues, handleSubmit, pristine, invalid, submitting, submitSucceeded, action, systems, } = this.props;
        const {tableHead, selected, openDetails, detailsAction, formChanged} = this.state;

        return(
            <>
                {formChanged === true &&
                    <ModalDialog
                        message={constants.MODAL_DIALOG_FORM_CHANGE_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmClose}
                        onClose={this.handleCancelClose}
                    />
                }
                { detailsAction === "delete" &&
                    <ModalDialog
                        message={constants.EMPLOYEE_ENTITLEMENT_CONFIRM_DELETE_PERMISSION_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDelete}
                    />
                }
                { openDetails &&
                    <EntitlementGroupFormContainer
                        initialValues={detailsAction==="add" ? {}: selected[0]}
                        action={detailsAction}
                        open={openDetails}
                        groups={this.props.systemPermissions}
                        organizationUnits={this.props.organizationUnits}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmit}
                    />
                }
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <Work className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.EMPLOYEE_BASIC_INFORMATION}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12}>
                                    <FormDictionaryField
                                        name="employment"
                                        dictionaryName={constants.EMPLOYEE_EMPLOYMENTS}
                                        label={constants.EMPLOYEE_EMPLOYMENTS}
                                        items={this.props.employments}
                                        isRequired={true}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormDictionaryField
                                        name="entitlementSystem"
                                        dictionaryName={constants.EMPLOYEE_ENTITLEMENT_SYSTEM_NAME}
                                        label={constants.EMPLOYEE_ENTITLEMENT_SYSTEM_NAME}
                                        items={systems}
                                        isRequired={true}
                                        disabled={action === "edit" && initialValues.permissions !== undefined && initialValues.permissions.length > 0 ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={6} >
                                    <FormTextField
                                        name="username"
                                        label={constants.EMPLOYEE_ENTITLEMENT_SYSTEM_USERNAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 50 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormDateField
                                        name="dateFrom"
                                        label={constants.EMPLOYEE_ENTITLEMENT_FROM}
                                        isRequired={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormDateField
                                        name="dateTo"
                                        label={constants.EMPLOYEE_ENTITLEMENT_TO}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormDateField
                                        name="dateWithdrawal"
                                        label={constants.EMPLOYEE_ENTITLEMENT_REVOKE_DATE}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} >
                                    <Toolbar className={classes.toolbar}>
                                        <List className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.EMPLOYEE_ENTITLEMENT_PERMISSION_GROUPS}
                                        </Typography>
                                    </Toolbar>
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="permissions"
                                        head={tableHead}
                                        allRows={initialValues.permissions !== undefined ? initialValues.permissions : []}
                                        checkedRows={selected ? selected : []}
                                        toolbar={true}
                                        orderBy="id"
                                        addButtonProps={{
                                            disabled : (!pristine || action === 'add')
                                        }}
                                        editButtonProps={{
                                            label :constants.BUTTON_EDIT,
                                            icon : <Edit/>,
                                            variant: "edit",
                                        }}
                                        onAdd={(event) => this.handleOpenDetails(event, "add")}
                                        onEdit={(event) => this.handleOpenDetails(event, 'edit')}
                                        onDelete={this.handleDeleteGroup}
                                        multiChecked={false}
                                        checkedColumnFirst={true}
                                        onSelect={this.handleSelect}
                                        onDoubleClick={this.handleDoubleClick}
                                        onExcelExport={this.handleExcelExport}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="comments.content"
                                        label={constants.COMMENTS}
                                        multiline
                                        rows="2"
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormTextField
                                        name="createdAtStr"
                                        label={constants.EMPLOYEE_ENTITLEMENT_CREATED_AT}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormTextField
                                        name="createdByStr"
                                        label={constants.EMPLOYEE_ENTITLEMENT_CREATED_BY}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormTextField
                                        name="updatedAtStr"
                                        label={constants.EMPLOYEE_ENTITLEMENT_UPDATED_AT}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormTextField
                                        name="updatedByStr"
                                        label={constants.EMPLOYEE_ENTITLEMENT_UPDATED_BY}
                                        disabled
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
                            justify="center"
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
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save />
                                        iconAlign="left"
                                        type='submit'
                                        variant="submit"
                                        disabled={pristine || submitting || invalid || submitSucceeded }
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
                                        onClick={this.handleClose}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </form>
            </>
        )
    }
}

EntitlementForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    employments: PropTypes.array.isRequired,
    systems: PropTypes.array.isRequired,
    systemPermissions: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(EntitlementForm);