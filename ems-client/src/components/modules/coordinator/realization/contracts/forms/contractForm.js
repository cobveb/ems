import React, { Component } from 'react';
import { Spinner, ModalDialog } from 'common/';
import { withStyles, Grid, Typography, Divider, Toolbar } from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import PropTypes from 'prop-types';
import { Button } from 'common/gui';
import { Edit, LibraryBooks, Save, Cancel, Description } from '@material-ui/icons/';
import { FormTableField, FormTextField, FormDateField, FormAmountField, FormDictionaryField } from 'common/form';
import InvoiceContainer from 'containers/modules/coordinator/realization/invoices/invoiceContainer';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        overflow: 'auto',
        maxWidth: '100%',
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
    },
    container: {
        paddingTop: theme.spacing(1),
        maxWidth: '100%',
    },
    actionContainer: {
        paddingLeft: theme.spacing(28),
    },
    section: {
        marginBottom: theme.spacing(0),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(80.5)}px)`,
    },
});

class ContractForm extends Component {
    state = {
        selected: [],
        invoices: [],
        openPositionDetails: false,
        positionAction: '',
        realPercent: null,
        heads: [
            {
                id: 'number',
                label: constants.COORDINATOR_REALIZATION_INVOICE_NUMBER,
                type: 'text',
            },
            {
                id: 'sellDate',
                label: constants.COORDINATOR_REALIZATION_INVOICE_SALE_DATE,
                type:'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'invoiceValueGross',
                label: constants.COORDINATOR_REALIZATION_INVOICE_VALUE_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'contractor.name',
                label: constants.COORDINATOR_REALIZATION_INVOICE_CONTRACTOR,
                type: 'object',
                subtype: 'text'
            },
        ]
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

    handleDeletePosition = (event, action) => {
        this.setState({positionAction: action});
    }

    handleConfirmDelete = () => {
        this.props.onDeleteInvoice(this.state.selected[0].id);
        this.setState({positionAction: null, selected: []});
    }

    handleCloseDialog = () => {
        this.setState({positionAction: null, selected: []});
    }

    handleClosePositionDetails = (invoice) => {
        this.setState({
            openPositionDetails: !this.state.openPositionDetails,
            positionAction: null,
            selected:[],
        });
        this.props.onCloseInvoiceDetails();
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                invoices: this.props.initialValues.invoices,
            });
        }
        if(this.props.initialValues.contractValueGross !== null && this.props.initialValues.realizedValueGross !== null && this.state.realPercent === null && this.state.realPercent === prevState.realPercent){
            this.setState({
                realPercent: ((this.props.initialValues.realizedValueGross / this.props.initialValues.contractValueGross) * 100).toFixed(2),
            });
        }
    }

    render(){
        const { classes, isLoading, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, action, contractors } = this.props;
        const { heads, selected, invoices, openPositionDetails, positionAction, realPercent } = this.state;
        return (
            <>
                {(submitting || isLoading) && <Spinner /> }
                { realPercent > 80 &&
                    <ModalDialog
                        message={constants.COORDINATOR_REALIZATION_CONTRACT_PERCENT_REALIZATION_MSG}
                        variant="warningInfo"
                        onClose={this.handleCloseDialog}
                    />
                }
                {positionAction === 'delete' &&
                    <ModalDialog
                        message={constants.COORDINATOR_REALIZATION_INVOICE_DELETE_POSITION_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                { openPositionDetails ?
                    <InvoiceContainer
                        initialValues={positionAction === 'add' ? {contract: initialValues, contractor: initialValues.contractor} : selected[0]}
                        action={positionAction}
                        applications={this.props.applications}
                        contracts={this.props.contracts}
                        financialPlanPositions={this.props.financialPlanPositions}
                        investmentPlanPositions={this.props.investmentPlanPositions}
                        onClose={this.handleClosePositionDetails}
                    />
                :
                    <form onSubmit={handleSubmit} className={classes.root}>
                        <Typography variant='h6'>
                            { action === "add" ?
                                constants.COORDINATOR_REALIZATION_CONTRACT_TITLE_CREATE
                                    :  constants.COORDINATOR_REALIZATION_CONTRACT_TITLE_EDIT + ` ${initialValues.number}`
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
                                    <Grid item xs={2} >
                                        <FormTextField
                                            name="number"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_NUMBER}
                                            isRequired={true}
                                            inputProps={{ maxLength: 26 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <FormDateField
                                            name="signingDate"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_SIGNED_DATE}
                                            disableFuture
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={4} >
                                        <FormTextField
                                            name="signingPlace"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_SIGNING_PLACE}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <FormDateField
                                            name="periodFrom"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_PERIOD_FROM}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <FormDateField
                                            name="periodTo"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_PERIOD_TO}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <FormTextField
                                            name="contractObject.content"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_OBJECT}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item sm={9}>
                                        <FormDictionaryField
                                            isRequired={true}
                                            name="contractor"
                                            dictionaryName={constants.ACCOUNTANT_SUBMENU_DICTIONARIES_CONTRACTORS}
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_CONTRACTOR}
                                            items={contractors}
                                        />
                                    </Grid>
                                    <Grid item sm={3}>
                                        <FormTextField
                                            name="representative"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_CONTRACTOR_REPRESENTATIVE}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormAmountField
                                            name="contractValueNet"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_VALUE_NET}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormAmountField
                                            name="contractValueGross"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_VALUE_GROSS}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormAmountField
                                            name="realPrevYearsValueNet"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_REALIZED_PREV_YEARS_VALUE_NET}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormAmountField
                                            name="realPrevYearsValueGross"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_REALIZED_PREV_YEARS_VALUE_GROSS}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormAmountField
                                            name="invoicesValueNet"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_INVOICES_VALUE_NET}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormAmountField
                                            name="invoicesValueGross"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_INVOICES_VALUE_GROSS}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormAmountField
                                            name="realizedValueNet"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_REALIZED_VALUE_NET}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormAmountField
                                            name="realizedValueGross"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_REALIZED_VALUE_GROSS}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormAmountField
                                            name="valueToRealizeNet"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_VALUE_TO_REALIZE_NET}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormAmountField
                                            name="valueToRealizeGross"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_VALUE_TO_REALIZE_GROSS}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormTextField
                                            name="changes.content"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_CHANGES}
                                            multiline
                                            rows="1"
                                            inputProps={{ maxLength: 500 }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.section}>
                                <Toolbar className={classes.toolbar}>
                                    <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                    <Typography variant="subtitle1" >
                                        {constants.COORDINATOR_SUBMENU_REALIZATION_INVOICES}
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={0} justify="center" className={classes.container}>
                                    <Grid item xs={12} sm={12} >
                                        <FormTableField
                                            className={classes.tableWrapper}
                                            name="invoices"
                                            head={heads}
                                            allRows={invoices}
                                            checkedRows={selected}
                                            toolbar={true}
                                            addButtonProps={{
                                                disabled : (!pristine || action === 'add' || initialValues.invoicesValueGross >= initialValues.contractValueGross)
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
                                            orderBy="id"
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
                }
            </>
        );
    };
};

ContractForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContractForm);