import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Dialog, Grid, Typography, Divider, DialogTitle, DialogActions, DialogContent, IconButton } from '@material-ui/core';
import { Save, Cancel, Close } from '@material-ui/icons/';
import { ModalDialog } from 'common/';
import { Button } from 'common/gui';
import { FormTableTransferListField, FormDictionaryField } from 'common/form';

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
    transferListWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(38)}px)`,
    },
})


class EntitlementGroupForm extends Component {
    state = {
        formChanged: false,
        transferListHead: [
            {
                id: 'code',
                type:'text',
                label: constants.TABLE_HEAD_ROW_CODE,
            },
            {
                id: 'name',
                type:'text',
                label: constants.TABLE_HEAD_ROW_NAME,
            },
        ]
    }

    handleClose = () =>{
        if(this.props.pristine === false){
            this.setState({formChanged: true});
        } else {
            this.props.onClose();
            this.props.reset();
        }
    };

    handleCancelClose = () => {
        this.setState({formChanged: false});
    }

    handleConfirmClose = () => {
        this.props.reset();
        this.props.onClose();
    }



    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, groups, organizationUnits } = this.props;
        const { formChanged, transferListHead } = this.state;
        return (
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="lg"
                    disableBackdropClick={true}
                >
                    <DialogTitle disableTypography={true} className={classes.dialogTitle}>
                        <Grid
                            container
                            direction="row"
                            spacing={1}
                        >
                            <Grid item xs={12} >
                                <Typography variant='h6'>
                                    {constants.EMPLOYEE_ENTITLEMENT_GROUP_TITLE}
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
                        {formChanged === true &&
                            <ModalDialog
                                message={constants.MODAL_DIALOG_FORM_CHANGE_MSG}
                                variant="warning"
                                onConfirm={this.handleConfirmClose}
                                onClose={this.handleCancelClose}
                            />
                        }
                        <DialogContent className={classes.dialogContent}>
                            <div className={classes.section}>
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={12}>
                                        <FormDictionaryField
                                            name="entitlementSystemPermission"
                                            dictionaryName={constants.EMPLOYEE_ENTITLEMENT_GROUP_NAME}
                                            label={constants.EMPLOYEE_ENTITLEMENT_GROUP_NAME}
                                            items={groups}
                                            isRequired={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormTableTransferListField
                                            className={classes.transferListWrapper}
                                            head={transferListHead}
                                            name="places"
                                            leftSideLabel = {constants.EMPLOYEE_ENTITLEMENT_GROUP_ALL_OUS}
                                            leftSide={organizationUnits.length ? organizationUnits : [] }
                                            rightSideLabel = {constants.EMPLOYEE_ENTITLEMENT_GROUP_OUS}
                                            rightSide={initialValues.places !== undefined ? initialValues.places : []}
                                            orderBy="id"
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
        )
    }
}

EntitlementGroupForm.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(EntitlementGroupForm);