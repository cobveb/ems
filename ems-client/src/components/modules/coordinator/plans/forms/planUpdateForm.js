import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Button, InputField } from 'common/gui';
import * as constants from 'constants/uiNames';
import { FormDateField, FormTableField, FormAmountField} from 'common/form';
import { Save, Cancel, Send, Description, LibraryBooks, Edit, Visibility, CheckCircle, Print } from '@material-ui/icons/';
import PlanUpdateFinancialContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planUpdateFinancialContentPositionFormContainer';
import PlanUpdateInvestmentContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planUpdateInvestmentContentPositionFormContainer';
import PlanUpdatePublicProcurementContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planUpdatePublicProcurementContentPositionFormContainer';
import {findIndexElement} from 'utils/';

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
        height: `calc(100vh - ${theme.spacing(58.5)}px)`,
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
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS,
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
                id: 'amountAwardedGross',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_CORRECTED,
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
                id: 'correctionPlanPosition.expensesPositionAwardedGross',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_AWARDED_GROSS,
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
                id: 'expensesPositionAwardedGross',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_CORRECTED,
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
                id: 'amountRealized',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
    };

    handleClose = () =>{
        if(this.props.pristine === false){
            this.setState({formChanged: !this.state.formChanged});
        } else {
            this.props.onClose();
            this.props.reset();
        }
    };

    handleCancelClose = () => {
        this.setState({formChanged: false});
    }

    handleConfirmClose = () => {
        this.setState({formChanged: false});
        this.props.onClose();
        this.props.reset();
    }

    handleSubmitPosition = (values, action) =>{
        this.props.onSubmitPlanPosition(values, this.state.positionAction);
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: [], positionAction: '',});
    }

    handleSubmitSubPosition = (values, action) =>{

        const {formFinancialValues, formPublicProcurementValues, formInvestmentValues} = this.props;

        const formValues = this.props.initialValues.type.code === 'FIN' ?
            formFinancialValues : this.props.initialValues.type.code === 'PZP' ?
                formPublicProcurementValues : formInvestmentValues;

        const payload = JSON.parse(JSON.stringify(formValues));
        const idx = findIndexElement(values, payload.subPositions, "positionId");
        if (idx !== null){
            payload.subPositions.splice(idx, 1, values);
        }
        this.props.onSubmitPlanSubPosition(payload, action)
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
                        correctedPlanValue={initialValues.correctionPlan.planAmountAwardedGross}
                        action={positionAction}
                        vats={vats}
                        costsTypes={costsTypes}
                        onSubmitPlanPosition={this.handleSubmitPosition}
                        onSubmitPlanSubPosition={this.handleSubmitSubPosition}
                        onExcelExport={this.handleExcelExport}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmitPosition}
                    />
                );
            case("INW"):
                return (
                    <PlanUpdateInvestmentContentPositionFormContainer
                        initialValues={positionAction === 'add' ? {vat: vats[1]} : selected[0]}
                        planStatus={initialValues.status.code}
                        action={positionAction}
                        foundingSources={foundingSources}
                        vats={vats}
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
                        onSubmitPlanSubPosition={this.handleSubmitSubPosition}
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
    };

    handleExcelExport = (exportType, level, headRow, positionId) => {
        const {headFin, headInv, headPzp} = this.state;
        const {initialValues} = this.props;
        let head = [];
        if(level === "subPositions"){
            head = headRow;
        } else {
           head = initialValues.type !== undefined && initialValues.type.code === "FIN" ?
                headFin : initialValues.type !== undefined && initialValues.type.code === "INV" ? headInv :
                    headPzp;
        }
        this.props.onExcelExport(exportType, head, level === undefined ? "position" : "subPositions", positionId)
    }

    findCorrectedPosition = () =>{
        const correctedPositions = this.state.positions.filter(position => position.amountCorrect !== null && position.amountCorrect !== 0)
        return correctedPositions.length > 0 ? false : true;
    }

    componentDidUpdate(prevProps){
        if(this.state.positionAction === 'add' && this.props.newPosition !== null){
            this.setState(prevState =>{
                const selected =  [...prevState.selected];
                let positionAction = {...prevState.positionAction}
                selected[0] = this.props.newPosition;
                positionAction = 'correct';
                return {selected, positionAction}
            })
        }
        if(this.state.selected.length > 0 && this.state.positionAction === 'correct' ){
            const index = findIndexElement(this.state.selected[0], this.props.initialValues.positions, "positionId");
            if(index !== null){
                if(this.props.initialValues.positions[index] !== this.state.selected[0] ){
                    this.setState(prevState =>{
                        let positions = [...prevState.positions];
                        let notExistCorrectedPositions = prevState.notExistCorrectedPositions;
                        const selected = [...prevState.selected];
                        notExistCorrectedPositions = this.findCorrectedPosition();
                        selected[0] = positions[index];
                        return {selected, notExistCorrectedPositions}
                   })
                }
            }
        }
        if(this.props.initialValues.positions !== prevProps.initialValues.positions){
            this.setState({
                positions: this.props.initialValues.positions,
                notExistCorrectedPositions: this.findCorrectedPosition(),
            });
        }
        if(this.props.submitAction === true){
            this.handleCloseDetails();
        }
    }

    componentDidMount(){
        this.setState({
            notExistCorrectedPositions: this.findCorrectedPosition(),
        });
    }

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues } = this.props
        const { headFin, headInv, headPzp, selected, openPositionDetails, positions, send, formChanged, notExistCorrectedPositions } = this.state;
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
                        {
                            Object.keys(initialValues).length > 1 && constants.COORDINATOR_PLAN_UPDATE_PLAN_TITLE + ` ${initialValues.type.name} ${new Date(initialValues.year).getFullYear()} `
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
                                {
                                    (initialValues.type !== undefined && initialValues.type.code === 'PZP') &&
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
                                <Grid item xs={12} sm={4}>
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
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="sendUser"
                                        label={constants.COORDINATOR}
                                        disabled={true}
                                        value={initialValues.sendUser !== undefined && initialValues.sendUser !== null ?
                                            `${initialValues.sendUser.name} ${initialValues.sendUser.surname}` :
                                                ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="planAcceptUser"
                                        label={initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
                                            constants.ACCOUNTANT_PLAN_COORDINATOR_ACCOUNTANT_ACCEPT_USER : constants.PUBLIC_PLAN_COORDINATOR_ACCEPT_USER}
                                        disabled={true}
                                        value={initialValues.planAcceptUser !== undefined && initialValues.planAcceptUser !== null ?
                                            `${initialValues.planAcceptUser.name} ${initialValues.planAcceptUser.surname}` :
                                                ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="directorAcceptUser"
                                        label={constants.ACCOUNTANT_PLAN_COORDINATOR_DIRECTOR_ACCEPT_USER}
                                        disabled={true}
                                        value={initialValues.directorAcceptUser !== undefined && initialValues.directorAcceptUser !== null ?
                                            `${initialValues.directorAcceptUser.name} ${initialValues.directorAcceptUser.surname}` :
                                                ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
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
                                <Grid item xs={12} sm={12} >
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="positions"
                                        head={ initialValues.type !== undefined && initialValues.type.code === "FIN" ? headFin : initialValues.type !== undefined && initialValues.type.code === "INW" ? headInv : headPzp}
                                        allRows={positions}
                                        checkedRows={selected}
                                        toolbar={true}
                                        addButtonProps={{
                                            disabled : (initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code !== 'ZP') || (initialValues.planAmountAwardedGross >= initialValues.correctionPlan.planAmountAwardedGross )) ? true : false
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
                            <Grid item xs={2}>
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
                                            disabled={pristine || submitting || invalid || submitSucceeded  }
                                        />
                                    }
                                    {(Object.keys(initialValues).length === 1 || (initialValues.status !== undefined && initialValues.status.code === 'ZP')) &&
                                        <Button
                                            label={constants.BUTTON_SEND}
                                            icon=<Send/>
                                            iconAlign="left"
                                            variant="submit"
                                            disabled={!pristine || submitting || invalid || initialValues.positions === undefined || positions.length === 0 || notExistCorrectedPositions}
                                            onClick={this.handleSend}
                                        />
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={2}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
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
