import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core';
import { Save, Cancel, Close } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormDateField, FormTextField, FormDictionaryField, FormCheckBox } from 'common/form';
import Spinner from 'common/spinner';


const styles = theme => ({
    container: {
        maxWidth: '100%',
    },
    dialogContent: {
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
        maxHeight: `calc(100vh - ${theme.spacing(25)}px)`,
    },
    dialogTitle: {
        paddingBottom: theme.spacing(0),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    tableWrapper: {
        overflow: 'auto',
        minHeight: theme.spacing(18),
        maxHeight: theme.spacing(18),
    },
    active: {
        maxWidth: '100%',
        paddingRight: theme.spacing(2),
    },
});

class WorkplaceForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, onClose } = this.props;
        return(
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="lg"
                    disableBackdropClick={true}
                >
                    <DialogTitle id="positionDetails-title" disableTypography={true} className={classes.dialogTitle}>
                        <Grid
                            container
                            direction="row"
                            spacing={1}
                        >
                            <Grid item xs={12} >
                                <Typography variant='h6'>
                                    {constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_TITLE}
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
                            { submitting && <Spinner /> }
                                <div className={classes.section}>
                                    <Grid container spacing={0} justify="flex-end" className={classes.active}>
                                        <FormCheckBox
                                            name="isActive"
                                            label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_ACTIVE}
                                        />
                                    </Grid>
                                    <Grid container spacing={1} justify="center" className={classes.container}>
                                        <Grid item xs={12}>
                                            <FormDictionaryField
                                                name="place"
                                                label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_PLACE}
                                                items={this.props.places}
                                                isRequired={true}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormDictionaryField
                                                name="workplace"
                                                dictionaryName={constants.EMPLOYEE_EMPLOYMENTS_TABLE_HEAD_ROW_WORKPLACE}
                                                label={constants.EMPLOYEE_EMPLOYMENTS_TABLE_HEAD_ROW_WORKPLACE}
                                                items={this.props.workplaces}
                                                isRequired={true}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormDateField
                                                name="dateFrom"
                                                label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_DATE_FROM}
                                                isRequired={true}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormDateField
                                                name="dateTo"
                                                label={constants.EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_DATE_TO}
                                            />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <FormTextField
                                                name="comments.content"
                                                label={constants.DESCRIPTION}
                                                multiline
                                                rows="1"
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
                                    icon=<Save />
                                    iconAlign="left"
                                    type='submit'
                                    variant="submit"
                                    disabled={pristine || submitting || invalid || submitSucceeded }
                                />
                                <Button
                                    label={constants.BUTTON_CLOSE}
                                    icon=<Cancel />
                                    iconAlign="left"
                                    variant="cancel"
                                    onClick={onClose}
                                />
                            </Grid>
                        </DialogActions>
                    </form>
                </Dialog>
            </>
        );
    };
};

WorkplaceForm.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    initialValues: PropTypes.object.isRequired,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
};

export default withStyles(styles)(WorkplaceForm);