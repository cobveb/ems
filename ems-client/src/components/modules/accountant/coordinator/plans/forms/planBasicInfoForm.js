import React, { Component } from 'react';
import { change } from 'redux-form';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Button, InputField } from 'common/gui';
import * as constants from 'constants/uiNames';
import { FormTableField, FormAmountField } from 'common/form';
import { Cancel, Description, LibraryBooks, Edit, Done, DoneAll, CheckCircle } from '@material-ui/icons/';
import PlanCorrectionPositionFormContainer from 'containers/modules/accountant/coordinator/plans/forms/planCorrectionPositionFormContainer.js'

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
        height: `calc(100vh - ${theme.spacing(54.5)}px)`,
    },
});


class PlanBasicInfoForm extends Component {
    state = {
        openCorrection: false,
        planAction: null,
        positions: this.props.initialValues.positions,
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
        ],
        headInv: [
            {
                id: 'task',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK,
                type: 'text',
            },
            {
                id: 'amountRequested',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountAwarded',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS,
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
                    onClose={this.handleCancelAccept}
                />);
            case "approve":
                return(<ModalDialog
                    message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_APPROVE_MESSAGE}
                    variant="confirm"
                    onConfirm={this.handleConfirmApprove}
                    onClose={this.handleCancelApprove}
                />);
            case "correction":
                return(
                    <>
                    {status !== undefined && ['WY', 'RO'].includes(status.code) &&
                        <PlanCorrectionPositionFormContainer
                            initialValues={this.state.selected[0]}
                            open={this.state.openCorrection}
                            onSubmit={this.handleCorrectPosition}
                            onClose={this.handleCloseCorrection}
                        />
                    }
                    </>
                );
            default:
                return null;
        }
    }

    handleAccept = () => {
        this.setState({ planAction: 'accept' });
    }

    handleCancelAccept = () => {
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

    handleCorrect = () =>{
        this.setState({
            planAction: 'correction',
            openCorrection: true,
        });
    }

    handleCloseCorrection = () => {
        this.setState({
            openCorrection: !this.state.openCorrection,
            selected: [],
            planAction: null,
        });
    };

    //Remove to Institution Plan
    handleApprove = () => {
        this.setState({ planAction: 'approve'});
    }

    handleCancelApprove = () => {
        this.setState({ planAction: null});
    }

    handleConfirmApprove = () => {
        this.props.onApprovePlan();
        this.setState({
            selected: [],
            planAction: null,
        })
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) =>{
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let planAction = {...prevState.openPositionDetails};
            let openCorrection = {...prevState.positionAction};
            selected[0] = row;
            planAction = 'correction';
            openCorrection = true;
            return {selected, openCorrection, planAction}
        });
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headFin)
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.positions !== prevState.positions){
            this.setState({
                positions: this.state.positions,
            });
        }
        if(this.props.initialValues.positions !== this.props.formValues)
        {
            if(this.state.planAction === null && prevState.planAction === "accept"){
                this.props.dispatch(change('PlanBasicInfoForm', 'positions', this.props.initialValues.positions ));
            } else if(this.state.planAction === null && prevState.planAction === "correction"){
                this.props.dispatch(change('PlanBasicInfoForm', 'positions', this.props.initialValues.positions ));
            }
        }
        if(this.props.initialValues.positions !== prevProps.initialValues.positions){
            this.setState({
                positions: this.props.initialValues.positions,
            });
        }
    }

    render(){
        const { handleSubmit, submitting, classes, initialValues, isLoading } = this.props
        const { headFin, headInv, selected, positions, planAction } = this.state;

        return(
            <>
                {(submitting || isLoading) && <Spinner /> }
                {planAction && this.renderDialog(initialValues.status)}
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
                                        name="planAmountAwardedGross"
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
                                        multiChecked={true}
                                        checkedColumnFirst={true}
                                        onSelect={this.handleSelect}
                                        onDoubleClick={this.handleDoubleClick}
                                        onExcelExport={this.handleExcelExport}
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
                            {/* Remove to institution plan
//                            {initialValues.status !== undefined && initialValues.status.code === 'RO' &&
//                                <Button
//                                    label={constants.BUTTON_APPROVE}
//                                    icon=<DoneAll/>
//                                    iconAlign="left"
//                                    variant="submit"
//                                    disabled={selected.length > 0 }
//                                    onClick={this.handleApprove}
//                                />
//                            }
                            */}
                            <Button
                                label={constants.BUTTON_CLOSE}
                                icon=<Cancel/>
                                iconAlign="left"
                                variant="cancel"
                                onClick={this.handleClose}
                            />
                        </Grid>
                    </div>
                </form>
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
