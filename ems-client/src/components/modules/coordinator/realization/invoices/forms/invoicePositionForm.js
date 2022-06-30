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

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    componentDidUpdate(prevProps){
        const { vat, amountGross } = this.props;

        if((vat !== undefined && prevProps.vat !== undefined && vat !== prevProps.vat && amountGross !== undefined && vat.code !== 'R') ||
            (amountGross !== undefined && prevProps.amountGross !== undefined && amountGross !== prevProps.amountGross && vat !== undefined && vat.code !== 'R')){
                this.props.dispatch(change('InvoicePositionForm', 'amountNet', parseFloat((Math.round((amountGross / vat.code) * 100) / 100).toFixed(2))));
        }
    }

    render(){
        const { classes, handleSubmit, pristine, submitting, invalid, submitSucceeded, isLoading, open, action, planTypes,
            vats, financialPlanPositions, investmentPlanPositions, positionIncludedPlanType, vat } = this.props;
        return (
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="lg"
                    disableBackdropClick={true}
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
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            name="amountNet"
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_NET}
                                            isRequired={true}
                                            disabled={vat === undefined}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormSelectField
                                            name="vat"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VAT}
                                            options={vats}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            name="amountGross"
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_GROSS}
                                            isRequired={true}
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
                                            rows="2"
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