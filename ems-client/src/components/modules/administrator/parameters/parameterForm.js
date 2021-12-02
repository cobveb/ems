import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core/';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Button } from 'common/gui';
import { Save, Close } from '@material-ui/icons/';
import { FormTextField, FormSelectField } from 'common/form';

const styles = theme => ({
    dialog: {
        minHeight: `calc(100vh - ${theme.spacing(40)}px)`,
        height: `calc(100vh - ${theme.spacing(40)}px)`,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    icon: {
        marginLeft: theme.spacing(1),
    },
    desc: {
        padding: theme.spacing(2,3),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    subheaderIcon: {
        marginRight: theme.spacing(1),
    },
})


class ParameterForm extends Component {
    state = {
        booleanType: [
            {
                code:'',
                name:'',
            },
            {
                code: 1,
                name: "Tak",
            },
            {
                code: 0,
                name: "Nie",
            }
        ]
    }

    render(){
        const {classes, open, onClose, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues} = this.props;
        const {booleanType} = this.state;
        return (
            <>
                <Dialog
                    open={open}
                    onClose={onClose}
                    fullWidth={true}
                    maxWidth="md"
                    disableBackdropClick={true}
                >
                    { submitting && <Spinner /> }
                    <form onSubmit={handleSubmit}>
                        <DialogTitle id="parameterDetails-title" disableTypography={true}>
                            <Grid
                                container
                                direction="row"
                                spacing={1}
                            >
                                <Grid item xs={12} >
                                    <Typography variant='h6'>
                                        {constants.PARAMETER_DETAILS_TITLE}
                                    </Typography>
                                    <IconButton aria-label="Close"
                                        className={classes.closeButton}
                                        onClick={onClose}
                                    >
                                        <Close fontSize='small'/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                            </Grid>
                        </DialogTitle>
                        <DialogContent
                            className={classes.dialog}
                        >
                            <Grid
                                container
                                spacing={1}
                                justify="center"
                            >
                                <Grid item xs={6} >
                                    <FormTextField
                                        name="category"
                                        label={constants.PARAMETER_CATEGORY}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6} >
                                    <FormTextField
                                        name="section"
                                        label={constants.PARAMETER_SECTION}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormTextField
                                        name="code"
                                        label={constants.PARAMETER_CODE}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={9} >
                                    <FormTextField
                                        name="name"
                                        label={constants.PARAMETER_NAME}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="description"
                                        label={constants.PARAMETER_DESCRIPTION}
                                        placeholder={constants.PARAMETER_DESCRIPTION}
                                        multiline
                                        value={initialValues.description}
                                        rows="5"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        initialValues.valueType === "N" || initialValues.valueType === "C" ?
                                            <FormTextField
                                                name="value"
                                                label={constants.PARAMETER_VALUE}
                                                valueType={initialValues.valueType === "N" ? "numbers" : "all"}
                                            /> :
                                            <FormSelectField
                                                name="value"
                                                value={initialValues.value ? initialValues.value : ""}
                                                label={constants.PARAMETER_VALUE}
                                                options={booleanType}
                                            />
                                    }
                                    </Grid>
                                </Grid>
                        </DialogContent>
                        <DialogActions className={classes.desc}>
                            <Grid
                                container
                                direction="row"
                            >
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                                <Grid item xs={12} >
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start"
                                    >
                                        <Button
                                            label={constants.BUTTON_SAVE}
                                            icon=<Save className={classes.icon}/>
                                            iconAlign="right"
                                            type='submit'
                                            variant="submit"
                                            disabled={pristine || submitting || invalid || submitSucceeded }
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </form>
                </Dialog>
            </>
        )
    }
}

ParameterForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ParameterForm);