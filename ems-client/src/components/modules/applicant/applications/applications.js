import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Table, Button, SearchField, SelectField, DatePicker } from 'common/gui';
import { Delete, Add, Edit, Undo, Visibility } from '@material-ui/icons/';
import ApplicationContainer from 'containers/modules/applicant/applicationContainer';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
        maxWidth: '100%',
    },
    container: {
        width: '100%',
        padding: 0,
        margin: 0,
    },
    item: {
        paddingRight: theme.spacing(1),
    },
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(38.2)}px)`,
    },
    spacer: {
        flexGrow: 1,
    },
    action:{
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    }
})

class Applications extends Component {
    state = {
        rows: [],
        headCells: [
            {
                id: 'number',
                label: constants.APPLICATIONS_TABLE_HEAD_ROW_NUMBER,
                type:'text',
            },
            {
                id: 'coordinator.name',
                label: constants.APPLICATIONS_TABLE_HEAD_ROW_COORDINATOR,
                type: 'object',
            },
            {
                id: 'status.name',
                label: constants.APPLICATIONS_TABLE_HEAD_ROW_STATUS,
                type: 'object',
            },
            {
                id: 'sendDate',
                label: constants.APPLICATIONS_TABLE_HEAD_ROW_SEND_DATE,
                type: 'date',
                dateFormat: 'dd-MM-yyyy',
            },
        ],
        selected: {},
        number: '',
        status: '',
        coordinator: '',
        sendDateFrom: null,
        sendDateTo: null,
        isDetailsVisible: false,
        action:'',
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleDataChange = (id) => (date) => {
        this.setState({[id]: date})
    }


    filter = () => {
        let applications = this.props.initialValues;
        return applications.filter((application) => {
            return application.number.toLowerCase().search(
                this.state.number.toLowerCase()) !== -1 &&
                application.status.code.toLowerCase().search(
                this.state.status.toLowerCase()) !== -1 &&
                application.coordinator.code.toLowerCase().search(
                this.state.coordinator.toLowerCase()) !== -1 &&
                (this.state.sendDateFrom === null
                    ? application :
                        application.sendDate === null
                            ? null :
                                new Date(Date.parse(application.sendDate)) >= this.state.sendDateFrom
                                    ? application : null
                ) &&
                (this.state.sendDateTo === null
                    ? application :
                        application.sendDate === null
                            ? null :
                                new Date(Date.parse(application.sendDate)) <= this.state.sendDateTo
                                    ? application : null
                )
        });
    }

    componentDidUpdate(prevProps, prevState){

        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.filter(),
            });
        } else if (this.state.number !== prevState.number ||
            this.state.coordinator !== prevState.coordinator ||
            this.state.status !== prevState.status ||
            this.state.sendDateFrom !== prevState.sendDateFrom ||
            this.state.sendDateTo !== prevState.sendDateTo)
        {
            this.setState({
                rows: this.filter(),
            })
        } else if(this.state.action !== prevState.action){
            this.setState({
                            rows: this.filter(),
                        })
        }
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    handleDelete = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleClose = (application) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: {},
            action: '',
            rows: this.props.onClose(application),
        }));
    }

    handleConfirmDelete = () => {
        this.props.onDelete(this.state.selected.id);
        this.setState({
            action: '',
            selected: {},
        });
    }

    handleCloseDialog = () => {
        this.setState({ action: '' });
        this.props.clearError(null);
    }

    handleWithdraw = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleConfirmWithdraw = () => {
        this.props.onWithdraw(this.state.selected.id);
        this.setState({
            action: '',
        });
    }

    handleCancelWithdraw = () => {
        this.setState({ action: '' });
    }

    handleChangeAction = (action) => {
        this.setState({
            action: action,
        });
    }

    render(){
        const { classes, isLoading, error, coordinators, units, statusVal } = this.props;
        const { headCells, rows, selected, action, isDetailsVisible, status, coordinator, sendDateFrom, sendDateTo } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                {
                    (() => {
                        switch(action){
                            case "delete":
                                return (
                                    <ModalDialog
                                        message={constants.APPLICATIONS_CONFIRM_DELETE_MESSAGE}
                                        variant="warning"
                                        onConfirm={this.handleConfirmDelete}
                                        onClose={this.handleCloseDialog}
                                    />
                                )
                            case "withdraw":
                                return (
                                    <ModalDialog
                                        message={constants.APPLICATIONS_CONFIRM_WITHDRAW_MESSAGE}
                                        variant="confirm"
                                        onConfirm={this.handleConfirmWithdraw}
                                        onClose={this.handleCloseDialog}
                                    />
                                )
                            default:
                                return null;
                        }
                    })()
                }
                <div>
                    { isDetailsVisible ?
                        <ApplicationContainer
                            initialValues={action === "add" ? {} : selected}
                            coordinators={coordinators}
                            units={units}
                            applicationsStatus={statusVal}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            action={action}
                            changeAction={this.handleChangeAction}
                            handleClose={this.handleClose}
                        />
                    :
                        <>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                                className={classes.root}
                            >
                                <Typography variant="h6">{constants.SUBMENU_APPLICATIONS}</Typography>
                                <Divider />
                                <div className={classes.content}>
                                <Grid container spacing={0} direction="row" justify="center" className={classes.container}>
                                    <Grid item xs={3} className={classes.item}>
                                        <SearchField
                                            name="number"
                                            onChange={this.handleSearch}
                                            label={constants.APPLICATIONS_SEARCH_NUMBER}
                                            placeholder={constants.APPLICATIONS_SEARCH_NUMBER}
                                            valueType="all"
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <SelectField
                                            name="status"
                                            onChange={this.handleSearch}
                                            label={constants.APPLICATIONS_SEARCH_STATUS}
                                            options={statusVal}
                                            value={status}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <DatePicker
                                            id="sendDateFrom"
                                            onChange={this.handleDataChange('sendDateFrom')}
                                            label={constants.APPLICATIONS_SEARCH_DATE_FROM}
                                            placeholder={constants.APPLICATIONS_SEARCH_DATE_FROM}
                                            value={sendDateFrom}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <DatePicker
                                            id="sendDateTo"
                                            onChange={this.handleDataChange('sendDateTo')}
                                            label={constants.APPLICATIONS_SEARCH_DATE_TO}
                                            placeholder={constants.APPLICATIONS_SEARCH_DATE_TO}
                                            value={sendDateTo}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={0} direction="row" justify="center" className={classes.container}>
                                    <Grid item xs={12}>
                                        <SelectField
                                            name="coordinator"
                                            onChange={this.handleSearch}
                                            label={constants.APPLICATIONS_TABLE_HEAD_ROW_COORDINATOR}
                                            options={coordinators}
                                            value={coordinator}
                                        />
                                    </Grid>

                                </Grid>
                                <Grid container spacing={0} direction="row" justify="flex-start" className={classes.container}>
                                <Table
                                    className={classes.tableWrapper}
                                    rows={rows}
                                    headCells={headCells}
                                    onSelect={this.handleSelect}
                                    rowKey="id"
                                    defaultOrderBy="number"
                                />
                                </Grid>
                                </div>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                                className={classes.container}
                            >
                                <Grid item xs={10}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start"
                                    >
                                        <Button
                                            label={constants.BUTTON_ADD}
                                            icon=<Add/>
                                            iconAlign="right"
                                            variant="add"
                                            onClick = { (event) => this.handleChangeVisibleDetails(event, 'add', )}
                                            data-action="add"
                                        />
                                        <Button
                                            label={Object.keys(selected).length !== 0  && selected.status.code !== 'ZP' ? constants.BUTTON_PREVIEW : constants.BUTTON_EDIT}
                                            icon={Object.keys(selected).length !== 0 && selected.status.code !== 'ZP'? <Visibility/> : <Edit/>}
                                            iconAlign="right"
                                            disabled={Object.keys(selected).length === 0}
                                            variant={Object.keys(selected).length !== 0 && selected.status.code !== 'ZP' ? "cancel" : "edit"}
                                            onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                            data-action="edit"
                                        />
                                        <Button
                                            label={constants.BUTTON_DELETE}
                                            icon=<Delete/>
                                            iconAlign="right"
                                            disabled={Object.keys(selected).length === 0 || selected.status.code !== 'ZP'}
                                            onClick = {(event) => this.handleDelete(event, 'delete', )}
                                            variant="delete"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={2}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                    >
                                        <Button
                                            label={constants.BUTTON_WITHDRAW}
                                            icon=<Undo/>
                                            iconAlign="left"
                                            disabled={Object.keys(selected).length === 0 || selected.status.code !== 'WY'}
                                            onClick = {(event) => this.handleWithdraw(event, 'withdraw', )}
                                            variant="cancel"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    }
                </div>
            </>
        )
    }
}

Applications.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
};

export default withStyles(styles)(Applications);