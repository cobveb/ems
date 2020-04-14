import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { Person, AccountCircle, Lock, Save, Cancel } from '@material-ui/icons/';
import * as constants from 'constants/uiNames';
import Spinner from 'common/spinner';
import { Button } from 'common/gui';
import { FormTextField, FormPasswordField, FormCheckBox, FormSelectField } from 'common/form';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(28)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    subheaderIcon: {
        marginRight: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    active: {
        paddingRight: theme.spacing(2),
    },
    container: {
        maxWidth: '100%',
    }
});

class UserForm extends Component {

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, action, ous, initialValues, onClose } = this.props
        return(
            <>
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <Person className={classes.subheaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.USER_BASIC_INFORMATION}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={3}>
                                    <FormTextField
                                        name="name"
                                        label={constants.USER_BASIC_INFORMATION_NAME}
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <FormTextField
                                        name="surname"
                                        label={constants.USER_BASIC_INFORMATION_SURNAME}
                                        inputProps={{ maxLength: 80 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <FormSelectField
                                        name="unit"
                                        value={ous.filter(ou => ou.code === initialValues.unit).length === 1 ? initialValues.unit : ""}
                                        label={constants.USER_BASIC_INFORMATION_OU}
                                        isRequired={true}
                                        options={ous}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.section}>
                            <Divider />
                            <Toolbar className={classes.toolbar}>
                                <AccountCircle className={classes.subheaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.USER_ACCOUNT}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={3}>
                                    <FormTextField
                                        name="id"
                                        label={constants.USER_ACCOUNT_CODE}
                                        inputProps={{
                                            maxLength: 10,
                                        }}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <FormTextField
                                        name="username"
                                        label={constants.USER_ACCOUNT_USERNAME}
                                        disabled={action === "edit" ? true : false}
                                        isRequired={true}
                                        inputProps={{ maxLength: 80 }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={0} justify="flex-start"  className={classes.active}>
                                <FormCheckBox
                                    name="isActive"
                                    label={constants.USER_ACCOUNT_ACTIVE}
                                    value={false}
                                />
                                <FormCheckBox
                                    name="isLocked"
                                    label={constants.USER_ACCOUNT_LOCKED}
                                    value={false}
                                />
                            </Grid>
                        </div>
                        <div className={classes.section}>
                            <Divider />
                            <Toolbar className={classes.toolbar}>
                                <Lock className={classes.subheaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.USER_PASSWORD}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={0} justify="flex-start" alignItems="center">
                                <Grid item xs={12} sm={3}>
                                    <FormCheckBox
                                        name="isCredentialsExpired"
                                        label={constants.USER_PASSWORD_CHANGE}
                                        checked={false}
                                        defaultChecked={false}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={5} >
                                    <FormPasswordField
                                        name="password"
                                        label={constants.USER_PASSWORD_NEW}
                                        inputProps={{ maxLength: 80 }}
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
                        >
                            <Button
                                label={constants.BUTTON_SAVE}
                                icon=<Save className={classes.leftIcon}/>
                                iconAlign="left"
                                type='submit'
                                variant="submit"
                                disabled={pristine || submitting || invalid || submitSucceeded }
                            />
                            <Button
                                label={constants.BUTTON_CLOSE}
                                icon=<Cancel className={classes.leftIcon}/>
                                iconAlign="left"
                                variant="cancel"
                                onClick={onClose}
                            />
                        </Grid>
                    </div>
                </form>
            </>
        )
    }
}
export default withStyles(styles)(UserForm)