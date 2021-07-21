import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@material-ui/core/';
import { Save, Cancel, Close } from '@material-ui/icons/';
import { FormAmountField } from 'common/form';
import { Button, InputField } from 'common/gui';

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

class PlanCorrectionPositionForm extends Component {
    state = {
        formChanged : false,
    }

    handleClose = () =>{
        if(this.props.pristine === false){
            this.setState({formChanged: !this.state.formChanged});
        } else {
            this.props.onClose();
            this.props.reset();
        }
    };

    handleCancelClose = () => {
        this.setState({formChanged: false});
    }

    calculateValuesAmount = (amountAwardedGross, vat) =>{
        this.props.dispatch(change('PlanCorrectionPositionForm', 'amountAwardedNet', parseFloat((amountAwardedGross / vat).toFixed(2))));
    }

    handleConfirmClose = () => {
        this.setState({formChanged: false});
        this.props.onClose();
        this.props.reset();
    }

    componentDidUpdate(prevProps){
        const { amountAwardedGross, initialValues } = this.props;
        if (amountAwardedGross !== prevProps.amountAwardedGross){
            this.calculateValuesAmount(amountAwardedGross, initialValues.vat.code);
        }
    }

    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues } = this.props;
        const { formChanged } = this.state;
        console.log(initialValues)
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
                {formChanged === true &&
                    <ModalDialog
                        message={constants.MODAL_DIALOG_FORM_CHANGE_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmClose}
                        onClose={this.handleCancelClose}
                    />
                }
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
                                    {constants.ACCOUNTANT_PLAN_COORDINATOR_CORRECTION_POSITIONS_TITLE + `${initialValues.costType.name}`}
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
                            <Grid item xs={6}>
                                <FormAmountField
                                    isRequired={true}
                                    name="amountRequestedNet"
                                    label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormAmountField
                                    isRequired={true}
                                    name="amountRequestedGross"
                                    label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REQUESTED_GROSS}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <FormAmountField
                                    isRequired={true}
                                    name="amountAwardedNet"
                                    label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <InputField
                                    isRequired={true}
                                    name="vat"
                                    label={constants.VAT}
                                    value={initialValues.vat.name}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <FormAmountField
                                    isRequired={true}
                                    name="amountAwardedGross"
                                    label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_AWARDED_GROSS}
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
                            <Grid item xs={12} >
                                <Divider />
                            </Grid>
                            <Button
                                label={constants.BUTTON_SAVE}
                                icon={<Save/>}
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
};

PlanCorrectionPositionForm.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanCorrectionPositionForm);