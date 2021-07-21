import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Spinner } from 'common/';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Toolbar } from '@material-ui/core/';
import { Button, InputField } from 'common/gui';
import { Save, Cancel, Close, Description } from '@material-ui/icons/';
import { FormAmountField, FormDictionaryField, FormSelectField } from 'common/form';

const styles = theme => ({
    dialog: {
        minHeight: `calc(100vh - ${theme.spacing(72.2)}px)`,
        maxHeight: `calc(100vh - ${theme.spacing(40)}px)`,
        width: '100%',
        paddingBottom: 0,
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
    toolbar: {
        minHeight: theme.spacing(4),

    },
    section: {
        marginBottom: theme.spacing(1),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
});

class ApplicationAssortmentGroupsForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    handleSelect = (coordinators) =>{
        this.setState({
            selected: coordinators,
        });
    }

    componentDidUpdate(prevProps){
        const {applicationProcurementPlanPosition, orderGroupValueNet, orderValueYearNet, vat} = this.props;

        if(applicationProcurementPlanPosition !== undefined && applicationProcurementPlanPosition !== prevProps.applicationProcurementPlanPosition){
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'vat', applicationProcurementPlanPosition.vat));
        }
        //Changed Vat
        if((vat !== prevProps.vat && vat !== undefined && orderValueYearNet !== undefined ) || (orderValueYearNet !== undefined && orderValueYearNet !== prevProps.orderValueYearNet && vat !== undefined) ){
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'orderValueYearGross', parseFloat((Math.round((orderValueYearNet * vat.code) * 100) / 100).toFixed(2))));
        }
        if((vat !== prevProps.vat && vat !== undefined && orderGroupValueNet !== undefined ) || (orderGroupValueNet !== undefined && orderGroupValueNet !== prevProps.orderGroupValueNet && vat !== undefined) ){
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'orderGroupValueGross', parseFloat((Math.round((orderGroupValueNet * vat.code) * 100) / 100).toFixed(2))));
        }
    }

    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, planPositions, vats, orderGroupValueNet, applicationProcurementPlanPosition } = this.props;
        return(
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="lg"
                    disableBackdropClick={true}
                >
                    { submitting && <Spinner /> }
                    <form onSubmit={handleSubmit}>
                        <DialogTitle disableTypography={true}>
                            <Grid
                                container
                                direction="row"
                                spacing={0}
                                className={classes.container}
                            >
                                <Grid item xs={12} >
                                    <Typography variant='h6'>
                                        {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP}
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
                            <Toolbar className={classes.toolbar}>
                                <Description className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_GROUP_INFO}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12}>
                                    <FormDictionaryField
                                        isRequired={true}
                                        name="applicationProcurementPlanPosition"
                                        dictionaryName={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                        items={planPositions}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputField
                                        name="estimationType"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE}
                                        value={applicationProcurementPlanPosition !== undefined  ? applicationProcurementPlanPosition.estimationType         !== undefined ? applicationProcurementPlanPosition.estimationType.name : '' : ''}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormAmountField
                                        name="applicationProcurementPlanPosition.amountRequestedNet"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_VALUE_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormAmountField
                                        name="applicationProcurementPlanPosition.amountInferredNet"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_INFERRED_VALUE_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormAmountField
                                        name="applicationProcurementPlanPosition.amountRealizedNet"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_REALIZED_VALUE_NET}
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.section}>
                            <Divider />
                            <Toolbar className={classes.toolbar}>
                                <Description className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_INFO}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={5}>
                                    <FormAmountField
                                        name="orderGroupValueNet"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_NET}
                                        isRequired={true}
                                        disabled={applicationProcurementPlanPosition === undefined}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <FormSelectField
                                        name="vat"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VAT}
                                        options={vats}
                                        isRequired={true}
                                        disabled={applicationProcurementPlanPosition === undefined}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormAmountField
                                        name="orderGroupValueGross"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_GROSS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="orderValueYearNet"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_YEAR_NET}
                                        isRequired={true}
                                        disabled={orderGroupValueNet === undefined}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="orderValueYearGross"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_YEAR_GROSS}
                                        disabled
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
        )
    }
}

ApplicationAssortmentGroupsForm.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationAssortmentGroupsForm);