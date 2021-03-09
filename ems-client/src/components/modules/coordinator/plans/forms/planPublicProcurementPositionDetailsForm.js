import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Button } from 'common/gui';
import {Spinner } from 'common/';
import { FormTextField, FormSelectField, FormAmountField } from 'common/form';
import { Add, Edit, Cancel, Close } from '@material-ui/icons/';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@material-ui/core/';
import { euroExchangeRateMask } from 'utils/';

const styles = theme => ({
    dialog: {
        maxHeight: `calc(100vh - ${theme.spacing(25)}px)`,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    container: {
        width: '100%',
    },
});


class PlanPublicProcurementContentPosition extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    calculateValuesAmount = (amountRequestedNet, amountRequestedGross, amountNet, amountGross, vat, action) =>{
        this.props.dispatch(change('PlanPublicProcurementPositionDetailsForm', 'amountGross', parseFloat((Math.round((amountNet * vat.code) * 100) / 100).toFixed(2))));
    }

    componentDidUpdate(prevProps){
        const {amountRequestedNet, amountRequestedGross, amountNet, amountGross, vat, estimationType, euroExchangeRate, action } = this.props;

            switch (action){
                case "add" :
                    if(amountNet !== undefined && amountNet !== prevProps.amountNet){
                        this.calculateValuesAmount(amountRequestedNet, amountRequestedGross, amountNet, amountGross, vat, action)
                    }
                    // Mode type UE
                    if(amountNet !== undefined && euroExchangeRate !== null && estimationType !== undefined && estimationType.code === 'UE139'){
                        this.props.dispatch(change('PlanPublicProcurementPositionDetailsForm', 'amountRequestedEuroNet', parseFloat((amountNet / euroExchangeRate).toFixed(2))));
                    }
                    break;
                case "edit":
                    if (amountNet !== prevProps.amountNet && prevProps.amountNet !== undefined){
                        this.calculateValuesAmount(amountRequestedNet, amountRequestedGross, amountNet, amountGross, vat, action)
                    }
                    // Mode type UE
                    if((euroExchangeRate !== null && prevProps.estimationType !== "UE139" && estimationType.code === 'UE139') ||
                       (estimationType.code === 'UE139' && euroExchangeRate !== prevProps.euroExchangeRate))
                    {
                        this.props.dispatch(change('PlanPublicProcurementPositionDetailsForm', 'amountRequestedEuroNet', parseFloat((amountNet / euroExchangeRate).toFixed(2))));
                    }
                    this.props.dispatch(change('PlanPublicProcurementPositionDetailsForm', 'amountRequestedEuroNet', parseFloat((amountNet / euroExchangeRate).toFixed(2))));
                    break;
                default:
                    return null;
            }
            if (prevProps.estimationType !== undefined && prevProps.estimationType.code === 'UE139' && estimationType.code !== 'UE139'){
                this.props.dispatch(change('PlanPublicProcurementPositionDetailsForm', 'amountRequestedEuroNet', null));
            }
    }

    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, action, planStatus, modes, estimationTypes, estimationType } = this.props;
        return(
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="md"
                    disableBackdropClick={true}
                >
                    { submitting && <Spinner /> }
                    <form onSubmit={handleSubmit}>
                        <DialogTitle id="positionDetails-title" disableTypography={true}>
                            <Grid
                                container
                                direction="row"
                                spacing={0}
                                className={classes.container}
                            >
                                <Grid item xs={12} >
                                    <Typography variant='h6'>
                                        { action === "add" ?
                                            constants.COORDINATOR_PLAN_POSITION_FINANCIAL_CREATE_POSITION_DETAILS_TITLE
                                                :  constants.COORDINATOR_PLAN_POSITION_FINANCIAL_EDIT_POSITION_DETAILS_TITLE + `${initialValues.name}`
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
                            <Grid container spacing={1} className={classes.container}>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="name"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT}
                                        isRequired={true}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormSelectField
                                        isRequired={true}
                                        name="mode"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_PROCEDURE_MODE}
                                        value={initialValues.mode !== undefined ? initialValues.mode : ""}
                                        options={modes}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormSelectField
                                        isRequired={true}
                                        name="estimationType"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE}
                                        value={initialValues.estimationType !== undefined ? initialValues.estimationType : ""}
                                        options={estimationTypes}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormAmountField
                                        isRequired={true}
                                        name="amountNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormAmountField
                                        name="amountGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_GROSS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormAmountField
                                        name="amountRealizedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_NET}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountAwarded ? initialValues.amountAwarded : ''}
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormAmountField
                                        name="amountRealizedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountAwarded ? initialValues.amountAwarded : ''}
                                    />
                                </Grid>
                                { (estimationType !== undefined && estimationType.code === 'UE139') &&
                                    <>
                                    <Grid item xs={12} sm={3}>
                                        <FormTextField
                                            isRequired={(estimationType!== undefined && estimationType.code === 'UE139') && true}
                                            name="euroExchangeRate"
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_EURO_EXCHANGE_RATE}
                                            mask={euroExchangeRateMask}
                                        />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <FormAmountField
                                            name="amountRequestedEuroNet"
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_EURO_VALUE_NET}
                                            disabled
                                        />
                                    </Grid>
                                    </>
                                }
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="comments"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_COMMENTS}
                                        multiline
                                        rows="5"
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                            >
                                {planStatus === 'ZP' &&
                                    <Button
                                        label={action ==='add' ? constants.BUTTON_ADD : constants.BUTTON_EDIT}
                                        icon={action === 'add' ? <Add/> : <Edit/>}
                                        iconAlign="right"
                                        type='submit'
                                        variant={action === 'add' ? 'add' : 'edit'}
                                        disabled={pristine || submitting || invalid || submitSucceeded }
                                    />
                                }
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
};

PlanPublicProcurementContentPosition.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanPublicProcurementContentPosition);