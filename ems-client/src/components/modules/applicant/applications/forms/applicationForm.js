import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import Spinner from 'common/spinner';
import ModalDialog from 'common/modalDialog';
import PropTypes from 'prop-types';
import { Button, InputField } from 'common/gui';
import * as constants from 'constants/uiNames';
import { Save, Cancel, Description, LibraryBooks, Edit, Visibility, Send } from '@material-ui/icons/';
import {  FormTableField, FormDateField, FormSelectField } from 'common/form';
import ApplicationPositionFormContainer from 'containers/modules/applicant/applicationPositionFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    subheaderIcon: {
        marginRight: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        width: '100%',
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(49)}px)`,
    },
});

const headPositions = [
    { id: 'name', numeric: false, disablePadding: false, label: constants.POSITIONS_TABLE_HEAD_ROW_NAME },
    { id: 'unit.name', numeric: false, object: true, disablePadding: false, label: constants.POSITIONS_TABLE_HEAD_ROW_UNIT },
    { id: 'quantity', numeric: false, disablePadding: false, label: constants.POSITIONS_TABLE_HEAD_ROW_QUANTITY },
    { id: 'status.name', numeric: false, object: true, disablePadding: false, label: constants.POSITIONS_TABLE_HEAD_ROW_STATUS },

]

class ApplicationForm extends Component {
    state = {
        openPositionDetails: false,
        positionAction: '',
        selected: [],
        positions: this.props.initialValues.positions,
        nextValPosition: this.props.initialValues.positions.length+1,
    };

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    findIndex = (value, positions) => (
        value.id ?
            positions.findIndex(position => position.id === value.id) :
                value.positionId  ? // position not saved yet
                    positions.findIndex(position => position.positionId === value.positionId)
                        : null
    );


    handleSubmitPosition = (values) => {
        switch(this.state.positionAction){
            case 'add':
                values.positionId = this.state.nextValPosition;
                values.status = {code: 'DO', name: 'Dodana'};
                this.setState( prevState => {
                    const positions = [...prevState.positions];
                    const selected = [...prevState.selected];
                    let nextValPosition = {...prevState.nextValPosition};
                    let positionAction = {...prevState.positionAction};
                    positions.push(values);
                    nextValPosition = this.state.nextValPosition + 1;
                    positionAction = 'edit';
                    selected[0]=values;
                    this.props.handlePositions(positions);
                    return {nextValPosition, selected, positions, positionAction};
                });
                break;
            case 'edit':
                const index = this.findIndex(values, this.state.positions);
                if (index !== null){
                    this.setState( prevState => {
                        const positions = [...prevState.positions];
                        const selected = [...prevState.selected];
                        positions.splice(index, 1, values);
                        selected.splice(0, 1, values);
                        this.props.handlePositions(positions);
                        return {positions, selected};
                    });
                }
                break;
            default:
                return null;
        }
    };

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: []});
    };

    handleDeletePosition = (event, action) => {
        this.setState(state => ({ positionAction: action}));
    }

    handleCancelDelete = () => {
        this.setState({ positionAction: '' });
    }

    handleConfirmDelete = () => {
        const index = this.findIndex(this.state.selected[0], this.state.positions);
        if (index !== null){
            this.setState( prevState => {
                const positions = [...prevState.positions];
                let selected = [...prevState.selected];
                let positionAction = [...prevState.positionAction];
                positions.splice(index, 1);
                selected = []
                positionAction = ''
                this.props.handlePositions(positions);
                return {positions, selected, positionAction};
            });
        }
    }

    handleSend = () => {
        this.props.onSend();
    }

    componentDidUpdate(prevProps){
        if(this.props.initialValues.positions !== prevProps.initialValues.positions){
            this.setState({
                positions: this.props.initialValues.positions,
            });
        }
    }


    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, onClose, initialValues, coordinators, units } = this.props
        const { openPositionDetails, positionAction, selected, positions } = this.state;
        return(
            <>
                { positionAction === "delete" &&
                    <ModalDialog
                        message={constants.APPLICATION_CONFIRM_DELETE_POSITION_MESSAGE}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDelete}
                    />
                }
                { openPositionDetails
                    ?
                        <ApplicationPositionFormContainer
                            initialValues={positionAction === 'add' ? {} : selected[0]}
                            units={units}
                            action={positionAction}
                            applicationStatus={initialValues.status.code}
                            open={openPositionDetails}
                            onClose={this.handleCloseDetails}
                            onSubmit={this.handleSubmitPosition}
                        />
                    :
                        <form onSubmit={handleSubmit}>
                            { submitting && <Spinner /> }
                            <div className={classes.content}>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <Description className={classes.subheaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.HEADING}
                                        </Typography>
                                    </Toolbar>
                                    <Grid container spacing={1} justify="center" className={classes.container}>
                                        <Grid item xs={12} sm={3}>
                                            <InputField
                                                name="number"
                                                label={constants.HEADING_NUMBER}
                                                disabled
                                                value={initialValues.number ? initialValues.number : ''}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <InputField
                                                name="status"
                                                label={constants.HEADING_STATUS}
                                                disabled={true}
                                                value={initialValues.status ? initialValues.status.name : ''}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <FormDateField
                                                name="createDate"
                                                label={constants.HEADING_CREATE_DATE}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <FormDateField
                                                name="sendDate"
                                                label={constants.HEADING_SEND_DATE}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            { initialValues.status === null || initialValues.status.code === 'ZP'
                                                ?
                                                    <FormSelectField
                                                        name="coordinator"
                                                        label={constants.HEADING_COORDINATOR}
                                                        isRequired={true}
                                                        value={initialValues.coordinator !== undefined ? initialValues.coordinator : ""}
                                                        options={coordinators}
                                                    />
                                                :
                                                    <InputField
                                                        name="coordinator"
                                                        label={constants.HEADING_COORDINATOR}
                                                        disabled={true}
                                                        isRequired={true}
                                                        value={initialValues.coordinator && initialValues.coordinator.name}
                                                    />
                                            }
                                        </Grid>
                                    </Grid>
                                </div>
                                <div>
                                    <Divider />
                                    <Toolbar className={classes.toolbar}>
                                        <LibraryBooks className={classes.subheaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.POSITIONS}
                                        </Typography>
                                    </Toolbar>
                                    <Grid container spacing={0} justify="center" className={classes.container}>
                                        <Grid item xs={12} sm={12} >
                                            <FormTableField
                                                className={classes.tableWrapper}
                                                name="positions"
                                                head={headPositions}
                                                allRows={positions}
                                                checkedRows={selected}
                                                toolbar={true}
                                                addButtonProps={{
                                                    disabled : (initialValues.status === null || initialValues.status.code !== 'ZP') ? true : false
                                                }}
                                                editButtonProps={{
                                                    label : (initialValues.status === null || initialValues.status.code === 'ZP') ?  constants.BUTTON_EDIT : constants.BUTTON_PREVIEW,
                                                    icon : (initialValues.status === null || initialValues.status.code === 'ZP') ?  <Edit/> : <Visibility/>,
                                                    variant: (initialValues.status === null || initialValues.status.code === 'ZP') ?  "edit" : "cancel",
                                                }}
                                                deleteButtonProps={{
                                                    disabled : (initialValues.status === null
                                                        || initialValues.status.code === 'ZP'
                                                        ?
                                                            selected.length > 0  && (selected[0].status.code === 'DO' || selected[0].status.code === 'ZP') ?  false : true
                                                        :
                                                            true
                                                    )
                                                }}
                                                onAdd={(event) => this.handleOpenPositionDetails(event, "add")}
                                                onEdit={(event) => this.handleOpenPositionDetails(event, 'edit')}
                                                onDelete={(event) => this.handleDeletePosition(event, 'delete', )}
                                                multiChecked={false}
                                                checkedColumnFirst={true}
                                                onSelect={this.handleSelect}
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
                                    {(initialValues.status === null || initialValues.status.code === 'ZP') &&
                                        <Button
                                            label={constants.BUTTON_SAVE}
                                            icon=<Save/>
                                            iconAlign="left"
                                            type='submit'
                                            variant="submit"
                                            disabled={pristine || submitting || invalid || submitSucceeded }
                                        />
                                    }
                                    {(initialValues.status === null || initialValues.status.code === 'ZP') &&
                                        <Button
                                            label={constants.BUTTON_SEND}
                                            icon=<Send/>
                                            iconAlign="left"
                                            variant="submit"
                                            disabled={!pristine || submitting || invalid || initialValues.positions.length === 0}
                                            onClick={this.handleSend}
                                        />
                                    }
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel/>
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={onClose}
                                    />
                                </Grid>
                            </div>
                        </form>
                }
            </>
        );
    };
};

ApplicationForm.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    coordinators: PropTypes.array.isRequired,
    units: PropTypes.array.isRequired,
    initialValues: PropTypes.object.isRequired,
}

export default withStyles(styles)(ApplicationForm)