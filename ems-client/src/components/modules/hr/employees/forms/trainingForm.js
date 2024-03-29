import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Dialog, Grid, Typography, Divider, DialogTitle, DialogActions, DialogContent, IconButton } from '@material-ui/core';
import { Save, Cancel, Close } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormDateField, FormTextField, FormSelectField } from 'common/form';

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
        maxWidth: '100%',
    },
});

class TrainingForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, action, initialValues } = this.props;
        return(
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="md"
                    disableBackdropClick={true}
                >
                    <DialogTitle id="functionDetails-title" disableTypography={true}>
                        <Grid
                            container
                            direction="row"
                            spacing={1}
                        >
                            <Grid item xs={12} >
                                <Typography variant='h6'>
                                    {constants.EMPLOYEE_TRAINING_DETAILS_TITLE}
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
                    <form onSubmit={handleSubmit}>
                        <DialogContent className={classes.dialog}>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="name"
                                        label={constants.EMPLOYEE_TRAINING_TABLE_HEAD_ROW_NAME}
                                        isRequired={true}
                                    />
                                </Grid>
                                <Grid item xs={9}>
                                    <FormSelectField
                                        name="type"
                                        label={constants.EMPLOYEE_TRAINING_TABLE_HEAD_ROW_TYPE}
                                        options={[]}
                                        isRequired={true}
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormDateField
                                        name="date"
                                        label={constants.EMPLOYEE_TRAINING_TABLE_HEAD_ROW_DATE}
                                        isRequired={true}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="comments"
                                        label={constants.DESCRIPTION}
                                        multiline
                                        rows="5"
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

TrainingForm.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    initialValues: PropTypes.object.isRequired,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
};

export default withStyles(styles)(TrainingForm);