import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import Spinner from 'common/spinner';
import { Button } from 'common/gui';
import { FormTextField } from 'common/form';
import { Person, Save, Cancel } from '@material-ui/icons/';


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
    container: {
        maxWidth: '100%',
    },
    item: {
        paddingRight: theme.spacing(1),
    },
});

class WorkerBasicInfoForm extends Component {
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
                                    {constants.WORKER_BASIC_INFORMATION}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={0} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={2} className={classes.item}>
                                    <FormTextField
                                        name="id"
                                        label={constants.WORKER_BASIC_INFORMATION_ID}
                                        isRequired={true}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} className={classes.item}>
                                    <FormTextField
                                        name="name"
                                        label={constants.WORKER_BASIC_INFORMATION_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <FormTextField
                                        name="surname"
                                        label={constants.WORKER_BASIC_INFORMATION_SURNAME}
                                        isRequired={true}
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
                    </div>
                </form>
            </>
        );
    };
};

export default withStyles(styles)(WorkerBasicInfoForm);
