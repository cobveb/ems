import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import { Table, Button, DatePicker, SearchField, SelectField } from 'common/gui';
import { Visibility } from '@material-ui/icons/';
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
        minHeight: `calc(100vh - ${theme.spacing(37.9)}px)`,
    },
    item: {
        paddingRight: theme.spacing(1),
    },
});

class Applications extends Component {
    state = {
        selected:{},
        isDetailsVisible: false,
        year: new Date(),
        estimationType: '',
        mode: '',
        number: '',
        status: '',
        orderedObject: '',
        coordinator:'',
        sendFrom: null,
        sendTo: null,
        rows:[],
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
        ]
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDataChange = (id) => (date) => {
       this.setState({[id]: date})
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            isDetailsVisible: !this.state.isDetailsVisible,
            action: 'edit',
        });
    }

    handleCloseDetails = (application) => {
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
            selected: [],
            rows: this.filter(),
        });

    };

    handleApproveApplication = (approveLevel) => {
        if(['public','accountant'].includes(this.props.levelAccess)){
            this.props.onApproveApplication(this.state.selected);
        } else if (this.props.levelAccess){
            this.props.onApproveApplication(this.state.selected, approveLevel);
        }
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
        });
    }

    handleSendBackApplication = () => {
        this.props.onSendBackApplication(this.state.selected);
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
        });
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
                application.coordinator.code.toLowerCase().search(
                    this.state.coordinator.toLowerCase()) !== -1 &&
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
                ) &&
                (
                    (this.state.sendFrom !== null && this.state.sendTo !== null) ?
                        new Date(application.sendDate) >= this.state.sendFrom && new Date(application.sendDate) <= this.state.sendTo :
                            this.state.sendFrom !== null ?
                            new Date(application.sendDate) >= this.state.sendFrom :
                                this.state.sendFrom === null && this.state.sendTo === null ?
                                    application :
                                        new Date(application.sendDate) <= this.state.sendTo
                )
        })
    }

    handleChangeVisibleDetails = () =>{
        this.setState({isDetailsVisible: !this.state.isDetailsVisible});
    }

    handleCloseDialog = () => {
        this.props.clearError(null);
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headCells)
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.filter(),
            });
        } else if (this.state.coordinator !== prevState.coordinator ||
            this.state.status !== prevState.status ||
            this.state.mode !== prevState.mode ||
            this.state.orderedObject !== prevState.orderedObject ||
            this.state.estimationType !== prevState.estimationType ||
            this.state.sendFrom !== prevState.sendFrom ||
            this.state.sendTo !== prevState.sendTo ||
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
        const { classes, isLoading, error, modes, statuses, estimationTypes, coordinators } = this.props;
        const { selected, year, estimationType, mode, status, headCells, rows, isDetailsVisible, coordinator, orderedObject, number, sendFrom, sendTo, } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                {isDetailsVisible ?
                    <ApplicationContainer
                        initialValues={selected}
                        levelAccess={this.props.levelAccess}
                        action={'edit'}
                        estimationTypes={estimationTypes}
                        applications={[]}
                        vats={this.props.vats}
                        planPositions={[]}
                        coordinators={this.props.coordinators}
                        modes={modes}
                        planTypes={this.props.planTypes}
                        orderProcedures={this.props.orderProcedures}
                        financialPlanPositions={[]}
                        investmentPlanPositions={[]}
                        reasonsNotRealizedApplication={this.props.reasonsNotRealizedApplication}
                        statuses={statuses}
                        open={isDetailsVisible}
                        onPrint={this.handlePrintApplication}
                        onSave={()=>{}}
                        onApproveApplication={this.handleApproveApplication}
                        onSendBackApplication={this.handleSendBackApplication}
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
                                            value={number}
                                            valueType="all"
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.item}>
                                        <SelectField
                                            name="coordinator"
                                            onChange={this.handleSearch}
                                            label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_COORDINATOR}
                                            options={coordinators}
                                            value={coordinator}
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.item}>
                                        <SelectField
                                            name="estimationType"
                                            onChange={this.handleSearch}
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE}
                                            options={estimationTypes}
                                            value={estimationType}
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.item}>
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
                                    <Grid item xs={8} className={classes.item}>
                                        <SearchField
                                            name="orderedObject"
                                            onChange={this.handleSearch}
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT}
                                            valueType="all"
                                            value={orderedObject}
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.item}>
                                        <DatePicker
                                            id="sendFrom"
                                            onChange={this.handleDataChange('sendFrom')}
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SEND_DATE_FROM}
                                            value={sendFrom}
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.item}>
                                        <DatePicker
                                            id="sendTo"
                                            onChange={this.handleDataChange('sendTo')}
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SEND_DATE_TO}
                                            value={sendTo}
                                        />
                                    </Grid>
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
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                >
                                    <Button
                                        label={constants.BUTTON_PREVIEW}
                                        icon=<Visibility />
                                        iconAlign="right"
                                        variant="cancel"
                                        disabled={Object.keys(selected).length === 0}
                                        onClick = {this.handleChangeVisibleDetails}
                                        data-action="preview"
                                    />
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