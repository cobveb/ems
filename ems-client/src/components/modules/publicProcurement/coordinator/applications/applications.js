import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import { Button, DatePicker, SearchField, SelectField } from 'common/gui';
import { TablePageable } from 'containers/common/gui';
import { Visibility } from '@material-ui/icons/';
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
        status: this.props.levelAccess === "public" ? 'WY' :
            this.props.levelAccess === "accountant" ? 'AD' :
                ["DIRECTOR", "ECONOMIC"].includes(this.props.role) ? 'AZ' : 'AK',
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
                id: 'coordinator.name',
                label: constants.PUBLIC_MENU_COORDINATOR,
                type: 'object',
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
        headCellsPublic: [
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
                id: 'coordinator.name',
                label: constants.PUBLIC_MENU_COORDINATOR,
                type: 'object',
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
            {
                id: 'isPublicRealization',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PUBLIC_REALIZATION,
                type: 'boolean',
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
                name: 'coordinator',
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
                value: this.props.levelAccess ==="public" ? 'WY' :
                    this.props.levelAccess === "accountant" ? 'AD' :
                        ["DIRECTOR", "ECONOMIC"].includes(this.props.role) ? 'AZ' : 'AK',
                type: 'select'
            },
            {
                name: 'orderedObject',
                value: '',
                type: 'text'
            },
            {
                name: 'sendFrom',
                value: '',
                type: 'date'
            },
            {
                name: 'sendTo',
                value: '',
                type: 'date'
            }
        ],
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDataChange = (id) => (date) => {
        this.setState(prevState => {
            let searchConditions = [...prevState.searchConditions];
            let searchConditionsChange = prevState.searchConditionsChange;
            switch(id) {
                case "sendTo":
                    let sendTo = `prevState.${id}`;
                    sendTo = date;
                    if(!isNaN(date)){
                        const sendToResult = setChangedSearchConditions(id, date instanceof Date ? date : '', searchConditions, searchConditionsChange)
                        searchConditions = Object.values(sendToResult)[0];
                        searchConditionsChange = Object.values(sendToResult)[1];
                    }
                    return {sendTo, searchConditions, searchConditionsChange};
                case "sendFrom":
                    let sendFrom = `prevState.${id}`;
                    sendFrom = date;
                    if(!isNaN(date)){
                        const sendFromResult = setChangedSearchConditions(id, date instanceof Date ? date : '', searchConditions, searchConditionsChange)
                        searchConditions = Object.values(sendFromResult)[0];
                        searchConditionsChange = Object.values(sendFromResult)[1];
                    }
                    return {sendFrom, searchConditions, searchConditionsChange};
                default:
                    let year = `prevState.${id}`;
                    if(!isNaN(date)){
                        const yearResult = setChangedSearchConditions(id, date instanceof Date ? date.getFullYear() : 0, searchConditions, searchConditionsChange)
                        year = date;
                        searchConditions = Object.values(yearResult)[0];
                        searchConditionsChange = Object.values(yearResult)[1];
                    }
                    return {year, searchConditions, searchConditionsChange};
            }
        });
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
        if(!['number','orderedObject'].includes(event.target.name)){
            this.onChangeSearchConditions(event);
        }
    }

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            isDetailsVisible: !this.state.isDetailsVisible,
            action: 'edit',
        });
    }

    handleCloseDetails = (application) => {
        this.setState( prevState => {
            let selected = {...prevState.selected};
            let rows = [...prevState.rows];
            let isDetailsVisible = prevState.isDetailsVisible;

            isDetailsVisible = !this.state.isDetailsVisible;
            selected = [];
            return {selected, rows, isDetailsVisible};
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

    handleChangeVisibleDetails = () =>{
        this.setState({isDetailsVisible: !this.state.isDetailsVisible});
    }

    handleCloseDialog = () => {
        this.props.clearError(null);
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.props.levelAccess === "public" ? this.state.headCellsPublic : this.state.headCells)
    }

    onChangeSearchConditions = (event) => {
        event.persist();
        this.setState(prevState => {
            const searchConditions =  [...prevState.searchConditions];
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
            this.props.onSetSearchConditions(this.state.searchConditions)
            this.setState({
                searchConditionsChange: false,
                selected: {},
            })
        }
    }

    componentDidMount() {
        this.props.onSetSearchConditions(this.state.searchConditions);
        this.setState({rows: this.props.initialValues});
    }

    render(){
        const { classes, isLoading, error, modes, statuses, estimationTypes, coordinators, levelAccess } = this.props;
        const { selected, year, estimationType, mode, status, headCells, headCellsPublic, rows, isDetailsVisible, coordinator, orderedObject, number, sendFrom, sendTo, searchConditionsChange } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                {isDetailsVisible ?
                    <ApplicationContainer
                        initialValues={selected}
                        levelAccess={levelAccess}
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
                                            onBlur={this.handleBlur}
                                            onKeyDown={(e) => this.handleKeyDown(e)}
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
                                            onBlur={this.handleBlur}
                                            onKeyDown={(e) => this.handleKeyDown(e)}
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
                                            <TablePageable
                                                className={classes.tableWrapper}
                                                rows={rows}
                                                headCells={levelAccess === 'public' ? headCellsPublic : headCells}
                                                onSelect={this.handleSelect}
                                                onDoubleClick={this.handleDoubleClick}
                                                onExcelExport={this.handleExcelExport}
                                                resetPageableProperties={searchConditionsChange}
                                                rowKey="id"
                                                orderBy={this.props.searchConditions.sort.orderBy !== undefined ? {id: this.props.searchConditions.sort.orderBy} : {id: "id"}}
                                                orderType={this.props.searchConditions.sort.orderType !== undefined ? this.props.searchConditions.sort.orderType : "desc"}
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
    onSetSearchConditions: PropTypes.func,
};

Applications.defaultProps = {
    onSetSearchConditions: () => {},
};

export default withStyles(styles)(Applications);