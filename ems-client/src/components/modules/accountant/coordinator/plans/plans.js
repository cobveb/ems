import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Table, Button, SelectField, DatePicker } from 'common/gui';
import { PostAdd, Visibility } from '@material-ui/icons/';
import PlanContainer from 'containers/modules/accountant/coordinator/plans/planContainer';

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
                id: 'coordinator.name',
                label: constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_COORDINATOR,
                type:'object',
            },
            {
                id: 'type.name',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_TYPE,
                type:'object',
            },
            {
                id: 'planAmountRequestedGross',
                label: constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REQUESTED_GROSS,
                suffix: 'zł.',
                type:'amount',
            },
            {
                id: 'planAmountAwardedGross',
                label: constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_AWARDED_GROSS,
                suffix: 'zł.',
                type:'amount',
            },
            {
                id: 'planAmountRealizedGross',
                label: constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REALIZED_GROSS,
                suffix: 'zł.',
                type:'amount',
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
        coordinator:'',
        status: '',
        year: null,
    }

    handleClose = (plan) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: {},
            action: '',
            rows: this.props.onClose(plan),
        }));
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
                plan.coordinator.code.toLowerCase().search(
                    this.state.coordinator.toLowerCase()) !== -1 &&
                (
                    this.state.year === null ?
                        plan :
                            plan.year === this.state.year.getFullYear()
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

    handleCloseDialog = () => {
        this.props.clearError(null);
    }

    handleChangeAction = (action) => {
        this.setState({ action: action });
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.filter(),
            });
        } else if (this.state.year !== prevState.year ||
            this.state.status !== prevState.status ||
            this.state.coordinator !== prevState.coordinator)
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
        const { classes, initialValues, isLoading, error, coordinators, statuses, onSubmitPlan } = this.props;
        const { headCells, rows, selected, isDetailsVisible, action, year, coordinator, status } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}

                <div>
                    { isDetailsVisible ?
                        <PlanContainer
                            initialValues={action === "add" ? {} : selected}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            action={action}
                            levelAccess="accountant"
                            changeAction={this.handleChangeAction}
                            handleClose={this.handleClose}
                            statuses={statuses}
                            investmentCategories={this.props.investmentCategories}
                            plans={initialValues}
                            onSubmitPlan={onSubmitPlan}
                        />
                    :
                        <>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                            >
                                <Typography variant="h6">{constants.ACCOUNTANT_COORDINATOR_PLANS_TITLE}</Typography>
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
                                                name="coordinator"
                                                onChange={this.handleSearch}
                                                label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_COORDINATOR}
                                                options={coordinators}
                                                value={coordinator}
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
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start"
                                    >
                                        <Button
                                            label={Object.keys(selected).length !== 0 && selected.status.code === 'RO' ?
                                                constants.BUTTON_CONSIDER :
                                                    Object.keys(selected).length !== 0 && selected.status.code === 'WY' ?
                                                        constants.BUTTON_RECEIVE :
                                                            constants.BUTTON_PREVIEW}
                                            icon={Object.keys(selected).length !== 0 && (selected.status.code === 'WY' || selected.status.code === 'RO') ? <Visibility/> : <PostAdd/>}
                                            iconAlign="right"
                                            disabled={Object.keys(selected).length === 0}
                                            variant={Object.keys(selected).length !== 0 && selected.status.code === 'RO' ? "add" :
                                                Object.keys(selected).length !== 0 && selected.status.code === 'WY' ? "submit" :
                                                    "cancel"}
                                            onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                            data-action="edit"
                                        />
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