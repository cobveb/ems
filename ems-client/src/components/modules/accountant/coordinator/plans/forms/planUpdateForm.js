import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Divider, Toolbar, Grid }  from '@material-ui/core/';
import { FormAmountField, FormTableField } from 'common/form';
import { Description, CheckCircle, LibraryBooks, Visibility, DoneAll, Cancel } from '@material-ui/icons/';
import { Spinner, ModalDialog } from 'common/';
import * as constants from 'constants/uiNames';
import { InputField, Button } from 'common/gui';
import PlanUpdateFinancialContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planUpdateFinancialContentPositionFormContainer';
import PlanUpdateInvestmentContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planUpdateInvestmentContentPositionFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    section: {
        marginBottom: theme.spacing(0),
    },
    toolbar: {
        minHeight: theme.spacing(6),
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

class PlanUpdateForm extends Component {

    state = {
        openPositionDetails: false,
        positionAction: null,
        positions: [],
        selected:[],
        approve: false,
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

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    handleSubmitPosition = (values, action) =>{
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: [], positionAction: '',});
        this.props.onSubmitPlanPosition(values, this.state.positionAction);
    }

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: [], positionAction: '',});
    };

    renderPlanPositionDetails = () =>{
        const { initialValues, vats, costsTypes, foundingSources} = this.props;
        const { positionAction, selected } = this.state;
        switch(initialValues.type.code){
            case("FIN"):
                return (
                    <PlanUpdateFinancialContentPositionFormContainer
                        initialValues={selected[0]}
                        planStatus={initialValues.status.code}
                        levelAccess="accountant"
                        correctedPlanValue={initialValues.correctionPlan.planAmountAwardedGross}
                        action={positionAction}
                        vats={vats}
                        costsTypes={costsTypes}
                        onExcelExport={this.handleExcelExport}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmitPosition}
                    />
                );
            case("INW"):
                return (
                    <PlanUpdateInvestmentContentPositionFormContainer
                        initialValues={selected[0]}
                        planStatus={initialValues.status.code}
                        action={positionAction}
                        foundingSources={foundingSources}
                        vats={vats}
                        onExcelExport={this.handleExcelExport}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmitPosition}
                    />
                );
            default:
                return null;
        };
    };

    handleApproveCorrectionPlan = () =>{
        this.setState({approve: !this.state.approve});
    }

    handleConfirmApprove = () =>{
        this.props.handleSubmit();
    }

    handleCloseDialog = () => {
        this.setState({
            approve: !this.state.approve,
        });
    };

    componentDidMount(){
        this.setState({
            positions: this.props.initialValues.positions,
        })
    }

    render(){
        const { pristine, invalid, submitting, classes, initialValues, isLoading, error } = this.props;
        const { headFin, headInv, headPzp, positions, selected, openPositionDetails, approve } = this.state;
        return(
            <>
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                { approve &&
                    <ModalDialog
                        message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_CORRECTION_APPROVE_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmApprove}
                        onClose={this.handleCancelDialog}
                    />
                }
                {openPositionDetails ?
                    this.renderPlanPositionDetails()
                :

                    <form>
                        { (isLoading || submitting) && <Spinner /> }
                        <Typography
                            variant="h6"
                        >
                            {
                                Object.keys(initialValues).length > 1 && constants.COORDINATOR_PLAN_UPDATE_PLAN_TITLE +
                            ` ${initialValues.type.name} ${initialValues.year} - ${initialValues.coordinator.name} `
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
                                                label: constants.BUTTON_DETAILS,
                                                icon: <Visibility />,
                                                variant: "cancel",
                                                disabled : (initialValues.status !== undefined && ['WY','RO'].includes(initialValues.status.code)) && selected.length === 0
                                            }}
                                            editButtonProps={{
                                                hide: true,
                                            }}
                                            deleteButtonProps={{
                                                hide: true,
                                            }}
                                            onAdd={(event) => this.handleOpenPositionDetails(event, "details")}
                                            onEdit={() => {}}
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
                                <Grid item xs={10}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start"
                                    >
                                        {(initialValues.status !== undefined && ['WY','RO'].includes(initialValues.status.code)) &&
                                            <Button
                                                label={constants.BUTTON_APPROVE}
                                                icon=<DoneAll/>
                                                iconAlign="left"
                                                variant="submit"
                                                disabled={!pristine || submitting || invalid }
                                                onClick={this.handleApproveCorrectionPlan}
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

PlanUpdateForm.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanUpdateForm)
