import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Button } from 'common/gui';
import { Add, Edit, Cancel, Close } from '@material-ui/icons/';
import { FormTextField } from 'common/form';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core/';
import PlanFinancialContentPosition from 'components/modules/coordinator/plans/forms/planFinancialContentPosition';
import PlanInvestmentsContentPosition from 'components/modules/coordinator/plans/forms/planInvestmentContentPosition';

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
});

class PlanPositionForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    componentDidUpdate(prevProps){
        if(this.props.planType ==='FIN'){
            if((this.props.vat !== prevProps.vat && prevProps.vat !== undefined) ||
                (this.props.amountRequestedNet !== prevProps.amountRequestedNet && prevProps.amountRequestedNet !== undefined)){
                    this.props.dispatch(change('PlanPositionForm', 'amountRequestedGross', parseFloat((Math.round((this.props.amountRequestedNet * this.props.vat.code) * 100) / 100).toFixed(2))));
            }
        }
    }
    render(){
        const {classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, action, planStatus, planType, vats, units, categories, foundingSources, costsTypes } = this.props;
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
                                            constants.COORDINATOR_PLAN_POSITION_CREATE_DETAILS_TITLE
                                                :  constants.COORDINATOR_PLAN_POSITION_EDIT_DETAILS_TITLE + ` ${initialValues.name}`
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
                                    <FormTextField
                                        name="name"
                                        label={constants.APPLICATION_POSITION_DETAILS_POSITION_NAME}
                                        isRequired={true}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                {
                                    planType ==='FIN' ?
                                        <PlanFinancialContentPosition
                                            initialValues={initialValues}
                                            planStatus={planStatus}
                                            vats={vats}
                                            units={units}
                                            costsTypes={costsTypes}
                                        />
                                    :
                                        <PlanInvestmentsContentPosition
                                            initialValues={initialValues}
                                            planStatus={planStatus}
                                            vats={vats}
                                            foundingSources={foundingSources}
                                            categories={categories}
                                        />
                                }
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

PlanPositionForm.propTypes = {
    classes: PropTypes.object.isRequired,
    units: PropTypes.array.isRequired,
    action: PropTypes.string.isRequired,
    planStatus: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanPositionForm);