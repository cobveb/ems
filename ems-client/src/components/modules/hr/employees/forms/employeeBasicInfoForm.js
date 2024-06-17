import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import { Button } from 'common/gui';
import { FormTextField } from 'common/form';
import { Person, Save, Cancel } from '@material-ui/icons/';


const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(25.1)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        maxWidth: '100%',
    },
    actionContainer: {
        paddingLeft: theme.spacing(20),
    },
});

class EmployeeBasicInfoForm extends Component {
    state = {
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

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, levelAccess } = this.props;
        const { formChanged } = this.state;
        return(
            <>
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    {formChanged === true &&
                        <ModalDialog
                            message={constants.MODAL_DIALOG_FORM_CHANGE_MSG}
                            variant="warning"
                            onConfirm={this.handleConfirmClose}
                            onClose={this.handleCancelClose}
                        />
                    }
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <Person className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.EMPLOYEE_BASIC_INFORMATION}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={2}>
                                    <FormTextField
                                        name="id"
                                        label={constants.EMPLOYEE_BASIC_INFORMATION_ID}
                                        isRequired={true}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormTextField
                                        name="hrNumber"
                                        label={constants.EMPLOYEE_BASIC_INFORMATION_HR_NUMBER}
                                        inputProps={{ maxLength: 15 }}
                                        disabled={levelAccess !== 'hr' ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <FormTextField
                                        name="surname"
                                        label={constants.EMPLOYEE_BASIC_INFORMATION_SURNAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 80 }}
                                        disabled={levelAccess !== 'hr' ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormTextField
                                        name="name"
                                        label={constants.EMPLOYEE_BASIC_INFORMATION_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 25 }}
                                        disabled={levelAccess !== 'hr' ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="comments.content"
                                        label={constants.COMMENTS}
                                        multiline
                                        minRows="5"
                                        disabled={levelAccess !== 'hr' ? true : false}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <div>
                        <Divider />
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                            className={classes.container}
                        >
                            <Grid item xs={10}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                    className={classes.actionContainer}
                                >
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save />
                                        iconAlign="left"
                                        type='submit'
                                        variant="submit"
                                        disabled={pristine || submitting || invalid || submitSucceeded }
                                    />
                               </Grid>
                            </Grid>
                            <Grid item xs={2}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-start"
                                    className={classes.container}
                                >
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel />
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={this.handleClose}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </form>
            </>
        );
    };
};

export default withStyles(styles)(EmployeeBasicInfoForm);
