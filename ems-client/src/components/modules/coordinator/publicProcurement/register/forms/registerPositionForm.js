import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Button, InputField } from 'common/gui';
import { Save, Send, Cancel, Close, Description, Contacts } from '@material-ui/icons/';
import { FormTextField, FormAmountField, FormDictionaryField, FormDateField, FormCheckBox, FormSelectField } from 'common/form';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Toolbar } from '@material-ui/core/';
import { zipCodeMask } from 'utils/';

const styles = theme => ({
    dialog: {
        height: `calc(100vh - ${theme.spacing(25)}px)`,
        overflow: 'auto',
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
    section: {
        marginBottom: theme.spacing(1),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },

});


class RegisterPositionsForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, action, initialValues, onClose, planPositions, isChangedEstimationType, estimationTypes, planPosition } = this.props;
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
                                            constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_TITLE_CREATE
                                                :  constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_TITLE_EDIT + ` ${initialValues.name}`
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
                                    <Grid item xs={2} >
                                        <FormTextField
                                            name="number"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_NUMBER}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={10} >
                                        <FormTextField
                                            name="orderedObject"
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormAmountField
                                            name="orderValue"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_ORDER_VALUE_NET}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormDictionaryField
                                            name="planPosition"
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                            dictionaryName={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUPS}
                                            isRequired={true}
                                            items={planPositions}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormAmountField
                                            name="planPosition.amountRequestedNet"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_ASSORTMENT_GROUP_VALUE}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <InputField
                                            name="estimationType"
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE}
                                            value={planPosition !== undefined ? planPosition.estimationType.name : ""}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormCheckBox
                                            name="isChangedEstimationType"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_CHANGE_MODE}
                                            value={false}
                                        />
                                    </Grid>
                                    { isChangedEstimationType &&
                                        <>
                                            <Grid item xs={5}>
                                                <FormSelectField
                                                    isRequired={true}
                                                    name="changedEstimationType"
                                                    label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_NEW_MODE}
                                                    value={initialValues.estimationType !== undefined ? initialValues.estimationType : ""}
                                                    options={estimationTypes}
                                                    isRequired={true}
                                                    disabled={!isChangedEstimationType}
                                                />
                                            </Grid>
                                            <Grid item xs={7} >
                                                <FormTextField
                                                    name="changeReason"
                                                    label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_CHANGE_MODE_REASON}
                                                    isRequired={true}
                                                    disabled={!isChangedEstimationType}
                                                />
                                            </Grid>
                                        </>
                                    }
                                    <Grid item xs={12} sm={3}>
                                        <FormDateField
                                            name="startDate"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_REGISTER_TABLE_HEAD_ROW_START_DATE}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormDateField
                                            name="sendDate"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_SEND_DATE}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormDateField
                                            name="endDate"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_REGISTER_TABLE_HEAD_ROW_END_DATE}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormTextField
                                            name="timeLimit"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_TIME_LIMIT}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.section}>
                                <Divider />
                                <Toolbar className={classes.toolbar} >
                                    <Description className={classes.subHeaderIcon} fontSize="small"/>
                                    <Typography variant="subtitle1" >
                                       {constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_INFO}
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={4}>
                                        <FormDateField
                                            name="executionDate"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_EXECUTION_DATE}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <InputField
                                            name="realizedDocumentType"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_DOCUMENT}
                                            value={initialValues.realizedDocumentType !== undefined ? initialValues.realizedDocumentType : ""}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={4} >
                                        <InputField
                                            name="realizedDocumentNumber"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_DOCUMENT_REALIZATION_NUMBER}
                                            value={initialValues.realizedDocumentNumber !== undefined ? initialValues.realizedDocumentNumber : ""}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormAmountField
                                            name="realizedValueNet"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_VALUE_NET}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormAmountField
                                            name="realizedValueGross"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_VALUE_GROSS}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.section}>
                                <Divider />
                                <Toolbar className={classes.toolbar} >
                                    <Contacts className={classes.subHeaderIcon} fontSize="small"/>
                                    <Typography variant="subtitle1" >
                                       {constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR_INFO}
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} >
                                        <InputField
                                            name="name"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR}
                                            value={initialValues.contractor !== undefined ? initialValues.contractor.name : ""}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <FormTextField
                                            name="city"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR_CITY}
                                            value={initialValues.contractor !== undefined ? initialValues.contractor.city : ""}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormTextField
                                            name="zipCode"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR_ZIP_CODE}
                                            value={initialValues.contractor !== undefined ? initialValues.contractor.zipCode : ""}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <FormTextField
                                            name="street"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR_STREET}
                                            value={initialValues.contractor !== undefined ? initialValues.contractor.street : ""}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <FormTextField
                                            name="building"
                                            label={constants.COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR_BUILDING}
                                            value={initialValues.contractor !== undefined ? initialValues.contractor.building : ""}
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
                                    icon={<Save/>}
                                    iconAlign="right"
                                    type='submit'
                                    variant='submit'
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

RegisterPositionsForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterPositionsForm);