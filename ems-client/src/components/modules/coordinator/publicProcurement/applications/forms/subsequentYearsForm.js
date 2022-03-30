import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@material-ui/core/';
import { Spinner } from 'common/';
import { Close, Save, Cancel } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormAmountField, FormDateField, FormSelectField } from 'common/form';

const styles = theme => ({
    dialog:{
        height: theme.spacing(20),
        width: '100%',
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(0),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})

class SubsequentYearsForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    componentDidUpdate(prevProps){
        const {yearExpenditureNet, vat} = this.props;

        if(yearExpenditureNet !== undefined && prevProps.yearExpenditureNet !== yearExpenditureNet){
            this.props.dispatch(change('SubsequentYearsForm', 'yearExpenditureGross', parseFloat((Math.round((yearExpenditureNet * vat.code) * 100) / 100).toFixed(2))));
        }
    }

    render(){
        const { classes, pristine, invalid, handleSubmit, submitting, submitSucceeded, isLoading, open, action, applicationStatus, vats } = this.props;
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
                        <DialogTitle disableTypography={true}>
                            <Grid
                                container
                                direction="row"
                                spacing={0}
                                className={classes.container}
                            >
                                <Grid item xs={12} >
                                    <Typography variant='h6'>
                                        {action === "add" ?
                                            constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_TITLE_CREATE :
                                                constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_TITLE_EDIT
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
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} >
                                    <FormDateField
                                        name="year"
                                        label={constants.YEAR}
                                        isRequired={true}
                                        dateFormat="yyyy"
                                        disablePast
                                        mask="____"
                                        views={["year"]}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormAmountField
                                        name="yearExpenditureNet"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_EXPENDITURE_NET}
                                        isRequired={true}
                                        disabled={applicationStatus !== undefined && applicationStatus.code !== 'ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <FormSelectField
                                        name="vat"
                                        label={constants.VAT}
                                        options={vats}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormAmountField
                                        name="yearExpenditureGross"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_EXPENDITURE_GROSS}
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
                            >
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                                {(applicationStatus !== undefined && applicationStatus.code === 'ZP') &&
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save/>
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

SubsequentYearsForm.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(SubsequentYearsForm);