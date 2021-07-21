import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core/';
import { Close, Save, Cancel } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormTextField, FormAmountField, FormSelectField } from 'common/form';

const styles = theme => ({
    dialog: {
        maxHeight: `calc(100vh - ${theme.spacing(25)}px)`,
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
    toolbar: {
        minHeight: theme.spacing(6),
    },
    tableWrapper: {
        overflow: 'auto',
        height: theme.spacing(15),
    },
});

class ApplicationPartForm extends Component {
    state = {
    }
    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    handleOpenPartDetails = (event, action) => {
        this.setState({openPartDetails: !this.state.openPartDetails, partAction: action});
    };

    componentDidUpdate(prevProps){
        const {groupVat, amountNet, vat} = this.props;
        if(groupVat !== undefined && vat === undefined){
             this.props.dispatch(change('ApplicationPartForm', "vat", groupVat))
        }
        if((vat !== prevProps.vat && vat !== undefined && amountNet !== undefined ) || (amountNet !== undefined && amountNet !== prevProps.amountNet && vat !== undefined) ){
            this.props.dispatch(change('ApplicationPartForm', 'amountGross', parseFloat((Math.round((amountNet * vat.code) * 100) / 100).toFixed(2))));
        }
    }

    render(){
        const { classes, isLoading, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, action, vats, initialValues } = this.props;
        return(
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="md"
                    disableBackdropClick={true}
                >
                    {(submitting || isLoading) && <Spinner /> }

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
                                            constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_TITLE_CREATE
                                                :  constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_TITLE_EDIT + ` ${initialValues.number}`
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
                                        <FormTextField
                                            isRequired={true}
                                            name="name"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_NAME}
                                            inputProps={{ maxLength: 120 }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            isRequired={true}
                                            name="amountNet"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_NET}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormSelectField
                                            name="vat"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VAT}
                                            options={vats}
                                            isRequired={true}
                                            disabled={this.props.groupVat !== undefined}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            name="amountGross"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_GROSS}
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
                                <Button
                                    label={constants.BUTTON_SAVE}
                                    icon=<Save/>
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

ApplicationPartForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationPartForm);