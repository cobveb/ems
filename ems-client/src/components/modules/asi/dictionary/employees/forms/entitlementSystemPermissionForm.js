import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Dialog, Grid, Typography, Divider, DialogTitle, DialogActions, DialogContent, IconButton } from '@material-ui/core';
import { Save, Cancel, Close } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormTextField, FormCheckBox } from 'common/form';


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
})

class EntitlementSystemPermissionForm extends Component {

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    render(){
        const {classes, initialValues, handleSubmit, pristine, submitting, invalid, submitSucceeded, open, action} = this.props;
        return(
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
                                { action === 'add' ?
                                    constants.ASI_DICTIONARY_SYSTEM_PERMISSION_CREATE_TITLE :
                                        `${constants.ASI_DICTIONARY_SYSTEM_PERMISSION_EDIT_TITLE} ${initialValues.name}`
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
                                <Grid item xs={12} sm={12}>
                                    <FormTextField
                                        name="name"
                                        label={constants.ASI_DICTIONARY_SYSTEM_PERMISSION_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 120 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="description.content"
                                        label={constants.DESCRIPTION}
                                        multiline
                                        rows={5}
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
        )
    }
}

EntitlementSystemPermissionForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    onClose: PropTypes.func,
};

export default withStyles(styles)(EntitlementSystemPermissionForm);