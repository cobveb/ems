import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@material-ui/core/';
import { Save, Cancel, Close } from '@material-ui/icons/';
import { FormTextField } from 'common/form';
import { Button } from 'common/gui';

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

class PlanCorrectionPositionForm extends Component {
    state = {
        formChanged : false,
    }

    handleClose = () =>{
        if(this.props.pristine === false){
            this.setState({formChanged: !this.state.formChanged});
        } else {
            this.props.onClose();
            this.props.reset();
        }
    };

    handleCancelClose = () => {
        this.setState({formChanged: false});
    }

    handleConfirmClose = () => {
        this.setState({formChanged: false});
        this.props.onClose();
        this.props.reset();
    }


    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, planStatus, planType, level } = this.props;
        const { formChanged } = this.state;
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
                {formChanged === true &&
                    <ModalDialog
                        message={constants.MODAL_DIALOG_FORM_CHANGE_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmClose}
                        onClose={this.handleCancelClose}
                    />
                }
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
                                    {`${planType === 'FIN' ?
                                        initialValues.costType !== undefined ?
                                            constants.ACCOUNTANT_PLAN_COORDINATOR_POSITION_REMARKS_TITLE + initialValues.costType.name
                                                :  initialValues.coordinatorName
                                        :
                                            initialValues.task !== undefined ?
                                                constants.ACCOUNTANT_PLAN_COORDINATOR_POSITION_REMARKS_TITLE + initialValues.task
                                                    : initialValues.coordinatorName
                                    }`}
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
                        <Grid container spacing={1} className={classes.container}>
                            <Grid item xs={6}>
                                <FormTextField
                                    name="coordinatorDescription"
                                    label={constants.COORDINATOR_PLAN_POSITION_COORDINATOR_DESCRIPTION}
                                    multiline
                                    rows="5"
                                    disabled
                                    inputProps={{ maxLength: 230 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormTextField
                                    name="managementDescription"
                                    label={constants.COORDINATOR_PLAN_POSITION_MANAGEMENT_DESCRIPTION}
                                    multiline
                                    rows="5"
                                    disabled={(level=== "accountant" && ['AK', 'AD', 'AN', 'ZA', 'RE', 'ZR', 'AA'].includes(planStatus)) ||
                                        (level === "director" && ['AN','ZA', 'RE', 'ZR', 'AA'].includes(planStatus)  && true)}
                                    inputProps={{ maxLength: 230 }}
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
                            <Button
                                label={constants.BUTTON_SAVE}
                                icon={<Save/>}
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
        );
    };
};

PlanCorrectionPositionForm.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanCorrectionPositionForm);