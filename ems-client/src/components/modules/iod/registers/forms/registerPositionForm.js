import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Typography, Divider, Grid } from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import { Save, Cancel } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormTextField, FormCheckBox } from 'common/form';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        overflow: 'auto',
        maxWidth: '100%',
    },
    content_wrapper: {
        overflow: 'auto',
        maxWidth: '100%',
        paddingRight: theme.spacing(0.3),
    },
    container: {
        paddingTop: theme.spacing(1),
        maxWidth: '100%',
    },
    actionContainer: {
        maxWidth: '100%',
    },
    active: {
        paddingRight: theme.spacing(2),
    },
})


class RegProcessingActivitiesPositionForm extends Component {
    state = {
        maxContentHeight: 30,
        titleHeight: 0,
        formChanged : false,
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
        this.setState({formChanged: false});
        this.props.onClose();
        this.props.reset();
    }

    componentDidUpdate(prevProps, prevState){

        // Setup content height by title height
        if(!this.state.showProtocol){
            if(this.title !== undefined && this.title.clientHeight !== this.state.titleHeight){
                 this.setState({titleHeight: this.title.clientHeight});
            }
            if(this.action !== undefined && prevState.titleHeight !== this.state.titleHeight){
                this.setState({maxContentHeight: (this.state.titleHeight + this.action.clientHeight)+67});
            }
        }
    }


    render() {
        const { classes, isLoading, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, action,} = this.props;
        const { maxContentHeight, formChanged } = this.state;
        return (
            <>
                {(submitting || isLoading) && <Spinner /> }
                {formChanged === true &&
                    <ModalDialog
                        message={constants.MODAL_DIALOG_FORM_CHANGE_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmClose}
                        onClose={this.handleCancelClose}
                    />
                }
                <form onSubmit={handleSubmit}>
                    <div className={classes.content}>
                        <Typography variant='h6' ref={(ref) => this.title = ref}>
                            { action === "add" ?
                                constants.IOD_REGISTER_CPDO_CREATE_NEW_POSITION_TITLE
                                    :  constants.IOD_REGISTER_CPDO_CREATE_EDIT_POSITION_TITLE + ` ${initialValues !== undefined ? initialValues.name : ""}`
                            }
                        </Typography>
                        <Divider/>
                        <div
                            className={classes.content_wrapper}
                            style={
                                {
                                    height : maxContentHeight !== 0 ? `calc(100vh - ${maxContentHeight}px)` : "100%",

                                }
                            }
                        >
                            <Grid container spacing={1} className={classes.container}>
                                <Grid container spacing={0} justify="flex-end"  className={classes.active}>
                                    <FormCheckBox
                                        name="isActive"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_ACTIVE}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="name"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 100 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="dataSetConnection.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_DATA_SET_CONNECTION}
                                        multiline
                                        inputProps={{ maxLength: 400 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="ou.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_OU}
                                        multiline
                                        inputProps={{ maxLength: 1500 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="purposeProcessing.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_PURPOSE_PROCESSING}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="categoriesPeople.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_CATEGORIES_PEOPLE}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="dataCategories.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_DATA_CATEGORIES}
                                        multiline
                                        inputProps={{ maxLength: 1500 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="legalBasis.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_LEGAL_BASIS}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="dataSource.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_DATA_SOURCE}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="categoryRemovalDate.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_CATEGORY_REMOVAL_DATE}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="coAdminName.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_CO_ADMINISTRATOR_NAME}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="processorName.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_PROCESSOR_NAME}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="recipientCategories.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_RECIPIENT_CATEGORIES}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="systemSoftwareName.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_SYSTEM_SOFTWARE_NAME}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="securityMeasures.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_SECURITY_MEASURES}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="dpia.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_DPIA}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="thirdCountry.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_THIRD_COUNTRY}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="thirdCountryDoc.content"
                                        label={constants.IOD_REGISTER_CPDO_POSITION_THIRD_COUNTRY_DOCUMENTATION}
                                        multiline
                                        inputProps={{ maxLength: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormTextField
                                        name="comments.content"
                                        label={constants.DESCRIPTION}
                                        multiline
                                        rows="5"
                                        inputProps={{ maxLength: 500 }}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div ref={(ref) => this.action = ref}>
                            <Divider />
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                                className={classes.actionContainer}
                            >
                                <Grid item xs={10}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start"
                                    >
                                        <Button
                                            label={constants.BUTTON_SAVE}
                                            icon=<Save/>
                                            iconAlign="left"
                                            type='submit'
                                            variant="submit"
                                            disabled={pristine || submitting || invalid || submitSucceeded}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={2}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-end"
                                        alignItems="center"
                                    >
                                        <Button
                                            label={constants.BUTTON_CLOSE}
                                            icon=<Cancel/>
                                            iconAlign="left"
                                            variant="cancel"
                                            onClick={this.handleClose}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </form>
            </>
        )
    }
}

RegProcessingActivitiesPositionForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegProcessingActivitiesPositionForm);