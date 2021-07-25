import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import {Spinner, ModalDialog } from 'common/';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar } from '@material-ui/core/';
import { Save, Cancel, Edit, Assignment, LibraryBooks, Print, Send } from '@material-ui/icons/';
import { Button, InputField } from 'common/gui';
import { FormTextField, FormAmountField, FormDateField, FormSelectField, FormTableField, FormCheckBox } from 'common/form';
import ApplicationPartFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationPartFormContainer';
import ApplicationCriterionFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationCriterionFormContainer';
import ApplicationAssortmentGroupsFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationAssortmentGroupsFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18)}px)`,
        overflow: 'auto',
        maxWidth: '100%',
        paddingTop: theme.spacing(1),
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
    },
    container: {
        width: '100%',
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
    },
});

class ApplicationForm extends Component {
    state = {
        selectedGroup: [],
        selectedPart: [],
        selectedCriterion: [],
        deleteActionName:null,
        isDelete: false,
        send: false,
        assortmentGroups:[],
        parts:[],
        criteria:[],
        openPartDetails: false,
        openCriterionDetails: false,
        openGroupsDetails: false,
        groupAction: null,
        partAction: null,
        criterionAction: null,
        estimationTypes: this.props.estimationTypes,
        tableHeadGroups: [
            {
                id: 'applicationProcurementPlanPosition.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP,
                type: 'object',
            },
            {
                id: 'applicationProcurementPlanPosition.estimationType.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE,
                type: 'object',
            },
            {
                id: 'applicationProcurementPlanPosition.amountRequestedNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUP_VALUE,
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
                this.props.onDeleteAssortmentGroup(this.state.selectedGroup[0])
            break;
            case 'deletePart':
                this.props.onDeletePart(this.state.selectedPart[0])
            break;
            case 'deleteCriterion':
                this.props.onDeleteCriterion(this.state.selectedCriterion[0])
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

    handleOpenGroupDetails = (event, action) =>{
        this.setState({openGroupsDetails: !this.state.openGroupsDetails, groupAction: action})
    }

    handleCloseGroupDetails = () => {
        this.setState({openGroupsDetails: !this.state.openGroupsDetails, selectedGroup: [], groupAction: null});
    };

    handleSubmitGroups = (value) =>{
        this.props.onSaveAssortmentGroup(value, this.state.groupAction, this.handleCloseGroupDetails);
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
            // no default
        }
    }

    filterEstimationTypes = () => {
        let estimationTypes = this.props.estimationTypes;
        const orderValueNet = this.props.formCurrentValues.orderValueNet;
        switch(true){
            case (this.props.initialValues.parts.length > 0):
                estimationTypes = estimationTypes.filter((i) => !['DO50', 'D0130', 'WR', 'COVID'].includes(i.code));
            break;
            case (orderValueNet > 50000 && orderValueNet <= 130000):
                estimationTypes = estimationTypes.filter((i) => !['DO50', 'PO130', 'UE139'].includes(i.code));
            break;
            case (orderValueNet > 130000):
                estimationTypes = estimationTypes.filter((i) => !['DO50', 'D0130'].includes(i.code));
            break;
            // no default
        }

        this.setState({
            estimationTypes: estimationTypes
        });

    }

    handleSend = () => {
        this.setState({ send: true });
    }

    handleCancelSend = () => {
        this.setState({ send: false });
    }

    handleConfirmSend = () => {
        this.props.onSend();
        this.setState({
            send: false,
        })
    }

    componentDidUpdate(prevProps){
        if(this.props.formCurrentValues !== prevProps.formCurrentValues && this.props.formCurrentValues.orderValueNet !== undefined && this.props.formCurrentValues.orderValueNet !== prevProps.formCurrentValues.orderValueNet){
            this.filterEstimationTypes();
        }
        if(this.props.initialValues !== prevProps.initialValues && this.props.initialValues.parts !== undefined && this.props.initialValues.parts.length > 0){
            this.filterEstimationTypes();
        } else if (this.props.initialValues !== prevProps.initialValues && this.props.initialValues.parts !== undefined && this.props.initialValues.parts.length === 0){
            this.filterEstimationTypes();
        }

        if(this.props.initialValues !== prevProps.initialValues){
            const arrayFields = ['assortmentGroups', 'parts', 'criteria']
            arrayFields.forEach(arrayField => {
                if(this.props.initialValues[arrayField] !== prevProps.initialValues[arrayField]){
                    this.setState({
                        arrayField: this.props.initialValues[arrayField]
                    });
                }
            })
        }

        if(prevProps.formCurrentValues !== undefined && prevProps.formCurrentValues.orderValueNet !== undefined && prevProps.formCurrentValues.orderValueNet !== this.props.formCurrentValues.orderValueNet &&
            this.props.formCurrentValues.assortmentGroups !== undefined && this.props.formCurrentValues.assortmentGroups.length > 1){
            this.filterEstimationTypes();
            this.props.dispatch(change('ApplicationForm', "estimationType", ''))
        }

        if(prevProps.formCurrentValues !== undefined && prevProps.formCurrentValues.isCombined === true && this.props.formCurrentValues.isCombined === false){
            this.props.dispatch(change('ApplicationForm', "coordinatorCombined", ''))
        }
    }

    render(){
        const { classes, isLoading, handleSubmit, pristine, submitting, invalid, submitSucceeded, action, modes, initialValues, planPositions, formCurrentValues, vats, coordinators } = this.props;
        const { tableHeadParts, tableHeadCriteria, tableHeadGroups, selectedGroup, selectedPart, selectedCriterion, openPartDetails, openCriterionDetails, openGroupsDetails, groupAction, partAction, criterionAction, isDelete, estimationTypes, send } = this.state;
        if (formCurrentValues === undefined) {
            return(
                null
            )
        } else {
            return(
                <>
                    {(submitting || isLoading) && <Spinner /> }
                    {isDelete && this.renderDialog()}
                    {send &&
                        <ModalDialog
                            message={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_SEND_MESSAGE}
                            variant="confirm"
                            onConfirm={this.handleConfirmSend}
                            onClose={this.handleCancelSend}
                        />
                    }
                    {openGroupsDetails &&
                        <ApplicationAssortmentGroupsFormContainer
                            isLoading={isLoading}
                            open={openGroupsDetails}
                            initialValues={groupAction === 'add' ? {} : selectedGroup[0]}
                            action={groupAction}
                            planPositions={planPositions.filter((position) => !this.state.assortmentGroups.includes(position))}
                            vats={vats}
                            assortmentGroups={this.props.initialValues.assortmentGroups}
                            applicationStatus={initialValues.status}
                            onClose={this.handleCloseGroupDetails}
                            onSubmit={this.handleSubmitGroups}
                        />
                    }
                    {openPartDetails &&
                        <ApplicationPartFormContainer
                            isLoading={isLoading}
                            open={openPartDetails}
                            initialValues={partAction === 'add' ? {} : selectedPart[0]}
                            action={partAction}
                            vats={vats}
                            groupVat={formCurrentValues.assortmentGroups.length === 1 ? formCurrentValues.assortmentGroups[0].vat : undefined}
                            orderValueNet={formCurrentValues.orderValueNet}
                            parts={this.props.initialValues.parts}
                            applicationStatus={initialValues.status}
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
                    <form onSubmit={handleSubmit}>
                        <div className={classes.content}>
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
                                        value={initialValues.mode !== undefined ? initialValues.mode.name : ""}
                                        options={modes}
                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormDateField
                                        name="createDate"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CREATE_DATE}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormDateField
                                        name="sendDate"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SEND_DATE}
                                        disabled
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
                                {(formCurrentValues.mode !== undefined && formCurrentValues.mode.code === 'UP') &&
                                    <Grid item xs={12} >
                                        <FormTextField
                                            name="reasonNotIncluded"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_REASON_NOT_INCLUDED}
                                            multiline
                                            isRequired={true}
                                            inputProps={{ maxLength: 256 }}
                                            disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="orderedObject"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT}
                                        isRequired={true}
                                        inputProps={{ maxLength: 256 }}
                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
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
                                    <Grid item xs={10} >
                                        <FormSelectField
                                            name="coordinatorCombined"
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_COORDINATOR_COMBINED}
                                            options={coordinators}
                                            isRequired={initialValues.status !== undefined ? true : null }
                                            disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12} >
                                    <Toolbar className={classes.toolbar}>
                                        <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >{constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUPS}</Typography>
                                    </Toolbar>
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="assortmentGroups"
                                        head={tableHeadGroups}
                                        allRows={action === "add" ? [] : this.props.initialValues.assortmentGroups}
                                        checkedRows={selectedGroup}
                                        toolbar={true}
                                        addButtonProps={{
                                            disabled : (initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code !== 'ZP')) && true,
                                        }}
                                        editButtonProps={{
                                            label: constants.BUTTON_EDIT,
                                            icon: <Edit/>,
                                            variant: "edit",
                                            disabled: (initialValues.status !== undefined && initialValues.status.code !== 'ZP') && true
                                        }}
                                        deleteButtonProps={{
                                            disabled : (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true
                                                : selectedGroup.length > 0 ? false : true,
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
                                <Grid item xs={9}>
                                    <FormSelectField
                                        name="estimationType"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDERING_MODE}
                                        options={estimationTypes}
                                        disabled={ (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                            this.props.initialValues.assortmentGroups !== undefined && this.props.initialValues.assortmentGroups.length < 2 ? true : false}
                                        isRequired={initialValues.status !== undefined ? true : null }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="orderValueNet"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormAmountField
                                        name="orderValueGross"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_GROSS}
                                        disabled
                                    />
                                </Grid>
                                {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                    <>
                                        {/* Above 130 / UE */}
                                        <Grid item xs={12}>
                                            <FormCheckBox
                                                name="isParts"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PARTS}
                                                disabled={(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                                    this.props.initialValues.parts.length > 0 ? true : false}
                                            />
                                        </Grid>
                                    </>
                                }
                                {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code) && formCurrentValues !== undefined && !formCurrentValues.isParts) &&
                                    <>
                                        {/* Above 130 / UE  and no order parts*/}
                                        <Grid item xs={12}>
                                            <FormTextField
                                                name="orderReasonLackParts"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_REASON_LACK_PARTS}
                                                multiline
                                                isRequired={true}
                                                inputProps={{ maxLength: 256 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                    </>
                                }
                                {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code) && formCurrentValues !== undefined && formCurrentValues.isParts) &&
                                    <>
                                        {/* Above 130 / UE  and order parts*/}
                                        <Grid item xs={12} sm={12} >
                                            <FormTableField
                                                className={classes.tableWrapper}
                                                name="parts"
                                                head={tableHeadParts}
                                                allRows={action === "add" ? [] : this.props.initialValues.parts}
                                                checkedRows={selectedPart}
                                                toolbar={true}
                                                addButtonProps={{
                                                    disabled:  (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
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
                                                orderBy="id"
                                            />
                                        </Grid>
                                    </>
                                }
                                {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                    <>
                                        {/* Above 130 / UE */}
                                        <Grid item xs={12} >
                                            <FormTextField
                                                name="cpv"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CPV}
                                                multiline
                                                isRequired={true}
                                                inputProps={{ maxLength: 256 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                    </>
                                }
                                {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                    <>
                                        {/* Above 130 / UE */}
                                        <Grid item xs={7}>
                                            <FormTextField
                                                name="orderValueBased"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_BASED}
                                                isRequired={true}
                                                inputProps={{ maxLength: 256 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        {/* Above 130 / UE */}
                                        <Grid item xs={3}>
                                            <FormTextField
                                                name="orderValueSettingPerson"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_SETTING_VALUE_PERSON}
                                                isRequired={true}
                                                inputProps={{ maxLength: 100 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        {/* Above 130 / UE */}
                                        <Grid item xs={2}>
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
                                        inputProps={{ maxLength: 550 }}
                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="orderDescription"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_DESCRIPTION}
                                        multiline
                                        isRequired={initialValues.status !== undefined ? true : null }
                                        inputProps={{ maxLength: 550 }}
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
                                                inputProps={{ maxLength: 100 }}
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
                                                inputProps={{ maxLength: 256 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        {/* Above 130 / UE */}
                                        <Grid item xs={12}>
                                            <FormTextField
                                                name="proposedOrderingProcedure"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PROPOSED_ORDERING_PROCEDURE}
                                                multiline
                                                isRequired={true}
                                                inputProps={{ maxLength: 256 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        {/* Above 130 / UE */}
                                        <Grid item xs={12}>
                                            <FormTextField
                                                name="personsPreparingJustification"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_JUSTIFICATION}
                                                isRequired={true}
                                                inputProps={{ maxLength: 100 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="orderContractorName"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CONTRACTOR_NAME}
                                        isRequired={initialValues.status !== undefined ? true : null }
                                        inputProps={{ maxLength: 256 }}
                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                    />
                                </Grid>
                                {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                    <>
                                        {/* Above 130 / UE */}
                                        <Grid item xs={12}>
                                            <FormTextField
                                                name="personsChoosingContractor"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_CHOOSING_CONTRACTOR}
                                                isRequired={true}
                                                inputProps={{ maxLength: 100 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="orderContractorConditions"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CONTRACTOR_CONDITIONS}
                                        multiline
                                        isRequired={initialValues.status !== undefined ? true : null }
                                        inputProps={{ maxLength: 256 }}
                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                    />
                                </Grid>
                                {(formCurrentValues.estimationType !== undefined && formCurrentValues.estimationType !== null && ['PO130','UE139'].includes(formCurrentValues.estimationType.code)) &&
                                    <>
                                        {/* Above 130 / UE */}
                                        <Grid item xs={12}>
                                            <FormTextField
                                                name="personsPreparingConditions"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_CONDITIONS}
                                                isRequired={true}
                                                inputProps={{ maxLength: 100 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="orderImportantRecords"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_IMPORTANT_RECORDS}
                                        multiline
                                        isRequired={initialValues.status !== undefined ? true : null}
                                        inputProps={{ maxLength: 256 }}
                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <Toolbar className={classes.toolbar}>
                                        <Assignment className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >{constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERIA_EVALUATION_OFFERS}</Typography>
                                    </Toolbar>
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="criteria"
                                        head={tableHeadCriteria}
                                        allRows={action === "add" ? [] : this.props.initialValues.criteria}
                                        checkedRows={selectedCriterion}
                                        toolbar={true}
                                        addButtonProps={{
                                            disabled: initialValues.status === undefined || (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
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
                                        {/* Powyżej 130 / UE */}
                                        <Grid item xs={12}>
                                            <FormTextField
                                                name="personsPreparingCriteria"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_CRITERIA}
                                                isRequired={true}
                                                inputProps={{ maxLength: 100 }}
                                                disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                            />
                                        </Grid>
                                        {/* Powyżej 130 / UE */}
                                        <Grid item xs={12}>
                                            <FormTextField
                                                name="tenderCommittee"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TENDER_COMMITTEE}
                                                isRequired={true}
                                                inputProps={{ maxLength: 256 }}
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
                                        inputProps={{ maxLength: 256 }}
                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="description"
                                        label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_COMMENTS}
                                        multiline
                                        rows="2"
                                        inputProps={{ maxLength: 256 }}
                                        disabled = {initialValues.status !== undefined && initialValues.status.code !== 'ZP'}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
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
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon={<Save/>}
                                        iconAlign="left"
                                        type='submit'
                                        variant='submit'
                                        disabled={(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||( pristine || (initialValues.status === undefined && invalid))}
                                    />
                                    <Button
                                        label={constants.BUTTON_SEND}
                                        icon={<Send/>}
                                        iconAlign="left"
                                        variant='submit'
                                        disabled={initialValues.status === undefined || ((initialValues.status !== undefined && initialValues.status.code !== 'ZP') || (!pristine || submitting || invalid || submitSucceeded)) }
                                        onClick={this.handleSend}
                                    />
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
                    </form>
                </>
            );
        };
    };
};

ApplicationForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationForm);