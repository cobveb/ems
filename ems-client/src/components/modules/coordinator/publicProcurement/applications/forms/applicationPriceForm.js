import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core/';
import { Button } from 'common/gui';
import { Close, Save, Cancel } from '@material-ui/icons/';
import { FormAmountField, FormDictionaryField, FormSelectField } from 'common/form';

const styles = theme => ({
    dialogTitle: {
        paddingBottom: theme.spacing(1),
    },
    dialog: {
        height: `calc(100vh - ${theme.spacing(76)}px)`,
        overflow: 'auto',
        width: '100%',
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
})

class ApplicationPriceForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    componentDidUpdate(prevProps){
        const { vat, amountContractAwardedNet, applicationAssortmentGroup } = this.props;
        //Setup vat on applicationAssortmentGroup change
        if(applicationAssortmentGroup !== undefined && applicationAssortmentGroup !== prevProps.applicationAssortmentGroup){
            this.props.dispatch(change('ApplicationPriceForm', 'vat', applicationAssortmentGroup.vat));
        }
        //Setup amountContractAwardedGross
        if(vat !== undefined && amountContractAwardedNet !== undefined && (vat !== prevProps.vat || (prevProps.amountContractAwardedNet !== undefined && amountContractAwardedNet !== prevProps.amountContractAwardedNet))){
            this.props.dispatch(change('ApplicationPriceForm', 'amountContractAwardedGross', parseFloat((Math.round((amountContractAwardedNet * vat.code) * 100) / 100).toFixed(2))));
        }
    }

    render(){
        const { classes, pristine, invalid, submitting, submitSucceeded, handleSubmit, isLoading, open, applicationStatus, applicationEstimationType, protocolStatus, assortmentGroups, vats } = this.props;
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
                                        { constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE }
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
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={12}>
                                        <FormDictionaryField
                                            isRequired={true}
                                            name="applicationAssortmentGroup"
                                            dictionaryName={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                            items={assortmentGroups}
                                            disabled={applicationStatus !== undefined && (applicationStatus !== 'ZP' ||
                                                (applicationStatus === 'ZP' && assortmentGroups.length === 1)
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            name="amountContractAwardedNet"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE_GROUP_NET}
                                            isRequired
                                            disabled={applicationEstimationType !== undefined && (applicationEstimationType === "DO50" ?
                                                    (applicationStatus !== undefined && applicationStatus !== 'ZP') ? true : false
                                                : (protocolStatus !== undefined &&  protocolStatus !== 'ZP') ? true : false )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormSelectField
                                            name="vat"
                                            label={constants.VAT}
                                            options={vats}
                                            isRequired
                                            disabled={applicationEstimationType !== undefined && (applicationEstimationType === "DO50" ?
                                                    (applicationStatus !== undefined && applicationStatus !== 'ZP') ? true : false
                                                : (protocolStatus !== undefined &&  protocolStatus !== 'ZP') ? true : false )}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            name="amountContractAwardedGross"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE_GROUP_GROSS}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </div>
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
                                {(applicationEstimationType !== undefined && (applicationEstimationType === "DO50" ?
                                        (applicationStatus !== undefined && applicationStatus !== 'ZP') ? false : true
                                    : (protocolStatus !== undefined &&  protocolStatus !== 'ZP') ? false : true )) &&
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save/>
                                        iconAlign="right"
                                        type='submit'
                                        variant='submit'
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

ApplicationPriceForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationPriceForm);