import React, { Component } from 'react';
import { withStyles, Grid } from '@material-ui/core/';
import { FormPasswordField } from 'common/form';
import * as constants from 'constants/uiNames';
import { Link } from 'react-router-dom';
import { Save, Cancel } from '@material-ui/icons/';
import { Button } from 'common/gui';
import Notification from 'common/notification';

const styles = theme => ({
	section: {
        marginBottom: theme.spacing(1.5),
        marginTop: theme.spacing(2.5),
    },
    action: {
        marginBottom: theme.spacing(1.5),
        marginTop: theme.spacing(2.5),
        paddingBottom: theme.spacing(1.5),
    },
    subheaderIcon: {
        marginRight: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    active: {
        paddingRight: theme.spacing(2),
    }
});

class ChangePasswordForm extends Component {

    componentDidMount(){
        this.props.changeTitle(`${this.props.initialValues.username} - ${constants.PASSWORD_NEEDS_CHANGE}`);
    }

    handleCancel = () =>{
        this.props.changeTitle(constants.LOGIN_SCREEN_TITLE);
        this.props.onCancel();
    }

    render(){
        const { handleSubmit, pristine, submitting, invalid, classes, clearError, msgError } = this.props

        return(
            <>
                { msgError && msgError === constants.CREDENTIALS_EXPIRED ?
                    <Notification message={msgError} onClose={clearError} variant="warning"/> :
                     msgError && <Notification message={msgError} onClose={clearError} variant="error"/>
                }
                <form onSubmit={handleSubmit}>
                    <div className={classes.section}>
                        <Grid container spacing={2} justify="center">
                            <Grid item xs={11}>
                                <FormPasswordField
                                    name="oldPassword"
                                    label={constants.OLD_PASSWORD}
                                    disabled={submitting}
                                    inputProps={{ maxLength: 80 }}
                                />
                            </Grid>
                            <Grid item xs={11}>
                                <FormPasswordField
                                    name="newPassword"
                                    label={constants.NEW_PASSWORD}
                                    disabled={submitting}
                                    inputProps={{ maxLength: 80 }}
                                />
                            </Grid>
                            <Grid item xs={11}>
                                <FormPasswordField
                                    name="reNewPassword"
                                    label={constants.RENEW_PASSWORD}
                                    disabled={submitting}
                                    inputProps={{ maxLength: 80 }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <div className={classes.action}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Button
                                label={constants.BUTTON_SAVE}
                                icon=<Save className={classes.leftIcon}/>
                                iconAlign="left"
                                type='submit'
                                variant="submit"
                                disabled={pristine || submitting || invalid }
                                isLoading={submitting}
                            />
                            <Button
                                label={constants.BUTTON_CANCEL}
                                icon=<Cancel className={classes.leftIcon}/>
                                iconAlign="left"
                                variant="cancel"
                                disabled={submitting}
                                onClick={this.handleCancel}
                                component={Link}
                                to={"/"}
                            />
                        </Grid>
                    </div>
                </form>
            </>
        )
    }
}

export default withStyles(styles)(ChangePasswordForm);