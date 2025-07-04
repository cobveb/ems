import React, { Component } from 'react';
import {Spinner, ModalDialog } from 'common/';
import { withStyles, Grid, Typography, Divider, Toolbar } from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import PropTypes from 'prop-types';
import { FormTextField, FormDateField, FormDictionaryField, FormPageableDictionaryField, FormAmountField, FormTableField } from 'common/form';
import { Edit, LibraryBooks, Save, Cancel, Description } from '@material-ui/icons/';
import { Button } from 'common/gui';
import InvoicePositionFormContainer from 'containers/modules/coordinator/realization/invoices/forms/invoicePositionFormContainer';

const styles = theme => ({
    content: {
        overflow: 'auto',
        maxWidth: '100%',
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
    },
    container: {
        paddingTop: theme.spacing(1),
        maxWidth: '100%',
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(67)}px)`,
    },
    actionContainer: {
        paddingLeft: theme.spacing(28),
    },
    root: {
        flexGrow: 1,
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    section: {
        marginBottom: theme.spacing(0),
    },
});

class InvoiceForm extends Component {
    state = {
        selected: [],
        invoicePositions: [],
        openPositionDetails: false,
        positionAction: '',
        heads: [
            {
                id: 'name.content',
                label: constants.COORDINATOR_REALIZATION_INVOICE_POSITION_NAME,
                type: 'object',
            },
            {
                id: 'amountNet',
                label: constants.COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountGross',
                label: constants.COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'optionValueNet',
                label: constants.COORDINATOR_REALIZATION_CONTRACT_OPTION_VALUE_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'optionValueGross',
                label: constants.COORDINATOR_REALIZATION_CONTRACT_OPTION_VALUE_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
    }

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) =>{
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let openPositionDetails = {...prevState.openPositionDetails};
            let positionAction = {...prevState.positionAction};
            selected[0] = row;
            openPositionDetails =  !this.state.openPositionDetails;
            positionAction = 'edit';
            return {selected, openPositionDetails, positionAction}
        });
    }

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    };

    handleClosePositionDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: [], positionAction: null});
    };

    handleSubmitPosition = (values) => {
        this.props.onSubmitPosition(values, this.state.positionAction);
        this.handleClosePositionDetails();
    }

    handleDeletePosition = (event, action) => {
        this.setState({positionAction: action});
    }

    handleConfirmDelete = () => {
        this.props.onDeletePosition(this.state.selected[0]);
    }

    handleCloseDialog = () => {
        this.setState({action: null});
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                invoicePositions: this.props.initialValues.invoicePositions,
            });
        }
    }

    render(){
        const { classes, isLoading, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, action, contractors, applications, contracts } = this.props;
        const { heads, selected, invoicePositions, openPositionDetails, positionAction } = this.state;
        return (
            <>
                {(isLoading) && <Spinner /> }
                {positionAction === 'delete' &&
                    <ModalDialog
                        message={constants.COORDINATOR_REALIZATION_INVOICE_DELETE_POSITION_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                {openPositionDetails &&
                    <InvoicePositionFormContainer
                        initialValues={positionAction === 'add' ? {} : selected[0]}
                        invoice={initialValues}
                        open={openPositionDetails}
                        isLoading={isLoading}
                        action={positionAction}
                        planTypes={this.props.planTypes}
                        financialPlanPositions={this.props.financialPlanPositions}
                        investmentPlanPositions={this.props.investmentPlanPositions}
                        vats={this.props.vats}
                        onClose={this.handleClosePositionDetails}
                        onSubmit={this.handleSubmitPosition}
                    />
                }
                <form onSubmit={handleSubmit} className={classes.root}>
                    <Typography variant='h6'>
                        { action === "add" ?
                            constants.COORDINATOR_REALIZATION_INVOICE_TITLE_CREATE
                                :  constants.COORDINATOR_REALIZATION_INVOICE_TITLE_EDIT + ` ${initialValues !== undefined ? initialValues.number : ""}`
                        }
                    </Typography>
                    <Divider/>
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <Description className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.HEADING}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} className={classes.container}>
                                <Grid item xs={3} >
                                    <FormTextField
                                        name="number"
                                        label={constants.COORDINATOR_REALIZATION_INVOICE_NUMBER}
                                        isRequired={true}
                                        inputProps={{ maxLength: 26 }}
                                    />
                                </Grid>
                                <Grid item sm={2}>
                                    <FormDateField
                                        name="sellDate"
                                        label={constants.COORDINATOR_REALIZATION_INVOICE_SALE_DATE}
                                        isRequired={true}
                                    />
                                </Grid>
                                <Grid item sm={7}>
                                    <FormDictionaryField
                                        isRequired={true}
                                        name="contractor"
                                        dictionaryName={constants.ACCOUNTANT_SUBMENU_DICTIONARIES_CONTRACTORS}
                                        label={constants.COORDINATOR_REALIZATION_INVOICE_CONTRACTOR}
                                        items={contractors}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormPageableDictionaryField
                                        name="publicProcurementApplication"
                                        dictionaryName={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_TITLE}
                                        label={constants.COORDINATOR_REALIZATION_INVOICE_PUBLIC_PROCUREMENT_APPLICATION}
                                        onChangeDictionarySearchConditions={this.props.onChangeDictionarySearchConditions}
                                        onSetDictionaryName={this.props.onSetDictionaryName}
                                        isLoading={isLoading}
                                        items={applications}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormPageableDictionaryField
                                        name="contract"
                                        dictionaryName={constants.COORDINATOR_REALIZATION_INVOICE_CONTRACT}
                                        label={constants.COORDINATOR_REALIZATION_INVOICE_CONTRACT}
                                        onChangeDictionarySearchConditions={this.props.onChangeDictionarySearchConditions}
                                        onSetDictionaryName={this.props.onSetDictionaryName}
                                        isLoading={isLoading}
                                        items={contracts}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="description.content"
                                        label={constants.DESCRIPTION}
                                        multiline
                                        minRows="2"
                                        inputProps={{ maxLength: 500 }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormAmountField
                                        name="invoiceValueNet"
                                        label={constants.COORDINATOR_REALIZATION_INVOICE_VALUE_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormAmountField
                                        name="invoiceValueGross"
                                        label={constants.COORDINATOR_REALIZATION_INVOICE_VALUE_GROSS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormAmountField
                                        name="optionValueNet"
                                        label={constants.COORDINATOR_REALIZATION_CONTRACT_OPTION_VALUE_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormAmountField
                                        name="optionValueGross"
                                        label={constants.COORDINATOR_REALIZATION_CONTRACT_OPTION_VALUE_GROSS}
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div>
                            <Toolbar className={classes.toolbar}>
                                <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.POSITIONS}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={0} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={12} >
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="invoicePositions"
                                        head={heads}
                                        allRows={invoicePositions}
                                        checkedRows={selected}
                                        toolbar={true}
                                        addButtonProps={{
                                            disabled : (!pristine || action === 'add')
                                        }}
                                        editButtonProps={{
                                            label: constants.BUTTON_EDIT,
                                            icon: <Edit/>,
                                            variant: "edit" ,
                                            disabled: selected.length === 0
                                        }}
                                        deleteButtonProps={{ disabled: selected.length === 0 }}
                                        onAdd={(event) => this.handleOpenPositionDetails(event, "add")}
                                        onEdit={(event) => this.handleOpenPositionDetails(event, 'edit')}
                                        onDelete={(event) => this.handleDeletePosition(event, 'delete')}
                                        multiChecked={false}
                                        checkedColumnFirst={true}
                                        onSelect={this.handleSelect}
                                        onDoubleClick={this.handleDoubleClick}
                                        onExcelExport={this.handleExcelExport}
                                        defaultOrderBy="id"
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
                        >
                            <Grid item xs={10}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                    className={classes.actionContainer}
                                >
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save/>
                                        iconAlign="left"
                                        type='submit'
                                        variant="submit"
                                        disabled={pristine || submitting || invalid || submitSucceeded}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={2}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="center"
                                >
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel/>
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
        );
    };
};

InvoiceForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InvoiceForm);