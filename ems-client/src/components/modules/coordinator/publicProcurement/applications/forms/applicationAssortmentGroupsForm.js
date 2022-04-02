import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Toolbar } from '@material-ui/core/';
import { Button, InputField } from 'common/gui';
import { Save, Cancel, Close, Description, Edit, LibraryBooks } from '@material-ui/icons/';
import { FormAmountField, FormDictionaryField, FormSelectField, FormTableField, FormDigitsField, FormCheckBox } from 'common/form';
import ApplicationPlanPositionFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationPlanPositionFormContainer';

const styles = theme => ({
    dialogTitle: {
        paddingBottom: theme.spacing(1),
    },
    dialog: {
        height: `calc(100vh - ${theme.spacing(32)}px)`,
        maxHeight: `calc(100vh - ${theme.spacing(25)}px)`,
        width: '100%',
        paddingTop: 0,
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingBottom:0,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    container: {
        width: '100%',
        padding: 0,
    },
    toolbar: {
        minHeight: theme.spacing(4),
    },
    toolbarTable: {
        minHeight: theme.spacing(0.5),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    tableWrapper: {
        overflow: 'auto',
        height: theme.spacing(30),
    },
});

class ApplicationAssortmentGroupsForm extends Component {

    state ={
        selected:[],
        tableHeadYears: [
            {
                id: 'year',
                label: constants.ACCOUNTANT_COST_TYPE_YEARS_VALIDITY_YEAR,
                type: 'date',
                dateFormat: 'yyyy',
            },
            {
                id: 'yearExpenditureNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_EXPENDITURE_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'yearExpenditureGross',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_EXPENDITURE_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        tableHeadPositionsFin:[
            {
                id: 'coordinatorPlanPosition.name',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_FINANCIAL_PLAN_POSITION,
                type: 'object',
            },
            {
                id: 'positionAmountNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_POSITION_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'positionAmountGross',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_POSITION_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        tableHeadPositionsInw:[
            {
                id: 'coordinatorPlanPosition.name',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_INVESTMENT_PLAN_POSITION,
                type: 'object',
            },
            {
                id: 'positionAmountNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_POSITION_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'positionAmountGross',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_POSITION_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        positionAction: '',
        openApplicationPositionDetails: false,
        isDelete: false,
        applicationAssortmentGroupPlanPositions:[],
    }

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    handleSelect = (row) => {
        this.setState({selected: row});
    }

    handleOpenApplicationPositionDetails = (event, action) => {
        this.setState({openApplicationPositionDetails: !this.state.openApplicationPositionDetails, positionAction: action});
    };

    handleDelete = (event, action) => {
        this.setState({ positionAction: action })
    }

    handleConfirmDelete = () => {
        this.props.onDeleteApplicationPlanPosition(this.state.selected[0]);
        this.setState({
            positionAction: '',
            selected: [],
        })
    }

    handleCancelDelete = () => {
        this.setState({
            positionAction: '',
            selected: [],
        })
    }

    handleClosePlanPositionDetails = () => {
        this.setState({openApplicationPositionDetails: !this.state.openApplicationPositionDetails, selected: [], positionAction: ''});
    };

    handleSubmitApplicationPlanPosition = (values) =>{
        this.props.onSaveApplicationPlanPosition(values, this.state.positionAction, this.props.initialValues.id)
        this.handleClosePlanPositionDetails();
    }

    handleSubmitPlanPositionYear = (values, action) =>{
        this.props.onSaveSubsequentYear(values, action, this.state.selected[0].id)
    }

    handleDeletePlanPositionYear = (values) => {
        this.props.onDeleteSubsequentYear(values, this.state.selected[0].id);
    }

    handleDoubleClick = (row) =>{
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let openApplicationPositionDetails = {...prevState.openApplicationPositionDetails};
            let positionAction = {...prevState.positionAction};
            selected[0] = row;
            openApplicationPositionDetails =  !this.state.openApplicationPositionDetails;
            positionAction = 'edit';
            return {selected, openApplicationPositionDetails, positionAction}
        });
    }

    componentDidUpdate(prevProps){
        const {orderGroupValueNet, orderGroupValueGross, vat, optionValue, isOption, amountContractAwardedNet } = this.props;

        if((vat !== prevProps.vat && vat !== undefined && orderGroupValueNet !== undefined ) || (orderGroupValueNet !== undefined && orderGroupValueNet !== prevProps.orderGroupValueNet && vat !== undefined) ){
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'orderGroupValueGross', parseFloat((Math.round((orderGroupValueNet * vat.code) * 100) / 100).toFixed(2))));
        }
        //Update on change assortment group plan position
        if(this.props.initialValues !== undefined && this.props.initialValues !== prevProps.initialValues){
            this.setState({ applicationAssortmentGroupPlanPositions: this.props.initialValues.applicationAssortmentGroupPlanPositions});
        }
        //Update on option value change
        if((optionValue !== undefined && prevProps.optionValue !== undefined && optionValue !== prevProps.optionValue)
            || (optionValue !== undefined && orderGroupValueNet !== prevProps.orderGroupValueNet && prevProps.orderGroupValueNet !== undefined)
        ){
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'amountOptionNet', parseFloat((Math.round(((optionValue / 100) * orderGroupValueNet) * 100) / 100).toFixed(2))));
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'amountOptionGross', parseFloat((Math.round((((optionValue / 100) * orderGroupValueNet) * vat.code) * 100) / 100).toFixed(2))));
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'amountSumNet', parseFloat((Math.round((((optionValue / 100) * orderGroupValueNet) + orderGroupValueNet) * 100) / 100).toFixed(2))));
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'amountSumGross', parseFloat((Math.round(((((optionValue / 100) * orderGroupValueNet) * vat.code) + orderGroupValueGross) * 100) / 100).toFixed(2))));
        }
        // Clear option amount value if not option
        if(!isOption && prevProps.isOption !== undefined && isOption !== prevProps.isOption){
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'amountOptionNet', null));
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'amountOptionGross', null));
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'amountSumNet', orderGroupValueNet));
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'amountSumGross', orderGroupValueGross));
        }
        if(amountContractAwardedNet !== undefined && prevProps.amountContractAwardedNet !== undefined && amountContractAwardedNet !== prevProps.amountContractAwardedNet){
            this.props.dispatch(change('ApplicationAssortmentGroupsForm', 'amountContractAwardedGross', parseFloat((Math.round((amountContractAwardedNet * vat.code) * 100) / 100).toFixed(2))));
        }

        if(this.state.selected.length > 0 && this.props.initialValues.applicationAssortmentGroupPlanPositions !== undefined){
            console.log(this.state.selected)
            const idx = this.props.initialValues.applicationAssortmentGroupPlanPositions.findIndex(planPosition => planPosition.id === this.state.selected[0].id)
            if(this.state.selected[0] !== this.props.initialValues.applicationAssortmentGroupPlanPositions[idx]){
                this.setState(prevState =>{
                    const selected = [...prevState.selected];
                    selected[0] = this.props.initialValues.applicationAssortmentGroupPlanPositions[idx];
                    return{selected}
                })
            }
        }
    }

    componentDidMount(){
        this.setState({ applicationAssortmentGroupPlanPositions: this.props.action === 'add' ? [] :this.props.initialValues.applicationAssortmentGroupPlanPositions });
    }

    render(){
        const { classes, isLoading, open, handleSubmit, pristine, submitting, invalid, submitSucceeded, initialValues, publicProcurementPlanPositions, planPositions, vats, orderGroupValueNet, applicationProcurementPlanPosition,
            applicationStatus, orderIncludedPlanType, action, isOption, levelAccess, isParts } = this.props;
        const { tableHeadYears, positionAction, tableHeadPositionsFin, tableHeadPositionsInw, openApplicationPositionDetails, selected, applicationAssortmentGroupPlanPositions } = this.state;
        return(
            <>
                { positionAction === 'delete' &&
                    <ModalDialog
                        message={constants.COORDINATOR_PLAN_POSITIONS_CONFIRM_DELETE_POSITION_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDelete}
                    />
                }
                {openApplicationPositionDetails &&
                    <ApplicationPlanPositionFormContainer
                        isLoading={isLoading}
                        open={openApplicationPositionDetails}
                        initialValues={positionAction === 'add' ? {vat: this.props.vat, subsequentYears: []} : selected[0]}
                        action={positionAction}
                        applicationStatus={applicationStatus}
                        orderIncludedPlanType={orderIncludedPlanType}
                        vats={vats}
                        orderValueYearNet={this.props.orderValueYearNet}
                        planPositions={planPositions}
                        onSaveSubsequentYear={this.handleSubmitPlanPositionYear}
                        onDeleteSubsequentYear={this.handleDeletePlanPositionYear}
                        onClose={this.handleClosePlanPositionDetails}
                        onSubmit={this.handleSubmitApplicationPlanPosition}
                    />
                }
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="xl"
                    disableBackdropClick={true}
                >
                    { submitting && <Spinner /> }
                    <form onSubmit={handleSubmit}>
                        <DialogTitle disableTypography={true} className={classes.dialogTitle}>
                            <Grid
                                container
                                direction="row"
                                spacing={0}
                                className={classes.container}
                            >
                                <Grid item xs={12} >
                                    <Typography variant='h6'>
                                        {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP}
                                    </Typography>
                                    <IconButton aria-label="Close"
                                        className={classes.closeButton}
                                        onClick={this.handleClose}
                                    >
                                        <Close fontSize='small'/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                            </Grid>
                        </DialogTitle>
                        <DialogContent className={classes.dialog}>
                            <div className={classes.section}>
                                <Toolbar className={classes.toolbar}>
                                    <Description className={classes.subHeaderIcon} fontSize="small" />
                                    <Typography variant="subtitle1" >
                                        {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_GROUP_INFO}
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={12}>
                                        <FormDictionaryField
                                            isRequired={true}
                                            name="applicationProcurementPlanPosition"
                                            dictionaryName={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                            items={publicProcurementPlanPositions}
                                            disabled={applicationStatus !== undefined && applicationStatus.code !== 'ZP'}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InputField
                                            name="estimationType"
                                            label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE}
                                            value={applicationProcurementPlanPosition !== undefined  ?
                                                applicationProcurementPlanPosition.estimationType !== undefined ?
                                                    applicationProcurementPlanPosition.estimationType.name : '' : ''}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormAmountField
                                            name="applicationProcurementPlanPosition.amountArt30Net"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_REALIZED_NET_ART30}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormAmountField
                                            name="applicationProcurementPlanPosition.amountArt30Gross"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_REALIZED_GROSS_ART30}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <InputField
                                            name="applicationProcurementPlanPosition.percentArt30"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_REALIZED_ART30}
                                            disabled
                                            value={applicationProcurementPlanPosition !== undefined  ?
                                                applicationProcurementPlanPosition.percentArt30 : ''
                                            }
                                            postfix='%'
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormAmountField
                                            name="applicationProcurementPlanPosition.amountRequestedNet"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_VALUE_NET}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormAmountField
                                            name="applicationProcurementPlanPosition.amountInferredNet"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_INFERRED_VALUE_NET}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormAmountField
                                            name="applicationProcurementPlanPosition.amountRealizedNet"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_REALIZED_VALUE_NET}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.section}>
                                <Divider />
                                <Toolbar className={classes.toolbar}>
                                    <Description className={classes.subHeaderIcon} fontSize="small" />
                                    <Typography variant="subtitle1" >
                                        {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_INFO}
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            name="orderGroupValueNet"
                                            label={applicationProcurementPlanPosition !== undefined && applicationProcurementPlanPosition.estimationType !== undefined && applicationProcurementPlanPosition.estimationType.code === 'DO50' ?
                                                constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_NET_50 :
                                                    constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_NET_OTHER
                                            }
                                            isRequired={true}
                                            disabled={applicationStatus !== undefined && applicationStatus.code !== 'ZP' ? true :
                                                applicationProcurementPlanPosition === undefined ? true : false }
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormSelectField
                                            name="vat"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VAT}
                                            options={vats}
                                            isRequired={true}
                                            disabled={applicationStatus !== undefined && applicationStatus.code !== 'ZP' ? true :
                                                applicationProcurementPlanPosition === undefined ? true : false}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            name="orderGroupValueGross"
                                            label={applicationProcurementPlanPosition !== undefined && applicationProcurementPlanPosition.estimationType !== undefined && applicationProcurementPlanPosition.estimationType.code === 'DO50' ?
                                                constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_GROSS_50 :
                                                    constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_GROSS_OTHER
                                            }
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.section}>
                                <Divider />
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={12} >
                                        <Toolbar className={classes.toolbarTable}>
                                            <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                            <Typography variant="subtitle1" >
                                                {orderIncludedPlanType === 'FIN' ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_PLAN_TYPE_FIN
                                                    : constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_PLAN_TYPE_INW
                                                }
                                         </Typography>
                                        </Toolbar>
                                        <FormTableField
                                            className={classes.tableWrapper}
                                            name="applicationAssortmentGroupPlanPositions"
                                            head={orderIncludedPlanType === 'FIN' ? tableHeadPositionsFin : tableHeadPositionsInw}
                                            allRows={applicationAssortmentGroupPlanPositions!== undefined ? applicationAssortmentGroupPlanPositions : [] }
                                            checkedRows={selected}
                                            toolbar={true}
                                            addButtonProps={{
                                                disabled: ((applicationStatus !== undefined && applicationStatus.code !== 'ZP') || (!submitSucceeded && action === 'add')) && true,
                                            }}
                                            editButtonProps={{
                                                label: constants.BUTTON_EDIT,
                                                icon: <Edit/>,
                                                variant: "edit",
                                                disabled: ((applicationStatus !== undefined && applicationStatus.code !== 'ZP') && selected.length === 0 ) && true
                                            }}
                                            deleteButtonProps={{
                                                disabled : (applicationStatus !== undefined && applicationStatus.code !== 'ZP') ? true
                                                    : selected.length > 0 ? false : true,
                                            }}
                                            onAdd={(event) => this.handleOpenApplicationPositionDetails(event, 'add')}
                                            onEdit={(event) => this.handleOpenApplicationPositionDetails(event, 'edit')}
                                            onDelete={(event) => this.handleDelete(event, 'delete')}
                                            multiChecked={false}
                                            checkedColumnFirst={true}
                                            onSelect={this.handleSelect}
                                            onDoubleClick={this.handleDoubleClick}
                                            orderBy="id"
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.section}>
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={6}>
                                        <FormAmountField
                                            name="orderValueYearNet"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_YEAR_NET}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormAmountField
                                            name="orderValueYearGross"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_YEAR_GROSS}
                                            disabled
                                        />
                                    </Grid>
                                    {(applicationProcurementPlanPosition !== undefined && applicationProcurementPlanPosition.estimationType !== undefined && ['PO130', 'UE139'].includes(applicationProcurementPlanPosition.estimationType.code)) &&
                                        <>
                                            <Grid item xs={12} >
                                                <FormCheckBox
                                                    name="isOption"
                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_OPTION}
                                                    disabled = {(applicationStatus !== undefined && applicationStatus.code !== 'ZP') || (applicationStatus !== undefined && applicationStatus.code === 'ZP' && orderGroupValueNet === undefined) || isParts}
                                                />
                                            </Grid>
                                            { isOption &&
                                                <>
                                                    <Grid item xs={2}>
                                                        <FormDigitsField
                                                            isRequired={true}
                                                            name="optionValue"
                                                            inputProps={{
                                                                maxLength: 3,
                                                            }}
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_CRITERIA_VALUE}
                                                            disabled = {applicationStatus.code !== 'ZP' || isParts}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <FormAmountField
                                                            name="amountOptionNet"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_OPTION_NET}
                                                            disabled
                                                        />
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <FormAmountField
                                                            name="amountOptionGross"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_OPTION_GROSS}
                                                            disabled
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormAmountField
                                                            name="amountSumNet"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_SUM_NET}
                                                            disabled
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormAmountField
                                                            name="amountSumGross"
                                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_SUM_GROSS}
                                                            disabled
                                                        />
                                                    </Grid>
                                                </>
                                            }
                                        </>
                                    }
                                    <Grid item xs={12} >
                                        <Toolbar className={classes.toolbarTable}>
                                            <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                            <Typography variant="subtitle1" >{constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_NEXT_YEARS}</Typography>
                                        </Toolbar>
                                        <FormTableField
                                            className={classes.tableWrapper}
                                            name="groupSubsequentYears"
                                            head={tableHeadYears}
                                            allRows={initialValues.subsequentYears !== undefined ? initialValues.subsequentYears : []}
                                            checkedRows={[]}
                                            toolbar={false}
                                            addButtonProps={{}}
                                            editButtonProps={{}}
                                            deleteButtonProps={{}}
                                            onAdd={() => {}}
                                            onEdit={() => {}}
                                            onDelete={() => {}}
                                            multiChecked={false}
                                            checkedColumnFirst={true}
                                            onSelect={() => {}}
                                            onDoubleClick={() =>{}}
                                            orderBy="id"
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            { (['ZA', 'RE', 'ZR'].includes(applicationStatus.code) && applicationProcurementPlanPosition !== undefined && applicationProcurementPlanPosition.estimationType !== undefined && applicationProcurementPlanPosition.estimationType.code !== 'DO50') &&
                                <div className={classes.section}>
                                    <Divider />
                                    <Toolbar className={classes.toolbar}>
                                        <Description className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_REALIZED_TITLE}
                                        </Typography>
                                    </Toolbar>
                                    <Grid container spacing={1} justify="center" className={classes.container}>
                                        <>
                                            <Grid item xs={6}>
                                                <FormAmountField
                                                    name="amountContractAwardedNet"
                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_VALUE_CONTRACT_AWARDED_NET}
                                                    isRequired
                                                    disabled = {levelAccess !== 'public' || (levelAccess === 'public' && !['ZA', 'RE'].includes(applicationStatus.code))
                                                        || (levelAccess === 'public' && ['ZA', 'RE'].includes(applicationStatus.code) && this.props.isParts)}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormAmountField
                                                    name="amountContractAwardedGross"
                                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_VALUE_CONTRACT_AWARDED_GROSS}
                                                    disabled
                                                />
                                            </Grid>
                                        </>
                                    </Grid>
                                </div>
                            }
                        </DialogContent>
                        <DialogActions>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                                {((levelAccess === undefined && applicationStatus !== undefined && applicationStatus.code === 'ZP') ||
                                    (levelAccess === 'public' && ['ZA', 'RE'].includes(applicationStatus.code) && !this.props.isParts)) &&
                                    <Button
                                        label={constants.BUTTON_SAVE}
                                        icon=<Save/>
                                        iconAlign="left"
                                        type='submit'
                                        variant={'submit'}
                                        disabled={pristine || submitting || invalid || submitSucceeded }
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
                        </DialogActions>
                    </form>
                </Dialog>
            </>
        )
    }
}

ApplicationAssortmentGroupsForm.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationAssortmentGroupsForm);