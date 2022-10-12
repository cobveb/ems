import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar, InputAdornment} from '@material-ui/core/';
import { Description, LibraryBooks, Visibility, Cancel, DoneAll, Undo, CheckCircle, Print } from '@material-ui/icons/';
import { Table, Button, InputField, SearchField } from 'common/gui';
import { Spinner, ModalDialog } from 'common/';
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
        height: `calc(100vh - ${theme.spacing(68.3)}px)`,
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
        headCellsUpd:[
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
                id: 'correctionPlanPosition.amountAwardedGross',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_BEFORE_CORRECTED_GROSS,
                suffix: 'zł.',
                type: 'object',
                subtype: 'amount',
            },
            {
                id: 'amountRequestedGross',
                label: constants.COORDINATOR_PLAN_UPDATE_FINANCIAL_POSITION_AMOUNT_CORRECT,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountCorrectGross',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_CORRECT,
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
                id: 'amountAwardedCorrectGross',
                label: constants.COORDINATOR_PLAN_UPDATE_FINANCIAL_POSITION_AMOUNT_AWARDED_CORRECT,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountRealizedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'status.name',
                label: constants.ACCOUNTANT_INSTITUTION_POSITION_STATUS,
                type: 'object',
            },
        ],
        selected:{},
        isDetailsVisible: false,
        codeNameSearch: '',
        disabledApprove: true,
        planAction:'',
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

    handlePlanAction = (event, action) => {
        this.setState({planAction: action})
    }

    handleConfirmApprovePlan = () => {
        if(this.props.levelAccess === "accountant"){
            this.props.onAccountantApprovePlan();
        } else if (this.props.levelAccess === "director"){
            this.props.onChiefApprovePlan()
        }
    }

    handleConfirmWithdrawPlan = () => {
        if(this.props.levelAccess === "accountant"){
            this.props.onAccountantWithdrawPlan();
        } else if (this.props.levelAccess === "director"){
            this.props.onChiefWithdrawPlan()
        }
    }

    handleCloseDialog = () => {
        this.setState({planAction: ""})
        this.props.clearError(null);
    }

    renderDialog = () =>{
        switch (this.state.planAction){
            case "approve":
                return(
                    <ModalDialog
                        message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_APPROVE_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmApprovePlan}
                        onClose={this.handleCloseDialog}
                    />
                );
            case "withdraw":
                return(
                    <ModalDialog
                        message={constants.COORDINATOR_PLANS_CONFIRM_WITHDRAW_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmWithdrawPlan}
                        onClose={this.handleCloseDialog}
                    />
                );
            default:
                //no default;
        }
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headCells)
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
                this.setState(prevState =>{
                let rows = [...prevState.rows];
                let selected = {...prevState.selected};
                let disabledApprove = {...prevState.disabledApprove}
                rows = this.props.initialValues.planPositions;
                if(rows.filter(row => {return ['WY', 'KR'].includes(row.status.code)}).length > 0){
                    disabledApprove = true;
                } else {
                    disabledApprove = false;
                }
                if(Object.keys(selected).length > 0){
                    const index = findIndexElement(selected, this.props.initialValues.planPositions, "costTypeCode");
                    if(index !== null){
                        selected = this.props.initialValues.planPositions[index];
                    }
                }
                return {rows, selected, disabledApprove}
            });
        } else if (this.state.codeNameSearch !== prevState.codeNameSearch){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const { classes, isLoading, error, initialValues, levelAccess, disableWithdraw } = this.props;
        const { headCells, headCellsUpd, rows, selected, isDetailsVisible, disabledApprove, planAction } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}

                { planAction && this.renderDialog() }

                {isDetailsVisible ?
                    <PlanPositionsContainer
                        initialValues={selected}
                        planType={initialValues.type}
                        planStatus={initialValues.status}
                        isPlanUpdate={initialValues.isCorrected}
                        levelAccess={levelAccess}
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
                            <Typography variant="h6">{ initialValues.isCorrected ?
                                constants.ACCOUNTANT_INSTITUTION_PLANS_TITLE + ` ${initialValues.type !== undefined &&initialValues.type.name} ${initialValues.year} - ${constants.ACCOUNTANT_INSTITUTION_PLANS_UPDATE_TITLE} ${initialValues.updateNumber}`
                                :
                                    constants.ACCOUNTANT_INSTITUTION_PLANS_TITLE + ` ${initialValues.type !== undefined &&initialValues.type.name} ${initialValues.year} `}</Typography>
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
                                                value={numberWithSpaces(initialValues.amountRealizedGross) === 'NaN' ? "" : numberWithSpaces(initialValues.amountRealizedGross)}
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
                                        <CheckCircle className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.COORDINATOR_PLAN_ACCEPT_PATH}
                                        </Typography>
                                    </Toolbar>
                                    <Grid container spacing={1} justify="center" className={classes.container}>
                                        <Grid item xs={12} sm={6}>
                                            <InputField
                                                name="approveUser"
                                                label={initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
                                                    constants.ACCOUNTANT_PLAN_COORDINATOR_ACCOUNTANT_ACCEPT_USER : constants.PUBLIC_PLAN_COORDINATOR_ACCEPT_USER}
                                                disabled={true}
                                                value={initialValues.approveUser !== undefined && initialValues.approveUser !== null ?
                                                    `${initialValues.approveUser.name} ${initialValues.approveUser.surname}` :
                                                        ''}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InputField
                                                name="chiefAcceptUser"
                                                label={constants.ACCOUNTANT_PLAN_COORDINATOR_CHIEF_ACCEPT_USER}
                                                disabled={true}
                                                value={initialValues.chiefAcceptUser !== undefined && initialValues.chiefAcceptUser !== null ?
                                                    `${initialValues.chiefAcceptUser.name} ${initialValues.chiefAcceptUser.surname}` :
                                                        ''}
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
                                                headCells={initialValues.isCorrected ? headCellsUpd : headCells}
                                                onSelect={this.handleSelect}
                                                onDoubleClick={this.handleDoubleClick}
                                                onExcelExport={this.handleExcelExport}
                                                rowKey='id'
                                                defaultOrderBy="id"
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
                            <Grid item xs={1}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                >
                                    <Button
                                        label={constants.BUTTON_PRINT}
                                        icon=<Print/>
                                        iconAlign="left"
                                        variant="cancel"
                                        disabled={initialValues.status !== undefined && initialValues.status.code === 'AK'}
                                        onClick={this.props.onPrintPlan}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={10}>
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
                                        disabled={levelAccess === "accountant" ?
                                            disabledApprove || (initialValues.status !== undefined && initialValues.status !== 'UT')
                                                : (!['AK', 'RE'].includes(initialValues.status) || (initialValues.status === 'RE' && initialValues.chiefAcceptUser !== null))
                                        }
                                        onClick={(event) => this.handlePlanAction(event, 'approve')}
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
                                        disabled={levelAccess === "accountant" ?
                                            disableWithdraw || ['UT','ZA', 'RE', 'AA'].includes(initialValues.status)
                                                : (!['AE', 'AN'].includes(initialValues.status) || initialValues.chiefAcceptUser === null)
                                        }
                                        onClick = {(event) => this.handlePlanAction(event, 'withdraw')}
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

