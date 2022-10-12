import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Button, InputField, SearchField } from 'common/gui';
import * as constants from 'constants/uiNames';
import { FormDateField, FormTableField, FormAmountField} from 'common/form';
import { Save, Cancel, Send, Description, LibraryBooks, Edit, Visibility, CheckCircle, Print, DoneAll, Redo, FolderOpen } from '@material-ui/icons/';
import PlanUpdateFinancialContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planUpdateFinancialContentPositionFormContainer';
import PlanUpdateInvestmentContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planUpdateInvestmentContentPositionFormContainer';
import PlanUpdatePublicProcurementContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planUpdatePublicProcurementContentPositionFormContainer';
import { findIndexElement, escapeSpecialCharacters } from 'utils/';
import PlanPositionRealizationContainer from 'containers/modules/coordinator/plans/planPositionRealizationContainer';

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
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(70.5)}px)`,
    },
});


class PlanBasicInfoForm extends Component {
    state = {
        openPositionDetails: false,
        positionAction: '',
        positions: this.props.initialValues.positions,
        selected:[],
        send: false,
        formChanged : false,
        notExistCorrectedPositions: false,
        isAgreed: false,
        approveLevel: null,
        openRealization: false,
        codeNameSearch:'',
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
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_AWARDED_AFTER_CORRECTED_GROSS,
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
                label: constants.HEADING_STATUS,
                type: 'object',
            },
        ],
        headInv: [
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
                id: 'correctionPlanPosition.amountRequestedNet',
                label: constants.COORDINATOR_PLAN_UPDATE_PUBLIC_POSITION_VALUE,
                suffix: 'zł.',
                type: 'object',
                subtype: 'amount',
            },
            {
                id: 'amountCorrect',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_CORRECT,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountRequestedNet',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_CORRECTED,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountRealizedNet',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_NET,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
    };

    handleClose = () =>{
        if((this.props.pristine === false  && this.state.codeNameSearch === '') || (this.props.pristine === true  && this.state.codeNameSearch !== '')){
            this.setState({formChanged: !this.state.formChanged});
        } else {
            this.props.onClose(this.props.initialValues);
            this.props.reset();
        }
    };

    handleCancelClose = () => {
        this.setState({formChanged: false});
    }

    handleConfirmClose = () => {
        this.setState({formChanged: false});
        this.props.onClose(this.props.initialValues);
        this.props.reset();
    }

    handleSubmitPosition = (values, action) =>{
        if(this.props.initialValues.type.code === 'PZP'){
            this.setState({
                openPositionDetails: !this.state.openPositionDetails,
                selected: [],
                positionAction: '',
                notExistCorrectedPositions: (((values.correctionPlanPosition === undefined && values.amountAwardedGross !== undefined)
                    || values.amountAwardedGross !== values.correctionPlanPosition) ? false : true),
            });
        }
        this.props.onSubmitPlanPosition(values, this.state.positionAction);
    }

    handleSubmitSubPosition = (values, action) =>{
        const {formFinancialValues, formPublicProcurementValues, formInvestmentValues} = this.props;

        const formValues = this.props.initialValues.type.code === 'FIN' ?
            formFinancialValues : this.props.initialValues.type.code === 'PZP' ?
                formPublicProcurementValues : formInvestmentValues;

        const payload = JSON.parse(JSON.stringify(formValues));

        if(action === 'add'){
            let sumAmountRequestedNet = 0;
            let sumAmountRequestedGross = 0;
            // If add no first subPosition
            if(formValues.amountRequestedNet !== undefined){
                sumAmountRequestedNet = formValues.amountRequestedNet
                sumAmountRequestedGross = formValues.amountRequestedGross
            }
            payload.subPositions.push(values);
            payload.amountRequestedNet = parseFloat((sumAmountRequestedNet + values.amountNet).toFixed(2));
            payload.amountRequestedGross =  parseFloat((sumAmountRequestedGross + values.amountGross).toFixed(2));
        } else if (action === 'edit'){
            const idx = findIndexElement(values, payload.subPositions, "positionId");
            if(idx !== null){
                if(this.props.initialValues.type.code !== 'FIN') {
                    let sumAmountRequestedNet = formValues.amountRequestedNet - formValues.subPositions[idx].amountNet;
                    let sumAmountRequestedGross = formValues.amountRequestedGross - formValues.subPositions[idx].amountGross;
                    payload.amountRequestedNet = parseFloat((sumAmountRequestedNet + values.amountNet).toFixed(2));
                    payload.amountRequestedGross =  parseFloat((sumAmountRequestedGross + values.amountGross).toFixed(2));
                    payload.subPositions.splice(idx, 1, values);
                } else {
                    let sumAmountRequestedNet = 0;
                    let sumAmountRequestedGross = 0;
                    payload.subPositions.splice(idx, 1, values);
                    payload.subPositions.forEach(subPos => {
                        sumAmountRequestedNet =  sumAmountRequestedNet + subPos.amountNet;
                        sumAmountRequestedGross =  sumAmountRequestedGross + subPos.amountGross;
                    })
                    payload.amountRequestedNet = sumAmountRequestedNet;
                    payload.amountRequestedGross = sumAmountRequestedGross;
                }
            }
        }
        this.props.onSubmitPlanSubPosition(payload, "correct")
    }

    handleDeleteSubPosition = (values) =>{
        const {formFinancialValues, formPublicProcurementValues} = this.props;

        const formValues = this.props.initialValues.type.code === 'FIN' ? formFinancialValues : formPublicProcurementValues;

        let sumAmountRequestedNet = formValues.amountRequestedNet - values.amountNet;
        let sumAmountRequestedGross = formValues.amountRequestedGross - values.amountGross;
        const payload = JSON.parse(JSON.stringify(formValues));
        payload.amountRequestedNet = sumAmountRequestedNet;
        payload.amountRequestedGross = sumAmountRequestedGross;
        const index = findIndexElement(values, payload.subPositions, "positionId");
        if (index !== null){
            payload.subPositions.splice(index, 1);
        }
        this.props.onDeletePlanSubPosition(payload, values)
    }

    handleConfirmApprovePlan = (event, levelAccess) => {
        switch(levelAccess){
            case 'sendBack':
                this.props.onSendBack()
                this.setState({approvePlanAction: null});
            break;
            default:
                this.props.onApprovePlan(levelAccess)
                this.setState({approvePlanAction: null});
            break;
        }
    }

    renderApproveDialog = () => {
        return(
            <ModalDialog
                message={["public", "director", "accountant", "chief" ].includes(this.state.approveLevel) ? constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_APPROVE_MESSAGE :
                    constants.COORDINATOR_PLANS_CONFIRM_SEND_BACK_MESSAGE
                }
                variant="confirm"
                onConfirm={(event) => this.handleConfirmApprovePlan(event, this.state.approveLevel)}
                onClose={() => this.setState(prevState =>{
                    return{
                        ...prevState,
                        approveLevel: null,
                    }
               })}
            />
        )
    }

    handleApproveAction = (event, level) => {
        this.setState({approveLevel: level});
    }

    renderPlanContent = () =>{
        const { initialValues, vats, units, costsTypes, modes, assortmentGroups, orderTypes, estimationTypes, foundingSources} = this.props;
        const { positionAction, selected } = this.state;
        switch(initialValues.type.code){
            case("FIN"):
                return (
                    <PlanUpdateFinancialContentPositionFormContainer
                        initialValues={positionAction === 'add' ? {vat: vats[1]} : selected[0]}
                        planStatus={initialValues.status.code}
                        planUpdate={initialValues.isUpdate}
                        correctedPlanValue={initialValues.correctionPlan.planAmountAwardedGross}
                        action={positionAction}
                        vats={vats}
                        costsTypes={costsTypes}
                        units={units}
                        onSubmitPlanSubPosition={this.handleSubmitSubPosition}
                        onDeletePlanSubPosition={this.handleDeleteSubPosition}
                        onExcelExport={this.handleExcelExport}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmitPosition}
                    />
                );
            case("INW"):
                return (
                    <PlanUpdateInvestmentContentPositionFormContainer
                        initialValues={positionAction === 'add' ? {vat: vats[2], subPositions:[], positionFundingSources:[]} : selected[0]}
                        planStatus={initialValues.status.code}
                        planYear={initialValues.year}
                        action={positionAction}
                        foundingSources={foundingSources}
                        unassignedUnits={this.props.unassignedUnits}
                        investmentCategories={this.props.investmentCategories}
                        vats={vats}
                        onSubmitPlanSubPosition={this.handleSubmitSubPosition}
                        onDeleteTargetUnit={this.props.onDeleteTargetUnit}
                        onDeleteSource={this.props.onDeleteSource}
                        onExcelExport={this.handleExcelExport}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmitPosition}
                    />
                );
            case("PZP"):
                return(
                    <PlanUpdatePublicProcurementContentPositionFormContainer
                        initialValues={positionAction === 'add' ? {vat: vats[1]} : selected[0]}
                        planStatus={initialValues.status.code}
                        action={positionAction}
                        modes={modes}
                        vats={vats}
                        units={units}
                        assortmentGroups={assortmentGroups}
                        orderTypes={orderTypes}
                        estimationTypes={estimationTypes}
                        euroExchangeRate={this.props.euroExchangeRate}
                        onSubmitPlanSubPosition={this.handleSubmitSubPosition}
                        onDeletePlanSubPosition={this.handleDeleteSubPosition}
                        onExcelExport={this.handleExcelExport}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmitPosition}
                    />
                )
            default:
                return null;
        };
    };

    handleSend = () => {
        this.setState({ send: true });
    }

    handleCancelSend = () => {
        this.setState({ send: false });
    }

    handleConfirmSend = () => {
        this.props.onSendPlan();
        this.setState({
            selected: [],
            send: false,
        })
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) =>{
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let openPositionDetails = {...prevState.openPositionDetails};
            let positionAction = {...prevState.positionAction};
            selected[0] = row;
            openPositionDetails =  !this.state.openPositionDetails;
            positionAction = 'correct';
            return {selected, openPositionDetails, positionAction}
        });
    }

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    };

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: [], positionAction: '',});
        if(this.props.initialValues.type.code !== "PZP"){
            this.props.setNewPositionToNull();
        }
    };

    handleOpenRealization = () => {
        this.setState({openRealization: !this.state.openRealization})
    }

    handleCloseRealization = () => {
        this.setState({openRealization: !this.state.openRealization, selected: [],})
    }

    handleChangeSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    filter = () => {
        const {initialValues} = this.props;
        let planPositions = this.props.initialValues.positions;
        const codeNameSearch = escapeSpecialCharacters(this.state.codeNameSearch)
        if(initialValues.type !== undefined){
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

    handleExcelExport = (exportType, level, headRow, positionId) => {
        const {headFin, headInv, headPzp} = this.state;
        const {initialValues} = this.props;
        let head = [];
        if(level === "subPositions"){
            head = headRow;
        } else {
           head = initialValues.type !== undefined && initialValues.type.code === "FIN" ?
                headFin : initialValues.type !== undefined && initialValues.type.code === "INW" ? headInv :
                    headPzp;
        }
        this.props.onExcelExport(exportType, head, level === undefined ? "position" : "subPositions", positionId)
    }

    findCorrectedPosition = () =>{
        const correctedPositions = this.state.positions.filter(position => position.amountCorrect !== null && position.amountCorrect !== 0)
        return correctedPositions.length > 0 ? false : true;
    }

    setupAgreedPlan = (positions) => {
        if(positions.filter(position => position.status.code !== 'UZ').length === 0){
            if(!this.state.isAgreed){
                this.setState({ isAgreed: true });
            }
        }
    }

    componentDidUpdate(prevProps, prevState){
        // Used in investments plan
        if(this.state.positionAction === 'add' && this.props.newPosition !== null){
            this.setState(prevState =>{
                const selected =  [...prevState.selected];
                let positionAction = {...prevState.positionAction}
                selected[0] = this.props.newPosition;
                positionAction = 'correct';
                return {selected, positionAction}
            })
        }

        if(this.state.selected.length > 0 && this.state.positionAction === 'correct'){
            const index = findIndexElement(this.state.selected[0], this.props.initialValues.positions, "positionId");
            if(index !== null){
                if(this.props.initialValues.positions[index] !== this.state.selected[0] ){
                    this.setState(prevState =>{
                        let positions = [...prevState.positions];
                        let notExistCorrectedPositions = prevState.notExistCorrectedPositions;
                        const selected = [...prevState.selected];
                        positions= this.props.initialValues.positions;
                        notExistCorrectedPositions = this.findCorrectedPosition();
                        selected[0] = positions[index];
                        return {positions, selected, notExistCorrectedPositions}
                   })
                }
            }
        }

        if(this.props.initialValues.positions !== prevProps.initialValues.positions){
            this.setState({
                positions: this.props.initialValues.positions,
                notExistCorrectedPositions: this.findCorrectedPosition(),
            });
            if(this.props.initialValues.type !== undefined && this.props.initialValues.type.code === "INW"){
                this.setupAgreedPlan(this.props.initialValues.positions);
            }
        }
        if(this.props.submitAction === true){
            this.handleCloseDetails();
        }

        /* Check if exist non agreed position in investment plan,
            if not allow forward to accountant after agreed  */
        if(this.props.initialValues.type !== undefined && this.props.initialValues.type.code === "INW"
            && this.props.initialValues.status.code === 'PK'){
            this.setupAgreedPlan(this.props.initialValues.positions);
        }

        /* Filter position */
        if (this.state.codeNameSearch !== prevState.codeNameSearch && this.props.initialValues.positions.length > 0){
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

    componentDidMount(){
        this.setState({
            notExistCorrectedPositions: this.findCorrectedPosition(),
        });
    }

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues, levelAccess } = this.props
        const { headFin, headInv, headPzp, selected, openPositionDetails, openRealization, positions, send, formChanged, notExistCorrectedPositions, approveLevel, codeNameSearch } = this.state;
        return(
            <>
                {send &&
                    <ModalDialog
                        message={constants.COORDINATOR_PLAN_CONFIRM_SEND_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmSend}
                        onClose={this.handleCancelSend}
                    />
                }
                {approveLevel && this.renderApproveDialog()}
                {openRealization &&
                    <PlanPositionRealizationContainer
                        initialValues={selected[0]}
                        planType={this.props.initialValues.type.code}
                        open={openRealization}
                        onClose={this.handleCloseRealization}
                    />
                }
                {openPositionDetails ?
                    this.renderPlanContent()
                :
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    {formChanged === true &&
                        <ModalDialog
                            message={constants.MODAL_DIALOG_FORM_CHANGE_MSG}
                            variant="warning"
                            onConfirm={this.handleConfirmClose}
                            onClose={this.handleCancelClose}
                        />
                    }
                    <Typography
                        variant="h6"
                    >
                        {   Object.keys(initialValues).length > 1 ?
                                initialValues.updateNumber !== null ?
                                    `${constants.COORDINATOR_PLAN_UPDATE_PLAN_TITLE} ${initialValues.updateNumber} - ${initialValues.type.name} ${new Date(initialValues.year).getFullYear()}` :
                                        `${constants.COORDINATOR_PLAN_UPDATE_PLAN_TITLE} - ${initialValues.type.name} ${new Date(initialValues.year).getFullYear()}`
                            : ""
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
                                    <FormDateField
                                        name="year"
                                        label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR}
                                        mask="____"
                                        dateFormat="yyyy"
                                        views={["year"]}
                                        disablePast
                                        isRequired={true}
                                        disabled={true}
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
                                { (initialValues.type !== undefined && initialValues.type.code === 'PZP' && !initialValues.isUpdate) &&
                                    <Grid item xs={12} sm={6}>
                                        <FormAmountField
                                            name="planAmountRequestedNet"
                                            label={constants.COORDINATOR_PLAN_PUBLIC_PROCUREMENT_REQUESTED_VALUE}
                                            suffix={'zł.'}
                                            disabled
                                        />
                                    </Grid>
                                }
                                {
                                    (initialValues.type !== undefined && initialValues.type.code === 'PZP' && initialValues.isUpdate) &&
                                    <>
                                        <Grid item xs={12} sm={4}>
                                            <FormAmountField
                                                name="correctionPlan.planAmountRequestedNet"
                                                label={constants.COORDINATOR_PLAN_UPDATE_PUBLIC_PROCUREMENT_VALUE}
                                                suffix={'zł.'}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormAmountField
                                                name="planAmountRequestedNet"
                                                label={constants.COORDINATOR_PLAN_UPDATE_PUBLIC_PROCUREMENT_CORRECT_VALUE}
                                                suffix={'zł.'}
                                                disabled
                                            />
                                        </Grid>
                                    </>
                                }
                                {
                                    (initialValues.type !== undefined && initialValues.type.code !== 'PZP') &&
                                    <>
                                        <Grid item xs={12} sm={4}>
                                            <FormAmountField
                                                name="correctionPlan.planAmountAwardedGross"
                                                label={constants.COORDINATOR_PLAN_UPDATE_PLAN_AWARDED_VALUE}
                                                suffix={'zł.'}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormAmountField
                                                name="planAmountAwardedGross"
                                                label={constants.COORDINATOR_PLAN_UPDATE_PLAN_AWARDED_CORRECT_VALUE}
                                                suffix={'zł.'}
                                                disabled
                                            />
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={12} sm={initialValues.type !== undefined && initialValues.type.code === 'PZP' && !initialValues.isUpdate ? 6 : 4}>
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
                                        value={ initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
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
                                        disabled={this.props.initialValues.positions.length === 0}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} >
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="positions"
                                        head={ initialValues.type !== undefined && initialValues.type.code === "FIN" ? headFin : initialValues.type !== undefined && initialValues.type.code === "INW" ? headInv : headPzp}
                                        allRows={positions}
                                        checkedRows={selected}
                                        toolbar={true}
                                        addButtonProps={{
                                            disabled : (initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code !== 'ZP')) ? true : false
                                        }}
                                        editButtonProps={{
                                            label: (initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code === 'ZP')) ?  constants.BUTTON_CORRECT : constants.BUTTON_PREVIEW,
                                            icon: (initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code === 'ZP')) ?  <Edit/> : <Visibility/>,
                                            variant: (initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code === 'ZP')) ?  "edit" : "cancel",
                                        }}
                                        deleteButtonProps={{
                                            hide: true,
                                        }}
                                        onAdd={(event) => this.handleOpenPositionDetails(event, "add")}
                                        onEdit={(event) => this.handleOpenPositionDetails(event, 'correct')}
                                        onDelete={() => {}}
                                        multiChecked={false}
                                        checkedColumnFirst={true}
                                        onSelect={this.handleSelect}
                                        onDoubleClick={this.handleDoubleClick}
                                        onExcelExport={this.handleExcelExport}
                                        defaultOrderBy="id"
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
                            <Grid item xs={2}>
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
                                        disabled={initialValues.status !== undefined && initialValues.status.code === 'ZP'}
                                        onClick={this.props.onPrintPlan}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={8}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                >
                                    {(Object.keys(initialValues).length === 1 || (initialValues.status !== undefined && initialValues.status.code === 'ZP')) &&
                                        <Button
                                            label={constants.BUTTON_SAVE}
                                            icon=<Save/>
                                            iconAlign="left"
                                            type='submit'
                                            variant="submit"
                                            disabled={(pristine && codeNameSearch === '') || (!pristine && codeNameSearch !== '') || submitting || invalid || submitSucceeded  }
                                        />
                                    }
                                    {(Object.keys(initialValues).length === 1 || (initialValues.status !== undefined && (initialValues.status.code === 'ZP' || initialValues.status.code === 'PK'))) &&
                                        <Button
                                            label={constants.BUTTON_SEND}
                                            icon=<Send/>
                                            iconAlign="left"
                                            variant="submit"
                                            disabled={(!pristine && codeNameSearch ==='') ||  (pristine && codeNameSearch !=='') || submitting || invalid || initialValues.positions === undefined
                                                || (positions.length === 0 && codeNameSearch ==='') || notExistCorrectedPositions
                                            }
                                            onClick={this.handleSend}
                                        />
                                    }
                                    {(levelAccess !== undefined && initialValues.status !== undefined && (
                                            (levelAccess === 'public' && initialValues.status.code === 'WY') ||
                                                (levelAccess === 'director' && ['AZ', 'AK'].includes(initialValues.status.code)) ||
                                                    (levelAccess === "accountant" && initialValues.status.code === 'AD')
                                        )
                                    ) &&
                                        <Button
                                            label={initialValues.status !== undefined && (
                                                initialValues.status.code === 'WY' ? constants.BUTTON_APPROVE :
                                                    initialValues.status.code === 'AZ' ? constants.INSTITUTION_PLAN_STATUS_APPROVED_DIRECTOR :
                                                        initialValues.status.code === 'AD' ? constants.INSTITUTION_PLAN_STATUS_APPROVED_ACCOUNTANT :
                                                            constants.INSTITUTION_PLAN_STATUS_APPROVED_CHIEF
                                            )}
                                            icon=<DoneAll/>
                                            iconAlign="left"
                                            variant="submit"
                                            onClick={initialValues.status !== undefined && levelAccess !== undefined && (
                                                levelAccess === 'public' && initialValues.status.code === 'WY' ? (event) => this.handleApproveAction(event, "public") :
                                                    levelAccess === 'director' && initialValues.status.code === 'AZ' ? (event) => this.handleApproveAction(event, "director") :
                                                        levelAccess === 'accountant' && initialValues.status.code === 'AD' ? (event) => this.handleApproveAction(event, "accountant") :
                                                            (event) => this.handleApproveAction(event, "chief")
                                            )}
                                        />
                                    }
                                    {((initialValues.type !== undefined && ['FIN','PZP'].includes(initialValues.type.code)) &&
                                        (levelAccess !== undefined && initialValues.status !== undefined && (
                                            (levelAccess === 'public' && initialValues.status.code === 'WY') ||
                                                (levelAccess === 'director' && ['AZ', 'AK'].includes(initialValues.status.code)) ||
                                                    (levelAccess === "accountant" && initialValues.status.code === 'AD')
                                        ))
                                    )  &&
                                        <Button
                                            label={constants.BUTTON_RETURN_COORDINATOR}
                                            icon=<Redo/>
                                            iconAlign="left"
                                            variant="delete"
                                            onClick={(event) => this.handleApproveAction(event, "sendBack")}
                                        />
                                    }
                                    {(initialValues.type !== undefined && initialValues.type.code !== "PZP") &&
                                        <Button
                                            label={constants.ACCOUNTANT_MENU_REALIZATION}
                                            icon=<FolderOpen />
                                            iconAlign="left"
                                            variant="add"
                                            disabled={selected.length === 0}
                                            onClick={this.handleOpenRealization}
                                        />
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={2}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-start"
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
