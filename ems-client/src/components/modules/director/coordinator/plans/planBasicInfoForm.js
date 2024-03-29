import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Button, InputField, SearchField } from 'common/gui';
import * as constants from 'constants/uiNames';
import { FormTableField, FormAmountField} from 'common/form';
import { Cancel, Description, LibraryBooks, CheckCircle, DoneAll, PriorityHigh, Visibility, Redo, FolderOpen, Info, Print } from '@material-ui/icons/';
import PlanPositionRemarksFormContainer from 'containers/modules/accountant/coordinator/plans/forms/planPositionRemarksFormContainer.js';
import PlanInvestmentPositionFormContainer from 'containers/modules/accountant/coordinator/plans/forms/planInvestmentPositionFormContainer.js';
import PlanPositionRealizationContainer from 'containers/modules/coordinator/plans/planPositionRealizationContainer';
import { escapeSpecialCharacters } from 'utils/';
import PlanFinancialContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planFinancialContentPositionFormContainer';

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
        marginBottom: theme.spacing(0),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        width: '100%',
    },
    containerBtn: {
        width: '100%',
        paddingLeft: theme.spacing(5),
        margin: 0,
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(66.5)}px)`,
    },
});


class PlanBasicInfoForm extends Component {
    state = {
        planAction: null,
        approveType: null,
        openRemarks: false,
        returnCoordinator: false,
        openRealization: false,
        openFinancialPositionDetails: false,
        positions: this.props.initialValues.positions,
        codeNameSearch: '',
        selected:[],
        headFin: [
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
            {
                id: 'isDescCor',
                label: constants.COORDINATOR_PLAN_POSITION_HEAD_COORDINATOR_DESCRIPTION,
                type: 'boolean',
            },
            {
                id: 'isDescMan',
                label: constants.COORDINATOR_PLAN_POSITION_HEAD_MANAGEMENT_DESCRIPTION,
                type: 'boolean',
            },
        ],
        headFinUpd: [
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
                id: 'amountCorrectGross',
                label: constants.COORDINATOR_PLAN_UPDATE_FINANCIAL_POSITION_AMOUNT_CORRECT,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountRequestedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
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
            {
                id: 'isDescCor',
                label: constants.COORDINATOR_PLAN_POSITION_HEAD_COORDINATOR_DESCRIPTION,
                type: 'boolean',
            },
            {
                id: 'isDescMan',
                label: constants.COORDINATOR_PLAN_POSITION_HEAD_MANAGEMENT_DESCRIPTION,
                type: 'boolean',
            },
        ],
        headInv: [
            {
                id: 'task',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK,
                type: 'text',
            },
            {
                id: 'taskPositionGross',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_TASK_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountRequestedGross',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'expensesPositionAwardedGross',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_AWARDED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountRealizedGross',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_REALIZED_PLAN_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'isDescCor',
                label: constants.COORDINATOR_PLAN_POSITION_HEAD_COORDINATOR_DESCRIPTION,
                type: 'boolean',
            },
            {
                id: 'isDescMan',
                label: constants.COORDINATOR_PLAN_POSITION_HEAD_MANAGEMENT_DESCRIPTION,
                type: 'boolean',
            },
        ],
        headInvUpd: [
            {
                id: 'task',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK,
                type: 'text',
            },
            {
                id: 'correctionPlanPosition.taskPositionGross',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_TASK,
                suffix: 'zł.',
                type: 'object',
                subtype: 'amount',
            },
            {
                id: 'correctionPlanPosition.expensesPositionAwardedGross',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_EXPENSES,
                suffix: 'zł.',
                type: 'object',
                subtype: 'amount',
            },
            {
                id: 'amountCorrect',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_TASK_CORRECTED,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'expensesAmountCorrect',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_EXPENSES_CORRECTED,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'taskPositionGross',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_TASK_CORRECTED,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'expensesPositionAwardedGross',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_EXPENSES_CORRECTED,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountRealizedGross',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_REALIZED_PLAN_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        headPzp: [
            {
                id: 'assortmentGroup.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP,
                type: 'object',
            },
            {
                id: 'orderType.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDER_TYPE,
                type: 'object',
            },
            {
                id: 'estimationType.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE,
                type: 'object',
            },
            {
                id: 'amountRequestedNet',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'initiationTerm',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_INITIATION_TERM,
                suffix: 'zł.',
                type: 'text',
            },
        ],
    };

    handleClose = () =>{
        this.props.onClose(this.props.initialValues);
        this.props.reset();
    };

    handleCancelClose = () => {
        this.setState({formChanged: false});
    }

    handleConfirmClose = () => {
        this.setState({formChanged: false});
        this.props.onClose();
        this.props.reset();
    }

    handleApprove = (event, approveType) => {
        this.setState({ planAction: 'approve', approveType: approveType });
    }

    handleCancelApprove = () => {
        this.setState({ planAction: null, approveType: null });
    }

    handleConfirmApprove = () => {
        if(this.state.approveType === 'approveDirector') {
            this.props.onApproveDirector();
        } else if (this.state.approveType === 'approveEconomic'){
            this.props.onApproveEconomic();
        } else {
            this.props.onApproveChief();
        }
        this.setState({
            selected: [],
            planAction: null,
            approveType: null,
        })
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleReturnCoordinator = () => {
        this.setState({ returnCoordinator: !this.state.returnCoordinator})
    }

    handleConfirmReturn = () => {
        this.props.onReturnPlan();
        this.props.reset();
    }

    handleRemarks = () =>{
        this.setState({
            openRemarks: true,
        });
    }

    handleRemarksPosition = (values) =>{
        this.props.onRemarksPlanPosition(values);
        this.setState({
            openRemarks: !this.state.openRemarks,
            selected: [],
        });
    }

    handleOpenRealization = () => {
        this.setState({openRealization: !this.state.openRealization})
    }

    handleCloseRealization = () => {
        this.setState({openRealization: !this.state.openRealization, selected: [],})
    }

    handleOpenFinancialPositionDetails = () => {
        this.setState({openFinancialPositionDetails: !this.state.openFinancialPositionDetails})
    }

    handleCloseFinancialPositionDetails = () => {
        this.setState({openFinancialPositionDetails: !this.state.openFinancialPositionDetails, selected: []})
    }

    handleCloseDialog = () => {
        this.setState({
            openRemarks: !this.state.openRemarks,
            selected: [],
        });
    };

    handleDoubleClick = (row) =>{
        if(this.props.initialValues.type.code === "FIN"){
            this.setState(prevState =>{
                const selected = [...prevState.selected];
                let openRemarks = {...prevState.openRemarks};
                selected[0] = row;
                openRemarks = true;
                return {selected, openRemarks}
            });
        } else if(['INW', 'PZP'].includes(this.props.initialValues.type.code)){
            this.setState(prevState =>{
                const selected = [...prevState.selected];
                let isDetailsVisible: {...prevState.isDetailsVisible};
                selected[0] = row;
                isDetailsVisible = true;
                return {selected, isDetailsVisible}
            })
        }
    }

    handleChangeVisibleDetails = () =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible}));
    }

    handleChangeSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    filter = () => {
        const {initialValues} = this.props;
        let planPositions = this.props.initialValues.positions;
        const codeNameSearch = escapeSpecialCharacters(this.state.codeNameSearch)
        if(initialValues.type !== undefined && planPositions.length > 0){
            switch(initialValues.type.code){
                case("FIN"):
                    return planPositions.filter(position => {
                        return position.costType.code.toLowerCase().search(
                            codeNameSearch.toLowerCase()) !== -1 ||
                            position.costType.name.toLowerCase().search(
                            codeNameSearch.toLowerCase()) !== -1
                    });
                case("INW"):
                    return planPositions.filter(position => {
                        return position.task.toLowerCase().search(
                            codeNameSearch.toLowerCase()) !== -1
                    });
                case("PZP"):
                    return planPositions.filter(position => {
                        return position.assortmentGroup.name.toLowerCase().search(
                            codeNameSearch.toLowerCase()) !== -1
                    });
                default:
                    return null;
            };
        }
    }

    handleExcelExport = (exportType) => {
        const {initialValues} = this.props;
        const {headFin, headInv, headPzp} = this.state;
        this.props.onExcelExport(exportType, initialValues.type !== undefined && initialValues.type.code === "FIN" ?
            headFin : initialValues.type !== undefined && initialValues.type.code === "INV" ? headInv :
                headPzp)
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues.positions !== prevProps.initialValues.positions){
            this.setState({
                positions: this.props.initialValues.positions,
            });
        }

        /* Filter position */
        if (this.state.codeNameSearch !== prevState.codeNameSearch){
            this.setState({
                positions: this.filter(),
            })
        }
        /* Filter positions on close position details */
        if(this.state.action === '' && this.state.action !== prevState.action){
            this.setState({
                positions: this.filter(),
            });
        }
    }

    render(){
        const { handleSubmit, submitting, classes, initialValues } = this.props
        const { headFin, headFinUpd, headInv, headInvUpd, headPzp, selected, positions, planAction, openRemarks,
            isDetailsVisible, returnCoordinator, openRealization, codeNameSearch, openFinancialPositionDetails } = this.state;
        return(
            <>
                { planAction &&
                    <ModalDialog
                        message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_APPROVE_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmApprove}
                        onClose={this.handleCancelApprove}
                    />
                }
                { openRemarks &&
                    <PlanPositionRemarksFormContainer
                        initialValues={this.state.selected[0]}
                        planStatus={initialValues.status.code}
                        planType={initialValues.type.code}
                        open={openRemarks}
                        level="director"
                        onSubmit={this.handleRemarksPosition}
                        onClose={this.handleCloseDialog}
                    />
                }
                { returnCoordinator &&
                    <ModalDialog
                        message={constants.DIRECTOR_PLAN_COORDINATOR_CONFIRM_RETURN_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmReturn}
                        onClose={this.handleReturnCoordinator}
                    />
                }
                {openRealization &&
                    <PlanPositionRealizationContainer
                        initialValues={selected[0]}
                        planType={initialValues.type.code}
                        open={openRealization}
                        onClose={this.handleCloseRealization}
                    />
                }
                {openFinancialPositionDetails &&
                    <PlanFinancialContentPositionFormContainer
                        initialValues={selected[0]}
                        planStatus={initialValues.status.code}
                        planUpdate={initialValues.isUpdate}
                        action={"edit"}
                        vats={this.props.vats}
                        units={[]}
                        costsTypes={[]}
                        onSubmitPlanSubPosition={()=>{}}
                        onDeletePlanSubPosition={()=>{}}
                        onExcelExport={this.handleExcelExport}
                        onClose={this.handleCloseFinancialPositionDetails}
                        onSubmit={()=>{}}
                    />
                }
                {isDetailsVisible ?
                    <PlanInvestmentPositionFormContainer
                        initialValues={selected[0]}
                        planType={initialValues.type}
                        planStatus={initialValues.status}
                        fundingSources={this.props.fundingSources}
                        levelAccess={""}
                        onSubmit={this.handleSubmitPosition}
                        onClose={this.handleChangeVisibleDetails}
                    />
                :
                    <form onSubmit={handleSubmit}>
                        { submitting && <Spinner /> }
                        <Typography
                            variant="h6"
                        >
                            { Object.keys(initialValues).length > 1 &&
                                constants.DIRECTOR_COORDINATOR_PLAN_TITLE + `${initialValues.type.name} - ${initialValues.coordinator.name} - ${initialValues.year} `
                            }
                        </Typography>
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
                                    <Grid item xs={12} sm={3}>
                                        <InputField
                                            name="year"
                                            label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR}
                                            value={initialValues.year !== undefined ? initialValues.year : ''}
                                            isRequired={true}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <InputField
                                            name="type"
                                            label={constants.COORDINATOR_PLAN_FORM_TYPE}
                                            disabled={true}
                                            isRequired={true}
                                            value={initialValues.type !== undefined ? initialValues.type.name : ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={5}>
                                        <InputField
                                            name="status"
                                            label={constants.HEADING_STATUS}
                                            disabled={true}
                                            value={initialValues.status !== undefined ? initialValues.status.name : ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={initialValues.type !== undefined && initialValues.type.code === 'FIN' ? 4 : 6}>
                                        <FormAmountField
                                            name={initialValues.type !== undefined && (initialValues.type.code === 'FIN' ||  initialValues.type.code === 'INW')?
                                                "planAmountRequestedGross" : "planAmountRequestedNet"}
                                            label={initialValues.type !== undefined && (initialValues.type.code === 'FIN' || initialValues.type.code === 'INW') ?
                                                constants.COORDINATOR_PLAN_FINANCIAL_REQUESTED_VALUE : constants.COORDINATOR_PLAN_PUBLIC_PROCUREMENT_REQUESTED_VALUE}
                                            suffix={'zł.'}
                                            disabled
                                        />
                                    </Grid>
                                    { (initialValues.type !== undefined && initialValues.type.code === 'FIN') &&
                                        <Grid item xs={12} sm={4}>
                                            <FormAmountField
                                                name="planAmountAwardedGross"
                                                label={constants.COORDINATOR_PLAN_FINANCIAL_AWARDED_VALUE}
                                                suffix={'zł.'}
                                                disabled
                                            />
                                        </Grid>
                                    }
                                    <Grid item xs={12} sm={initialValues.type !== undefined && initialValues.type.code === 'FIN' ? 4 : 6}>
                                        <FormAmountField
                                            name={initialValues.type !== undefined && initialValues.type.code === 'FIN' ?
                                                "planAmountRealizedGross" : "planAmountRealizedNet"}
                                            label={initialValues.type !== undefined && initialValues.type.code === 'FIN' ?
                                                constants.COORDINATOR_PLAN_FINANCIAL_REALIZED_VALUE : constants.COORDINATOR_PLAN_PUBLIC_PROCUREMENT_REALIZED_VALUE}
                                            suffix={'zł.'}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                                <Toolbar className={classes.toolbar}>
                                    <CheckCircle className={classes.subHeaderIcon} fontSize="small" />
                                    <Typography variant="subtitle1" >
                                        {constants.COORDINATOR_PLAN_ACCEPT_PATH}
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={12} sm={4}>
                                        <InputField
                                            name="sendUser"
                                            label={constants.COORDINATOR}
                                            disabled={true}
                                            value={initialValues.sendUser !== undefined && initialValues.sendUser !== null ?
                                                `${initialValues.sendUser.name} ${initialValues.sendUser.surname}` :
                                                    ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <InputField
                                            name={initialValues.type !== undefined && initialValues.type.code === 'FIN' ? "planAcceptUser" : "publicAcceptUser" }
                                            label={initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
                                                constants.ACCOUNTANT_PLAN_COORDINATOR_ACCOUNTANT_ACCEPT_USER : constants.PUBLIC_PLAN_COORDINATOR_ACCEPT_USER}
                                            disabled={true}
                                            value={initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
                                                initialValues.planAcceptUser !== undefined && initialValues.planAcceptUser !== null ?
                                                    `${initialValues.planAcceptUser.name} ${initialValues.planAcceptUser.surname}` :
                                                        ''
                                                : initialValues.publicAcceptUser !== undefined && initialValues.publicAcceptUser !== null ?
                                                    `${initialValues.publicAcceptUser.name} ${initialValues.publicAcceptUser.surname}` :
                                                        ''
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <InputField
                                            name="directorAcceptUser"
                                            label={constants.ACCOUNTANT_PLAN_COORDINATOR_DIRECTOR_ACCEPT_USER}
                                            disabled={true}
                                            value={initialValues.directorAcceptUser !== undefined && initialValues.directorAcceptUser !== null ?
                                                `${initialValues.directorAcceptUser.name} ${initialValues.directorAcceptUser.surname}` :
                                                    ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputField
                                            name={initialValues.type !== undefined && initialValues.type.code !== 'PZP' ? "economicAcceptUser" : "planAcceptUser" }
                                            label={initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
                                                constants.ACCOUNTANT_PLAN_COORDINATOR_ECONOMIC_ACCEPT_USER : constants.ACCOUNTANT_PLAN_COORDINATOR_ACCOUNTANT_ACCEPT_USER}
                                            disabled={true}
                                            value={initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
                                                initialValues.economicAcceptUser !== undefined && initialValues.economicAcceptUser !== null ?
                                                    `${initialValues.economicAcceptUser.name} ${initialValues.economicAcceptUser.surname}` :
                                                    ''
                                                : initialValues.planAcceptUser !== undefined && initialValues.planAcceptUser !== null ?
                                                    `${initialValues.planAcceptUser.name} ${initialValues.planAcceptUser.surname}` :
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
                            <div>
                                <Toolbar className={classes.toolbar}>
                                    <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                    <Typography variant="subtitle1" >
                                        { initialValues.type !== undefined && initialValues.type.code === "FIN" ? constants.COORDINATOR_PLAN_POSITIONS_HEAD_COSTS_TYPE :
                                            initialValues.type !== undefined && initialValues.type.code === "INW" ? constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASKS :
                                               constants.POSITIONS
                                        }
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={0} justify="center" className={classes.container}>
                                    <Grid item xs={12}>
                                        <SearchField
                                            name="codeNameSearch"
                                            onChange={this.handleChangeSearch}
                                            label={this.props.initialValues.type !== undefined && (
                                                this.props.initialValues.type.code === 'FIN' ? constants.ACCOUNTANT_INSTITUTION_POSITION_SEARCH_COST_TYPE :
                                                    this.props.initialValues.type.code === 'PZP' ? constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP :
                                                        constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK
                                            )}
                                            valueType='all'
                                            value={codeNameSearch}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} >
                                        <FormTableField
                                            className={classes.tableWrapper}
                                            name="positions"
                                            head={initialValues.type !== undefined && initialValues.type.code === "FIN" ?
                                                    initialValues.isUpdate ? headFinUpd : headFin
                                                : initialValues.type !== undefined && initialValues.type.code === "INW" ?
                                                    initialValues.isUpdate ? headInvUpd : headInv
                                                    : headPzp
                                            }
                                            allRows={positions}
                                            checkedRows={selected}
                                            toolbar={false}
                                            checkedColumnFirst={true}
                                            onSelect={this.handleSelect}
                                            onDoubleClick={this.handleDoubleClick}
                                            onExcelExport={this.handleExcelExport}
                                            orderBy="id"
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
                                className={classes.container}
                            >
                                <Grid item xs={1}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                    >
                                        <Button
                                            label={constants.BUTTON_PRINT}
                                            icon=<Print/>
                                            iconAlign="left"
                                            variant="cancel"
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
                                        className={classes.containerBtn}
                                    >
                                        {(initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
                                                initialValues.status !== undefined && ['AK','AD','AE',].includes(initialValues.status.code)
                                            :
                                                initialValues.status !== undefined && ['AZ','AK'].includes(initialValues.status.code)) &&
                                            <>
                                                <Button
                                                    label={initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
                                                        initialValues.status.code === 'AK' ? constants.BUTTON_APPROVE_DIRECTOR
                                                            : initialValues.status.code === 'AD' ? constants.BUTTON_APPROVE_ECONOMIC
                                                                : constants.BUTTON_APPROVE_CHIEF
                                                    :
                                                        initialValues.status.code === 'AZ' ? constants.BUTTON_APPROVE_DIRECTOR
                                                            : constants.BUTTON_APPROVE_CHIEF
                                                        }
                                                    icon=<DoneAll/>
                                                    iconAlign="left"
                                                    variant="submit"
                                                    onClick={initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
                                                        initialValues.status.code === 'AK' ? (event) => this.handleApprove(event, "approveDirector")
                                                            : initialValues.status.code === 'AD' ? (event) => this.handleApprove(event, "approveEconomic")
                                                                : (event) => this.handleApprove(event, "approveChief")
                                                    :
                                                        initialValues.status.code === 'AZ' ? (event) => this.handleApprove(event, "approveDirector")
                                                            : (event) => this.handleApprove(event, "approveChief")
                                                    }
                                                />
                                            </>
                                        }
                                        {((initialValues.type !== undefined && ['FIN','PZP'].includes(initialValues.type.code)) &&
                                            (initialValues.status !== undefined && ['AZ','AK', 'AE','AD'].includes(initialValues.status.code)))  &&
                                            <Button
                                                label={constants.BUTTON_RETURN_COORDINATOR}
                                                icon=<Redo/>
                                                iconAlign="left"
                                                variant="delete"
                                                onClick={this.handleReturnCoordinator}
                                            />
                                        }
                                        { (initialValues.type !== undefined && initialValues.type.code === "INW") &&
                                            <Button
                                                label={constants.BUTTON_PREVIEW}
                                                icon={<Visibility/>}
                                                iconAlign="right"
                                                disabled={Object.keys(selected).length === 0}
                                                variant={"cancel"}
                                                onClick={this.handleChangeVisibleDetails}
                                                data-action="edit"
                                            />
                                        }

                                        { (initialValues.type !== undefined && initialValues.type.code === "FIN") &&
                                            <Button
                                                label={constants.BUTTON_REMARKS}
                                                icon=<PriorityHigh/>
                                                iconAlign="left"
                                                variant="cancel"
                                                disabled={selected.length === 0 ||  selected.length > 1}
                                                onClick={this.handleRemarks}
                                            />
                                        }
                                        {initialValues.type !== undefined &&
                                            <Button
                                                label={constants.ACCOUNTANT_MENU_REALIZATION}
                                                icon=<FolderOpen />
                                                iconAlign="left"
                                                variant="add"
                                                disabled={selected.length === 0}
                                                onClick={this.handleOpenRealization}
                                            />
                                        }
                                        { (initialValues.type !== undefined && initialValues.type.code === "FIN") &&
                                            <Button
                                                label={constants.BUTTON_DETAILS}
                                                icon=<Info />
                                                iconAlign="left"
                                                variant="cancel"
                                                disabled={selected.length === 0 || selected.length > 1}
                                                onClick={this.handleOpenFinancialPositionDetails}
                                            />
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={1}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-end"
                                        alignItems="flex-start"
                                        className={classes.container}
                                    >
                                        <Button
                                            label={constants.BUTTON_CLOSE}
                                            icon=<Cancel/>
                                            iconAlign="left"
                                            variant="cancel"
                                            onClick={this.handleClose}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </form>
                }
            </>
        );
    };
};

PlanBasicInfoForm.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
}

export default withStyles(styles)(PlanBasicInfoForm)
