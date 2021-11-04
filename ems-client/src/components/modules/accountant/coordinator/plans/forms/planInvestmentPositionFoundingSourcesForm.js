import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider, Typography, IconButton, Toolbar } from '@material-ui/core/';
import { Spinner } from 'common/';
import { Button } from 'common/gui';
import { Close, Cancel, Save, AccountBalanceWallet } from '@material-ui/icons/';
import { FormAmountField, FormSelectField } from 'common/form';


const styles = theme => ({
    dialog: {
        height: theme.spacing(50),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    toolbarHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        width: '100%',
    },
});


class PlanInvestmentPositionFoundingSourcesForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };



    componentDidUpdate(prevProps){
        if(this.props.vat !== undefined){
            if (this.props.sourceAmountAwardedGross !== null && this.props.sourceAmountAwardedGross !== prevProps.sourceAmountAwardedGross){
                this.props.dispatch(change('PlanInvestmentPositionFoundingSourcesForm', 'sourceAmountAwardedNet', parseFloat((Math.round((this.props.sourceAmountAwardedGross / this.props.vat.code) * 100) / 100).toFixed(2))));
            }
            if (this.props.sourceExpensesPlanAwardedGross !== null && this.props.sourceExpensesPlanAwardedGross !== prevProps.sourceExpensesPlanAwardedGross){
                this.props.dispatch(change('PlanInvestmentPositionFoundingSourcesForm', 'sourceExpensesPlanAwardedNet', parseFloat((Math.round((this.props.sourceExpensesPlanAwardedGross / this.props.vat.code) * 100) / 100).toFixed(2))));
            }
        }
    }

    render(){

        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, action, planStatus, fundingSources } = this.props;
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
                                                :  constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_EDIT_SOURCES_DETAILS_TITLE + `${initialValues.type.name}`
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
                                <Grid item xs={12}>
                                    <FormSelectField
                                        name="type"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_SOURCES}
                                        options={fundingSources}
                                        disabled={!['WY', 'RO'].includes(planStatus.code) ? true :
                                            action === "edit" ? true : false }
                                        isRequired={true}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Toolbar className={classes.toolbar}>
                                        <AccountBalanceWallet className={classes.toolbarHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_TASK}
                                        </Typography>
                                    </Toolbar>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceAmountNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_TASK_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceAmountGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_TASK_GROSS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceAmountAwardedNet"
                                        label={constants.ACCOUNTANT_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AWARDED_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceAmountAwardedGross"
                                        label={constants.ACCOUNTANT_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AWARDED_GROSS}
                                        isRequired={['WY', 'RO'].includes(planStatus.code)}
                                        disabled={!['WY', 'RO'].includes(planStatus.code)}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <Toolbar className={classes.toolbar}>
                                        <AccountBalanceWallet className={classes.toolbarHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSE}
                                        </Typography>
                                    </Toolbar>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceExpensesPlanNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceExpensesPlanGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceExpensesPlanAwardedNet"
                                        label={constants.ACCOUNTANT_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AWARDED_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceExpensesPlanAwardedGross"
                                        label={constants.ACCOUNTANT_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AWARDED_GROSS}
                                        isRequired={['WY', 'RO'].includes(planStatus.code)}
                                        disabled={!['WY', 'RO'].includes(planStatus.code)}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                spacing={0}
                            >
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                { ['WY', 'RO'].includes(planStatus.code) &&
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save/>
                                        iconAlign="right"
                                        type='submit'
                                        variant="submit"
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

PlanInvestmentPositionFoundingSourcesForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanInvestmentPositionFoundingSourcesForm);