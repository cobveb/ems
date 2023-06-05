import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import { Spinner, ModalDialog }  from 'common';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Toolbar } from '@material-ui/core/';
import { Close, Save, Cancel, Description } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormTextField, FormAmountField, FormSelectField, FormDictionaryField, FormCheckBox, FormDigitsField } from 'common/form';

const styles = theme => ({
    dialogTitle: {
        paddingBottom: theme.spacing(1),
    },
    dialog: {
        height: `calc(100vh - ${theme.spacing(51)}px)`,
        maxHeight: `calc(100vh - ${theme.spacing(25)}px)`,
        overflow: 'auto',
        width: '100%',
        paddingTop: theme.spacing(0.7),
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingBottom:0,
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
    section: {
        marginBottom: theme.spacing(1),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    tableWrapper: {
        overflow: 'auto',
        height: theme.spacing(15),
    },
});

class ApplicationPartForm extends Component {
    state = {isNotRealized: false}

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    handleSubmitPartRealized = () => {
        if(this.props.formCurrentValues.reasonNotRealized !== null){
            console.log(this.props.formCurrentValues.reasonNotRealized)
            this.setState({isNotRealized: !this.state.isNotRealized});
        } else {
            this.props.onSubmit(this.props.formCurrentValues)
        }
    }
    handleConfirmDialog = () => {
        this.props.onSubmit(this.props.formCurrentValues)
    }

    handleCloseDialog = () => {
        this.setState({isNotRealized: !this.state.isNotRealized});
    }

    componentDidUpdate(prevProps){
        const {groupVat, amountNet, amountGross, vat, assortmentGroups, applicationProcurementPlanPosition, amountContractAwardedNet, isRealized, action, optionValue} = this.props;
        if(groupVat !== undefined && vat === undefined){
             this.props.dispatch(change('ApplicationPartForm', "vat", groupVat))
        }
        if((vat !== prevProps.vat && vat !== undefined && amountNet !== undefined ) || (amountNet !== undefined && amountNet !== prevProps.amountNet && vat !== undefined) ){
            this.props.dispatch(change('ApplicationPartForm', 'amountGross', parseFloat((Math.round((amountNet * vat.code) * 100) / 100).toFixed(2))));
        }
        if(action === 'add' && applicationProcurementPlanPosition === undefined && assortmentGroups.length === 1){
             this.props.dispatch(change('ApplicationPartForm', 'applicationProcurementPlanPosition', assortmentGroups[0]));
        }
        if(amountContractAwardedNet !== undefined && prevProps.amountContractAwardedNet !== undefined && amountContractAwardedNet !== prevProps.amountContractAwardedNet && isRealized){
            this.props.dispatch(change('ApplicationPartForm', 'amountContractAwardedGross', parseFloat((Math.round((amountContractAwardedNet * vat.code) * 100) / 100).toFixed(2))));
        }
        if(!isRealized && prevProps.isRealized && amountContractAwardedNet !== null){
            this.props.dispatch(change('ApplicationPartForm', 'amountContractAwardedNet', null));
            this.props.dispatch(change('ApplicationPartForm', 'amountContractAwardedGross', null));
        }
        if(optionValue !== undefined && prevProps.optionValue !== undefined && (optionValue !== prevProps.optionValue || (optionValue !== undefined && amountNet !== prevProps.amountNet))){
            this.props.dispatch(change('ApplicationPartForm', 'amountOptionNet', parseFloat((Math.round(((optionValue / 100) * amountNet) * 100) / 100).toFixed(2))));
            this.props.dispatch(change('ApplicationPartForm', 'amountOptionGross', parseFloat((Math.round((((optionValue / 100) * amountNet) * vat.code) * 100) / 100).toFixed(2))));
            this.props.dispatch(change('ApplicationPartForm', 'amountSumNet', parseFloat((Math.round((((optionValue / 100) * amountNet) + amountNet) * 100) / 100).toFixed(2))));
            this.props.dispatch(change('ApplicationPartForm', 'amountSumGross', parseFloat((Math.round(((((optionValue / 100) * amountNet) * vat.code) + amountGross) * 100) / 100).toFixed(2))));
        }
    }

    render(){
        const { classes, isLoading, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, action, vats, initialValues, applicationStatus, assortmentGroups, isRealized, reasonsNotRealized, isOption, amountNet, applicationThreshold, levelAccess, formCurrentValues } = this.props;
        const { isNotRealized } = this.state

        return(
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="lg"
                    disableBackdropClick={true}
                >
                    {(submitting || isLoading) && <Spinner /> }
                    {isNotRealized &&
                        <ModalDialog
                            message={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_CONFIRM_WITHDRAW_REALISATION_MSG}
                            variant={"warning"}
                            onConfirm={this.handleConfirmDialog}
                            onClose={this.handleCloseDialog}
                        />
                    }
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
                                        { action === "add" ?
                                            constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_TITLE_CREATE
                                                :  constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_TITLE_EDIT + ` ${initialValues.name}`
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
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <FormDictionaryField
                                            isRequired={true}
                                            name="applicationAssortmentGroup"
                                            dictionaryName={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                            items={assortmentGroups}
                                            disabled={applicationStatus !== undefined && applicationStatus.code !== 'ZP'}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormTextField
                                            isRequired={true}
                                            name="name"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_NAME}
                                            inputProps={{ maxLength: 200 }}
                                            disabled = {applicationStatus !== undefined && applicationStatus.code !== 'ZP'}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            isRequired={true}
                                            name="amountNet"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_NET}
                                            disabled = {applicationStatus !== undefined && applicationStatus.code !== 'ZP'}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormSelectField
                                            name="vat"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VAT}
                                            options={vats}
                                            isRequired={true}
                                            disabled={applicationStatus !== undefined && applicationStatus.code !== 'ZP' ? true : false}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            name="amountGross"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_GROSS}
                                            disabled
                                        />
                                    </Grid>
                                    { ['PO130', 'UE139'].includes(applicationThreshold) &&
                                        <>
                                            <Grid item xs={12} >
                                                <FormCheckBox
                                                    name="isOption"
                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_OPTION}
                                                    disabled = {(applicationStatus !== undefined && applicationStatus.code !== 'ZP') || (applicationStatus.code === 'ZP' && amountNet === undefined)}
                                                />
                                            </Grid>
                                            { isOption &&
                                                <>
                                                    <Grid item xs={2}>
                                                        <FormDigitsField
                                                            isRequired={true}
                                                            name="optionValue"
                                                            inputProps={{
                                                                maxLength: 3,
                                                            }}
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_CRITERIA_VALUE}
                                                            disabled = {applicationStatus.code !== 'ZP'}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <FormAmountField
                                                            name="amountOptionNet"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_OPTION_NET}
                                                            disabled
                                                        />
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <FormAmountField
                                                            name="amountOptionGross"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_OPTION_GROSS}
                                                            disabled
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormAmountField
                                                            name="amountSumNet"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_SUM_NET}
                                                            disabled
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormAmountField
                                                            name="amountSumGross"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_SUM_GROSS}
                                                            disabled
                                                        />
                                                    </Grid>
                                                </>
                                            }
                                        </>
                                    }
                                </Grid>
                            </div>
                            { (!['ZP'].includes(applicationStatus.code) && applicationThreshold !=='DO50') &&
                                <>
                                    <div className={classes.section}>
                                        <Divider />
                                        <Toolbar className={classes.toolbar}>
                                            <Description className={classes.subHeaderIcon} fontSize="small" />
                                            <Typography variant="subtitle1" >
                                                {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_REALIZED_TITLE}
                                            </Typography>
                                        </Toolbar>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} >
                                                <FormCheckBox
                                                    name="isRealized"
                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_REALIZED}
                                                    disabled = {
                                                        levelAccess !== 'public' ||
                                                            (levelAccess === 'public' && !['ZA', 'RE'].includes(applicationStatus.code)) ||
                                                                (levelAccess === 'public' && ['ZA', 'RE'].includes(applicationStatus.code) && formCurrentValues !== undefined && formCurrentValues.reasonNotRealized !== null)
                                                    }
                                                />
                                            </Grid>
                                            {!isRealized &&
                                                <>
                                                    <Grid item xs={12}>
                                                        <FormSelectField
                                                            isRequired={true}
                                                            name="reasonNotRealized"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_REASON_NOT_REALIZED}
                                                            options={reasonsNotRealized}
                                                            disabled = {
                                                                levelAccess !== 'public' ||
                                                                    (levelAccess === 'public' && !['ZA', 'RE'].includes(applicationStatus.code)) ||
                                                                        (levelAccess === 'public' && ['ZA', 'RE'].includes(applicationStatus.code) && formCurrentValues !== undefined && formCurrentValues.reasonNotRealized !== null)
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} >
                                                    <FormTextField
                                                        name="descNotRealized.content"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_DESC_NOT_REALIZED}
                                                        multiline
                                                        inputProps={{ maxLength: 1000 }}
                                                        disabled = {
                                                            levelAccess !== 'public' ||
                                                                (levelAccess === 'public' && !['ZA', 'RE'].includes(applicationStatus.code)) ||
                                                                    (levelAccess === 'public' && ['ZA', 'RE'].includes(applicationStatus.code) && formCurrentValues !== undefined && formCurrentValues.reasonNotRealized !== null)
                                                            }
                                                        />
                                                    </Grid>
                                                </>
                                            }
                                            {isRealized &&
                                                <>
                                                    <Grid item xs={6}>
                                                        <FormAmountField
                                                            name="amountContractAwardedNet"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_VALUE_CONTRACT_AWARDED_NET}
                                                            isRequired
                                                            disabled = {levelAccess !== 'public' || (levelAccess === 'public' && !['ZA', 'RE'].includes(applicationStatus.code))}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormAmountField
                                                            name="amountContractAwardedGross"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_VALUE_CONTRACT_AWARDED_GROSS}
                                                            disabled
                                                        />
                                                    </Grid>
                                                </>
                                            }
                                        </Grid>
                                    </div>
                                </>
                            }
                        </DialogContent>
                        <DialogActions>
                            <Divider />
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                                {(levelAccess === undefined && applicationStatus !== undefined && applicationStatus.code === 'ZP') &&
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save/>
                                        iconAlign="right"
                                        type='submit'
                                        variant='submit'
                                        disabled={pristine || submitting || invalid || submitSucceeded}
                                    />
                                }
                                {(levelAccess === 'public' && ['ZA', 'RE'].includes(applicationStatus.code) &&
                                    initialValues !== undefined && initialValues.reasonNotRealized === null) &&
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save/>
                                        iconAlign="right"
                                        variant='submit'
                                        disabled={pristine || submitting || invalid || submitSucceeded}
                                        onClick={this.handleSubmitPartRealized}
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

ApplicationPartForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationPartForm);