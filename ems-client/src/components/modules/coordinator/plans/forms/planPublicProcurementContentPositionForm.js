import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Button } from 'common/gui';
import {Spinner, ModalDialog } from 'common/';
import { FormTextField, FormDictionaryField, FormSelectField, FormAmountField, FormTableField } from 'common/form';
import { Save, Cancel, Edit, Visibility, LibraryBooks } from '@material-ui/icons/';
import { withStyles, Grid, Divider, Typography, Toolbar } from '@material-ui/core/';
import PlanPublicProcurementPositionDetailsFormContainer from 'containers/modules/coordinator/plans/forms/planPublicProcurementPositionDetailsFormContainer';
import { euroExchangeRateMask } from 'utils/';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    container: {
        width: '100%',
    },
    empty: {
        marginBottom: theme.spacing(2),
       padding: theme.spacing(2),
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(55.5)}px)`,
    },
    tableEuroWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(62.5)}px)`,
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    toolbarHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    section: {
        marginBottom: theme.spacing(0),
        height: '100%',
    },
});


class PlanPublicProcurementContentPosition extends Component {
    state = {
        head: [
            {
                id: 'name',
                label: constants.APPLICATION_POSITION_DETAILS_POSITION_NAME,
                type: 'text',
            },
            {
                id: 'amountNet',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountGross',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        selected: [],
        openPositionDetailsDetails: false,
        positionAction: '',
        nextValPosition: 0,
        positions: [],
        formChanged : false,
        wrongEstimationType: false,
    };

    handleCheckEstimationType = () => {
        const {amountRequestedNet, estimationType } = this.props;
        let wrongEstimationType = false

        if(amountRequestedNet != null && (estimationType.code !== 'WR' && estimationType.code !== 'COVID')){
            if(amountRequestedNet <= 50000 && estimationType.code !== 'DO50'){
                wrongEstimationType = true
            } else if (amountRequestedNet > 50000 && amountRequestedNet <= 130000 && estimationType.code !== 'DO130'){
                wrongEstimationType = true
            } else if(amountRequestedNet > 130000 && amountRequestedNet <= 593432 && estimationType.code !== 'PO130'){
                wrongEstimationType = true
            } else if (amountRequestedNet <= 593432 && estimationType.code === 'UE139'){
                wrongEstimationType = true
            }
        }
        return wrongEstimationType;
    }

    handleClose = () =>{
        if(this.props.pristine === false){
            this.setState({formChanged: !this.state.formChanged});
        } else if(this.handleCheckEstimationType() && this.props.planStatus === 'ZP'){
            this.setState({wrongEstimationType: !this.state.wrongEstimationType});
        } else {
            this.props.onClose();
            this.props.reset();
        }
    };

    handleCancelClose = () => {
        this.setState({formChanged: false, wrongEstimationType: !this.state.wrongEstimationType});
    }

    handleConfirmClose = () => {
        this.setState({formChanged: false});
        this.props.onClose();
        this.props.reset();
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) => {
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

    handleExcelExport = (exportType) =>{
        this.props.onExcelExport(exportType, "subPositions", this.state.head, this.props.initialValues.id)
    }

    handleSubmitPosition = (values) => {
        if(this.state.positionAction === 'add'){
            values.status = {code: 'DO', name: constants.COORDINATOR_PLAN_POSITION_STATUS_ADDED};
            values.type='pzpp';
        }
        this.props.onSubmitPlanSubPosition(values, this.state.positionAction);
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: [], positionAction: ''});
    };

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    };

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: []});
    };

    handleDeletePosition = (event, action) => {
        this.setState(state => ({ positionAction: action}));
    }

    handleCancelDelete = () => {
        this.setState({ positionAction: '' });
    }

    handleConfirmDelete = () => {
        this.props.onDeletePlanSubPosition(this.state.selected[0]);
        this.setState(state => ({ positionAction: ''}));
    }

    componentDidUpdate(prevProps){
        const {amountRequestedNet, estimationType, euroExchangeRate, action } = this.props;

        //Update subPosition after submit
        if(this.props.initialValues.subPositions !== prevProps.initialValues.subPositions){
            this.setState({
                positions: this.props.initialValues.subPositions,
            })
        }
        //Changed Vat
        if(this.props.vat !== prevProps.vat && prevProps.vat !== undefined){
            if(this.props.initialValues.subPositions !== undefined){
                this.props.subPositions.map((position) => {
                    return Object.assign(position,
                    {
                         amountGross: position.amountGross = parseFloat((Math.round((position.amountNet * this.props.vat.code) * 100) / 100).toFixed(2)),
                    })
                });
                this.props.dispatch(change('PlanPublicProcurementContentPositionForm', `subPositions`, this.props.subPositions))
                this.props.dispatch(change('PlanPublicProcurementContentPositionForm', 'amountRequestedGross', parseFloat((Math.round((this.props.amountRequestedNet * this.props.vat.code) * 100) / 100).toFixed(2))));
                this.setState({
                    positions: this.props.subPositions,
                });
            }
        }
        //Mode type UE

        switch (action){
            case "add" :
                if(amountRequestedNet !== undefined && euroExchangeRate !== null && estimationType !== undefined && estimationType.code === 'UE139'){
                    this.props.dispatch(change('PlanPublicProcurementContentPositionForm', 'amountRequestedEuroNet', parseFloat((amountRequestedNet / euroExchangeRate).toFixed(2))));
                }
                break;
            case "edit":
                if( (amountRequestedNet !== null && amountRequestedNet !== undefined) && ((euroExchangeRate!== undefined && euroExchangeRate !== null && prevProps.estimationType !== "UE139" && estimationType.code === 'UE139') ||
                   (estimationType.code === 'UE139' && euroExchangeRate !== undefined && euroExchangeRate !== prevProps.euroExchangeRate)))
                {
                    this.props.dispatch(change('PlanPublicProcurementContentPositionForm', 'amountRequestedEuroNet', parseFloat((amountRequestedNet / euroExchangeRate.replace(",", ".")).toFixed(2))));
                }
                break;
            //no default
        }
        //Remove UE mode
        if (prevProps.estimationType !== undefined && prevProps.estimationType.code === 'UE139' && estimationType.code !== 'UE139'){
            this.props.dispatch(change('PlanPublicProcurementContentPositionForm', 'amountRequestedEuroNet', null));
            this.props.dispatch(change('PlanPublicProcurementContentPositionForm', 'euroExchangeRate', null));
        }
        //Reuse UE mode
        if (prevProps.estimationType !== undefined && prevProps.estimationType.code !== 'UE139' && estimationType.code === 'UE139'){
            this.props.dispatch(change('PlanPublicProcurementContentPositionForm', 'euroExchangeRate', this.props.euroExchangeRate));
        } else if ( prevProps.estimationType === undefined && estimationType !== undefined && estimationType.code === 'UE139' && this.props.initialValues.euroExchangeRate === undefined  ){
            this.props.dispatch(change('PlanPublicProcurementContentPositionForm', 'euroExchangeRate', this.props.euroExchangeRate));
        }
    }

    componentDidMount(){
        if(this.props.initialValues.subPositions !== undefined && this.props.initialValues.subPositions.length > 0){
            this.setState({
                nextValPosition: this.props.initialValues.subPositions.length+1,
                positions: this.props.initialValues.subPositions,
            })
        }
    }

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues, action, planStatus,
        modes, vats, assortmentGroups, orderTypes, estimationTypes, estimationType } = this.props;
        const {head, selected, openPositionDetails, positionAction, positions, formChanged, wrongEstimationType } = this.state;
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
                {openPositionDetails &&
                    <PlanPublicProcurementPositionDetailsFormContainer
                        initialValues={positionAction === 'add' ? {} : selected[0]}
                        action={positionAction}
                        planStatus={planStatus}
                        modes={modes}
                        estimationTypes={estimationTypes}
                        open={openPositionDetails}
                        onSubmit={this.handleSubmitPosition}
                        onClose={this.handleCloseDetails}
                    />
                }
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    {(formChanged === true || wrongEstimationType === true) &&
                        <ModalDialog
                            message={wrongEstimationType ? constants.COORDINATOR_PLAN_POSITION_PUBLIC_WRONG_ESTIMATION_TYPE_MSG : constants.MODAL_DIALOG_FORM_CHANGE_MSG}
                            variant="warning"
                            onConfirm={this.handleConfirmClose}
                            onClose={this.handleCancelClose}
                        />
                    }
                    <Typography
                        variant="h6"
                    >
                        { action === "add" ?
                            constants.COORDINATOR_PLAN_POSITION_CREATE_DETAILS_TITLE
                                :  constants.COORDINATOR_PLAN_POSITION_EDIT_DETAILS_TITLE + `  ${initialValues.assortmentGroup.name}`
                        }
                    </Typography>
                    <Divider />
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Grid container spacing={1} className={classes.container}>
                                <Grid item xs={12} >
                                    <Toolbar className={classes.toolbar}>
                                        <LibraryBooks className={classes.toolbarHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.COORDINATOR_PLAN_BASIC_INFORMATION}
                                        </Typography>
                                    </Toolbar>
                                </Grid>
                                <Grid item xs={8}>
                                    <FormDictionaryField
                                        isRequired={true}
                                        name="assortmentGroup"
                                        dictionaryName={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                        disabled={planStatus!=='ZP' && true}
                                        items={assortmentGroups}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <FormSelectField
                                        isRequired={true}
                                        name="orderType"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDER_TYPE}
                                        value={initialValues.orderType !== undefined ? initialValues.orderType : ""}
                                        options={orderTypes}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormTextField
                                        name="initiationTerm"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_INITIATION_TERM}
                                        isRequired={true}
                                        disabled={planStatus!=='ZP' && true}
                                        inputProps={{ maxLength: 20 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormSelectField
                                        isRequired={true}
                                        name="mode"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_PROCEDURE_MODE}
                                        value={initialValues.mode !== undefined ? initialValues.mode : ""}
                                        options={modes}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormSelectField
                                        isRequired={true}
                                        name="estimationType"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE}
                                        value={initialValues.estimationType !== undefined ? initialValues.estimationType : ""}
                                        options={estimationTypes}
                                        disabled={planStatus!=='ZP' && true}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <FormSelectField
                                        isRequired={true}
                                        name="vat"
                                        label={constants.COORDINATOR_PLAN_POSITION_VAT}
                                        value={initialValues.vat !== undefined ? initialValues.vat : ""}
                                        options={vats}
                                        disabled={planStatus!=='ZP' && true}
                                    />

                                </Grid>
                                <Grid item xs={5}>
                                    <FormAmountField
                                        name="amountRequestedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormAmountField
                                        name="amountRealizedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_NET}
                                        disabled
                                    />
                                </Grid>
                                { (estimationType !== undefined && estimationType.code === 'UE139')
                                    &&
                                        <>
                                        <Grid item xs={12} sm={3}>
                                            <FormTextField
                                                isRequired={(estimationType!== undefined && estimationType.code === 'UE139') && true}
                                                name="euroExchangeRate"
                                                label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_EURO_EXCHANGE_RATE}
                                                mask={euroExchangeRateMask}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={9}>
                                            <FormAmountField
                                                name="amountRequestedEuroNet"
                                                label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_EURO_VALUE_NET}
                                                suffix='€'
                                                disabled
                                            />
                                        </Grid>
                                        </>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <LibraryBooks className={classes.toolbarHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP_POSITIONS}
                                        </Typography>
                                    </Toolbar>
                                    <FormTableField
                                        className={estimationType !== undefined && estimationType.code === 'UE139' ? classes.tableEuroWrapper : classes.tableWrapper}
                                        name="subPositions"
                                        head={head}
                                        allRows={positions}
                                        checkedRows={selected}
                                        toolbar={true}
                                        addButtonProps={{
                                            disabled : (initialValues.status === undefined || initialValues.status.code !== 'ZP') ? true : false
                                        }}
                                        editButtonProps={{
                                            label : (planStatus === 'ZP') ?  constants.BUTTON_EDIT : constants.BUTTON_PREVIEW,
                                            icon : (planStatus === 'ZP') ?  <Edit/> : <Visibility/>,
                                            variant: (planStatus === 'ZP') ?  "edit" : "cancel",
                                        }}
                                        deleteButtonProps={{
                                            disabled : (planStatus === null || planStatus !== 'ZP') ? true : false
                                        }}
                                        onAdd={(event) => this.handleOpenPositionDetails(event, "add")}
                                        onEdit={(event) => this.handleOpenPositionDetails(event, 'edit')}
                                        onDelete={(event) => this.handleDeletePosition(event, 'delete', )}
                                        multiChecked={false}
                                        checkedColumnFirst={true}
                                        onSelect={this.handleSelect}
                                        onDoubleClick={this.handleDoubleClick}
                                        onExcelExport={this.handleExcelExport}
                                        orderBy="id"
                                    />
                                </div>
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
                        >
                            {planStatus === 'ZP' &&
                                <Button
                                    label={constants.BUTTON_SAVE}
                                    icon=<Save/>
                                    iconAlign="left"
                                    type='submit'
                                    variant="submit"
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
                    </div>
                </form>
            </>
        );
    };
};

PlanPublicProcurementContentPosition.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanPublicProcurementContentPosition);