import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Toolbar, Typography, Grid, Divider }  from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import * as constants from 'constants/uiNames';
import { LibraryBooks, Save, Cancel  } from '@material-ui/icons/';
import { FormDateField, FormTableField } from 'common/form';
import { Button, InputField } from 'common/gui';
import RegisterPositionFormContainer from 'containers/modules/iod/registers/forms/registerPositionFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    container: {
        maxWidth: '100%',
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(42.7)}px)`,
    },
    actionContainer: {
        width: '100%',
        paddingLeft: theme.spacing(5),
        margin: 0,
    },
});

class RegisterForm extends Component {
    state = {
        selected: [],
        openPositionDetails: false,
        positionAction: null,
        heads: [
            {
                id: 'name',
                label: constants.IOD_REGISTER_CPDO_POSITION_NAME,
                type: 'text',
            },
        ],
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) =>{
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let openPositionDetails = {...prevState.openPositionDetails};
            let positionAction = {...prevState.positionAction};
            selected[0] = row;
            openPositionDetails =  !this.state.openPositionDetails;
            positionAction = 'edit';
            return {selected, openPositionDetails, positionAction}
        });
    }

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    };

    handleConfirmDelete = () => {
        this.props.onDeletePosition(this.state.selected[0]);
        this.setState({positionAction: null, selected: []});
    }

    handleCloseDialog = () => {
        this.setState({positionAction: null, selected: []});
        if(this.props.error){
            this.props.clearError();
        }
    }

    handleDeletePosition = (event, action) => {
        this.setState({positionAction: action});
    }

    handleClosePositionDetails = () => {
        this.setState({
            openPositionDetails: !this.state.openPositionDetails,
            positionAction: null,
            selected:[],
        });
    }

    handleSubmitPosition = (values) => {
        this.props.onSubmitPosition(values, this.state.positionAction)
        this.handleClosePositionDetails();
    }

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    componentDidUpdate(prevProps){
        if(this.props.initialValues.positions !== prevProps.initialValues.positions){
            this.setState({
                positions: this.props.initialValues.positions,
            });
        }
    }

    render() {
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues, error } = this.props;
        const { selected, heads, positionAction, openPositionDetails } = this.state;
        return (
            <>
                {positionAction === 'delete' &&
                    <ModalDialog
                        message={constants.COORDINATOR_REALIZATION_INVOICE_DELETE_POSITION_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                { openPositionDetails ?
                    <RegisterPositionFormContainer
                        initialValues={positionAction === 'add' ? {} : selected[0]}
                        action={positionAction}
                        applications={this.props.applications}
                        contracts={this.props.contracts}
                        financialPlanPositions={this.props.financialPlanPositions}
                        investmentPlanPositions={this.props.investmentPlanPositions}
                        onSubmit={this.handleSubmitPosition}
                        onClose={this.handleClosePositionDetails}
                    />
                :
                    <form onSubmit={handleSubmit}>
                        { submitting && <Spinner /> }
                        {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                            className={classes.root}
                        >
                            <Typography variant="h6">{initialValues.name}</Typography>
                            <Divider />
                            <div className={classes.content}>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.EMPLOYEE_BASIC_INFORMATION}
                                        </Typography>
                                    </Toolbar>
                                    <Grid container spacing={1} justify="flex-start" className={classes.container}>
                                        <Grid item xs={12} sm={3}>
                                            <FormDateField
                                                name="updateDate"
                                                label={constants.IOD_REGISTER_CPDO_UPDATE_DATE}
                                                disableFuture
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <InputField
                                                name="updateUser"
                                                label={constants.IOD_REGISTER_CPDO_UPDATE_USER}
                                                disabled={true}
                                                value={initialValues.updateUser !== undefined && initialValues.updateUser !== null ?
                                                    `${initialValues.updateUser.name} ${initialValues.updateUser.surname}` :
                                                        ''}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.IOD_REGISTER_CPDO_POSITIONS}
                                        </Typography>
                                    </Toolbar>
                                    <Grid container spacing={0} justify="center" className={classes.container}>
                                        <Grid item xs={12} sm={12} >
                                            <FormTableField
                                                className={classes.tableWrapper}
                                                name="positions"
                                                head={heads}
                                                allRows={initialValues.positions}
                                                checkedRows={selected}
                                                toolbar={true}
                                                addButtonProps={{}}
                                                editButtonProps={{
                                                    disabled: selected.length === 0
                                                }}
                                                deleteButtonProps={{
                                                    disabled: selected.length === 0
                                                }}
                                                onAdd={(event) => this.handleOpenPositionDetails(event, "add")}
                                                onEdit={(event) => this.handleOpenPositionDetails(event, 'edit')}
                                                onDelete={(event) => this.handleDeletePosition(event, 'delete')}
                                                multiChecked={false}
                                                checkedColumnFirst={true}
                                                onSelect={this.handleSelect}
                                                onDoubleClick={this.handleDoubleClick}
                                                onExcelExport={this.handleExcelExport}
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
                                                disabled={pristine || submitting || invalid || submitSucceeded}
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
                                                onClick={this.handleClose}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    </form>
                }
            </>
        )
    }
}

RegisterForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};


export default withStyles(styles)(RegisterForm);