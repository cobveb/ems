import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Button } from 'common/gui';
import { Add, Cancel, Close } from '@material-ui/icons/';
import { withStyles, Dialog, Grid, Typography, Divider, DialogTitle, DialogActions, DialogContent, IconButton} from '@material-ui/core';
import { FormTableTransferListField, FormDateField } from 'common/form';

const styles = theme => ({
    dialog: {
        maxHeight: `calc(100vh - ${theme.spacing(25)}px)`,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    transferListWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(38)}px)`,
    },
});


class CostYearForm extends Component {

    state = {
        transferListHead: [
            { id: 'code', type:'text', label: 'Kod' },
            { id: 'name', type:'text', label: 'Nazwa' },
        ]
    };


    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, coordinators } = this.props;
        const { transferListHead } = this.state;
        return(
            <>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="lg"
                    disableBackdropClick={true}
                >
                    <form onSubmit={handleSubmit}>
                        <DialogTitle id="yearDetails-title" disableTypography={true}>
                            <Grid
                                container
                                direction="row"
                                spacing={1}
                            >
                                <Grid item xs={12} >
                                    <Typography variant='h6'>
                                        {constants.ACCOUNTANT_COST_TYPE_YEAR_DETAILS_TITLE}
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
                            <Grid item xs={12} >
                                <FormDateField
                                    name="year"
                                    label={constants.ACCOUNTANT_COST_TYPE_YEAR}
                                    isRequired={true}
                                    dateFormat="yyyy"
                                    mask="____"
                                    views={["year"]}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormTableTransferListField
                                    className={classes.transferListWrapper}
                                    head={transferListHead}
                                    name="coordinators"
                                    leftSideLabel = {constants.ACCOUNTANT_COST_TYPE_ALL_COORDINATORS}
                                    leftSide={coordinators.length ? coordinators : [] }
                                    rightSideLabel = {constants.ACCOUNTANT_COST_TYPE_YEAR_COORDINATORS}
                                    rightSide={initialValues.coordinators !== undefined ? initialValues.coordinators: []}
                                    orderBy="code"
                                />
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
                                    label={constants.BUTTON_ADD}
                                    icon={<Add/>}
                                    iconAlign="right"
                                    type='submit'
                                    variant={'add'}
                                    disabled={pristine || submitting || invalid || submitSucceeded }
                                />
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
        )
    }
}


CostYearForm.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    initialValues: PropTypes.object.isRequired,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    coordinators: PropTypes.array,
};

export default withStyles(styles)(CostYearForm);