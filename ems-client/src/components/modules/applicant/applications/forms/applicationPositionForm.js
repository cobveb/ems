import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Button, InputField } from 'common/gui';
import { Add, Edit, Cancel, Close } from '@material-ui/icons/';
import { FormTextField, FormDictionaryField, FormDigitsField } from 'common/form';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core/';


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
});

class ApplicationPositionForm extends Component {
    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }
    render(){
        const {classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, units, action, applicationStatus} = this.props;
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
                                spacing={1}
                            >
                                <Grid item xs={12} >
                                    <Typography variant='h6'>
                                        {constants.APPLICATION_POSITION_DETAILS_TITLE}
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
                                        disabled={applicationStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={4} >
                                    <FormDigitsField
                                        name="quantity"
                                        label={constants.APPLICATION_POSITION_DETAILS_QUANTITY}
                                        isRequired={true}
                                        disabled={applicationStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormDictionaryField
                                        isRequired={true}
                                        name="unit"
                                        dictionaryName='Jednostki miary'
                                        label={constants.APPLICATION_POSITION_DETAILS_UNIT}
                                        disabled={applicationStatus!=='ZP' && true}
                                        items={units}
                                    />
                                </Grid>
                                <Grid item xs={5} >
                                    <InputField
                                        name="status"
                                        label={constants.APPLICATION_POSITION_DETAILS_STATUS}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.status ? initialValues.status.name : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="description"
                                        label={constants.APPLICATION_POSITION_DETAILS_DESCRIPTION}
                                        placeholder={constants.APPLICATION_POSITION_DETAILS_DESCRIPTION}
                                        multiline
                                        rows="5"
                                        disabled={applicationStatus!=='ZP' && true}
                                    />
                                </Grid>
                                { (Object.keys(initialValues).length !== 0 && initialValues.status.code ==='OD') &&
                                    <Grid item xs={12} >
                                        <FormTextField
                                            name="rejectionReason"
                                            label={constants.APPLICATION_POSITION_DETAILS_REJECTION_REASON}
                                            placeholder={constants.APPLICATION_POSITION_DETAILS_REJECTION_REASON}
                                            multiline
                                            rows="5"
                                            disabled={true}
                                        />
                                    </Grid>
                                }
                            </Grid>
                        </DialogContent>
                        <DialogActions className={classes.desc}>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                                { applicationStatus === 'ZP' &&
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

ApplicationPositionForm.propTypes = {
    classes: PropTypes.object.isRequired,
    units: PropTypes.array.isRequired,
    action: PropTypes.string.isRequired,
    applicationStatus: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationPositionForm);