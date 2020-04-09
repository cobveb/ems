import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { LocationCity, MyLocation, Contacts, Save } from '@material-ui/icons/';
import * as constants from 'constants/uiNames';
import Spinner from 'common/spinner';
import { FormTextField } from 'common/form';
import { Button } from 'common/gui';

const styles = theme => ({
    section: {
        marginBottom: theme.spacing(1),
    },
    subheaderIcon: {
        marginRight: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
});

const nipMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
const regonMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
const zipCodeMask = [/\d/, /\d/, ' ', '-', ' ', /\d/, /\d/, /\d/,];
const phoneMask = ['+', '4','8',' ','(', /[1-9]/, /\d/,')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

class InstitutionForm extends Component {

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues } = this.props
        return (
            <form onSubmit={handleSubmit}>
                { submitting && <Spinner /> }
                <div className={classes.section}>
                    <Toolbar className={classes.toolbar}>
                        <LocationCity className={classes.subheaderIcon} fontSize="small" />
                        <Typography variant="subtitle1" >
                            {constants.INSTITUTION_BASIC_INFORMATION}
                        </Typography>
                    </Toolbar>
                    <Grid container spacing={1} justify="center">
                        <Grid item xs={12} sm={3}>
                            <FormTextField
                                name="code"
                                label={constants.INSTITUTION_BASIC_INFORMATION_CODE}
                                isRequired={true}
                                inputProps={{ maxLength: 10 }}
                                disabled={initialValues ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <FormTextField
                                name="shortName"
                                label={constants.INSTITUTION_BASIC_INFORMATION_SHORT_NAME}
                                isRequired={true}
                                inputProps={{ maxLength: 80 }}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <FormTextField
                                name="name"
                                label={constants.INSTITUTION_BASIC_INFORMATION_NAME}
                                isRequired={true}
                                inputProps={{ maxLength: 120 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormTextField
                                name="nip"
                                label={constants.INSTITUTION_BASIC_INFORMATION_NIP}
                                mask={nipMask}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormTextField
                                name="regon"
                                label={constants.INSTITUTION_BASIC_INFORMATION_REGON}
                                mask={regonMask}
                            />
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.section}>
                    <Divider />
                    <Toolbar className={classes.toolbar} >
                        <MyLocation className={classes.subheaderIcon} fontSize="small"/>
                        <Typography variant="subtitle1" >
                           {constants.INSTITUTION_ADDRESS}
                        </Typography>
                    </Toolbar>
                    <Grid container spacing={1} justify="center">
                        <Grid item xs={12} sm={9}>
                            <FormTextField
                                name="city"
                                label={constants.INSTITUTION_ADDRESS_CITY}
                                inputProps={{ maxLength: 30 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormTextField
                                name="zipCode"
                                label={constants.INSTITUTION_ADDRESS_ZIP_CODE}
                                mask={zipCodeMask}
                            />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <FormTextField
                                name="street"
                                label={constants.INSTITUTION_ADDRESS_STREET}
                                inputProps={{ maxLength: 50 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormTextField
                                name="building"
                                label={constants.INSTITUTION_ADDRESS_BUILDING}
                                inputProps={{ maxLength: 5 }}
                            />
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.section}>
                    <Divider/>
                    <Toolbar className={classes.toolbar} >
                        <Contacts className={classes.subheaderIcon} fontSize="small" />
                        <Typography variant="subtitle1" >
                            {constants.INSTITUTION_CONTACTS}
                        </Typography>
                    </Toolbar>
                    <Grid container spacing={1} justify="flex-start" direction="row" alignItems="flex-start">
                        <Grid item xs={12} sm={3}>
                            <FormTextField
                                name="phone"
                                label={constants.INSTITUTION_CONTACTS_PHONE}
                                mask={phoneMask}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormTextField
                                name="fax"
                                label={constants.INSTITUTION_CONTACTS_FAX}
                                mask={phoneMask}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormTextField
                                name="email"
                                label={constants.INSTITUTION_CONTACTS_EMAIL}
                                isRequired={true}
                            />
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.section}>
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
                    </Grid>
                </div>
            </form>
        )
    }
}

export default withStyles(styles)(InstitutionForm)
