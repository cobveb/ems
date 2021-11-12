import React, { Component } from 'react';
import { change } from 'redux-form';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Button, InputField } from 'common/gui';
import * as constants from 'constants/uiNames';
import { FormTableField, FormAmountField } from 'common/form';
import { Cancel, Description, LibraryBooks, Edit, Done, PriorityHigh, CheckCircle, Visibility, ArrowForward, Undo } from '@material-ui/icons/';
import PlanCorrectionPositionFormContainer from 'containers/modules/accountant/coordinator/plans/forms/planCorrectionPositionFormContainer.js';
import PlanPositionRemarksFormContainer from 'containers/modules/accountant/coordinator/plans/forms/planPositionRemarksFormContainer.js';
import PlanInvestmentPositionFormContainer from 'containers/modules/accountant/coordinator/plans/forms/planInvestmentPositionFormContainer.js';
import { findIndexElement} from 'utils/';

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
        paddingLeft: theme.spacing(35),
        margin: 0,
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(54.5)}px)`,
    },
});


class PlanBasicInfoForm extends Component {
    state = {
        openCorrection: false,
        openRemarks: false,
        planAction: null,
        positions: this.props.initialValues.positions,
        selected:[],
        isDetailsVisible: false,
        disabledForward: true,
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
    };

    handleClose = () =>{
        this.props.onClose(this.props.initialValues);
        this.props.reset();
    };

    renderDialog = (status) =>{
        switch (this.state.planAction){
            case "accept":
                return(<ModalDialog
                    message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_ACCEPT_POSITIONS_MESSAGE}
                    variant="confirm"
                    onConfirm={this.handleConfirmAccept}
                    onClose={this.handleCancelDialog}
                />);
            case "remarks":
                return(
                    <>
                        <PlanPositionRemarksFormContainer
                            initialValues={this.state.selected[0]}
                            planStatus={status.code}
                            planType={this.props.initialValues.type.code}
                            level="accountant"
                            open={this.state.openRemarks}
                            onSubmit={this.handleRemarksPosition}
                            onClose={this.handleCloseDialog}
                        />
                    </>
                );
            case "correction":
                return(
                    <>
                    {status !== undefined && ['WY', 'RO'].includes(status.code) &&
                        <PlanCorrectionPositionFormContainer
                            initialValues={this.state.selected[0]}
                            open={this.state.openCorrection}
                            onSubmit={this.handleCorrectPosition}
                            onClose={this.handleCloseDialog}
                        />
                    }
                    </>
                );
            case "forward":
                return(
                    <ModalDialog
                        message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_FORWARD_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmForward}
                        onClose={this.handleCancelDialog}
                    />
                );
            case "approve":
                return(
                    <ModalDialog
                        message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_APPROVE_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmApprove}
                        onClose={this.handleCancelDialog}
                    />
                )
            case "withdraw":
            return(
                <ModalDialog
                    message={constants.ACCOUNTANT_COORDINATOR_PLANS_CONFIRM_WITHDRAW_MESSAGE}
                    variant="confirm"
                    onConfirm={this.handleConfirmWithdraw}
                    onClose={this.handleCancelDialog}
                />
            )
            default:
                //no default;
        }
    }

    handleAccept = () => {
        this.setState({ planAction: 'accept' });
    }

    handleCancelDialog = () => {
        this.setState({ planAction: null });
    }

    handleConfirmAccept = () => {
        this.props.onAcceptPlanPositions(this.state.selected);
        this.setState({
            selected: [],
            planAction: null,
        });
    }

    handleCorrectPosition = (values) =>{
        this.props.onCorrectPlanPosition(values);
        this.setState({
            selected: [],
            planAction: null,
        });
    }

    handleRemarksPosition = (values) =>{
        this.props.onRemarksPlanPosition(values);
        this.setState({
            selected: [],
            planAction: null,
        });
    }

    handleConfirmForward = () =>{
        this.props.onForwardPlan();
    }

    handleConfirmWithdraw = () =>{
        this.props.onWithdrawPlan();
    }

    handleApprove = () => {
        this.setState({ planAction: 'approve' });
    }

    handleConfirmApprove = () =>{
        this.props.onApprovePlan();
    }

    handleCorrect = () =>{
        this.setState({
            planAction: 'correction',
            openCorrection: true,
        });
    }

    handleRemarks = () =>{
        this.setState({
            planAction: 'remarks',
            openRemarks: true,
        });
    }

    handleForward = () =>{
        this.setState({planAction: 'forward'});
    }

    handleWithdraw = () =>{
        this.setState({planAction: 'withdraw'});
    }

    handleCloseDialog = () => {
        this.setState({
            openCorrection: !this.state.openCorrection,
            selected: [],
            planAction: null,
        });
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) =>{
        if(this.props.initialValues.type.code === "FIN"){
            this.setState(prevState =>{
                const selected = [...prevState.selected];
                let planAction = {...prevState.openPositionDetails};
                let openCorrection = {...prevState.positionAction};
                selected[0] = row;
                planAction = 'correction';
                openCorrection = true;
                return {selected, openCorrection, planAction}
            });
        } else if(this.props.initialValues.type.code === "INW"){
            this.setState(prevState =>{
                const selected = [...prevState.selected];
                let isDetailsVisible: {...prevState.isDetailsVisible};
                selected[0] = row;
                isDetailsVisible = true;
                return {selected, isDetailsVisible}
            })
        }
    }

    handleExcelExport = (exportType) => {
        const {headFin, headInv} = this.state;
        const {initialValues} = this.props;
        this.props.onExcelExport(exportType, initialValues.type !== undefined && initialValues.type.code === "FIN" ? headFin : headInv)
    }

    handleChangeVisibleDetails = () =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, selected: []}));
    }

    handleSubmitPosition = (values) => {
        this.props.onUpdateInvestmentPosition(values)
    }

    setupDisabledForward = (positions) => {
        if(positions.filter(row => {
            return row.positionFundingSources.filter(source =>{
                return source.sourceAmountAwardedGross === null ? source : null
            }).length > 0 ? row : null
        }).length === 0){
            this.setState({ disabledForward: false });
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.positions !== prevState.positions){
            this.setState({
                positions: this.state.positions,
            });
        }
        if(this.props.initialValues.positions !== this.props.formValues.positions)
        {
            if(this.state.planAction === null && prevState.planAction === "accept"){
                this.props.dispatch(change('PlanBasicInfoForm', 'positions', this.props.initialValues.positions ));
            } else if(this.state.planAction === null && prevState.planAction === "correction"){
                this.props.dispatch(change('PlanBasicInfoForm', 'positions', this.props.initialValues.positions ));
            } else if (this.props.initialValues.type !== undefined && this.props.initialValues.type.code === "INW" &&
                this.state.disabledForward){
                /* Check if exist null sourceAmountAwardedGross in investment plan,
                if not allow forward to coordinator */
                this.setupDisabledForward(this.props.initialValues.positions);
            }
        }
        if(this.props.initialValues.positions !== prevProps.initialValues.positions){
            this.setState(prevState => {
                let positions = [...prevState.positions];
                positions = this.props.initialValues.positions;
                return {positions}
            });
            /* Check if exist null sourceAmountAwardedGross in investment plan,
            if not allow forward to coordinator */
            if(this.props.initialValues.type.code === "INW"){
                this.setupDisabledForward(this.props.initialValues.positions);
            }
        }

        if(this.state.selected.length > 0 ){
            const index = findIndexElement(this.state.selected[0], this.props.initialValues.positions, "positionId");
            if(index !== null){
                if(this.state.selected[0] !== this.props.initialValues.positions[index]){
                    this.setState({selected: [this.props.initialValues.positions[index]]});
                }
            }
        }

    }

    render(){
        const { handleSubmit, submitting, classes, initialValues, isLoading, levelAccess } = this.props
        const { headFin, headInv, selected, positions, planAction, isDetailsVisible, disabledForward } = this.state;
        return(
            <>
                {(submitting || isLoading) && <Spinner /> }
                {planAction && this.renderDialog(initialValues.status)}

                {isDetailsVisible ?
                    <PlanInvestmentPositionFormContainer
                        initialValues={selected[0]}
                        planType={initialValues.type}
                        planStatus={initialValues.status}
                        fundingSources={this.props.fundingSources}
                        levelAccess={levelAccess}
                        onSubmit={this.handleSubmitPosition}
                        onClose={this.handleChangeVisibleDetails}
                    />
                :
                    <form onSubmit={handleSubmit}>
                        { submitting && <Spinner /> }
                        <Typography
                            variant="h6"
                        >
                            {Object.keys(initialValues).length > 1 && constants.ACCOUNTANT_COORDINATOR_PLAN_PLAN_TITLE +
                                ` ${initialValues.type.name} ${initialValues.year} - ${initialValues.coordinator.name}`}
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
                                            isRequired={true}
                                            value={initialValues.year !== undefined ? initialValues.year : ''}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <InputField
                                            name="type"
                                            label={constants.COORDINATOR_PLAN_FORM_TYPE}
                                            disabled
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

                                    <Grid item xs={12} sm={4}>
                                        <FormAmountField
                                            name={"planAmountRequestedGross"}
                                            label={constants.COORDINATOR_PLAN_FINANCIAL_REQUESTED_VALUE}
                                            suffix={'zł.'}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormAmountField
                                            name={"planAmountAwardedGross"}
                                            label={constants.COORDINATOR_PLAN_FINANCIAL_AWARDED_VALUE}
                                            suffix={'zł.'}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormAmountField
                                            name={"planAmountRealizedGross"}
                                            label={constants.COORDINATOR_PLAN_FINANCIAL_REALIZED_VALUE}
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
                                            label={constants.ACCOUNTANT_PLAN_COORDINATOR_ACCOUNTANT_ACCEPT_USER}
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
                                            constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASKS
                                        }
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={0} justify="center" className={classes.container}>
                                    <Grid item xs={12} sm={12} >
                                        <FormTableField
                                            className={classes.tableWrapper}
                                            name="positions"
                                            head={ initialValues.type !== undefined && initialValues.type.code === "FIN" ? headFin : headInv }
                                            allRows={positions}
                                            checkedRows={selected}
                                            toolbar={false}
                                            multiChecked={initialValues.type !== undefined && initialValues.type.code === "FIN" ? true : false}
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
                                <Grid item xs={9}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start"
                                        className={classes.containerBtn}
                                    >
                                        { (initialValues.type !== undefined && initialValues.type.code === "INW" && levelAccess === "accountant")  &&
                                            <>
                                                {initialValues.status !== undefined && (initialValues.status.code === 'WY' || initialValues.status.code === 'RO' || initialValues.status.code === 'UZ') &&
                                                    <Button
                                                        label={constants.BUTTON_APPROVE}
                                                        icon=<Done/>
                                                        iconAlign="left"
                                                        variant="submit"
                                                        disabled={initialValues.status !== undefined && initialValues.status.code !== 'UZ' }
                                                        onClick={this.handleApprove}
                                                    />
                                                }
                                            </>
                                        }
                                        { (initialValues.type !== undefined && initialValues.type.code === "FIN" && levelAccess === "accountant")  &&
                                            <>
                                                {initialValues.status !== undefined && (initialValues.status.code === 'WY' || initialValues.status.code === 'RO') &&
                                                    <Button
                                                        label={constants.BUTTON_ACCEPT}
                                                        icon=<Done/>
                                                        iconAlign="left"
                                                        variant="add"
                                                        disabled={selected.length === 0 || (selected.length === 1 && selected[0].amountAwardedGross !== null)}
                                                        onClick={this.handleAccept}
                                                    />
                                                }
                                                {(initialValues.status !== undefined && ['WY', 'RO'].includes(initialValues.status.code)) &&
                                                    <Button
                                                        label={constants.BUTTON_CORRECT}
                                                        icon=<Edit/>
                                                        iconAlign="left"
                                                        variant="edit"
                                                        disabled={selected.length === 0 ||  selected.length > 1}
                                                        onClick={this.handleCorrect}
                                                    />
                                                }
                                            </>
                                        }
                                        { (initialValues.type !== undefined && initialValues.type.code === "INW" && levelAccess === "accountant") &&
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
                                        <Button
                                            label={constants.BUTTON_REMARKS}
                                            icon=<PriorityHigh/>
                                            iconAlign="left"
                                            variant="cancel"
                                            disabled={selected.length === 0 ||  selected.length > 1}
                                            onClick={this.handleRemarks}
                                        />
                                        { (initialValues.type !== undefined && initialValues.type.code === "INW" && levelAccess === "accountant")  &&
                                            <>
                                                {initialValues.status !== undefined && (initialValues.status.code === 'WY' || initialValues.status.code === 'RO' || initialValues.status.code === 'UZ') &&
                                                    <Button
                                                        label={constants.BUTTON_COORDINATOR}
                                                        icon=<ArrowForward/>
                                                        iconAlign="left"
                                                        variant="add"
                                                        disabled={(initialValues.status !== undefined && initialValues.status.code !== 'RO') || disabledForward}
                                                        onClick={this.handleForward}
                                                    />

                                                }
                                                {(initialValues.status !== undefined && initialValues.status.code === 'AK') &&
                                                    <Button
                                                        label={constants.BUTTON_WITHDRAW}
                                                        icon=<Undo/>
                                                        iconAlign="left"
                                                        onClick = {this.handleWithdraw}
                                                        variant="cancel"
                                                    />
                                                }
                                            </>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
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
