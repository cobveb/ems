import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@material-ui/core/';
import { Spinner } from 'common/';
import { Save, Cancel, Close } from '@material-ui/icons/';
import { FormAmountField, FormSelectField, FormTextField, FormDictionaryField } from 'common/form';
import { Button } from 'common/gui';

const styles = theme => ({
    dialogTitle: {
        paddingBottom: theme.spacing(1),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    container: {
        width: '100%',
        padding: 0,
    },
    section: {
        marginBottom: theme.spacing(1),
    },
})

class InvoicePositionForm extends Component {

    handleClose = (event, reason) =>{
        if(reason && ["backdropClick", "escapeKeyDown"].includes(reason)) return;
        this.props.onClose();
        this.props.reset();
    };

    componentDidUpdate(prevProps){
        const { vat, amountGross, optionValueGross, optionValueNet } = this.props;
        if((vat !== undefined && prevProps.vat !== undefined && vat !== prevProps.vat && amountGross !== undefined && vat.code !== 'R') ||
            (amountGross !== undefined  && vat !== undefined && vat.code !== 'R')){
                this.props.dispatch(change('InvoicePositionForm', 'amountNet', parseFloat((Math.round((amountGross / vat.code) * 100) / 100).toFixed(2))));
        }

        /* Option value change */
        if(vat !== undefined && vat.code !== 'R'){
            if(vat !== prevProps.vat){
                if(optionValueGross !== null){
                    /*
                        VAT change and VAT different that "R" then calculate value base on gross.
                        The gross value is treated as primary.
                    */
                    this.props.dispatch(change('InvoicePositionForm', 'optionValueNet', parseFloat((Math.round((optionValueGross / vat.code) * 100) / 100).toFixed(2))));
                } else if (optionValueNet !== null && optionValueGross === null){
                    /* VAT change and VAT different that "R" then calculate base on net value only if gross is undefined. */
                    this.props.dispatch(change('InvoicePositionForm', 'optionValueGross', parseFloat((Math.round((optionValueNet * vat.code) * 100) / 100).toFixed(2))));
                }
            } else {
                if(optionValueGross !== undefined && !isNaN(optionValueGross) &&
                    ((optionValueGross !== null && optionValueGross.length !== 0 && prevProps.optionValueGross !== null && optionValueGross !== prevProps.optionValueGross) ||
                        (optionValueGross !== null && prevProps.optionValueGross === null))){
                    /* Option Value Gross change and VAT different that "R" then calculate value net */
                    this.props.dispatch(change('InvoicePositionForm', 'optionValueNet', parseFloat((Math.round((optionValueGross / vat.code) * 100) / 100).toFixed(2))));
                } else if((optionValueNet === undefined && prevProps.optionValueNet !== null) ||
                        (optionValueNet !== undefined && optionValueNet !== null && optionValueNet.length === 0 &&
                            prevProps.optionValueNet !== null && optionValueGross !== null)){
                    /* Option value net was cleared. Delete option value gross if exist */
                    this.props.dispatch(change('InvoicePositionForm', 'optionValueGross', null));
                } else if ((optionValueGross === undefined && prevProps.optionValueGross !== null) ||
                        (optionValueGross !== undefined && optionValueGross !== null && optionValueGross.length === 0 &&
                            prevProps.optionValueGross !== null && optionValueNet !== null)){
                    /* Option value gross was cleared and value is empty string. Delete option value */
                    this.props.dispatch(change('InvoicePositionForm', 'optionValueNet', null));
                }
            }
        }
    }

    render(){
        const { classes, handleSubmit, pristine, submitting, invalid, submitSucceeded, isLoading, open, action, planTypes,
            vats, financialPlanPositions, investmentPlanPositions, positionIncludedPlanType, vat, invoice } = this.props;
        return (
            <>
                <Dialog
                    open={open}
                    onClose={(event, reason) => this.handleClose(event, reason)}
                    fullWidth={true}
                    maxWidth="lg"
                >
                    { (submitting || isLoading) && <Spinner /> }
                    <form onSubmit={handleSubmit}>
                        <DialogTitle disableTypography={true} className={classes.dialogTitle}>
                            <Grid
                                container
                                direction="row"
                                spacing={0}
                                className={classes.container}
                            >
                                <Grid item xs={12} >
                                    <Typography variant='h6'>
                                        {action === 'add' ?
                                            constants.COORDINATOR_REALIZATION_INVOICE_POSITION_TITLE_CREATE :
                                                constants.COORDINATOR_REALIZATION_INVOICE_POSITION_TITLE_EDIT
                                        }
                                    </Typography>
                                    <IconButton aria-label="Close"
                                        className={classes.closeButton}
                                        onClick={this.handleClose}
                                    >
                                        <Close fontSize='small'/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                            </Grid>
                        </DialogTitle>
                        <DialogContent className={classes.dialog}>
                            <div className={classes.section}>
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={10}>
                                        <FormTextField
                                            name="name.content"
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_POSITION_NAME}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={2} >
                                        <FormSelectField
                                            isRequired={true}
                                            name="positionIncludedPlanType"
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_COORDINATOR_TYPE}
                                            options={planTypes}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormAmountField
                                            name="amountNet"
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_NET}
                                            isRequired={true}
                                            disabled={vat === undefined || vat.code !== 'R'}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormSelectField
                                            name="vat"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VAT}
                                            options={vats}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormAmountField
                                            name="amountGross"
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_GROSS}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormAmountField
                                            name="optionValueNet"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_OPTION_VALUE_NET}
                                            disabled = {invoice.contract === null || (invoice.contract !== null && invoice.contract.percentOption === null)
                                            || ( vat === undefined || (vat !== undefined && vat.code !== 'R'))}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormAmountField
                                            name="optionValueGross"
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_OPTION_VALUE_GROSS}
                                            disabled={invoice.contract === null || (invoice.contract !== null && invoice.contract.percentOption === null)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormDictionaryField
                                            isRequired={true}
                                            name="coordinatorPlanPosition"
                                            dictionaryName={positionIncludedPlanType !== undefined && positionIncludedPlanType.code === 'FIN' ?
                                                constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_FINANCIAL_PLAN_POSITION :
                                                    constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_INVESTMENT_PLAN_POSITION
                                            }
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_POSITION_COORDINATOR_PLAN_POSITION}
                                            items={positionIncludedPlanType !== undefined && positionIncludedPlanType.code === 'FIN' ?
                                                financialPlanPositions : investmentPlanPositions}
                                            disabled={positionIncludedPlanType === undefined}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormTextField
                                            name="description.content"
                                            label={constants.DESCRIPTION}
                                            multiline
                                            minRows="2"
                                            inputProps={{ maxLength: 230 }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save/>
                                        iconAlign="left"
                                        type='submit'
                                        variant={'submit'}
                                        disabled={pristine || submitting || invalid || submitSucceeded }
                                    />
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel/>
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={this.handleClose}
                                    />
                            </Grid>
                        </DialogActions>
                    </form>
                </Dialog>
            </>
        );
    };
}

InvoicePositionForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(InvoicePositionForm);