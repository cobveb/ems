import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Button } from 'common/gui';
import {Spinner, ModalDialog } from 'common/';
import { FormTextField, FormAmountField } from 'common/form';
import { Save, Cancel, Close } from '@material-ui/icons/';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@material-ui/core/';

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

    calculateValuesAmount = (amountRequestedNet, amountRequestedGross, amountNet, amountGross, vat, action) =>{
        this.props.dispatch(change('PlanPublicProcurementPositionDetailsForm', 'amountGross', parseFloat((Math.round((amountNet * vat.code) * 100) / 100).toFixed(2))));
    }

    handleCancelClose = () => {
        this.setState({formChanged: false});
    }

    handleConfirmClose = () => {
        this.setState({formChanged: false});
        this.props.onClose();
        this.props.reset();
    }

    componentDidUpdate(prevProps){
        const {amountRequestedNet, amountRequestedGross, amountNet, amountGross, vat, action } = this.props;
        switch (action){
            case "add" :
                if(amountNet !== undefined && amountNet !== prevProps.amountNet){
                    this.calculateValuesAmount(amountRequestedNet, amountRequestedGross, amountNet, amountGross, vat, action)
                }
                break;
            case "edit":
                if (amountNet !== prevProps.amountNet && prevProps.amountNet !== undefined){
                    this.calculateValuesAmount(amountRequestedNet, amountRequestedGross, amountNet, amountGross, vat, action)
                }
                break;
            default:
                return null;
        }
    }

    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, action, planStatus } = this.props;
        const {formChanged} = this.state;
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
                                        { action === "add" ?
                                            constants.COORDINATOR_PLAN_POSITION_FINANCIAL_CREATE_POSITION_DETAILS_TITLE
                                                :  (action === "edit" ? constants.COORDINATOR_PLAN_POSITION_FINANCIAL_EDIT_POSITION_DETAILS_TITLE
                                                    : constants.COORDINATOR_PLAN_POSITION_FINANCIAL_PREVIEW_POSITION_DETAILS_TITLE) + `${initialValues.name}`
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
                                        inputProps={{ maxLength: 200 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        isRequired={true}
                                        name="amountNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="amountGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_GROSS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="comments"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_COMMENTS}
                                        multiline
                                        rows="5"
                                        disabled={planStatus!=='ZP' && true}
                                        inputProps={{ maxLength: 500 }}
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
                                        label={constants.BUTTON_SAVE}
                                        icon={<Save/>}
                                        iconAlign="left"
                                        type='submit'
                                        variant={'submit'}
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