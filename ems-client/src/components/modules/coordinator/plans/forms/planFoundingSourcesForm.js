import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Button } from 'common/gui';
import { Add, Edit, Cancel, Close } from '@material-ui/icons/';
import { FormAmountField, FormSelectField } from 'common/form';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core/';

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

class PlanFoundingSourcesForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    componentDidUpdate(prevProps){
        if(this.props.vat !== prevProps.vat && prevProps.vat !== undefined){
            this.props.dispatch(change('PlanFoundingSourcesForm', 'amountRequestedGross', parseFloat((Math.round((this.props.amountRequestedNet * this.props.vat.code) * 100) / 100).toFixed(2))));
            this.props.dispatch(change('PlanFoundingSourcesForm', 'expensesPlanGross', parseFloat((Math.round((this.props.expensesPlanNet * this.props.vat.code) * 100) / 100).toFixed(2))));
        } else if (this.props.amountRequestedNet !== prevProps.amountRequestedNet && prevProps.amountRequestedNet !== undefined){
            this.props.dispatch(change('PlanFoundingSourcesForm', 'amountRequestedGross', parseFloat((Math.round((this.props.amountRequestedNet * this.props.vat.code) * 100) / 100).toFixed(2))));
        } else if(this.props.expensesPlanNet !== prevProps.expensesPlanNet && prevProps.expensesPlanNet !== undefined){
            this.props.dispatch(change('PlanFoundingSourcesForm', 'expensesPlanGross', parseFloat((Math.round((this.props.expensesPlanNet * this.props.vat.code) * 100) / 100).toFixed(2))));
        }
    }

    render(){

        const {classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, foundingSources, action, planStatus, positionInfo, vats} = this.props;

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
                                            constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_CREATE_SOURCES_DETAILS_TITLE
                                                :  constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_EDIT_SOURCES_DETAILS_TITLE + `${positionInfo.name} - ${initialValues.foundingSource.name}`
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
                                    <FormSelectField
                                        name="foundingSource"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_SOURCES}
                                        isRequired={true}
                                        value={initialValues.source !== undefined ? initialValues.source : ""}
                                        options={foundingSources}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormAmountField
                                        isRequired={true}
                                        name="amountRequestedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_NET}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <FormSelectField
                                        isRequired={true}
                                        name="vat"
                                        label={constants.COORDINATOR_PLAN_POSITION_VAT}
                                        value={initialValues.vat !== undefined ? initialValues.vat : ""}
                                        options={vats}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormAmountField
                                        name="amountRequestedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        isRequired={true}
                                        name="expensesPlanNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_NET}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="expensesPlanGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS}
                                        disabled
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


PlanFoundingSourcesForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanFoundingSourcesForm);
