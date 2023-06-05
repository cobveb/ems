import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar } from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common';
import * as constants from 'constants/uiNames';
import PropTypes from 'prop-types';
import { Save, Cancel, Description } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormTextField, FormCheckBox, FormSelectField } from 'common/form';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.1)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    active: {
        paddingRight: theme.spacing(2),
    },
    container: {
        width: '100%',
    },
    actionContainer: {
        paddingLeft: theme.spacing(5),
        margin: 0,
    },
});

class PlaceForm extends Component {

    handleCloseDialog = () => {
        this.props.clearError();
    }

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, error, initialValues, action, onClose, locations, groups } = this.props;
        return (
            <>
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    { error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                    <Typography
                        variant="h6"
                    >
                        { action === "add" ?
                            initialValues.type==='WP' ? constants.HR_PLACE_CREATE_NEW_WORKPLACE_TITLE : constants.HR_PLACE_CREATE_NEW_PLACE_TITLE
                                : `${initialValues.type==='WP' ? constants.HR_PLACE_EDIT_WORKPLACE_TITLE: constants.HR_PLACE_EDIT_PLACE_TITLE} ${initialValues.name}`
                        }
                    </Typography>
                    <Divider />
                    <div className={classes.content}>
                        <Toolbar className={classes.toolbar}>
                            <Description className={classes.subHeaderIcon} fontSize="small" />
                            <Typography variant="subtitle1" >
                                {constants.ACCOUNTANT_COST_TYPE_BASIC_INFORMATION}
                            </Typography>
                        </Toolbar>
                            <Grid container spacing={0} justify="flex-end"  className={classes.active}>
                                <FormCheckBox
                                    name="active"
                                    label={constants.HR_PLACE_ACTIVE}
                                />
                            </Grid>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={3}>
                                    <FormTextField
                                        name="id"
                                        label={constants.HR_PLACE_ID}
                                        isRequired={true}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <FormTextField
                                        name="name"
                                        label={constants.HR_PLACE_NAME}
                                        isRequired={true}
                                        inputProps={{ maxLength: 120 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormSelectField
                                        isRequired={true}
                                        name={initialValues.type==='WP' ? "group" : "location"}
                                        label={initialValues.type==='WP' ? constants.HR_WORKPLACE_SEARCH_GROUP : constants.HR_PLACE_SEARCH_LOCATION}
                                        options={initialValues.type==='WP' ? groups : locations}
                                    />
                                </Grid>
                            </Grid>
                    </div>
                    <div>
                        <Divider />
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
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
                                        icon=<Save/>
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
                                    alignItems="center"
                                >
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel/>
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={onClose}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </form>
            </>
        )
    }
}

PlaceForm.propTypes = {
    classes: PropTypes.object.isRequired,
    error: PropTypes.string,
    initialValues: PropTypes.object.isRequired,
    locations: PropTypes.array,
    changeVisibleDetails: PropTypes.func,
    handleSubmit: PropTypes.func,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    onClose: PropTypes.func,
};

export default withStyles(styles)(PlaceForm);