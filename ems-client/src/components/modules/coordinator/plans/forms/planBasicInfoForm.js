import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Button, InputField } from 'common/gui';
import * as constants from 'constants/uiNames';
import { FormDateField, FormSelectField , FormTableField} from 'common/form';
import { Save, Cancel, Send, Description, LibraryBooks, Edit, Visibility } from '@material-ui/icons/';
import PlanFinancialContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planFinancialContentPositionFormContainer';
import PlanInvestmentContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planInvestmentContentPositionFormContainer';
import PlanPublicProcurementContentPositionFormContainer from 'containers/modules/coordinator/plans/forms/planPublicProcurementContentPositionFormContainer';
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
        height: `calc(100vh - ${theme.spacing(41.6)}px)`,
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
        headFin: [
            {
                id: 'costType.code',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_COST_TYPE,
                suffix: 'zł.',
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

    handleSubmitPosition = (values) =>{
        this.props.onSubmitPlanPosition(values, this.state.positionAction)
    }

    handleSubmitSubPosition = (values, action) =>{

        const {formFinancialValues, formFinancialInitialValues,formPublicProcurementValues, formPublicProcurementInitialValues} = this.props;

        const formValues = this.props.initialValues.type.code === 'FIN' ? formFinancialValues : formPublicProcurementValues;
        const formInitialValues = this.props.initialValues.type.code === 'FIN' ? formFinancialInitialValues : formPublicProcurementInitialValues;

        const payload = JSON.parse(JSON.stringify(formValues));
        if(action === 'add'){
            let sumAmountRequestedNet = 0;
            let sumAmountRequestedGross = 0;
            //If add no first subPosition
            if(formValues.amountRequestedNet !== undefined){
                sumAmountRequestedNet = formValues.amountRequestedNet
                sumAmountRequestedGross = formValues.amountRequestedGross
            }
            payload.subPositions.push(values);
            payload.amountRequestedNet = parseFloat((sumAmountRequestedNet + values.amountNet).toFixed(2));
            payload.amountRequestedGross =  parseFloat((sumAmountRequestedGross + values.amountGross).toFixed(2));
        } else if (action === 'edit'){
            const index = findIndexElement(values, payload.subPositions, "positionId");
            let sumAmountRequestedNet = formValues.amountRequestedNet - formInitialValues.subPositions[index].amountNet;
            let sumAmountRequestedGross = formValues.amountRequestedGross - formInitialValues.subPositions[index].amountGross;
            payload.amountRequestedNet = parseFloat((sumAmountRequestedNet + values.amountNet).toFixed(2));
            payload.amountRequestedGross =  parseFloat((sumAmountRequestedGross + values.amountGross).toFixed(2));
            if (index !== null){
                payload.subPositions.splice(index, 1, values);
            }
        }
        this.props.onSubmitPlanSubPosition(payload, this.state.positionAction)
    }

    handleDeleteSubPosition = (values) =>{
        const {formFinancialValues, formPublicProcurementValues} = this.props;

        const formValues = this.props.initialValues.type.code === 'FIN' ? formFinancialValues : formPublicProcurementValues;

        let sumAmountRequestedNet = formValues.amountRequestedNet - values.amountNet;
        let sumAmountRequestedGross = formValues.amountRequestedGross - values.amountGross;
        const payload = JSON.parse(JSON.stringify(formValues));
        payload.amountRequestedNet = parseFloat(sumAmountRequestedNet.toFixed(2));
        payload.amountRequestedGross = parseFloat(sumAmountRequestedGross.toFixed(2));
        const index = findIndexElement(values, payload.subPositions, "positionId");
        if (index !== null){
            payload.subPositions.splice(index, 1);
        }
        this.props.onDeletePlanSubPosition(payload, values)
    }

    renderPlanContent = () =>{
        const { initialValues, vats, units, costsTypes, modes, assortmentGroups, orderTypes, estimationTypes} = this.props;
        const { positionAction, selected } = this.state;
        switch(initialValues.type.code){
            case("FIN"):
                return (
                    <PlanFinancialContentPositionFormContainer
                        initialValues={positionAction === 'add' ? {} : selected[0]}
                        planStatus={initialValues.status.code}
                        action={positionAction}
                        vats={vats}
                        units={units}
                        costsTypes={costsTypes}
                        onSubmitPlanSubPosition={this.handleSubmitSubPosition}
                        onDeletePlanSubPosition={this.handleDeleteSubPosition}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmitPosition}
                    />
                );
            case("INW"):
                return (
                    <PlanInvestmentContentPositionFormContainer
                        initialValues={positionAction === 'add' ? {} : selected[0]}
                        planStatus={initialValues.status.code}
                        action={positionAction}
                        vats={vats}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmitPosition}
                    />
                );
            case("PZP"):
                return(
                    <PlanPublicProcurementContentPositionFormContainer
                        initialValues={positionAction === 'add' ? {} : selected[0]}
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

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    };

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: [], positionAction: '',});
        this.props.setNewPositionToNull();
    };

    handleDeletePosition = (event, action) => {
        this.setState(state => ({ positionAction: action}));
    }

    handleCancelDelete = () => {
        this.setState({ positionAction: '' });
    }

    handleConfirmDelete = () => {
        this.props.onDeletePlanPosition(this.state.selected[0]);
        this.setState({
            selected: [],
            positionAction: '',
        })
    }

    componentDidUpdate(prevProps){
        if(this.state.positionAction === 'add' && this.props.newPosition !== null){
            this.setState(prevState =>{
                const selected =  [...prevState.selected];
                let positionAction = {...prevState.positionAction}
                selected[0] = this.props.newPosition;
                positionAction = 'edit';

                return {selected, positionAction}
            })
        }

        if(this.state.selected.length > 0 && this.state.positionAction === 'edit' ){
            const index = findIndexElement(this.state.selected[0], this.props.initialValues.positions, "positionId");
            if(index !== null){
                if(this.props.initialValues.positions[index] !== this.state.selected[0] ){
                    this.setState(prevState =>{
                        let positions = [...prevState.positions];
                        const selected = [...prevState.selected];
                        selected[0] = positions[index];
                        return {selected}
                   })
                }
            }
        }
        if(this.props.initialValues.positions !== prevProps.initialValues.positions){
            this.setState({
                positions: this.props.initialValues.positions,
            });
        }
        if(this.props.submitAction === true){
            this.handleCloseDetails();
        }
    }

    render(){
        const { handleSubmit, pristine, submitting, invalid, action, submitSucceeded, classes, initialValues, types } = this.props
        const { headFin, headInv, headPzp, selected, openPositionDetails, positionAction, positions, send, formChanged } = this.state;
            return(
            <>
                {positionAction === "delete" &&
                    <ModalDialog
                        message={constants.COORDINATOR_PLAN_POSITIONS_CONFIRM_DELETE_POSITION_MESSAGE}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDelete}
                    />
                }
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
                        { action === "add" ?
                            constants.COORDINATOR_PLAN_CREATE_NEW_PLAN_TITLE
                                : Object.keys(initialValues).length > 1 && constants.COORDINATOR_PLAN_EDIT_PLAN_TITLE + ` ${initialValues.type.name} ${new Date(initialValues.year).getFullYear()} `
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
                                        isRequired={true}
                                        disabled={action ==='add' ? false :
                                            initialValues.status !== undefined && initialValues.status.code !=='ZP' ? true :
                                                false
                                        }
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    { action === 'add'
                                        ?
                                            <FormSelectField
                                                name="type"
                                                label={constants.COORDINATOR_PLAN_FORM_TYPE}
                                                isRequired={true}
                                                value={initialValues.type !== undefined ? initialValues.type : ''}
                                                options={types}
                                            />
                                        :
                                            <InputField
                                                name="type"
                                                label={constants.COORDINATOR_PLAN_FORM_TYPE}
                                                disabled={true}
                                                isRequired={true}
                                                value={initialValues.type !== undefined ? initialValues.type.name : ''}
                                            />
                                    }
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
                                        head={ initialValues.type !== undefined && initialValues.type.code === "FIN" ? headFin : initialValues.type !== undefined && initialValues.type.code === "INV" ? headInv : headPzp}
                                        allRows={positions}
                                        checkedRows={selected}
                                        toolbar={true}
                                        addButtonProps={{
                                            disabled : (initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code !== 'ZP')) ? true : false
                                        }}
                                        editButtonProps={{
                                            label : (initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code === 'ZP')) ?  constants.BUTTON_EDIT : constants.BUTTON_PREVIEW,
                                            icon : (initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code === 'ZP')) ?  <Edit/> : <Visibility/>,
                                            variant: (initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code === 'ZP')) ?  "edit" : "cancel",
                                        }}
                                        deleteButtonProps={{
                                            disabled : (initialValues.status !== undefined && initialValues.status.code === 'ZP'
                                                ?
                                                    selected.length > 0  && (selected[0].status.code === 'DO' || selected[0].status.code === 'ZP') ?  false : true
                                                :
                                                    true
                                            )
                                        }}
                                        onAdd={(event) => this.handleOpenPositionDetails(event, "add")}
                                        onEdit={(event) => this.handleOpenPositionDetails(event, 'edit')}
                                        onDelete={(event) => this.handleDeletePosition(event, 'delete', )}
                                        multiChecked={false}
                                        checkedColumnFirst={true}
                                        onSelect={this.handleSelect}
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
                                    disabled={!pristine || submitting || invalid || initialValues.positions === undefined || positions.length === 0}
                                    onClick={this.handleSend}
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
