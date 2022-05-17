import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Table, Button, SelectField, DatePicker } from 'common/gui';
import { Delete, Add, Edit, Undo, Visibility, DynamicFeed } from '@material-ui/icons/';
import PlanContainer from 'containers/modules/coordinator/plans/planContainer';

const styles = theme => ({
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
    containerBtn: {
        width: '100%',
        paddingLeft: theme.spacing(35),
        margin: 0,
    },
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
    item: {
        paddingRight: theme.spacing(1),
    },
})

class Plans extends Component {

    state = {
        rows: [],
        headCells: [
            {
                id: 'year',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR,
                type:'date',
                dateFormat: 'yyyy',
            },
            {
                id: 'type.name',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_TYPE,
                type:'object',
            },
            {
                id: 'status.name',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_STATUS,
                type: 'object',
            },
            {
                id: 'isUpdate',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_UPDATE,
                type: 'boolean',
            },
        ],
        selected: {},
        isDetailsVisible: false,
        action: null,
        type:'',
        status: '',
        year: null,
    }

    handleClose = (plan) => {
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
            selected: {},
            action: '',
            rows: this.props.onClose(plan, this.state.action),
        });
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            isDetailsVisible: !this.state.isDetailsVisible,
            action: 'edit',
        });
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headCells)
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleDataChange = (id) => (date) => {
        this.setState({[id]: date})
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    filter = () => {
        let plans = this.props.initialValues;
        return plans.filter((plan) => {
            return plan.status.code.toLowerCase().search(
                    this.state.status.toLowerCase()) !== -1 &&
                plan.type.code.toLowerCase().search(
                    this.state.type.toLowerCase()) !== -1 &&
                (
                    this.state.year === null ?
                        plan :
                            plan.year === new Date(this.state.year.getFullYear(),0,1).toJSON()
                )
        })
    }

    handleDelete = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleConfirmDelete = () => {
        this.props.onDelete(this.state.selected.id);
        this.setState({
            action: '',
            selected: {},
        });
    }

    handleWithdraw = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleConfirmWithdraw = () => {
        this.props.onWithdraw(this.state.selected.id);
        this.setState({ action: '' });
    }

    handleCancelWithdraw = () => {
        this.setState({ action: '' });
    }

    handleCloseDialog = () => {
        this.props.clearError(null);
    }

    handleChangeAction = (action) => {
        this.setState({ action: action });
    }

    handleUpdate = (event, action) => {
        this.setState({action: action})
    }

    handleConfirmUpdate = () =>{
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.filter(),
            });
        } else if (this.state.year !== prevState.year ||
            this.state.status !== prevState.status ||
            this.state.type !== prevState.type)
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
    render(){
        const { classes, initialValues, isLoading, error, statuses, types, modes } = this.props;
        const { headCells, rows, selected, isDetailsVisible, action, year, type, status } = this.state;
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
                                        message={constants.COORDINATOR_PLANS_CONFIRM_DELETE_MESSAGE}
                                        variant="warning"
                                        onConfirm={this.handleConfirmDelete}
                                        onClose={this.handleCloseDialog}
                                    />
                                )
                            case "withdraw":
                                return (
                                    <ModalDialog
                                        message={constants.COORDINATOR_PLANS_CONFIRM_WITHDRAW_MESSAGE}
                                        variant="confirm"
                                        onConfirm={this.handleConfirmWithdraw}
                                        onClose={this.handleCloseDialog}
                                    />
                                )
                            case "update":
                                return(
                                    <ModalDialog
                                        message={constants.COORDINATOR_PLANS_CONFIRM_UPDATE_MESSAGE}
                                        variant="confirm"
                                        onConfirm={this.handleConfirmUpdate}
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
                        <PlanContainer
                            initialValues={action === "add" ? {} : selected}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            action={action}
                            changeAction={this.handleChangeAction}
                            handleClose={this.handleClose}
                            types={types}
                            statuses={statuses}
                            modes={modes}
                            investmentCategories={this.props.investmentCategories}
                            plans={initialValues}
                        />
                    :
                        <>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                            >
                                <Typography variant="h6">{constants.COORDINATOR_PLANS_TITLE}</Typography>
                                <Divider />
                                <div className={classes.content}>
                                    <Grid container spacing={0} direction="row" justify="center" className={classes.container}>
                                        <Grid item xs={3} className={classes.item}>
                                            <DatePicker
                                                id="year"
                                                onChange={this.handleDataChange('year')}
                                                label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR}
                                                placeholder={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR}
                                                value={year}
                                                format="yyyy"
                                                mask="____"
                                                views={["year"]}
                                            />
                                        </Grid>
                                        <Grid item xs={4} className={classes.item}>
                                            <SelectField
                                                name="type"
                                                onChange={this.handleSearch}
                                                label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_TYPE}
                                                options={types}
                                                value={type}
                                            />
                                        </Grid>
                                        <Grid item xs={5} >
                                            <SelectField
                                                name="status"
                                                onChange={this.handleSearch}
                                                label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_STATUS}
                                                options={statuses}
                                                value={status}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={0} direction="row" justify="flex-start" className={classes.container}>
                                        <Table
                                            className={classes.tableWrapper}
                                            rows={rows}
                                            headCells={headCells}
                                            onSelect={this.handleSelect}
                                            onDoubleClick={this.handleDoubleClick}
                                            onExcelExport={this.handleExcelExport}
                                            rowKey="id"
                                            defaultOrderBy="id"
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
                                spacing={0}
                            >
                                <Grid item xs={9}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start"
                                        className={classes.containerBtn}
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
                                <Grid item xs={3}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-end"
                                        alignItems="flex-start"
                                        className={classes.container}
                                    >
                                        <Button
                                            label={constants.BUTTON_WITHDRAW}
                                            icon=<Undo/>
                                            iconAlign="left"
                                            disabled={Object.keys(selected).length === 0 || selected.status.code !== 'WY'}
                                            onClick = {(event) => this.handleWithdraw(event, 'withdraw', )}
                                            variant="cancel"
                                        />
                                        {
                                            <Button
                                                label={constants.BUTTON_UPDATE}
                                                icon=<DynamicFeed/>
                                                iconAlign="left"
                                                disabled={(Object.keys(selected).length === 0 || !['ZA','RE'].includes(selected.status.code) || selected.type.code !== 'PZP')}
                                                onClick = {(event) => this.handleUpdate(event, 'update', )}
                                                variant="cancel"
                                            />
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    }
                </div>
            </>
        );
    };

};


Plans.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
    loading: PropTypes.func,
};

export default withStyles(styles)(Plans);