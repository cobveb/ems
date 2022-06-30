import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Dialog, Grid, Typography, Divider, DialogTitle, DialogActions, DialogContent, IconButton, Toolbar} from '@material-ui/core';
import * as constants from 'constants/uiNames';
import { Button, InputField } from 'common/gui';
import { Save, Cancel, Close, Description } from '@material-ui/icons/';
import { FormTextField, FormCheckBox } from 'common/form';

const styles = theme => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(3),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    active: {
        paddingRight: theme.spacing(2),
    },
});
const nipMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

class ContractorForm extends Component {

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
                    maxWidth="lg"
                    disableBackdropClick={true}
                >
                <form onSubmit={handleSubmit}>
                    <DialogTitle id="contractorTitle" disableTypography={true}>
                        <Grid
                            container
                            direction="row"
                            spacing={1}
                        >
                            <Grid item xs={12} >
                                <Typography variant='h6'>
                                    { action === 'add' ?
                                        constants.ACCOUNTANT_CONTRACTOR_ADD_DETAILS_TITLE :
                                            constants.ACCOUNTANT_CONTRACTOR_EDIT_DETAILS_TITLE + `${initialValues.name}`
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
                        <Toolbar className={classes.toolbar}>
                            <Description className={classes.subHeaderIcon} fontSize="small" />
                            <Typography variant="subtitle1" >
                                {constants.ACCOUNTANT_COST_TYPE_BASIC_INFORMATION}
                            </Typography>
                        </Toolbar>
                        <Grid container spacing={0} justify="flex-end" className={classes.active}>
                            <FormCheckBox
                                name="active"
                                label={constants.ACCOUNTANT_CONTRACTOR_ACTIVE}
                            />
                        </Grid>
                        <Grid container spacing={1} justify="flex-start" className={classes.container}>
                            <Grid item xs={2}>
                                <InputField
                                    name="code"
                                    label={constants.ACCOUNTANT_CONTRACTOR_CODE}
                                    disabled
                                    value={initialValues.code !== undefined ? initialValues.code : ''}
                                />
                            </Grid>
                            <Grid item xs={10}>
                                <FormTextField
                                    name="name"
                                    label={constants.ACCOUNTANT_CONTRACTOR_NAME}
                                    isRequired
                                    inputProps={{ maxLength: 250 }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormTextField
                                    name="nip"
                                    label={constants.INSTITUTION_BASIC_INFORMATION_NIP}
                                    isRequired
                                    mask={nipMask}
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
                                icon={<Save />}
                                iconAlign="right"
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

ContractorForm.propTypes = {
    classes: PropTypes.object.isRequired,
    error: PropTypes.string,
    initialValues: PropTypes.object.isRequired,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    onClose: PropTypes.func,
};

export default withStyles(styles)(ContractorForm);