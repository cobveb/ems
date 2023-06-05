import React, { Component } from 'react';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Table, Button, SplitButton, SelectField, DatePicker, SearchField } from 'common/gui';
import { Delete, Add, Edit, Visibility, Undo } from '@material-ui/icons/';
import ApplicationContainer from 'containers/modules/coordinator/publicProcurement/applications/applicationContainer';

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
        status: '',
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
        this.setState({[id]: date})
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState({isDetailsVisible: !this.state.isDetailsVisible, action: action});
    }

    handleCloseDetails = (application) => {
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
            selected: [],
            rows: this.props.onClose(application),
            action: ''
        });
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

    handleSaveApplication = (values) =>{
        this.props.onSave(values)
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    filter = () => {
        let applications = this.props.initialValues;
        let estimationTypes = this.props.estimationTypes

        if(estimationTypes.filter(estimationType => estimationType.code === '').length === 0 ){
            estimationTypes.unshift(
            {
                code: '',
                name: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE,
            })
        }

        return applications.filter((application) => {
            return application.status.code.toLowerCase().search(
                    this.state.status.toLowerCase()) !== -1 &&
                application.mode.code.toLowerCase().search(
                    this.state.mode.toLowerCase()) !== -1 &&
                (
                    this.state.estimationType !== '' ?
                    application.estimationType !== undefined ?
                        application.estimationType.code.toLowerCase().search(
                            this.state.estimationType.toLowerCase()) !== -1
                        : null
                    : application
                ) &&
                (
                    this.state.orderedObject !== '' ?
                    application.orderedObject !== null ?
                        application.orderedObject.toLowerCase().search(
                            this.state.orderedObject.toLowerCase()) !== -1
                        : null
                    : application
                ) &&
                (
                    this.state.number !== '' ?
                        application.number !== null ?
                            application.number.toLowerCase().search(
                                this.state.number.toLowerCase()) !== -1
                        : null
                    : application
                )  &&
                (
                    this.state.year === null ?
                        application :
                            new Date(application.createDate).getFullYear() === this.state.year.getFullYear()
                )
        })
    }

    setupApplications = () => {
        /*
            Function returns application that can be the source if the current application is the replay
        */
        let tmp = this.props.initialValues;

        tmp = tmp.filter(application => application.number !== null && ['RE', 'ZR', 'AN'].includes(application.status.code));
        if (tmp.length > 0){
            tmp.forEach(application => {
                Object.assign(application,
                {
                    code: application.code = application.id.toString(),
                    name: application.name = application.number,
                })
            })
            return (tmp)
        } else {
            return [];
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
        this.setState({ action: '', selected: []});
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

    componentDidUpdate(prevProps, prevState){
//        if( this.state.selected !== prevState.selected){
//            if(this.state.selected.status !== undefined && this.state.selected.status.code !== 'ZP'){
//                this.setState(prevState => {
//                    const splitOptions = [...prevState.splitOptions];
//                    if(this.state.selected.status.code === 'WY')
//                        splitOptions[0].disabled = true;
////                    if(this.state.selected.status.code === 'ZA'){
////                        splitOptions[1].disabled = true;
////                    }
//                    return {splitOptions}
//                });
//            }
//        }
        // Filter rows on close application
        if(this.state.action === '' && this.state.action !== prevState.action){
            this.setState({
                rows: this.filter(),
            });
        }
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.filter(),
                applications: this.setupApplications(),
            });
        } else if (this.state.status !== prevState.status ||
            this.state.mode !== prevState.mode ||
            this.state.orderedObject !== prevState.orderedObject ||
            this.state.estimationType !== prevState.estimationType ||
            this.state.number !== prevState.number)
        {
            this.setState({
             rows: this.filter(),
            })
        } else if (this.state.year !== prevState.year){
            this.props.onChangeYear(this.state.year);
        }
    }

    render(){
        const { classes, isLoading, error, estimationTypes, vats, planPositions, coordinators, modes, statuses } = this.props;
        const { initData, isDetailsVisible, action, year, rows, headCells, selected, estimationType, mode, number, orderedObject, status, splitOptions, applications } = this.state;
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
                        onSave={this.handleSaveApplication}
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
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT}
                                            valueType="all"
                                            value={orderedObject}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={0} direction="row" justify="flex-start" className={classes.container}>
                                    <Grid item xs={12} className={classes.item}>
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
};

export default withStyles(styles)(Applications);