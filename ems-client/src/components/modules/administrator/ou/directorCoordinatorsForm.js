import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Spinner } from 'common/';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@material-ui/core/';
import { Button } from 'common/gui';
import { Save, Cancel, Close } from '@material-ui/icons/';
import { FormTableField } from 'common/form';

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
    container: {
        width: '100%',
    },
});

class DirectorCoordinatorsForm extends Component {
    state = {
        head: [
            {
                id: 'code',
                label: constants.ORGANIZATION_UNIT_COORDINATOR_CODE,
                type: 'text',
            },
            {
                id: 'name',
                label: constants.ORGANIZATION_UNIT_COORDINATOR_NAME,
                type: 'text',
            },
        ],
        selected:[],
    };

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    handleSelect = (coordinators) =>{
        this.setState({
            selected: coordinators,
        });
    }
    render(){
        const { classes, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, unassignedCoordinators } = this.props;
        const { head, selected } = this.state;
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
                                        {constants.ORGANIZATION_UNIT_DIRECTOR_COORDINATORS_TITLE}
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
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={12}>
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="directorCoordinators"
                                        head={head}
                                        allRows={unassignedCoordinators}
                                        checkedRows={selected}
                                        toolbar={false}
                                        multiChecked={true}
                                        checkedColumnFirst={true}
                                        onSelect={this.handleSelect}
                                        orderBy="code"
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
                                    label={constants.BUTTON_ADD}
                                    icon={<Save/>}
                                    iconAlign="left"
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

DirectorCoordinatorsForm.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(DirectorCoordinatorsForm);