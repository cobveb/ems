import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core/';
import { Close, Save, Cancel } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormTextField, FormDigitsField } from 'common/form';

const styles = theme => ({
    dialog: {
        maxHeight: `calc(100vh - ${theme.spacing(25)}px)`,
        overflow: 'auto',
        width: '100%',
        paddingBottom: 0,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    container: {
        width: '100%',
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    tableWrapper: {
        overflow: 'auto',
        height: theme.spacing(15),
    },
});

class ApplicationCriterionForm extends Component {
    state = {
    }
    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    handleOpenPartDetails = (event, action) => {
        this.setState({openPartDetails: !this.state.openPartDetails, partAction: action});
    };

    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, action, initialValues, applicationStatus } = this.props;
        return(
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="md"
                    disableBackdropClick={true}
                >
                    { submitting && <Spinner /> }

                    <form onSubmit={handleSubmit}>
                        <DialogTitle id="positionDetails-title" disableTypography={true}>
                            <Grid
                                container
                                direction="row"
                                spacing={0}
                                className={classes.container}
                            >
                                <Grid item xs={12} >
                                    <Typography variant='h6'>
                                        { action === "add" ?
                                            constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_TITLE_CREATE
                                                :  constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_TITLE_EDIT + ` ${initialValues.name}`
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
                            <div className={classes.section}>
                                <Grid container spacing={1}>
                                    <Grid item xs={2}>
                                        <FormDigitsField
                                            isRequired={true}
                                            name="value"
                                            inputProps={{
                                                maxLength: 3,
                                            }}
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_CRITERIA_VALUE}
                                            disabled = {applicationStatus !== undefined && applicationStatus.code !== 'ZP'}
                                        />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <FormTextField
                                            isRequired={true}
                                            name="name"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_CRITERIA_NAME}
                                            inputProps={{ maxLength: 120 }}
                                            disabled = {applicationStatus !== undefined && applicationStatus.code !== 'ZP'}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormTextField
                                            name="scoringDescription"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_SCORING_DESCRIPTION}
                                            multiline
                                            inputProps={{ maxLength: 256 }}
                                            disabled = {applicationStatus !== undefined && applicationStatus.code !== 'ZP'}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Divider />
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                                {(applicationStatus !== undefined && applicationStatus.code === 'ZP') &&
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save/>
                                        iconAlign="right"
                                        type='submit'
                                        variant='submit'
                                        disabled={pristine || submitting || invalid || submitSucceeded }
                                    />
                                }
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

ApplicationCriterionForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationCriterionForm);