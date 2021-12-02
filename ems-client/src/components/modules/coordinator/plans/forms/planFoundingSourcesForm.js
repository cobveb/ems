import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Button, InputField } from 'common/gui';
import { Save, Cancel, Close, AccountBalanceWallet } from '@material-ui/icons/';
import { FormAmountField, FormSelectField } from 'common/form';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Toolbar } from '@material-ui/core/';
import { numberWithSpaces } from 'utils/';

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
    multilineColor:{
        color:'red'
    }
});

class PlanFoundingSourcesForm extends Component {

    state = {
        sourceAmountAgreedGross: 0,
        sourceExpensesPlanAwardedAgreedGross: 0,
    }

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    calculateFreeSourceAmount = (sourceType) =>{
        this.setState(prevState =>{
            let  sourceAmountAgreedGross = prevState.sourceAmountAgreedGross;
            let  sourceExpensesPlanAwardedAgreedGross = prevState.sourceExpensesPlanAwardedAgreedGross;
            const positionSource = this.props.positionFundingSources.filter(source => source.type.code === sourceType.code);
            if(positionSource.length > 0){
                sourceAmountAgreedGross = positionSource[0].sourceAmountAwardedGross;
                sourceExpensesPlanAwardedAgreedGross = positionSource[0].sourceExpensesPlanAwardedGross;
                if(this.props.targetUnits.length > 1) {
                    let sumSourceAwardedGross = 0;
                    let sumSourceExpenseAwardedGross = 0;
                    this.props.targetUnits.forEach(unit =>{
                        const source = unit.fundingSources.filter(source => source.type.code === sourceType.code)
                        if(source.length >0){
                            if(source.sourceAmountAwardedGross !== null && source.sourceExpensesPlanAwardedGross !== null){
                                sumSourceAwardedGross += source[0].sourceAmountAwardedGross;
                                sumSourceExpenseAwardedGross += source[0].sourceExpensesPlanAwardedGross;
                            }
                        }
                    })
                    sourceAmountAgreedGross = parseFloat(sourceAmountAgreedGross - sumSourceAwardedGross).toFixed(2);
                    sourceExpensesPlanAwardedAgreedGross = parseFloat(sourceExpensesPlanAwardedAgreedGross - sumSourceExpenseAwardedGross).toFixed(2);
                } else {
                    const source = this.props.targetUnits[0].fundingSources.filter(source => source.type.code === sourceType.code)
                    console.log(source)
                    console.log(source.sourceAmountAwardedGross)
                    if(source.length >0){
                        if(source.sourceAmountAwardedGross !== null && source.sourceExpensesPlanAwardedGross !== null){
                            sourceAmountAgreedGross -= source[0].sourceAmountAwardedGross;
                            sourceExpensesPlanAwardedAgreedGross -= source[0].sourceExpensesPlanAwardedGross;
                        }
                    }
                }
            }
            return {sourceAmountAgreedGross,  sourceExpensesPlanAwardedAgreedGross}
        });
    }


    componentDidUpdate(prevProps){
        if(this.props.vat !== undefined){
            if(this.props.sourceAmountGross !== prevProps.sourceAmountGross){
                this.props.dispatch(change('PlanFoundingSourcesForm', 'sourceAmountNet', parseFloat((Math.round((this.props.sourceAmountGross / this.props.vat.code) * 100) / 100).toFixed(2))));
            }
            if(this.props.sourceExpensesPlanGross !== prevProps.sourceExpensesPlanGross){
                this.props.dispatch(change('PlanFoundingSourcesForm', 'sourceExpensesPlanNet', parseFloat((Math.round((this.props.sourceExpensesPlanGross / this.props.vat.code) * 100) / 100).toFixed(2))));
            }
            if(this.props.sourceAmountAwardedGross !== prevProps.sourceAmountAwardedGross){
                this.props.dispatch(change('PlanFoundingSourcesForm', 'sourceAmountAwardedNet', parseFloat((Math.round((this.props.sourceAmountAwardedGross / this.props.vat.code) * 100) / 100).toFixed(2))));
            }
            if(this.props.sourceExpensesPlanAwardedGross !== prevProps.sourceExpensesPlanAwardedGross){
                this.props.dispatch(change('PlanFoundingSourcesForm', 'sourceExpensesPlanAwardedNet', parseFloat((Math.round((this.props.sourceExpensesPlanAwardedGross / this.props.vat.code) * 100) / 100).toFixed(2))));
            }
        }

        if(this.props.planStatus === "PK" && this.props.action === "add" && this.props.sourceType !== undefined && this.props.sourceType !== prevProps.sourceType){
            /* Calculate free source amount on agreed mode. New source was added in accountant module */
            this.calculateFreeSourceAmount(this.props.sourceType);
        }
    }

    componentDidMount(){
        if(this.props.planStatus === 'PK' && this.props.initialValues.type !== undefined){
            /* Calculate free source amount on agreed mode. Edit value in exist source */
            this.calculateFreeSourceAmount(this.props.initialValues.type);
        }
    }

    render(){
        const {classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, foundingSources, action, planStatus, positionName} = this.props;
        const { sourceAmountAgreedGross, sourceExpensesPlanAwardedAgreedGross } = this.state;
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
                                                :  constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_EDIT_SOURCES_DETAILS_TITLE + `${positionName} - ${initialValues.type.name}`
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
                                    { !['ZP', 'PK'].includes(planStatus) ?
                                        <InputField
                                            name="type"
                                            label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_SOURCES}
                                            value={initialValues.type !== undefined ? initialValues.type.name : ''}
                                            disabled
                                        />
                                    :
                                        <FormSelectField
                                            name="type"
                                            label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_SOURCES}
                                            isRequired={true}
                                            disabled = {planStatus === 'PK' && action === 'edit'}
                                            options={foundingSources}
                                        />
                                    }
                                </Grid>
                                <Grid item xs={12} >
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
                                        disabled={planStatus!=='ZP' && true}
                                        isRequired={planStatus!=='ZP' ? false : true}
                                    />
                                </Grid>
                                {planStatus === 'PK' &&
                                    <Grid item xs={12}>
                                        <InputField
                                            name="sourceAmountAgreedGross"
                                            label={constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AGREED_GROSS}
                                            value={numberWithSpaces(sourceAmountAgreedGross)}
                                            isError={sourceAmountAgreedGross < 0 ? true : false}
                                            isSuccess={sourceAmountAgreedGross > 0 ? true : false}
                                            postfix={"zł."}
                                            disabled
                                        />
                                    </Grid>
                                }
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceAmountAwardedNet"
                                        label={constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AWARDED_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceAmountAwardedGross"
                                        label={constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AWARDED_GROSS}
                                        isRequired={planStatus === 'PK' && true}
                                        disabled={planStatus !=='PK' && true}
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
                                        disabled={planStatus!=='ZP' && true}
                                        isRequired={planStatus!=='ZP' ? false : true}
                                    />
                                </Grid>
                                {planStatus === 'PK' &&
                                    <Grid item xs={12}>
                                        <InputField
                                            name="sourceExpensesPlanAwardedAgreedGross"
                                            label={constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AGREED_GROSS}
                                            value={numberWithSpaces(sourceExpensesPlanAwardedAgreedGross)}
                                            isError={sourceExpensesPlanAwardedAgreedGross < 0 ? true : false}
                                            isSuccess={sourceExpensesPlanAwardedAgreedGross > 0 ? true : false}
                                            postfix={"zł."}
                                            disabled
                                        />
                                    </Grid>
                                }
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceExpensesPlanAwardedNet"
                                        label={constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AWARDED_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="sourceExpensesPlanAwardedGross"
                                        label={constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AWARDED_GROSS}
                                        disabled={planStatus !=='PK' && true}
                                        isRequired={planStatus === 'PK' && true}
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
                                {  ['ZP', 'PK'].includes(planStatus) &&
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


PlanFoundingSourcesForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanFoundingSourcesForm);
