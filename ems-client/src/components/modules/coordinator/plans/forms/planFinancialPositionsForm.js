import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Spinner } from 'common/';
import { InputField, Button } from 'common/gui';
import { FormTextField, FormDictionaryField, FormDigitsField, FormAmountField } from 'common/form';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography} from '@material-ui/core/';
import { Add, Edit, Cancel, Close } from '@material-ui/icons/';


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

class PlanFinancialContentPosition extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    calculateValuesAmount = (quantity, unitPrice, vat) =>{

        this.props.dispatch(change('PlanFinancialPositionsForm', 'amountNet', parseFloat((quantity * unitPrice).toFixed(2))));
        this.props.dispatch(change('PlanFinancialPositionsForm', 'amountGross', parseFloat((Math.round((((quantity * unitPrice)) * vat.code) * 100) / 100).toFixed(2))));
    }

    componentDidUpdate(prevProps){
        const { quantity, unitPrice, vat, action} = this.props;
        if(vat !== undefined){
            switch(action){
                case 'add':
                    if((unitPrice !== undefined && unitPrice !== prevProps.unitPrice) ||
                    ((quantity !== prevProps.quantity && prevProps.quantity !== undefined))){
                        this.calculateValuesAmount(quantity, unitPrice, vat);
                    }
                    break;
                case 'edit':
                    if (unitPrice !== prevProps.unitPrice || (quantity !== prevProps.quantity && prevProps.quantity !== undefined)){
                        this.calculateValuesAmount(quantity, unitPrice, vat);
                    }
                    break;
                default:
                    return null;
            }
        }
    }

    render(){
        const {classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, action, planStatus, units} = this.props;

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
                            <Grid container spacing={1}>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="name"
                                        label={constants.APPLICATION_POSITION_DETAILS_POSITION_NAME}
                                        isRequired={true}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={4} >
                                    <FormDigitsField
                                        name="quantity"
                                        label={constants.APPLICATION_POSITION_DETAILS_QUANTITY}
                                        isRequired={true}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormDictionaryField
                                        isRequired={true}
                                        name="unit"
                                        dictionaryName='Jednostki miary'
                                        label={constants.APPLICATION_POSITION_DETAILS_UNIT}
                                        disabled={planStatus!=='ZP' && true}
                                        items={units}
                                    />
                                </Grid>
                                <Grid item xs={4} >
                                    <FormAmountField
                                        isRequired={true}
                                        name="unitPrice"
                                        label={constants.COORDINATOR_PLAN_POSITION_FINANCIAL_UNIT_PRICE}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormAmountField
                                        name="amountNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_FINANCIAL_AMOUNT_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormAmountField
                                        name="amountGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_FINANCIAL_AMOUNT_GROSS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormAmountField
                                        name="amountCorrectedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_NET}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountCorrectedNet ? initialValues.amountCorrectedNet : ''}
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormAmountField
                                        name="amountCorrectedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountCorrectedGross ? initialValues.amountCorrectedGross : ''}
                                    />
                                </Grid>
                                <Grid item xs={6} >
                                    <InputField
                                        name="amountRealizedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_NET}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountRealizedNet ? initialValues.amountRealizedNet : ''}
                                    />
                                </Grid>
                                <Grid item xs={6} >
                                    <InputField
                                        name="amountRealizedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountRealizedGross ? initialValues.amountRealizedGross : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="description"
                                        label={constants.COORDINATOR_PLAN_POSITION_FINANCIAL_DESCRIPTION}
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
                                spacing={0}
                            >
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                                { planStatus === 'ZP' &&
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

PlanFinancialContentPosition.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanFinancialContentPosition);
