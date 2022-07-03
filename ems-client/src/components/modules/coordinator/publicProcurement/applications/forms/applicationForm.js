import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import {Spinner, ModalDialog } from 'common/';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar, FormControl, FormLabel, FormHelperText } from '@material-ui/core/';
import { Save, Cancel, Edit, Assignment, LibraryBooks, Print, Send, CheckCircle, Done, Redo, AssignmentTurnedIn } from '@material-ui/icons/';
import { Button, InputField, SplitButton } from 'common/gui';
import { FormTextField, FormAmountField, FormDateField, FormSelectField, FormTableField, FormCheckBox, FormDictionaryField } from 'common/form';
import ApplicationPartFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationPartFormContainer';
import ApplicationCriterionFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationCriterionFormContainer';
import ApplicationPriceFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationPriceFormContainer';
import ApplicationAssortmentGroupsFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationAssortmentGroupsFormContainer';
import ApplicationProtocolContainer from 'containers/modules/coordinator/publicProcurement/applications/applicationProtocolContainer';

const styles = theme => ({
    content: {
        overflow: 'auto',
        maxWidth: '100%',
    },
    content_wrapper: {
        overflow: 'auto',
        maxWidth: '100%',
        paddingRight: theme.spacing(0.3),
    },
    container: {
        paddingTop: theme.spacing(1),
        maxWidth: '100%',
    },
    actionContainer: {
        maxWidth: '100%',
    },
    columnContainer:{
        maxWidth: '100%',
        marginTop: theme.spacing(1),
        paddingLeft: theme.spacing(1),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    tableWrapper: {
        overflow: 'auto',
        height: theme.spacing(20),
        maxWidth: '100%',
    },
    tablePartsWrapper: {
        overflow: 'auto',
        minHeight: theme.spacing(20),
        maxHeight: theme.spacing(58),
    },
    formControl: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: '100%',
        maxWidth: '100%',
    },
    formControlError: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: '100%',
        maxWidth: '100%',
        color:'red'
    },
    splitButtonIcon: {
        marginRight: theme.spacing(0.7),
    },
});

class ApplicationForm extends Component {
    state = {
        selectedGroup: [],
        selectedPart: [],
        selectedCriterion: [],
        selectedPrice: [],
        deleteActionName:null,
        applicationAction: null,
        isDelete: false,
        assortmentGroups:[],
        assortmentGroupsParts:[],
        parts:[],
        criteria:[],
        openPartDetails: false,
        openCriterionDetails: false,
        openGroupsDetails: false,
        openPricesDetails: false,
        groupAction: null,
        partAction: null,
        criterionAction: null,
        priceAction: null,
        estimationTypes: this.props.estimationTypes,
        showProtocol: false,
        allowToSend: true,
        allowSaveOnAdd: false,
        splitAction: null,
        tableHeadGroups: [
            {
                id: 'applicationProcurementPlanPosition.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP,
                type: 'object',
            },
            {
                id: 'applicationProcurementPlanPosition.estimationType.name',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_THRESHOLD,
                type: 'object',
            },
            {
                id: 'applicationProcurementPlanPosition.amountRequestedNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_VALUE_NET,
                suffix: 'zł.',
                type: 'object',
                subtype: 'amount',
            },
            {
                id: 'orderGroupValueNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUP_APPLICATION_VALUE,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'vat.name',
                label: constants.VAT,
                type: 'object',
            },
            {
                id: 'orderValueYearNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_YEAR_NET,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        tableHeadParts: [
            {
                id: 'name',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_NAME,
                type: 'text',
            },
            {
                id: 'applicationAssortmentGroup.applicationProcurementPlanPosition.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP,
                type: 'object',
            },
            {
                id: 'amountNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountGross',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        tableHeadCriteria: [
            {
                id: 'value',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_CRITERIA_VALUE,
                suffix: '%',
                type: 'text',
            },
            {
                id: 'name',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_CRITERIA_NAME,
                type: 'text',
            },
        ],
        tableHeadPrices: [
            {
                id: 'applicationAssortmentGroup.applicationProcurementPlanPosition.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP,
                type: 'object',
            },
            {
                id: 'amountContractAwardedNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE_GROUP_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'vat.name',
                label: constants.VAT,
                type: 'object',
            },
            {
                id: 'amountContractAwardedGross',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE_GROUP_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        splitOptions:[
//            {
//                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_BUTTON_ROLLBACK_PART_REALIZATION,
//                onClick: ((event) => this.handleSplitAction(event, 'rollbackParts')),
//                disabled: false,
//                icon:<AssignmentReturn className={this.props.classes.splitButtonIcon} />,
//            },
            {
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_BUTTON_ROLLBACK_REALIZATION,
                onClick: ((event) => this.handleSplitAction(event, 'rollbackAll')),
                disabled: false,
                icon:<Cancel className={this.props.classes.splitButtonIcon} />,
            },
            {
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_BUTTON_REALIZED,
                onClick: ((event) => this.handleSplitAction(event, 'confirm')),
                disabled: false,
                icon:<AssignmentTurnedIn className={this.props.classes.splitButtonIcon} />,
            },
        ],
        maxContentHeight: 30,
        titleHeight: 0,
    }
    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    handleSelect = (event, action) => {
        this.setState({[action]: event});
    }


//    Example delete item in various array
//    handleDeleteItems = (all_name, sName) =>{
//        this.setState(prevState =>{
//            const items = prevState[all_name];
//            const idx = findIndexElement(prevState[sName][0], prevState[all_name]);
//            items.splice(idx,1)
//            return{
//                ...prevState,
//                isDelete: false,
//                [all_name]: items,
//                [sName]: [],
//                deleteActionName: null,
//            }
//        })
//    }

    handleConfirmDelete = (event, action) => {
        switch(action){
            case 'deleteGroup':
                this.props.onDeleteAssortmentGroup(this.state.selectedGroup[0]);
                this.setState({selectedGroup: [], groupAction: null, isDelete: false});
            break;
            case 'deletePart':
                this.props.onDeletePart(this.state.selectedPart[0])
                this.setState({selectedPart: [], partAction: null, isDelete: false});
            break;
            case 'deleteCriterion':
                this.props.onDeleteCriterion(this.state.selectedCriterion[0])
                this.setState({selectedCriterion: [], criterionAction: null, isDelete: false});
            break;
            case 'deletePrice':
                this.props.onDeleteProtocolPrice(this.state.selectedPrice[0])
                this.setState({selectedPrice: [], priceAction: null, isDelete: false});
            break;
            // no default
        }
    }

    renderDialog = () => {
        return(
            <>
                <ModalDialog
                    message={constants.COORDINATOR_PLAN_POSITIONS_CONFIRM_DELETE_POSITION_MESSAGE}
                    variant="warning"
                    onConfirm={(event) => this.handleConfirmDelete(event, this.state.deleteActionName)}
                    onClose={() => this.setState(prevState =>{
                        return{
                            ...prevState,
                            isDelete: false,
                            deleteActionName: '',
                        }
                   })}
                />
            </>
        )
    }

    handleConfirmApplicationAction = (event, action) => {
        switch(action){
            case 'send':
                this.props.onSend();
                this.setState({applicationAction: null});
            break;
            case 'approve':
                this.props.onApproveApplication()
                this.setState({applicationAction: null});
            break;
            case 'approveDirector':
                this.props.onApproveApplication('approveDirector')
                this.setState({applicationAction: null});
            break;
            case 'approveMedical':
                this.props.onApproveApplication('approveMedical')
                this.setState({applicationAction: null});
            break;
            case 'approveAccountant':
                this.props.onApproveApplication('approveAccountant')
                this.setState({applicationAction: null});
            break;
            case 'approveChief':
                this.props.onApproveApplication('approveChief')
                this.setState({applicationAction: null});
            break;
            case 'sendBack':
                this.props.onSendBackApplication()
                this.setState({applicationAction: null});
            break;
            case 'withdraw':
                this.props.onRollbackRealisation('all')
                this.setState({applicationAction: null});
            break;
            // no default
        }
    }

    renderActionDialog = () => {
        return(
            <ModalDialog
                message={this.state.applicationAction === "send" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_SEND_MSG :
                    this.state.applicationAction === "approve" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_APPROVE_MSG :
                        this.state.applicationAction === "approveDirector" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_APPROVE_DIRECTOR_MSG :
                            this.state.applicationAction === "approveMedical" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_APPROVE_MEDICAL_MSG :
                                this.state.applicationAction === "approveAccountant" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_APPROVE_ACCOUNTANT_MSG :
                                    this.state.applicationAction === "approveChief" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_APPROVE_MSG :
                                        this.state.applicationAction === "withdraw" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_WITHDRAW_MSG :
                        constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_SEND_BACK_MSG
                }
                variant={this.state.applicationAction === "withdraw" ? "warning" : "confirm"}
                onConfirm={(event) => this.handleConfirmApplicationAction(event, this.state.applicationAction)}
                onClose={() => this.setState(prevState =>{
                    return{
                        ...prevState,
                        applicationAction: null,
                    }
               })}
            />
        )
    }

    handleConfirmSplitAction = (event, action) => {
        switch(action){
            case 'confirm':
                this.props.onRealized();
                this.setState({splitAction: null});
            break;
            case 'rollbackAll':
                this.props.onRollbackRealisation('all')
                this.setState({applicationAction: null});
            break;
            case 'rollbackParts':
//                this.props.onRollbackRealisation('parts')
                this.setState({applicationAction: null});
            break;
            // no default
        }
    }

    renderSplitDialog = () =>{
        return(
            <ModalDialog
                message={this.state.splitAction === "confirm" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_REALIZATION_MSG :
                    this.state.splitAction === "rollbackAll" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ROLLBACK_REALIZATION_MSG :
                        constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ROLLBACK_PARTS_REALIZATION_MSG
                }
                variant="confirm"
                onConfirm={(event) => this.handleConfirmSplitAction(event, this.state.splitAction)}
                onClose={() => this.setState(prevState =>{
                    return{
                        ...prevState,
                        splitAction: null,
                    }
               })}
            />
        )
    }

    handleSplitAction = (event, action) => {
        this.setState({
            splitAction: action,
        })
    }

    handleOpenGroupDetails = (event, action) =>{
        this.setState({openGroupsDetails: !this.state.openGroupsDetails, groupAction: action})
    }

    handleCloseGroupDetails = () => {
        this.setState({openGroupsDetails: !this.state.openGroupsDetails, selectedGroup: [], groupAction: null});
    };

    handleSubmitGroups = (value) =>{
        this.props.onSaveAssortmentGroup(value, this.state.groupAction);
        this.handleCloseGroupDetails();
    }

    handleSubmitGroupApplicationPlanPosition = (values, action, groupId) =>{
        this.props.onSaveAssortmentGroupApplicationPlanPosition(this.state.selectedGroup[0].id, values, action);
    }

    handleDeleteGroupApplicationPlanPosition = (values) =>{
        this.props.onDeleteAssortmentGroupApplicationPlanPosition(this.state.selectedGroup[0].id, values);
    }

    handleSubmitGroupSubsequentYear = (values, action, planPositionId) =>{
        this.props.onSaveAssortmentGroupSubsequentYear(planPositionId, values, action);
    }

    handleDeleteGroupSubsequentYear = (values, planPositionId) =>{
        this.props.onDeleteAssortmentGroupSubsequentYear(planPositionId, values);
    }

    handleDelete = (event, action) =>{
       this.setState({isDelete: true, deleteActionName: action})
    }

    handleOpenPartDetails = (event, action) => {
        this.setState({openPartDetails: !this.state.openPartDetails, partAction: action});
    };

    handleClosePartDetails = () => {
        this.setState({openPartDetails: !this.state.openPartDetails, selectedPart: [], partAction: null});
    };

    handleSubmitPart = (values) =>{
        this.props.onSavePart(values, this.state.partAction, this.handleClosePartDetails);
    }

    handleOpenCriterionDetails = (event, action) => {
        this.setState({openCriterionDetails: !this.state.openCriterionDetails, criterionAction: action});
    };

    handleCloseCriterionDetails = () => {
        this.setState({openCriterionDetails: !this.state.openCriterionDetails, selectedCriterion: [], criterionAction: null});
    };

    handleSubmitCriterion = (values) => {
        this.props.onSaveCriterion(values, this.state.criterionAction, this.handleCloseCriterionDetails);
    }

    handleOpenPriceDetails = (event, action) => {
        this.setState({openPriceDetails: !this.state.openPriceDetails, priceAction: action});
    };

    handleClosePriceDetails = () => {
        this.setState({openPriceDetails: !this.state.openPriceDetails, selectedPrice: [], priceAction: null});
    };

    handleSubmitPrice = (values) => {

        this.props.onSaveProtocolPrice(values, this.props.formCurrentValues.applicationProtocol, this.state.priceAction);
        this.handleClosePriceDetails();
    }

    handleDoubleClick = (event, action) => {
        switch(action){
            case 'assortmentGroup':
                this.setState({
                    openGroupsDetails: !this.state.openGroupsDetails,
                    groupAction: action,

                });
                this.state.selectedGroup.push(event);
            break;
            case 'part':
                this.setState({
                    openPartDetails: !this.state.openPartDetails,
                    partAction: action,
                });
                this.state.selectedPart.push(event);
            break;
            case 'criterion':
                this.setState({
                    openCriterionDetails: !this.state.openCriterionDetails,
                    criterionAction: action,
                });
                this.state.selectedCriterion.push(event);
            break;
            case 'price':
                this.setState({
                    openPriceDetails: !this.state.openPriceDetails,
                    priceAction: action,
                });
                this.state.selectedPrice.push(event);
            break;
            // no default
        }
    }

    filterEstimationTypes = () => {
        if(this.props.formCurrentValues !== null && !this.props.formCurrentValues.isArt30){
            let estimationTypes = this.props.estimationTypes;
            const orderValueNet = this.props.formCurrentValues.orderValueNet;
            switch(true){
                case (orderValueNet > 50000 && orderValueNet <= 130000):
                    estimationTypes = estimationTypes.filter((i) => !['DO50'].includes(i.code));
                break;
                case (orderValueNet > 130000):
                    estimationTypes = estimationTypes.filter((i) => !['DO50', 'DO130'].includes(i.code));
                break;
                // no default
            }
            this.setState({
                estimationTypes: estimationTypes
            });
        }
    }

    handleApplicationAction = (event, action) => {
        this.setState({applicationAction: action});
    }

    handleShowProtocol = () => {
        this.setState({
            showProtocol: !this.state.showProtocol,
        })
    }

    handleSave = () => {
        this.props.onSave(this.props.formCurrentValues)
    }

    allowToSend = () => {
        const { formErrors } = this.props;
        if(formErrors.parts !== undefined || formErrors.assortmentGroups !== undefined || formErrors.criteria !== undefined || (formErrors.applicationProtocol !== undefined && formErrors.applicationProtocol.prices !== undefined)){
            this.setState({allowToSend: false})
        }
    }

    handlePartsExcelExport = (exportType) => {
        this.props.onExcelPartsExport(exportType, this.state.tableHeadParts);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.formCurrentValues !== prevProps.formCurrentValues && this.props.formCurrentValues.orderValueNet !== undefined && this.props.formCurrentValues.orderValueNet !== prevProps.formCurrentValues.orderValueNet){
            this.filterEstimationTypes();
        }
        if(this.props.initialValues !== prevProps.initialValues && this.props.initialValues.parts !== undefined && this.props.initialValues.parts.length > 0){
            this.filterEstimationTypes();
        } else if (this.props.initialValues !== prevProps.initialValues && this.props.initialValues.parts !== undefined && this.props.initialValues.parts.length === 0){
            this.filterEstimationTypes();
            this.setState(prevState => {
                const splitOptions = [...prevState.splitOptions];
                    splitOptions[0].disabled = true;
                return {splitOptions}
            });
        }

        if(this.props.initialValues !== prevProps.initialValues){
            const arrayFields = ['assortmentGroups', 'parts', 'criteria']
            arrayFields.forEach(arrayField => {
                if(this.props.initialValues[arrayField] !== prevProps.initialValues[arrayField]){
                    if(arrayField === 'assortmentGroups'){
                        this.setState(prevState =>{
                            let assortmentGroups = [...prevState.assortmentGroups];
                            let assortmentGroupsParts = [...prevState.assortmentGroupsParts];
                            let selectedGroup = [...prevState.selectedGroup];
                            assortmentGroups = this.props.initialValues["assortmentGroups"];
                            assortmentGroupsParts = [];
                            assortmentGroups.forEach(group =>{
                                Object.assign(group,
                                    {
                                        code: group.applicationProcurementPlanPosition.code,
                                        name: group.applicationProcurementPlanPosition.name,
                                    }
                                )
                                if(assortmentGroupsParts.length === 0){
                                    assortmentGroupsParts.push(group);
                                } else if(assortmentGroupsParts.filter(assortmentGroup => assortmentGroup.applicationProcurementPlanPosition.id === group.applicationProcurementPlanPosition.id).length === 0){
                                    assortmentGroupsParts.push(group);
                                }
                            });
                            return {assortmentGroups, assortmentGroupsParts, selectedGroup}
                        });
                    } else {
                        this.setState({
                            arrayField: this.props.initialValues[arrayField]
                        });
                    }
                }
            })
            this.allowToSend();
            // Setup split button disabled option
            if(this.props.initialValues.parts.length === 0){
                this.setState(prevState => {
                    const splitOptions = [...prevState.splitOptions];
                    splitOptions[0].disabled = false;
                    if(this.props.formCurrentValues.assortmentGroups.filter(group => group.amountContractAwardedNet === null).length > 0){
                        splitOptions[1].disabled = true;
                    } else if(splitOptions[1].disabled && this.props.formCurrentValues.assortmentGroups.filter(group => group.amountContractAwardedNet === null).length === 0){
                        splitOptions[1].disabled = false;
                    }
                    return {splitOptions}
                });
            } else {
                this.setState(prevState => {
                    const splitOptions = [...prevState.splitOptions];
                    if(this.props.formCurrentValues.parts.filter(part => ((part.isRealized === true && part.amountContractAwardedNet === null) ||
                        (part.isRealized === false && part.reasonNotRealized === null))).length > 0){
                        splitOptions[1].disabled = true;
                    } else {
                        splitOptions[1].disabled = false;
                    }
                    return {splitOptions}
                });
            }
        }

        if(prevProps.formCurrentValues !== undefined && prevProps.formCurrentValues.orderValueNet !== undefined && prevProps.formCurrentValues.orderValueNet !== this.props.formCurrentValues.orderValueNet &&
            this.props.formCurrentValues.assortmentGroups !== undefined && this.props.formCurrentValues.assortmentGroups.length > 1){
            if(this.props.formCurrentValues.assortmentGroups.filter(group => group.applicationProcurementPlanPosition.estimationType.code !== this.props.formCurrentValues.assortmentGroups[0].applicationProcurementPlanPosition.estimationType.code).length >0){
                this.filterEstimationTypes();
                this.props.dispatch(change('ApplicationForm', "estimationType", ''))
            }
        }

        if(prevProps.formCurrentValues !== undefined && prevProps.formCurrentValues.isCombined === true && this.props.formCurrentValues.isCombined === false){
            this.props.dispatch(change('ApplicationForm', "coordinatorCombined", ''))
        }

        if(this.state.selectedGroup.length > 0 && this.props.initialValues.assortmentGroups !== undefined){
            const idx = this.props.initialValues.assortmentGroups.findIndex(group => group.id === this.state.selectedGroup[0].id)
            if(this.state.selectedGroup[0] !== this.props.initialValues.assortmentGroups[idx]){
                this.setState(prevState =>{
                    let selectedGroup = [...prevState.selectedGroup];
                    selectedGroup[0] = this.props.initialValues.assortmentGroups[idx];
                    return{selectedGroup}
                })
            }
        }

        if(this.props.action === 'add'){
            if(this.props.formCurrentValues !== undefined && this.props.formCurrentValues.orderIncludedPlanType !== undefined &&
                this.props.formCurrentValues.orderedObject !== undefined && this.props.formCurrentValues.mode !== undefined && !this.state.allowSaveOnAdd){
                this.setState({
                    allowSaveOnAdd: true,
                })
            }
        } else if(!this.state.allowSaveOnAdd) {
            this.setState({
                allowSaveOnAdd: true,
            })
        }

        // Setup content height by title height
        if(!this.state.showProtocol){
            if(this.title !== undefined && this.title.clientHeight !== this.state.titleHeight){
                 this.setState({titleHeight: this.title.clientHeight});
            }
            if(this.action !== undefined && prevState.titleHeight !== this.state.titleHeight){
                this.setState({maxContentHeight: (this.state.titleHeight + this.action.clientHeight)+67});
            }
        }
    }

    render(){
        const { classes, isLoading, pristine, submitting, invalid, submitSucceeded, action, modes, initialValues, planPositions, formCurrentValues, vats, coordinators, orderProcedures,
            planTypes, applications, contractors, formErrors, levelAccess } = this.props;
        const { tableHeadParts, tableHeadCriteria, tableHeadGroups, selectedGroup, selectedPart, selectedCriterion, selectedPrice, openPartDetails, openCriterionDetails, openGroupsDetails,
            openPriceDetails, groupAction, partAction, criterionAction, priceAction, isDelete, estimationTypes, showProtocol, tableHeadPrices, allowToSend, allowSaveOnAdd, applicationAction, splitOptions,
                splitAction, maxContentHeight } = this.state;
        if (formCurrentValues === undefined) {
            return(
                null
            )
        } else {
            return(
                <>
                    {(submitting || isLoading) && <Spinner /> }
                    {isDelete && this.renderDialog()}
                    {applicationAction && this.renderActionDialog()}
                    {splitAction && this.renderSplitDialog()}
                    {openGroupsDetails &&
                        <ApplicationAssortmentGroupsFormContainer
                            isLoading={isLoading}
                            open={openGroupsDetails}
                            initialValues={groupAction === 'add' ? {subsequentYears: []} : selectedGroup[0]}
                            action={groupAction}
                            publicProcurementPlanPositions={planPositions.filter((position) => !this.state.assortmentGroups.includes(position))}
                            planPositions={formCurrentValues.orderIncludedPlanType !== undefined && formCurrentValues.orderIncludedPlanType.code === 'FIN' ? this.props.financialPlanPositions : this.props.investmentPlanPositions}
                            orderIncludedPlanType={formCurrentValues.orderIncludedPlanType !== undefined && formCurrentValues.orderIncludedPlanType.code}
                            vats={vats}
                            assortmentGroups={this.props.initialValues.assortmentGroups}
                            applicationStatus={initialValues.status}
                            levelAccess={levelAccess}
                            isParts={formCurrentValues.isParts}
                            onClose={this.handleCloseGroupDetails}
                            onSubmit={this.handleSubmitGroups}
                            onSaveApplicationPlanPosition={this.handleSubmitGroupApplicationPlanPosition}
                            onDeleteApplicationPlanPosition={this.handleDeleteGroupApplicationPlanPosition}
                            onSaveSubsequentYear={this.handleSubmitGroupSubsequentYear}
                            onDeleteSubsequentYear={this.handleDeleteGroupSubsequentYear}
                        />
                    }
                    {openPartDetails &&
                        <ApplicationPartFormContainer
                            isLoading={isLoading}
                            open={openPartDetails}
                            initialValues={partAction === 'add' ? {isRealized: false} : selectedPart[0]}
                            action={partAction}
                            vats={vats}
                            assortmentGroups={this.state.assortmentGroupsParts}
                            groupVat={formCurrentValues.assortmentGroups.length === 1 ? formCurrentValues.assortmentGroups[0].vat : undefined}
                            orderValueNet={formCurrentValues.orderValueNet}
                            parts={this.props.initialValues.parts}
                            applicationStatus={initialValues.status}
                            applicationThreshold={formCurrentValues.estimationType !== undefined ? formCurrentValues.estimationType.code : null}
                            reasonsNotRealized={this.props.reasonsNotRealizedApplication}
                            levelAccess={levelAccess}
                            onClose={this.handleClosePartDetails}
                            onSubmit={this.handleSubmitPart}
                        />
                    }
                    {openCriterionDetails &&
                        <ApplicationCriterionFormContainer
                            isLoading={isLoading}
                            open={openCriterionDetails}
                            initialValues={criterionAction === 'add' ? {} : selectedCriterion[0]}
                            action={criterionAction}
                            criteria={this.props.initialValues.criteria}
                            applicationStatus={initialValues.status}
                            onClose={this.handleCloseCriterionDetails}
                            onSubmit={this.handleSubmitCriterion}
                        />
                    }
                    {openPriceDetails &&
                        <ApplicationPriceFormContainer
                            isLoading={isLoading}
                            open={openPriceDetails}
                            initialValues={priceAction === 'add' ?
                                this.state.assortmentGroupsParts.length === 1 ? {applicationAssortmentGroup : this.state.assortmentGroupsParts[0], vat: this.state.assortmentGroupsParts[0].vat} : {}
                                    : selectedPrice[0]
                            }
                            vats={vats}
                            action={priceAction}
                            assortmentGroups={this.state.assortmentGroupsParts}
                            prices={this.props.initialValues.prices}
                            applicationStatus={initialValues.status.code}
                            applicationEstimationType={initialValues.estimationType.code}
                            application={initialValues.status.code}
                            onClose={this.handleClosePriceDetails}
                            onSubmit={this.handleSubmitPrice}
                        />
                    }
                    {showProtocol ?
                        <ApplicationProtocolContainer
                            initialValues={formCurrentValues}
                            assortmentGroups={this.state.assortmentGroupsParts}
                            levelAccess={levelAccess}
                            vats={vats}
                            contractors={contractors}
                            applicationStatus={initialValues.status.code}
                            applicationEstimationType={initialValues.estimationType.code}
                            onClose={this.handleShowProtocol}
                        />
                    :
                        <form>
                            <div className={classes.content}>
                                <Typography variant='h6'  ref={(ref) => this.title = ref}>
                                    { action === "add" ?
                                        constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TITLE_CREATE
                                            :  constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TITLE_EDIT + ` ${initialValues.orderedObject}`
                                    }
                                </Typography>
                                <Divider/>
                                <div
                                    className={classes.content_wrapper}
                                    style={
                                        {
                                            height : maxContentHeight !== 0 ? `calc(100vh - ${maxContentHeight}px)` : "100%",

                                        }
                                    }
                                >
                                    <Grid container spacing={1} className={classes.container}>
                                        <Grid item xs={3} >
                                            <FormTextField
                                                name="number"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_NUMBER}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormSelectField
                                                isRequired={true}
                                                name="mode"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE}
                                                options={modes}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <FormDateField
                                                name="createDate"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CREATE_DATE}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                isRequired={true}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <FormDateField
                                                name="sendDate"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SEND_DATE}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                isRequired={true}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <InputField
                                                name="status"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS}
                                                value={initialValues.status !== undefined ? initialValues.status.name : ""}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormCheckBox
                                                name="isReplay"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_IS_REPLAY}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        { formCurrentValues.isReplay &&
                                            <Grid item xs={9}>
                                                <FormDictionaryField
                                                    isRequired={true}
                                                    name="replaySourceApplication"
                                                    dictionaryName={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_TITLE}
                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SOURCE_APPLICATION}
                                                    items={applications}
                                                    disabled={initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                />
                                            </Grid>
                                        }
                                        <Grid item xs={12}>
                                            <Toolbar className={classes.toolbar}>
                                                <CheckCircle className={classes.subHeaderIcon} fontSize="small" />
                                                <Typography variant="subtitle1" >
                                                    {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ACCEPT_PATH}
                                                </Typography>
                                            </Toolbar>
                                        </Grid>
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
                                                name="publicAcceptUser"
                                                label={constants.PUBLIC_PLAN_COORDINATOR_ACCEPT_USER}
                                                disabled={true}
                                                value={initialValues.publicAcceptUser !== undefined && initialValues.publicAcceptUser !== null ?
                                                    `${initialValues.publicAcceptUser.name} ${initialValues.publicAcceptUser.surname}` :
                                                        ''}
                                            />
                                        </Grid>
                                        {(formCurrentValues.coordinator !== undefined && formCurrentValues.coordinator.code === 'dam' &&
                                            formCurrentValues.orderIncludedPlanType.code === 'INW' ) &&
                                            <Grid item xs={12} sm={4}>
                                                <InputField
                                                    name="medicalDirectorAcceptUser"
                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MEDICAL_DIRECTOR_ACCEPT_USER}
                                                    disabled={true}
                                                    value={initialValues.medicalDirectorAcceptUser !== undefined && initialValues.medicalDirectorAcceptUser !== null ?
                                                        `${initialValues.medicalDirectorAcceptUser.name} ${initialValues.medicalDirectorAcceptUser.surname}` :
                                                            ''}
                                                />
                                            </Grid>
                                        }
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
                                        <Grid item xs={12} sm={formCurrentValues.coordinator !== undefined && formCurrentValues.coordinator.code === 'dam' &&
                                            formCurrentValues.orderIncludedPlanType.code === 'INW' ? 4 : 6 }>
                                            <InputField
                                                name="accountantAcceptUser"
                                                label={constants.ACCOUNTANT_PLAN_COORDINATOR_ACCOUNTANT_ACCEPT_USER}
                                                disabled={true}
                                                value={initialValues.accountantAcceptUser !== undefined && initialValues.accountantAcceptUser !== null ?
                                                    `${initialValues.accountantAcceptUser.name} ${initialValues.accountantAcceptUser.surname}` :
                                                        ''}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={formCurrentValues.coordinator !== undefined && formCurrentValues.coordinator.code === 'dam' &&
                                            formCurrentValues.orderIncludedPlanType.code === 'INW' ? 4 : 6 }>
                                            <InputField
                                                name="chiefAcceptUser"
                                                label={constants.ACCOUNTANT_PLAN_COORDINATOR_CHIEF_ACCEPT_USER}
                                                disabled={true}
                                                value={initialValues.chiefAcceptUser !== undefined && initialValues.chiefAcceptUser !== null ?
                                                    `${initialValues.chiefAcceptUser.name} ${initialValues.chiefAcceptUser.surname}` :
                                                        ''}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>
                                        {(formCurrentValues.mode !== undefined && formCurrentValues.mode.code === 'UP') &&
                                            <Grid item xs={12} >
                                                <FormTextField
                                                    name="reasonNotIncluded"
                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_REASON_NOT_INCLUDED}
                                                    multiline
                                                    isRequired={true}
                                                    inputProps={{ maxLength: 1000 }}
                                                    disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                />
                                            </Grid>
                                        }
                                        <Grid item xs={12} >
                                            <FormTextField
                                                name="orderedObject"
                                                label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT}
                                                isRequired={true}
                                                inputProps={{ maxLength: 300 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        <Grid item xs={2} >
                                            <FormSelectField
                                                isRequired={true}
                                                name="orderIncludedPlanType"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_COORDINATOR_TYPE}
                                                options={planTypes}
                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                    (this.props.initialValues.assortmentGroups !== undefined && this.props.initialValues.assortmentGroups.length > 0) ?
                                                        true : false
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <FormCheckBox
                                                name="isCombined"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_COMBINED}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        {formCurrentValues.isCombined &&
                                            <Grid item xs={8} >
                                                <FormDictionaryField
                                                    isRequired={true}
                                                    name="coordinatorCombined"
                                                    dictionaryName={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_COORDINATOR_COMBINED}
                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_COORDINATOR_COMBINED}
                                                    items={coordinators}
                                                    disabled={initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                />
                                            </Grid>
                                        }
                                        <Grid item xs={12} >
                                            <Toolbar className={classes.toolbar}>
                                                <FormControl error>
                                                    <Typography variant="subtitle1" ><LibraryBooks className={classes.subHeaderIcon} fontSize="small" /> {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUPS}</Typography>
                                                    { formErrors.criteria !== undefined &&
                                                        <FormHelperText>{formErrors.assortmentGroups}</FormHelperText>
                                                    }
                                                </FormControl>
                                            </Toolbar>
                                            <FormTableField
                                                className={classes.tableWrapper}
                                                name="assortmentGroups"
                                                head={tableHeadGroups}
                                                allRows={action === "add" ? [] : this.props.initialValues.assortmentGroups}
                                                checkedRows={selectedGroup}
                                                toolbar={true}
                                                addButtonProps={{
                                                    disabled : (!pristine || initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code !== 'ZP')
                                                        || (initialValues.status !== undefined && initialValues.status.code === 'ZP' && formCurrentValues.coordinatorPlanType === null)
                                                            || (formCurrentValues.isArt30 === true && formCurrentValues.assortmentGroups.length > 0)) && true,
                                                }}
                                                editButtonProps={{
                                                    label: constants.BUTTON_EDIT,
                                                    icon: <Edit/>,
                                                    variant: "edit",
                                                    disabled: (initialValues.status !== undefined && initialValues.status.code !== 'ZP' && formCurrentValues.coordinatorPlanType === null) && true
                                                }}
                                                deleteButtonProps={{
                                                    disabled : (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true
                                                        : selectedGroup.length > 0 && formCurrentValues.parts !== undefined && formCurrentValues.parts.length === 0 && formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.prices.length === 0 ? false
                                                            : selectedGroup.length > 0 && formCurrentValues.parts !== undefined && formCurrentValues.parts.length > 0 && formCurrentValues.parts.filter(part => part.applicationAssortmentGroup.id === selectedGroup[0].id).length === 0 && formCurrentValues.applicationProtocol === null ? false
                                                                : selectedGroup.length > 0 && formCurrentValues.parts !== undefined && formCurrentValues.parts.length > 0 && formCurrentValues.parts.filter(part => part.applicationAssortmentGroup.id === selectedGroup[0].id).length === 0 && formCurrentValues.applicationProtocol !== null && (formCurrentValues.applicationProtocol.prices.length === 0 || (formCurrentValues.applicationProtocol.prices.length > 0 && formCurrentValues.applicationProtocol.prices.filter(price => price.applicationAssortmentGroup.id === selectedGroup[0].id).length === 0)) ? false : true,

                                                }}
                                                onAdd={(event) => this.handleOpenGroupDetails(event, 'add')}
                                                onEdit={(event) => this.handleOpenGroupDetails(event, 'edit')}
                                                onDelete={(event) => this.handleDelete(event, 'deleteGroup')}
                                                multiChecked={false}
                                                checkedColumnFirst={true}
                                                onSelect={(event) => this.handleSelect(event, 'selectedGroup')}
                                                onDoubleClick={(event) => this.handleDoubleClick(event, 'assortmentGroup' )}
                                                orderBy="id"
                                            />
                                        </Grid>
                                        <Grid item xs={3} >
                                            <FormTextField
                                                name="orderRealizationTerm"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_REALIZATION_TERM}
                                                isRequired={initialValues.status !== undefined ? true : null }
                                                inputProps={{ maxLength: 20 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormSelectField
                                                name="estimationType"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_THRESHOLD}
                                                options={estimationTypes}
                                                disabled={(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                    this.props.initialValues.assortmentGroups !== undefined && this.props.initialValues.assortmentGroups.length < 2 && formCurrentValues.isArt30 ? false :
                                                        this.props.initialValues.assortmentGroups !== undefined && this.props.initialValues.assortmentGroups.length < 2 ? true : false}
                                                isRequired={initialValues.status !== undefined ? true : null }
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormCheckBox
                                                name="isArt30"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ART_30}
                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') || (this.props.initialValues.assortmentGroups !== undefined && this.props.initialValues.assortmentGroups.length > 1) }
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormAmountField
                                                name="orderValueNet"
                                                label={formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType.code === 'DO50' ?
                                                    constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_NET_50 :
                                                        constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_NET_OTHER
                                                }
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormAmountField
                                                name="orderValueGross"
                                                label={formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType.code === 'DO50' ?
                                                    constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_GROSS_50 :
                                                       constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_GROSS_OTHER}
                                                disabled
                                            />
                                        </Grid>
                                        <>
                                            <Grid item xs={12}>
                                                <FormCheckBox
                                                    name="isParts"
                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PARTS}
                                                    disabled={(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                        this.props.initialValues.parts !== undefined && this.props.initialValues.parts.length > 0 ? true : false}
                                                />
                                            </Grid>
                                            {formErrors.parts !== undefined &&
                                                <Grid item xs={12}>
                                                    <FormControl error>
                                                        <FormHelperText>{formErrors.parts}</FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                            }
                                        </>
                                        {(initialValues.status !== undefined && (formCurrentValues.estimationType !== undefined &&
                                            formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code) &&
                                                !formCurrentValues.isParts)) &&
                                            <>
                                                {/* Above 130 / UE  and no order parts*/}
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="orderReasonLackParts"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_REASON_LACK_PARTS}
                                                        multiline
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 1000 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        {(formCurrentValues !== undefined && formCurrentValues.isParts) &&
                                            <>
                                                {/* if is order parts*/}
                                                <Grid item xs={12} sm={12} >
                                                    <FormTableField
                                                        className={classes.tablePartsWrapper}
                                                        name="parts"
                                                        head={tableHeadParts}
                                                        allRows={action === "add" ? [] : this.props.initialValues.parts}
                                                        checkedRows={selectedPart}
                                                        toolbar={true}
                                                        addButtonProps={{
                                                            disabled:  (!pristine || (initialValues.status !== undefined && initialValues.status.code !== 'ZP')) ? true :
                                                                formCurrentValues.orderValueNet === undefined ?
                                                                    true :
                                                                        this.state.parts.reduce((prev, cur) => prev + cur.amountNet, 0) === formCurrentValues.orderValueNet ?
                                                                            true :
                                                                                false,
                                                        }}
                                                        editButtonProps={{
                                                            label: constants.BUTTON_EDIT,
                                                            icon: <Edit/>,
                                                            variant: "edit",
                                                            disabled: (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                                selectedPart.length > 0 && formCurrentValues.orderValueNet === undefined ? true : false,
                                                        }}
                                                        deleteButtonProps={{
                                                            disabled: (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                                selectedPart.length > 0 ? false : true,
                                                        }}
                                                        onAdd={(event) => this.handleOpenPartDetails(event, "add")}
                                                        onEdit={(event) => this.handleOpenPartDetails(event, 'edit')}
                                                        onDelete={(event) => this.handleDelete(event, 'deletePart')}
                                                        multiChecked={false}
                                                        checkedColumnFirst={true}
                                                        onSelect={(event) => this.handleSelect(event, 'selectedPart')}
                                                        onDoubleClick={(event) => this.handleDoubleClick(event, 'part' )}
                                                        onExcelExport={this.handlePartsExcelExport}
                                                        orderBy="id"
                                                    />
                                                </Grid>
                                                {levelAccess === 'public' &&
                                                    <>
                                                        <Grid item xs={6}>
                                                            <FormAmountField
                                                                name="partsAmountNet"
                                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PARTS_VALUE_NET}
                                                                disabled
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormAmountField
                                                                name="partsAmountGross"
                                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PARTS_VALUE_GROSS}
                                                                disabled
                                                            />
                                                        </Grid>
                                                    </>
                                                }
                                            </>
                                        }
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                            <>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="orderValueBased"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_BASED}
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 200 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={9}>
                                                    <FormTextField
                                                        name="orderValueSettingPerson"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_SETTING_VALUE_PERSON}
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 200 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={3}>
                                                    <FormDateField
                                                        name="dateEstablishedValue"
                                                        isRequired={true}
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_DATE_ESTABLISHED_VALUE}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        <Grid item xs={12} >
                                            <FormTextField
                                                name="justificationPurchase"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_JUSTIFICATION_PURCHASE}
                                                multiline
                                                isRequired={initialValues.status !== undefined ? true : null }
                                                inputProps={{ maxLength: 1000 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <FormTextField
                                                name="orderDescription"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_DESCRIPTION}
                                                multiline
                                                isRequired={initialValues.status !== undefined ? true : null }
                                                inputProps={{ maxLength: 5000 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                            <>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="personsPreparingDescription"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_DESCRIPTION}
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 200 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="requirementsVariantBids"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_REQUIREMENTS_VARIANT_BIDS}
                                                        multiline
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 1000 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} >
                                                    <FormTextField
                                                        name="cpv"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CPV}
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 500 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} >
                                                    <FormSelectField
                                                        name="orderProcedure"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_PROCEDURE}
                                                        options={orderProcedures}
                                                        disabled={ (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                             false}
                                                        isRequired={initialValues.status !== undefined ? true : null }
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="proposedOrderingProcedure"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PROPOSED_ORDERING_PROCEDURE}
                                                        multiline
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 1000 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="personsPreparingJustification"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_JUSTIFICATION}
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 200 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                            <>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={12} >
                                                    <FormTextField
                                                        name="orderContractorName"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CONTRACTOR_NAME}
                                                        isRequired={initialValues.status !== undefined ? true : null }
                                                        inputProps={{ maxLength: 200 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['D0130'].includes(formCurrentValues.estimationType.code)) &&
                                            <>
                                                {/* Threshold DO130 */}
                                                <Grid item xs={12} >
                                                    <FormTextField
                                                        name="justificationNonCompetitiveProcedure"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_JUSTIFICATION_NON_COMPETITIVE_PROCEDURE}
                                                        isRequired={initialValues.status !== undefined ? true : null }
                                                        inputProps={{ maxLength: 1000 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                            <>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="personsChoosingContractor"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_CHOOSING_CONTRACTOR}
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 200 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['DO130'].includes(formCurrentValues.estimationType.code)) &&
                                            <>
                                                {/* Threshold DO130 */}
                                                <Grid item xs={12} >
                                                    <FormTextField
                                                        name="orderContractorConditions"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CONTRACTOR_CONDITIONS}
                                                        multiline
                                                        isRequired={initialValues.status !== undefined ? true : null }
                                                        inputProps={{ maxLength: 1000 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                            <>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="conditionsParticipation"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONDITIONS_PARTICIPATION}
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 10000 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="personsPreparingConditions"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_CONDITIONS}
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 200 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && formCurrentValues.estimationType.code !== 'DO50') &&
                                            <>
                                                {/* Above DO50 / 130 / UE */}
                                                <Grid item xs={12} >
                                                    <FormTextField
                                                        name="orderImportantRecords"
                                                        label={formCurrentValues.estimationType.code === 'DO130' ?
                                                            constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_IMPORTANT_RECORDS_UP_TO_130
                                                                : constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_IMPORTANT_RECORDS_UE
                                                        }
                                                        multiline
                                                        isRequired={initialValues.status !== undefined ? true : null}
                                                        inputProps={{ maxLength: 11000 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        <Grid item xs={12} >
                                            <Toolbar className={classes.toolbar}>
                                                <FormControl error>
                                                    <Typography variant="subtitle1" ><Assignment className={classes.subHeaderIcon} fontSize="small" /> {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERIA_EVALUATION_OFFERS}</Typography>
                                                    { formErrors.criteria !== undefined &&
                                                        <FormHelperText>{formErrors.criteria}</FormHelperText>
                                                    }
                                                </FormControl>
                                            </Toolbar>
                                            <FormTableField
                                                className={classes.tableWrapper}
                                                name="criteria"
                                                head={tableHeadCriteria}
                                                allRows={action === "add" ? [] : this.props.initialValues.criteria}
                                                checkedRows={selectedCriterion}
                                                toolbar={true}
                                                addButtonProps={{
                                                    disabled: !pristine || initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                        this.state.criteria.reduce((prev, cur) => prev + cur.value, 0) === 100 ? true : false,
                                                }}
                                                editButtonProps={{
                                                    label: constants.BUTTON_EDIT,
                                                    icon: <Edit/>,
                                                    variant: "edit",
                                                    disabled: (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                        selectedCriterion.length > 0 ? false : true,
                                                }}
                                                deleteButtonProps={{
                                                    disabled : (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                        selectedCriterion.length > 0 ? false : true,
                                                }}
                                                onAdd={(event) => this.handleOpenCriterionDetails(event, "add")}
                                                onEdit={(event) => this.handleOpenCriterionDetails(event, 'edit')}
                                                onDelete={(event) => this.handleDelete(event, 'deleteCriterion')}
                                                multiChecked={false}
                                                checkedColumnFirst={true}
                                                onSelect={(event) => this.handleSelect(event, 'selectedCriterion')}
                                                onDoubleClick={(event) => this.handleDoubleClick(event, 'criterion' )}
                                                orderBy="id"
                                            />
                                        </Grid>
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                            <>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="personsPreparingCriteria"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_CRITERIA}
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 200 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                                {/* Above 130 / UE */}
                                                <Grid item xs={12}>
                                                    <FormTextField
                                                        name="tenderCommittee"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TENDER_COMMITTEE}
                                                        isRequired={true}
                                                        inputProps={{ maxLength: 500 }}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        <Grid item xs={12} >
                                            <FormTextField
                                                name="warrantyRequirements"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_WARRANTY_REQUIREMENTS}
                                                multiline
                                                isRequired={initialValues.status !== undefined ? true : null}
                                                inputProps={{ maxLength: 1000 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                            <>
                                                <Grid item xs={6}>
                                                    <FormCheckBox
                                                        name="isMarketConsultation"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MARKET_CONSULTATION}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                        isRequired
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormCheckBox
                                                        name="isOrderFinanced"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_FINANCED}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                        isRequired
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormCheckBox
                                                        name="isParticipatedPreparation"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONTRACTOR_PARTICIPATED_PREPARATION}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                        isRequired
                                                    />
                                                </Grid>
                                                { formCurrentValues.isContractorParticipatedPreparation &&
                                                    <Grid item xs={12}>
                                                        <FormTextField
                                                            name="measuresAvoidanceDistortions"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MEASURES_AVOIDANCE_DISTORTIONS}
                                                            disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                            isRequired
                                                            inputProps={{ maxLength: 1000 }}
                                                        />
                                                    </Grid>
                                                }
                                                <Grid item xs={12}>
                                                    <FormCheckBox
                                                        name="isSecuringContract"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SECURING_CONTRACT}
                                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                        isRequired
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        <Grid item xs={12} >
                                            <FormTextField
                                                name="description"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_COMMENTS}
                                                multiline
                                                rows="2"
                                                inputProps={{ maxLength: 1000 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && formCurrentValues.estimationType.code === 'DO50') &&
                                            <>
                                                {/* Threshold DO50 */}
                                                <Grid item xs={12} >
                                                    <Divider />
                                                    <Toolbar className={classes.toolbar}>
                                                        <Assignment className={classes.subHeaderIcon} fontSize="small" />
                                                        <Typography variant="subtitle1" >{constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PROTOCOL}</Typography>
                                                    </Toolbar>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    {(formCurrentValues.applicationProtocol!== null && formCurrentValues.applicationProtocol.contractor !== null
                                                        && formCurrentValues.applicationProtocol.contractor.code)
                                                        ?
                                                            <FormDictionaryField
                                                                isRequired={true}
                                                                name="applicationProtocol.contractor"
                                                                dictionaryName={constants.ACCOUNTANT_SUBMENU_DICTIONARIES_CONTRACTORS}
                                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONTRACTOR_CONTRACT}
                                                                items={contractors}
                                                                disabled={initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                            />
                                                        :
                                                            <FormTextField
                                                                name="applicationProtocol.contractorDesc"
                                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONTRACTOR_CONTRACT}
                                                                isRequired
                                                                multiline
                                                                inputProps={{ maxLength: 1000 }}
                                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') }
                                                            />
                                                    }
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={1} direction="column"  alignItems="flex-start" className={classes.columnContainer}>
                                                        <FormControl required className={formErrors.applicationProtocol !== undefined && formErrors.applicationProtocol.email !== undefined ? classes.formControlError : classes.formControl}>
                                                            <FormLabel component="label">{constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT}</FormLabel>
                                                            <FormHelperText>{formErrors.applicationProtocol !== undefined && formErrors.applicationProtocol.email}</FormHelperText>
                                                            <FormCheckBox
                                                                name="applicationProtocol.email"
                                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_EMAIL}
                                                                labelPlacement="end"
                                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                                    (initialValues.status !== undefined && initialValues.status.code === 'ZP' && formCurrentValues.applicationProtocol === null)
                                                                        || (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.id === undefined)
                                                                                || formCurrentValues.applicationProtocol.renouncement
                                                                }
                                                            />
                                                            <FormCheckBox
                                                                name="applicationProtocol.phone"
                                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_PHONE}
                                                                labelPlacement="end"
                                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                                    (initialValues.status !== undefined && initialValues.status.code === 'ZP' && formCurrentValues.applicationProtocol === null)
                                                                        || (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.id === undefined)
                                                                            || formCurrentValues.applicationProtocol.renouncement
                                                                }
                                                            />
                                                            <FormCheckBox
                                                                name="applicationProtocol.internet"
                                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_INTERNET}
                                                                labelPlacement="end"
                                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                                    (initialValues.status !== undefined && initialValues.status.code === 'ZP' && formCurrentValues.applicationProtocol === null)
                                                                        || (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.id === undefined)
                                                                            || formCurrentValues.applicationProtocol.renouncement
                                                                }
                                                            />
                                                            <FormCheckBox
                                                                name="applicationProtocol.paper"
                                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_PAPER}
                                                                labelPlacement="end"
                                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                                    (initialValues.status !== undefined && initialValues.status.code === 'ZP' && formCurrentValues.applicationProtocol === null)
                                                                        || (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.id === undefined)
                                                                            || formCurrentValues.applicationProtocol.renouncement
                                                                }
                                                            />
                                                            <FormCheckBox
                                                                name="applicationProtocol.other"
                                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_OTHER}
                                                                labelPlacement="end"
                                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                                    (initialValues.status !== undefined && initialValues.status.code === 'ZP' && formCurrentValues.applicationProtocol === null)
                                                                        || (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.id === undefined)
                                                                            || (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.renouncement)
                                                                }
                                                            />
                                                            {(formCurrentValues.applicationProtocol!== null && formCurrentValues.applicationProtocol.other) &&
                                                                <FormTextField
                                                                    name="applicationProtocol.otherDesc"
                                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_OTHER_DESC}
                                                                    isRequired
                                                                    multiline
                                                                    inputProps={{ maxLength: 1000 }}
                                                                    disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') }
                                                                />
                                                            }
                                                            <FormCheckBox
                                                                name="applicationProtocol.renouncement"
                                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_RENOUNCEMENT}
                                                                labelPlacement="end"
                                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                                    (initialValues.status !== undefined && initialValues.status.code === 'ZP' && formCurrentValues.applicationProtocol === null)
                                                                        || (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.id === undefined)
                                                                            || formCurrentValues.applicationProtocol.other || formCurrentValues.applicationProtocol.paper || formCurrentValues.applicationProtocol.internet || formCurrentValues.applicationProtocol.phone ||
                                                                                formCurrentValues.applicationProtocol.email
                                                                }
                                                            />
                                                            {(formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.renouncement) &&
                                                                <FormTextField
                                                                    name="applicationProtocol.nonCompetitiveOffer"
                                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_NON_COMPETITIVE}
                                                                    isRequired
                                                                    multiline
                                                                    inputProps={{ maxLength: 1000 }}
                                                                    disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                                                />
                                                            }
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <Toolbar className={classes.toolbar}>
                                                    <FormControl error>
                                                        <Typography variant="subtitle1" ><Assignment className={classes.subHeaderIcon} fontSize="small" /> {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE}</Typography>
                                                        { formErrors.applicationProtocol !== undefined && formErrors.applicationProtocol.prices !== undefined &&
                                                            <FormHelperText>{formErrors.applicationProtocol.prices}</FormHelperText>
                                                        }
                                                    </FormControl>
                                                    </Toolbar>
                                                    <FormTableField
                                                        className={classes.tableWrapper}
                                                        name="applicationProtocol.prices"
                                                        head={tableHeadPrices}
                                                        allRows={action === "add" ? [] :
                                                            this.props.initialValues.applicationProtocol !== null ?
                                                                this.props.initialValues.applicationProtocol.prices : []
                                                        }
                                                        checkedRows={selectedPrice}
                                                        toolbar={true}
                                                        addButtonProps={{
                                                            disabled: (!pristine || (initialValues.status !== undefined && initialValues.status.code !== 'ZP')) ||
                                                                (initialValues.status !== undefined && initialValues.status.code === 'ZP' &&
                                                                    (formCurrentValues.applicationProtocol === null ||
                                                                        (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.id === undefined)))
                                                        }}
                                                        editButtonProps={{
                                                            label: constants.BUTTON_EDIT,
                                                            icon: <Edit/>,
                                                            variant: "edit",
                                                            disabled: (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                                selectedPrice.length > 0 ? false : true,
                                                        }}
                                                        deleteButtonProps={{
                                                            disabled : (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                                selectedPrice.length > 0 ? false : true,
                                                        }}
                                                        onAdd={(event) => this.handleOpenPriceDetails(event, "add")}
                                                        onEdit={(event) => this.handleOpenPriceDetails(event, 'edit')}
                                                        onDelete={(event) => this.handleDelete(event, 'deletePrice')}
                                                        multiChecked={false}
                                                        checkedColumnFirst={true}
                                                        onSelect={(event) => this.handleSelect(event, 'selectedPrice')}
                                                        onDoubleClick={(event) => this.handleDoubleClick(event, 'price')}
                                                        orderBy="id"
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormAmountField
                                                        name="applicationProtocol.pricesAmountNet"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICES_VALUE_NET}
                                                        disabled
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormAmountField
                                                        name="applicationProtocol.pricesAmountGross"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICES_VALUE_GROSS}
                                                        disabled
                                                    />
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <FormTextField
                                                        name="applicationProtocol.receivedOffers"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_RECEIVED_OFFERS}
                                                        multiline
                                                        isRequired
                                                        inputProps={{ maxLength: 4000 }}
                                                        disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                            (initialValues.status !== undefined && initialValues.status.code === 'ZP' && formCurrentValues.applicationProtocol === null)
                                                                || (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.id === undefined)
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <FormTextField
                                                        name="applicationProtocol.justificationChoosingOffer"
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_JUSTIFICATION_CHOOSING_OFFER}
                                                        multiline
                                                        isRequired
                                                        inputProps={{ maxLength: 4000 }}
                                                        disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                            (initialValues.status !== undefined && initialValues.status.code === 'ZP' && formCurrentValues.applicationProtocol === null)
                                                                || (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.id === undefined)
                                                        }
                                                    />
                                                </Grid>
                                            </>
                                        }

                                    </Grid>
                                </div>
                                <div ref={(ref) => this.action = ref}>
                                    <Divider />
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start"
                                        className={classes.actionContainer}
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
                                                    disabled={initialValues.status === undefined ||
                                                        (initialValues.status !== undefined && initialValues.status.code === 'ZP')
                                                    }
                                                    onClick={this.props.onPrint}
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
                                                {initialValues.status !== undefined && levelAccess !== undefined && ((initialValues.status.code === 'WY' && levelAccess === 'public') ||
                                                    (initialValues.status.code === 'AZ' && levelAccess === 'director') ||
                                                        (initialValues.status.code === 'AZ' && levelAccess === 'director' && initialValues.orderIncludedPlanType !== undefined && initialValues.orderIncludedPlanType.code === 'INW' && initialValues.coordinator !== undefined && initialValues.coordinator.code === 'lab') ||
                                                            ((initialValues.status.code === 'AD' && levelAccess === 'accountant') || (initialValues.status.code === 'AM' && levelAccess === 'director')) || (initialValues.status.code === 'AK' && levelAccess === 'director')
                                                ) &&
                                                    <Button
                                                        label={initialValues.status !== undefined && levelAccess !== undefined && (
                                                            initialValues.status.code === 'WY' && levelAccess === 'public' ? constants.BUTTON_ACCEPT :
                                                                initialValues.status.code === 'AZ' && levelAccess === 'director' && initialValues.orderIncludedPlanType.code === 'INW' && initialValues.coordinator.code === 'dam' ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_MEDICAL :
                                                                    initialValues.status.code === 'AZ' && levelAccess === 'director' ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_DIRECTOR :
                                                                        initialValues.status.code === 'AM' && levelAccess === 'director' ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_DIRECTOR :
                                                                            initialValues.status.code === 'AD' && levelAccess === 'accountant' ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_ACCOUNTANT :
                                                                               constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_CHIEF
                                                        )}
                                                        icon=<Done/>
                                                        iconAlign="left"
                                                        variant="submit"
                                                        onClick={initialValues.status !== undefined && levelAccess !== undefined && (
                                                            initialValues.status.code === 'WY' && levelAccess === 'public' ? (event) => this.handleApplicationAction(event, "approve") :
                                                                initialValues.status.code === 'AZ' && levelAccess === 'director' && initialValues.orderIncludedPlanType.code === 'INW' && initialValues.coordinator.code === 'dam' ? (event) => this.handleApplicationAction(event, "approveMedical") :
                                                                    initialValues.status.code === 'AZ' && levelAccess === 'director' ? (event) => this.handleApplicationAction(event, "approveDirector") :
                                                                        initialValues.status.code === 'AM' && levelAccess === 'director'  ? (event) => this.handleApplicationAction(event, "approveDirector") :
                                                                            initialValues.status.code === 'AD' && levelAccess === 'accountant' ? (event) => this.handleApplicationAction(event, "approveAccountant") :
                                                                                (event) => this.handleApplicationAction(event, "approveChief")
                                                        )}
                                                    />
                                                }
                                                {(initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code === 'ZP')) &&
                                                    <>
                                                        <Button
                                                            label={constants.BUTTON_SAVE}
                                                            icon={<Save/>}
                                                            iconAlign="left"
                                                            variant='submit'
                                                            type='button'
                                                            disabled={(initialValues.status !== undefined && initialValues.status.code !== 'ZP') || pristine || !allowSaveOnAdd ||
                                                                (formCurrentValues.applicationProtocol !== null && formCurrentValues.applicationProtocol.contractor !== null && formCurrentValues.applicationProtocol.contractor.code === 'err')
                                                            }
                                                            onClick={this.handleSave}
                                                        />
                                                        <Button
                                                            label={constants.BUTTON_SEND}
                                                            icon={<Send/>}
                                                            iconAlign="left"
                                                            variant='submit'
                                                            disabled={initialValues.status === undefined || ((initialValues.status !== undefined && initialValues.status.code !== 'ZP') || (!pristine || submitting || !allowToSend ||  invalid || submitSucceeded)) }
                                                            onClick={(event) => this.handleApplicationAction(event, "send")}

                                                        />
                                                    </>
                                                }
                                                {(initialValues.status !== undefined && formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType.code === 'DO130') &&
                                                    <Button
                                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_BUTTON_PROTOCOL}
                                                        icon=<Assignment/>
                                                        iconAlign="left"
                                                        variant="cancel"
                                                        onClick={this.handleShowProtocol}
                                                    />
                                                }
                                                {initialValues.status !== undefined && levelAccess !== undefined && ((initialValues.status.code === 'WY' && levelAccess === 'public') ||
                                                    (initialValues.status.code === 'AZ' && levelAccess === 'director') ||
                                                        (initialValues.status.code === 'AZ' && levelAccess === 'director' && initialValues.orderIncludedPlanType !== undefined && initialValues.orderIncludedPlanType.code === 'INW' && initialValues.coordinator !== undefined && initialValues.coordinator.code === 'dam') ||
                                                            ((initialValues.status.code === 'AD' && levelAccess === 'accountant') || (initialValues.status.code === 'AM' && levelAccess === 'director')) || (initialValues.status.code === 'AK' && levelAccess === 'director')
                                                ) &&
                                                    <Button
                                                        label={constants.BUTTON_RETURN_COORDINATOR}
                                                        icon=<Redo/>
                                                        iconAlign="left"
                                                        variant="delete"
                                                        onClick={(event) => this.handleApplicationAction(event, "sendBack")}
                                                    />
                                                }
                                                {(levelAccess === 'public' && initialValues.status !== undefined && ['ZA', 'RE'].includes(initialValues.status.code)) &&
                                                    <SplitButton
                                                        options={splitOptions}
                                                        variant="cancel"
                                                        icon=<Print/>
                                                    />
                                                }
                                                {(levelAccess === 'director' && initialValues.status !== undefined &&
                                                    initialValues.status.code === 'ZR' && formCurrentValues.estimationType.code === 'DO50') &&
                                                        <Button
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_BUTTON_ROLLBACK_REALIZATION}
                                                            icon=<Redo/>
                                                            iconAlign="left"
                                                            variant="delete"
                                                            onClick={(event) => this.handleApplicationAction(event, "withdraw")}
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
                            </div>
                        </form>
                    }
                </>
            );
        };
    };
};

ApplicationForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationForm);