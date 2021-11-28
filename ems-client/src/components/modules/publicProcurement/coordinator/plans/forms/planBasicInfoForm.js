import React, { Component } from 'react';
import { change } from 'redux-form';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Button, InputField } from 'common/gui';
import * as constants from 'constants/uiNames';
import { FormTableField } from 'common/form';
import { Cancel, Description, LibraryBooks, Visibility, DoneAll, CheckCircle } from '@material-ui/icons/';
import PlanPublicProcurementContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planPublicProcurementContentPositionFormContainer';

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
        height: `calc(100vh - ${theme.spacing(52)}px)`,
    },
});


class PlanBasicInfoForm extends Component {
    state = {
        openPositionDetails: false,
        planAction: null,
        approveType: null,
        positions: this.props.initialValues.positions,
        selected:[],
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

    renderDialog = () =>{
        switch (this.state.planAction){
            case "approve":
                return(<ModalDialog
                    message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_APPROVE_MESSAGE}
                    variant="confirm"
                    onConfirm={this.handleConfirmApprove}
                    onClose={this.handleCancelApprove}
                />);
            default:
                return null;
        }
    }

    renderPlanContent = () =>{
        const { initialValues, vats, units, modes, assortmentGroups, orderTypes, estimationTypes} = this.props;
        const { positionAction, selected } = this.state;
        switch(initialValues.type.code){
            case("PZP"):
                return(
                    <PlanPublicProcurementContentPositionFormContainer
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
                        onDeletePlanSubPosition={this.handleDeleteSubPosition}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmitPosition}
                        onExcelExport={this.handleExcelExport}
                    />
                )
            default:
                return null;
        };

    };

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    };

    handleApprove = (event, approveType) => {
        this.setState({ planAction: 'approve', approveType: approveType });
    }

    handleCancelApprove = () => {
        this.setState({ planAction: null, approveType: null });
    }

    handleConfirmApprove = () => {
        if(this.state.approveType === 'approvePublicProcurement'){
            this.props.onApprovePlan();
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

    handleDoubleClick = (row) =>{
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let openPositionDetails = {...prevState.openPositionDetails};
            let positionAction = {...prevState.positionAction};
            selected[0] = row;
            openPositionDetails =  !this.state.openPositionDetails;
            positionAction = 'edit';
            return {selected, openPositionDetails, positionAction}
        });
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headPzp)
    }

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: [], positionAction: '',});
    };

    handleExcelExport = (exportType, level, headRow, positionId) => {
        const {headPzp} = this.state;
        let head = [];
        if(level === "subPositions"){
            head = headRow;
        } else {
           head = headPzp;
        }
        this.props.onExcelExport(exportType, head, level === undefined ? "position" : "subPositions", positionId)
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
        const { handleSubmit, submitting, classes, initialValues } = this.props;
        const { headPzp, selected, openPositionDetails, positions, planAction } = this.state;
        return(
            <>
                {planAction && this.renderDialog()}
                {openPositionDetails ?
                    this.renderPlanContent()
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
                                        label={constants.PUBLIC_PLAN_COORDINATOR_ACCEPT_USER}
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
                                        head={headPzp}
                                        allRows={positions}
                                        checkedRows={selected}
                                        toolbar={true}
                                        addButtonProps={{
                                            disabled: true,
                                        }}
                                        editButtonProps={{
                                            label: constants.BUTTON_PREVIEW,
                                            icon: <Visibility/>,
                                            variant: "cancel",
                                        }}
                                        deleteButtonProps={{
                                            disabled: true,
                                        }}
                                        onAdd={() => {}}
                                        onEdit={(event) => this.handleOpenPositionDetails(event, 'edit')}
                                        onDelete={() => {}}
                                        multiChecked={false}
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
                            {initialValues.status !== undefined && initialValues.status.code === 'WY' &&
                                <Button
                                    label={constants.BUTTON_APPROVE}
                                    icon=<DoneAll/>
                                    iconAlign="left"
                                    variant="submit"
                                    onClick={(event) => this.handleApprove(event, "approvePublicProcurement")}
                                />
                            }
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
