import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Dialog, Grid, Typography, Divider, DialogTitle, DialogActions, DialogContent, IconButton } from '@material-ui/core';
import { Save, Cancel, Close } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormDateField, FormTextField, FormCheckBox } from 'common/form';

const styles = theme => ({
    dialogContent: {
        maxHeight: `calc(100vh - ${theme.spacing(25)}px)`,
        paddingBottom: theme.spacing(0),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogTitle :{
        paddingBottom: theme.spacing(0),
    },
    container: {
        maxWidth: '100%',
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    active: {
        maxWidth: '100%',
        paddingRight: theme.spacing(2),
    },
});

class StatementForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded } = this.props;
        return(
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="lg"
                    disableBackdropClick={true}
                >
                    <DialogTitle id="functionDetails-title" disableTypography={true} className={classes.dialogTitle}>
                        <Grid
                            container
                            direction="row"
                            spacing={1}
                        >
                            <Grid item xs={12} >
                                <Typography variant='h6'>
                                    {constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_TITLE}
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
                        <DialogContent className={classes.dialogContent}>
                            <div className={classes.section}>
                                <Grid container spacing={0} justify="flex-end" className={classes.active}>
                                    <FormCheckBox
                                        name="isActive"
                                        label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_ACTIVE}
                                    />
                                </Grid>
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={3}>
                                        <FormDateField
                                            name="statementDate"
                                            label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DATE}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormDateField
                                            name="dateFrom"
                                            label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DATE_FROM}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={3} >
                                        <FormDateField
                                            name="dateTo"
                                            label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DATE_TO}
                                        />
                                    </Grid>
                                    <Grid item xs={3} >
                                        <FormDateField
                                            name="verificationDate"
                                            label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_VERIFICATION_DATE}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <FormTextField
                                            name="comments.content"
                                            label={constants.DESCRIPTION}
                                            multiline
                                            rows="2"
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

StatementForm.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(StatementForm);