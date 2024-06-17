import React, { Component } from 'react';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Button, SplitButton, SelectField, DatePicker, SearchField } from 'common/gui';
import { TablePageable } from 'containers/common/gui';
import { Delete, Add, Edit, Visibility, Undo } from '@material-ui/icons/';
import ApplicationContainer from 'containers/modules/coordinator/publicProcurement/applications/applicationContainer';
import { setChangedSearchConditions } from 'utils';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        height: `calc(100vh - ${theme.spacing(18)}px)`,
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
        minHeight: `calc(100vh - ${theme.spacing(37.8)}px)`,
    },
    item: {
        paddingRight: theme.spacing(1),
    },
});

class Applications extends Component {
    state = {
        initData: {
            isOrderParts: true,
            isCombined: false,
            groups: []
        },
        year: new Date(),
        estimationType: '',
        mode: '',
        number: '',
        status: 'ZP',
        orderedObject: '',
        selected:{},
        rows:[],
        applications:[],
        action: '',
        headCells: [
            {
                id: 'number',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_NUMBER,
                type: 'text',
            },
            {
                id: 'orderedObject',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT,
                type: 'text',
            },
            {
                id: 'estimationType.name',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_THRESHOLD,
                type: 'object',
            },
            {
                id: 'mode.name',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE,
                type: 'object',
            },
            {
                id: 'orderValueNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_ORDER_VALUE_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'status.name',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS,
                type: 'object',
            },
        ],
        searchConditionsChange: false,
        searchConditions: [
            {
                name: 'year',
                value: new Date().getFullYear(),
                type: 'number'
            },
            {
                name: 'number',
                value: '',
                type: 'text'
            },
            {
                name: 'estimationType',
                value: '',
                type: 'select'
            },
            {
                name: 'mode',
                value: '',
                type: 'select'
            },
            {
                name: 'status',
                value: 'ZP',
                type: 'select'
            },
            {
                name: 'orderedObject',
                value: '',
                type: 'text'
            }
        ]
//        splitOptions:[
////            {
////                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_WITHDRAW_REALISATION,
////                onClick: ((event) => this.handleAction(event, 'withdrawRealisation')),
////                disabled: false,
////            },
//            {
//                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_WITHDRAW,
//                onClick: ((event) => this.handleAction(event, 'withdraw')),
//                disabled: false,
//            },
//        ],
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDataChange = (id) => (date) => {
        this.setState(prevState => {
            let searchConditions = [...prevState.searchConditions];
            let searchConditionsChange = prevState.searchConditionsChange;
            let year = `prevState.${id}`;
            const result = setChangedSearchConditions(id, date instanceof Date ? date.getFullYear() : 0, searchConditions, searchConditionsChange)

            searchConditions = Object.values(result)[0];
            searchConditionsChange = Object.values(result)[1];
            year = date;

            return {year, searchConditions, searchConditionsChange};
        });
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState({isDetailsVisible: !this.state.isDetailsVisible, action: action});
    }

    handleCloseDetails = (isAplMod) => {
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
            selected: [],
            action: ''
        });
        if(isAplMod){
            this.props.onClose(isAplMod);
        }
    };

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
        if(!['number','orderedObject'].includes(event.target.name)){
            this.onChangeSearchConditions(event);
        }
    }

    handleAction = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleConfirmDialog = (action) => {
        if(action === "delete"){
            this.props.onDelete(this.state.selected.id);
        } else {
            this.props.onWithdraw(this.state.selected.id);
        }
        this.setState({ action: '', selected: [], });
    }

    handleCloseDialog = () => {
        this.props.clearError(null);
        this.setState({ action: '' });
    }

    renderDialog = () => {
        return(
            <ModalDialog
                message={this.state.action === "delete" ?
                    constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_CONFIRM_DELETE_MSG :
                        this.state.action === "withdraw" ?
                            constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_CONFIRM_WITHDRAW_MSG :
                                constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_CONFIRM_WITHDRAW_REALISATION_MSG}
                variant={this.state.action === "delete" ? "warning" : "confirm"}
                onConfirm={() =>this.handleConfirmDialog(this.state.action)}
                onClose={this.handleCloseDialog}
            />
        )
    }

    onChangeSearchConditions = (event) => {
        event.persist();
        this.setState(prevState => {
            const searchConditions = [...prevState.searchConditions];
            let searchConditionsChange = prevState.searchConditionsChange;
            return setChangedSearchConditions(event.target.name, event.target.value, searchConditions, searchConditionsChange);
        });
    }

    handleBlur = (event) => {
        this.onChangeSearchConditions(event);
    }

    handleKeyDown = (event) => {
       if (event.key === "Enter") {
          this.onChangeSearchConditions(event);
       }
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues,
            });
        }

        if(this.state.searchConditionsChange){
            this.setState({
                searchConditionsChange: false,
                selected: {},
                action: ''
            })
            this.props.onSetSearchConditions(this.state.searchConditions);
        }
    }

    componentDidMount() {
        this.props.onSetSearchConditions(this.state.searchConditions);
        this.setState({rows: this.props.initialValues});
    }

    render(){
        const { classes, isLoading, error, estimationTypes, vats, planPositions, coordinators, modes, statuses } = this.props;
        const { initData, isDetailsVisible, action, year, rows, headCells, selected, estimationType, mode, number, orderedObject, status, splitOptions, applications, searchConditionsChange } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                {['delete','withdraw','withdrawRealisation'].includes(action) && this.renderDialog()}
                { isDetailsVisible ?
                    <ApplicationContainer
                        initialValues={action === 'add' ? initData : selected}
                        action={action}
                        estimationTypes={estimationTypes}
                        applications={applications}
                        vats={vats}
                        planPositions={planPositions}
                        coordinators={coordinators}
                        modes={modes}
                        planTypes={this.props.planTypes}
                        orderProcedures={this.props.orderProcedures}
                        financialPlanPositions={this.props.financialPlanPositions}
                        investmentPlanPositions={this.props.investmentPlanPositions}
                        reasonsNotRealizedApplication={this.props.reasonsNotRealizedApplication}
                        statuses={statuses}
                        open={isDetailsVisible}
                        onPrint={this.handlePrintApplication}
                        onClose={this.handleCloseDetails}
                    />
                :
                    <>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                            className={classes.root}
                        >
                            <Typography variant="h6">{constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_TITLE}</Typography>
                            <Divider />
                            <div className={classes.content}>
                                <Grid container spacing={0} direction="row" justify="center" className={classes.container}>
                                    <Grid item xs={2} className={classes.item}>
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
                                    <Grid item xs={2} className={classes.item}>
                                        <SearchField
                                            name="number"
                                            onChange={this.handleSearch}
                                            onBlur={this.handleBlur}
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_NUMBER}
                                            placeholder={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_NUMBER}
                                            valueType="all"
                                            value={number}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <SelectField
                                            name="estimationType"
                                            onChange={this.handleSearch}
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE}
                                            options={estimationTypes}
                                            value={estimationType}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <SelectField
                                            name="mode"
                                            onChange={this.handleSearch}
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE}
                                            options={modes}
                                            value={mode}
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.item}>
                                        <SelectField
                                            name="status"
                                            onChange={this.handleSearch}
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS}
                                            options={statuses}
                                            value={status}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className={classes.item}>
                                        <SearchField
                                            name="orderedObject"
                                            onChange={this.handleSearch}
                                            onBlur={this.handleBlur}
                                            onKeyDown={(e) => this.handleKeyDown(e)}
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT}
                                            valueType="all"
                                            value={orderedObject}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={0} direction="row" justify="flex-start" className={classes.container}>
                                    <Grid item xs={12} className={classes.item}>
                                        <TablePageable
                                            className={classes.tableWrapper}
                                            rows={rows}
                                            headCells={headCells}
                                            onSelect={this.handleSelect}
                                            onDoubleClick={this.handleDoubleClick}
                                            onExcelExport={this.handleExcelExport}
                                            resetPageableProperties={searchConditionsChange}
                                            rowKey="id"
                                            orderType={"desc"}
                                        />
                                    </Grid>
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
                            <Grid item xs={11}>
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
                                        onClick = { (event) => this.handleChangeVisibleDetails(event, 'add')}
                                        data-action="add"
                                    />
                                    <Button
                                        label={Object.keys(selected).length !== 0  && (selected.status !== undefined && selected.status.code !== 'ZP') ? constants.BUTTON_PREVIEW : constants.BUTTON_EDIT}
                                        icon={Object.keys(selected).length !== 0 && (selected.status !== undefined && selected.status.code !== 'ZP')? <Visibility/> : <Edit/>}
                                        iconAlign="right"
                                        disabled={Object.keys(selected).length === 0}
                                        variant={Object.keys(selected).length !== 0 && (selected.status !== undefined && selected.status.code !== 'ZP') ? "cancel" : "edit"}
                                        onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit')}
                                        data-action="edit"
                                    />
                                    <Button
                                        label={constants.BUTTON_DELETE}
                                        icon=<Delete/>
                                        iconAlign="right"
                                        disabled={ Object.keys(selected).length === 0 || (selected !== undefined && selected.number !== null) }
                                        onClick = {(event) => this.handleAction(event, 'delete', )}
                                        variant="delete"
                                    />

                                </Grid>
                            </Grid>
                            <Grid item xs={1}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-start"
                                >
                                    <Button
                                        label={constants.BUTTON_WITHDRAW}
                                        icon=<Undo/>
                                        iconAlign="left"
                                        disabled={Object.keys(selected).length === 0 || selected.status.code !== 'WY'}
                                        onClick = {(event) => this.handleAction(event, 'withdraw')}
                                        variant="cancel"
                                    />
                                    {/*<SplitButton
                                        options={splitOptions}
                                        variant="cancel"
                                        disabled={Object.keys(selected).length === 0 || (selected.status !== undefined && selected.status.code !== 'WY')}
                                    />*/}
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                }
            </>
        );
    };
};

Applications.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
    loading: PropTypes.func,
    onSetSearchConditions: PropTypes.func.isRequired,
};

Applications.defaultProps = {
    onSetSearchConditions: () => {},
};

export default withStyles(styles)(Applications);