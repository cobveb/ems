import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider, Toolbar} from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import * as constants from 'constants/uiNames';
import { Description, LibraryBooks, Cancel, Done, Edit, Timeline } from '@material-ui/icons/';
import { getCoordinatorPlanTypes, getCoordinatorPlanStatuses } from 'utils/';
import { Button } from 'common/gui';
import { FormTableField, FormAmountField } from 'common/form';
import PlanCorrectionPositionFormContainer from 'containers/modules/accountant/coordinator/plans/forms/planCorrectionPositionFormContainer.js'
import PlanContainer from 'containers/modules/accountant/coordinator/plans/planContainer';

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
        height: `calc(100vh - ${theme.spacing(42)}px)`,
    },
    input: {
        padding: theme.spacing(1.5),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
})

class PlanPositionsForm extends Component {
    state ={
        headCells:[
            {
                id: 'coordinatorName',
                label: constants.ACCOUNTANT_MENU_COORDINATOR,
                type: 'text',
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
                id: 'coordinatorName',
                label: constants.ACCOUNTANT_MENU_COORDINATOR,
                type: 'text',
            },
            {
                id: 'correctionPlanCoordinatorPosition.amountAwardedGross',
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
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_REQUESTED_AFTER_CORRECTED_GROSS,
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
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_AWARDED_AFTER_CORRECTED_GROSS,
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
        selected: [],
        planPositions:[],
        action: null,
        openPlanDetails: false,
        openCorrection: false,
        types: getCoordinatorPlanTypes(),
        statuses: getCoordinatorPlanStatuses(),
        acceptDisabled: true,
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleClose = () => {
        this.props.onClose();
    }

    handleAction = (event, action) => {
        this.setState({action: action});
    }

    handleConfirmAccept = () =>{
        this.props.onAcceptPlanPositions(this.state.selected);
        this.setState({
            selected: [],
            action: null,
        });
    }

    handleCorrectPosition = (values) =>{
        this.props.onCorrectPlanPosition(values);
        this.setState({
            selected: [],
            action: null,
        });
    }

    handleOpenCorrection = () =>{
        this.setState(state => ({openCorrection: !state.openPlanDetails, action: 'correction'}));
    }

    handleCloseCorrection = () =>{
        this.setState(state => ({openCorrection: !state.openPlanDetails, action: null, selected: []}));
    }

    handleOpenPlanDetails = () =>{
        this.setState(state => ({openPlanDetails: !state.openPlanDetails}));
    }

    handleClosePlanDetails = () =>{
        this.props.onClosePlanDetails();
        this.setState(state => ({openPlanDetails: !state.openPlanDetails, selected:[]}));
    }

    renderDialog = () =>{
        switch (this.state.action){
            case "accept":
                return(<ModalDialog
                    message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_ACCEPT_POSITIONS_MESSAGE}
                    variant="confirm"
                    onConfirm={this.handleConfirmAccept}
                    onClose={this.handleCancelAccept}
                />);
            case "correction":
                return(
                    <>
                        {this.state.selected[0].planStatus !== undefined && ['WY', 'RO'].includes(this.state.selected[0].planStatus) &&
                            <PlanCorrectionPositionFormContainer
                                initialValues={this.state.selected[0]}
                                open={this.state.openCorrection}
                                onSubmit={this.handleCorrectPosition}
                                onClose={this.handleCloseCorrection}
                            />
                        }
                    </>
                );
            // no default
        }
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headCells)
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.initValues !== undefined && this.props.initValues.planPositions !== prevProps.initValues.planPositions){
            this.setState({
                planPositions: this.props.initValues.planPositions,
            });
        }

        if(this.state.selected !== prevState.selected){
            this.setState({acceptDisabled: true,});
            for (var i=0; i<this.state.selected.length; i++){
                if(this.state.selected[i].amountRequestedGross !== this.state.selected[i].amountAwardedGross){
                    this.setState({acceptDisabled: false,});
                    break;
                }
            }
        }
    }

    render(){
        const {handleSubmit, classes, isLoading, error, initValues, planStatus, levelAccess, isPlanUpdate} = this.props;
        const {headCells, headCellsUpd, selected, planPositions, action, openPlanDetails, acceptDisabled} = this.state;
        if(initValues === undefined) {
            return null;
        }
        return(
            <>
                {action && this.renderDialog()}
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                {openPlanDetails ?
                    <PlanContainer
                        initialValues={selected[0]}
                        changeVisibleDetails={this.handleChangeVisibleDetails}
                        action={'plan'}
                        levelAccess={levelAccess}
                        changeAction={this.handleChangeAction}
                        handleClose={this.handleClosePlanDetails}
                        statuses={this.state.statuses}
                        types={this.state.types}
                        onSubmitPlan={this.onSubmitPlan}
                    />
                :
                    <form onSubmit={handleSubmit}>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                        >
                            <Typography variant="h6">{constants.ACCOUNTANT_INSTITUTION_PLAN_POSITIONS_TITLE + ` ${initValues.costType !==  undefined && initValues.costType !==  null ? initValues.costType.code : ''} - ${initValues.costType !== undefined && initValues.costType !== null ? initValues.costType.name : ''}`}</Typography>
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
                                        <Grid item xs={12} sm={4}>
                                            <FormAmountField
                                                name="amountRequestedGross"
                                                label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REQUESTED_GROSS}
                                                suffix={'zł.'}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormAmountField
                                                name="amountAwardedGross"
                                                label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_AWARDED_GROSS}
                                                suffix={'zł.'}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <FormAmountField
                                                name="amountRealizedGross"
                                                label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REALIZED_GROSS}
                                                suffix={'zł.'}
                                                disabled
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1">{constants.ACCOUNTANT_INSTITUTION_PLAN_COORDINATOR_POSITIONS}</Typography>
                                    </Toolbar>
                                    <Grid container spacing={0} justify="center" className={classes.container}>
                                        <Grid item xs={12} sm={12}>
                                            <FormTableField
                                                className={classes.tableWrapper}
                                                name="planPositions"
                                                head={isPlanUpdate ? headCellsUpd : headCells}
                                                allRows={planPositions}
                                                checkedRows={selected}
                                                toolbar={false}
                                                multiChecked={levelAccess === "accountant" ? true : false}
                                                checkedColumnFirst={true}
                                                onSelect={this.handleSelect}
                                                onExcelExport={this.handleExcelExport}
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
                            <Grid item xs={11}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                >
                                    { levelAccess === "accountant" &&
                                        <>
                                            <Button
                                                label={constants.BUTTON_ACCEPT}
                                                icon=<Done/>
                                                iconAlign="left"
                                                variant="add"
                                                disabled={selected.length === 0 ||
                                                    (selected.length === 1 && selected[0].amountAwardedGross !== null) || acceptDisabled ||
                                                        (selected[0].planStatus !== undefined && !['WY', 'RO'].includes(selected[0].planStatus))
                                                            || planStatus !== 'UT'}
                                                onClick={(event) => this.handleAction(event, 'accept')}
                                            />
                                            <Button
                                                label={constants.BUTTON_CORRECT}
                                                icon=<Edit/>
                                                iconAlign="left"
                                                variant="edit"
                                                disabled={selected.length === 0 ||
                                                    selected.length > 1 ||
                                                        (selected[0].planStatus !== undefined && !['WY', 'RO'].includes(selected[0].planStatus))
                                                            || planStatus !== 'UT'}
                                                onClick={this.handleOpenCorrection}
                                            />
                                        </>
                                    }
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel/>
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={this.handleClose}
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
                                        label={constants.ACCOUNTANT_INSTITUTION_PLAN_COORDINATOR_POSITIONS_BUTTON_PLAN}
                                        icon=<Timeline/>
                                        iconAlign="left"
                                        disabled={selected.length === 0 || selected.length > 1}
                                        onClick = {this.handleOpenPlanDetails}
                                        variant="cancel"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                }
            </>
        );
    };
};

PlanPositionsForm.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
};

export default withStyles(styles)(PlanPositionsForm);