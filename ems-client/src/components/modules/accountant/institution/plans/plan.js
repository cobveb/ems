import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar, InputAdornment} from '@material-ui/core/';
import { Description, LibraryBooks, Visibility, Cancel, DoneAll, Undo } from '@material-ui/icons/';
import { Table, Button, InputField, SearchField } from 'common/gui';
import { Spinner, ModalDialog } from 'common/';
import { FormAmountField } from 'common/form';
import { numberWithSpaces, escapeSpecialCharacters, findIndexElement } from 'utils/';
import PlanPositionsContainer from 'containers/modules/accountant/institution/plans/planPositionsContainer';

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
    section: {
        marginBottom: theme.spacing(0),
    },
    tableWrapper: {
        height: `calc(100vh - ${theme.spacing(54)}px)`,
    },
    item: {
        paddingRight: theme.spacing(1),
    },
    input: {
        padding: theme.spacing(1.5),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
})

class Plan extends Component {
    state = {
        rows:[],
        headCells:[
            {
                id: 'costType.code',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_COST_TYPE,
                type: 'object',
            },
            {
                id: 'costType.name',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_COST_NAME,
                type: 'object',
            },
            {
                id: 'amountRequestedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountAwardedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
                {
                id: 'amountRealizedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        selected:{},
        isDetailsVisible: false,
        codeNameSearch: '',
        isApproveAvailable: false,
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            isDetailsVisible: !this.state.isDetailsVisible,
        });
    }

    handleChangeVisibleDetails = () =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible}));
    }

    handleClosePlanPosition = () =>{
        this.setState({
            selected: {},
            isDetailsVisible: !this.state.isDetailsVisible,
        });
    }

    handleClosePlan = () => {
        this.props.onClose(this.props.initialValues);
    }

    filter = () => {
        let planPositions = this.props.initialValues.planPositions;
        const codeNameSearch = escapeSpecialCharacters(this.state.codeNameSearch)
        return planPositions.filter(position => {
            return position.costType.code.toLowerCase().search(
                codeNameSearch.toLowerCase()) !== -1 ||
                position.costType.name.toLowerCase().search(
                codeNameSearch.toLowerCase()) !== -1
        });
    }

    handleChangeSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleApprovePlan = () => {
        this.props.onApprovePlan();
    }

    handleWithdrawPlan = () => {
        this.props.onWithdrawPlan();
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState(prevState =>{
                let rows = [...prevState.rows];
                let selected = {...prevState.selected};
                let isApproveAvailable = {...prevState.isApproveAvailable}
                rows = this.props.initialValues.planPositions;
                if(rows.filter(row => {return row.status==='WY'}).length > 0){
                    isApproveAvailable = false;
                } else {
                    isApproveAvailable = true;
                }
                if(Object.keys(selected).length > 0){
                    const index = findIndexElement(selected, this.props.initialValues.planPositions, "costTypeCode");
                    if(index !== null){
                        selected = this.props.initialValues.planPositions[index];
                    }
                }
                return {rows, selected, isApproveAvailable}
            });
        } else if (this.state.codeNameSearch !== prevState.codeNameSearch){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const { classes, isLoading, error, initialValues } = this.props;
        const { headCells, rows, selected, isDetailsVisible, isApproveAvailable } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}

                {isDetailsVisible ?
                    <PlanPositionsContainer
                        initialValues={selected}
                        planType={initialValues.type}
                        planStatus={initialValues.status}
                        onClosePosition={this.props.onClosePosition}
                        onClose={this.handleClosePlanPosition}
                    />

                :
                    <>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                        >
                            <Typography variant="h6">{constants.ACCOUNTANT_INSTITUTION_PLANS_TITLE + ` ${initialValues.type !== undefined &&initialValues.type.name} ${initialValues.year} `}</Typography>
                            <Divider />
                            <div className={classes.content}>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <Description className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.HEADING}
                                        </Typography>
                                    </Toolbar>
                                    <Grid container spacing={1} justify="center" className={classes.container}>
                                        <Grid item xs={12} sm={1}>
                                            <InputField
                                                name="year"
                                                label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR}
                                                disabled
                                                value={initialValues.year}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <InputField
                                                name="type"
                                                label={constants.COORDINATOR_PLAN_FORM_TYPE}
                                                disabled
                                                value={initialValues.type !== undefined ? initialValues.type.name : ''}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <InputField
                                                name="amountRequestedGross"
                                                label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REQUESTED_GROSS}
                                                disabled
                                                value={numberWithSpaces(initialValues.amountRequestedGross) === 'NaN' ? "" : numberWithSpaces(initialValues.amountRequestedGross) }
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">zł.</InputAdornment>,
                                                    classes: {
                                                        input: classes.input,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <InputField
                                                name="amountAwardedGross"
                                                label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_AWARDED_GROSS}
                                                disabled
                                                value={numberWithSpaces(initialValues.amountAwardedGross) === 'NaN' ? "" : numberWithSpaces(initialValues.amountAwardedGross)}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">zł.</InputAdornment>,
                                                    classes: {
                                                        input: classes.input,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <InputField
                                                name="amountRealizedGross"
                                                label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REALIZED_GROSS}
                                                disabled
                                                value={isNaN(numberWithSpaces(initialValues.amountRealizedGross)) ? "" : numberWithSpaces(initialValues.amountRealizedGross)}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">zł.</InputAdornment>,
                                                    classes: {
                                                        input: classes.input,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1">{constants.COORDINATOR_PLAN_POSITIONS_HEAD_COSTS_TYPE}</Typography>
                                    </Toolbar>
                                    <Grid container spacing={0} justify="center" className={classes.container}>
                                        <Grid item xs={12}>
                                            <SearchField
                                                name="codeNameSearch"
                                                onChange={this.handleChangeSearch}
                                                label={constants.ACCOUNTANT_INSTITUTION_POSITION_SEARCH_COST_TYPE}
                                                placeholder={constants.ACCOUNTANT_INSTITUTION_POSITION_SEARCH_COST_TYPE}
                                                valueType='all'
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <Table
                                                className={classes.tableWrapper}
                                                rows={rows}
                                                headCells={headCells}
                                                onSelect={this.handleSelect}
                                                onDoubleClick={this.handleDoubleClick}
                                                onExcelExport={this.handleExcelExport}
                                                rowKey='id'
                                                defaultOrderBy="costType.code"
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
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
                                        label={constants.BUTTON_PREVIEW}
                                        icon={<Visibility/>}
                                        iconAlign="right"
                                        disabled={Object.keys(selected).length === 0}
                                        variant={"cancel"}
                                        onClick={this.handleChangeVisibleDetails}
                                        data-action="edit"
                                    />
                                    <Button
                                        label={constants.BUTTON_APPROVE}
                                        icon=<DoneAll/>
                                        iconAlign="left"
                                        variant="submit"
                                        disabled={isApproveAvailable && initialValues.status !== undefined && initialValues.status !== 'UT'}
                                        onClick={this.handleApprovePlan}
                                    />
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel/>
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={this.handleClosePlan}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={1}>
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
                                        disabled={initialValues.status !== undefined && initialValues.status !== 'ZA'}
                                        onClick = {this.handleWithdrawPlan}
                                        variant="cancel"
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

Plan.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
};

export default withStyles(styles)(Plan);

