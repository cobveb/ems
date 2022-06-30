import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { InputField, Button } from 'common/gui';
import {Spinner, ModalDialog } from 'common/';
import { FormDictionaryField, FormSelectField, FormAmountField, FormTableField, FormTextField } from 'common/form';
import { Save, Cancel, Edit, Visibility, LibraryBooks } from '@material-ui/icons/';
import { withStyles, Grid, Toolbar, Typography, Divider  } from '@material-ui/core/';
import PlanFinancialPositionsFormContainer from 'containers/modules/coordinator/plans/forms/planFinancialPositionsFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    container: {
        width: '100%',
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(65.5)}px)`,
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    toolbarHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    section: {
        marginBottom: theme.spacing(0),
    },
});

class PlanFinancialContentPosition extends Component {

    state = {
        head: [
            {
                id: 'name',
                label: constants.APPLICATION_POSITION_DETAILS_POSITION_NAME,
                type: 'text',
            },
            {
                id: 'quantity',
                label: constants.APPLICATION_POSITION_DETAILS_QUANTITY,
                type: 'text',
            },
            {
                id: 'unitPrice',
                label: constants.COORDINATOR_PLAN_POSITION_FINANCIAL_UNIT_PRICE,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountNet',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
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
            values.type='finp';
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
        this.setState(state => ({ positionAction: '', selected: []}));
    }

    componentDidUpdate(prevProps){
        if(this.props.initialValues.subPositions !== prevProps.initialValues.subPositions){
            this.setState({
                positions: this.props.initialValues.subPositions,
            })
        }
        if(this.props.vat !== prevProps.vat && prevProps.vat !== undefined){
            if(this.props.initialValues.subPositions !== undefined){
                this.props.subPositions.map((position) => {
                    return Object.assign(position,
                    {
                         amountGross: position.amountGross = parseFloat((Math.round((position.amountNet * this.props.vat.code) * 100) / 100).toFixed(2)),
                    })
                });
                this.props.dispatch(change('PlanFinancialContentPositionForm', `subPositions`, this.props.subPositions))
                this.props.dispatch(change('PlanFinancialContentPositionForm', 'amountRequestedGross', parseFloat((Math.round((this.props.amountRequestedNet * this.props.vat.code) * 100) / 100).toFixed(2))));
                this.setState({
                    positions: this.props.subPositions,
                });
            }
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
        const {handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues, action, planStatus, planUpdate, units, costsTypes, vats} = this.props;
        const {head, selected, openPositionDetails, positionAction, positions, formChanged } = this.state;
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
                    <PlanFinancialPositionsFormContainer
                        initialValues={positionAction === 'add' ? {} : selected[0]}
                        action={positionAction}
                        planStatus={planStatus}
                        units={units}
                        open={openPositionDetails}
                        onSubmit={this.handleSubmitPosition}
                        onClose={this.handleCloseDetails}
                    />
                }
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
                            constants.COORDINATOR_PLAN_POSITION_CREATE_DETAILS_TITLE
                                :  constants.COORDINATOR_PLAN_POSITION_EDIT_DETAILS_TITLE + `  ${initialValues.costType !== undefined && initialValues.costType.code}  - ${initialValues.costType !== undefined && initialValues.costType.name}`
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
                                <Grid item xs={9}>
                                    <FormDictionaryField
                                        isRequired={true}
                                        name="costType"
                                        dictionaryName={constants.ACCOUNTANT_SUBMENU_DICTIONARIES_COST_TYPES}
                                        label={constants.COORDINATOR_PLAN_POSITION_FINANCIAL_COST_TYPES}
                                        disabled={(planStatus!=='ZP' || (planUpdate && action === 'correct')) && true}
                                        items={costsTypes}
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <InputField
                                        name="status"
                                        label={constants.APPLICATION_POSITION_DETAILS_STATUS}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.status ? initialValues.status.name : ''}
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
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_NET}
                                        suffix={'zł.'}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormAmountField
                                        name="amountRequestedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormAmountField
                                        name="amountAwardedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_NET}
                                        suffix={'zł.'}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormAmountField
                                        name="amountAwardedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS}
                                        suffix={'zł.'}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormAmountField
                                        name="amountRealizedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_NET}
                                        disabled
                                        suffix={'zł.'}
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormAmountField
                                        name="amountRealizedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS}
                                        disabled
                                        suffix={'zł.'}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormTextField
                                        name="coordinatorDescription"
                                        label={constants.COORDINATOR_PLAN_POSITION_COORDINATOR_DESCRIPTION}
                                        multiline
                                        rows="1"
                                        disabled={planStatus!=='ZP' && true}
                                        inputProps={{ maxLength: 230 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormTextField
                                        name="managementDescription"
                                        label={constants.COORDINATOR_PLAN_POSITION_MANAGEMENT_DESCRIPTION}
                                        multiline
                                        rows="1"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <div className={classes.section}>
                                        <Toolbar className={classes.toolbar}>
                                            <LibraryBooks className={classes.toolbarHeaderIcon} fontSize="small" />
                                            <Typography variant="subtitle1" >
                                                {constants.COORDINATOR_PLAN_POSITION_PUBLIC_COST_TYPE_POSITIONS}
                                            </Typography>
                                        </Toolbar>
                                        <FormTableField
                                            className={classes.tableWrapper}
                                            name="subPositions"
                                            head={head}
                                            allRows={positions}
                                            checkedRows={selected}
                                            toolbar={true}
                                            addButtonProps={{
                                                disabled : (initialValues.status === undefined || !['ZP', 'KR'].includes(initialValues.status.code)) ? true : false
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
                                            defaultOrderBy="id"
                                        />
                                    </div>
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

PlanFinancialContentPosition.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanFinancialContentPosition);
