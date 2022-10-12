import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@material-ui/core/';
import { Close, Cancel, Settings } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormDateField } from 'common/form';

const styles = theme => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogTitle: {
        paddingBottom: theme.spacing(1),
    },
})

class GeneratorCostTypeForm extends Component {
    state = {
        generate: false,
    }


    handleCloseDialog = () => {
        this.props.clearError(null);
    }

    handleGenerateCostsTypes = () =>{
        this.setState({generate: !this.state.generate})
    }

    handleConfirmGenerate = () => {
        this.handleGenerateCostsTypes();
        this.props.onSubmit(this.props.formGeneratorValues);
        this.props.onClose();
    }

    render(){
        const { classes, open, onClose, isLoading, error,  handleSubmit, pristine, submitting, invalid, submitSucceeded } = this.props;
        const { generate } = this.state;
        return (
            <>
                <Dialog
                    open={open}
                    onClose={onClose}
                    fullWidth={true}
                    maxWidth="sm"
                    disableBackdropClick={true}
                >
                    {isLoading && <Spinner />}
                    {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                    {generate &&
                        <ModalDialog
                            message={constants.ACCOUNTANT_COST_TYPE_GENERATOR_CONFIRM_MSG}
                            variant="confirm"
                            onConfirm={this.handleConfirmGenerate}
                            onClose={this.handleGenerateCostsTypes}
                        />
                    }
                    <DialogTitle disableTypography={true} className={classes.dialogTitle}>
                        <Grid
                            container
                            direction="row"
                            spacing={0}
                            className={classes.container}
                        >
                            <Grid item xs={12} >
                                <Typography variant='h6'>
                                    {constants.ACCOUNTANT_COST_TYPE_GENERATOR_TITLE}
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
                    <DialogContent >
                        <Grid container spacing={1} justify="center" className={classes.container}>
                            <Grid item xs={12} sm={6}>
                                <FormDateField
                                    name="sourceYear"
                                    label={constants.ACCOUNTANT_COST_TYPE_GENERATOR_SOURCE_YEAR}
                                    mask="____"
                                    dateFormat="yyyy"
                                    views={["year"]}
                                    isRequired={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormDateField
                                    name="targetYear"
                                    label={constants.ACCOUNTANT_COST_TYPE_GENERATOR_TARGET_YEAR}
                                    mask="____"
                                    dateFormat="yyyy"
                                    views={["year"]}
                                    isRequired={true}
                                />
                            </Grid>
                        </Grid>
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
                                        label={constants.BUTTON_GENERATE}
                                        icon=<Settings/>
                                        iconAlign="left"
                                        onClick = {this.handleGenerateCostsTypes}
                                        disabled={pristine || submitting || invalid || submitSucceeded }
                                        variant="submit"
                                    />
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel/>
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={onClose}
                                    />
                            </Grid>
                        </DialogActions>
                </Dialog>
            </>
        )
    }
}

GeneratorCostTypeForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GeneratorCostTypeForm);