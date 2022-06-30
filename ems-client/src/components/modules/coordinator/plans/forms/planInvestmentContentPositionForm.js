import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Table, InputField, Button } from 'common/gui';
import { FormTextField, FormSelectField, FormTableField, FormAmountField, FormDateField } from 'common/form';
import { withStyles, Grid, Toolbar, Typography, Divider } from '@material-ui/core/';
import { Save, Cancel, Edit, Visibility, LibraryBooks, AccountTree, AccountBalanceWallet } from '@material-ui/icons/';
import PlanInvestmentPositionsFormContainer from 'containers/modules/coordinator/plans/forms/planInvestmentPositionsFormContainer';
import { getInvestmentPositionSourceHead, getInvestmentPositionUnitsHead} from 'utils/';
import {Spinner, ModalDialog } from 'common/';

const styles = theme => ({
    tableWrapper: {
        overflow: 'auto',
        maxHeight: `calc(100vh - ${theme.spacing(80)}px)`,
    },
    sourceTableWrapper: {
        overflow: 'auto',
        maxHeight: theme.spacing(26.5),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    toolbarHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    form: {
        height: `calc(100vh - ${theme.spacing(14)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    section: {
        marginBottom: theme.spacing(0),
    },
    container: {
        width: '100%',
    },
});

class PlanInvestmentContentPosition extends Component {
    state = {
        headSource: getInvestmentPositionSourceHead(),
        headUnits: getInvestmentPositionUnitsHead(),
        selected: [],
        openPositionDetails: false,
        openTargetUnits: false,
        positionAction: '',
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

    handleSubmitPosition = (values) => {
        if(this.state.positionAction === 'add'){
            values.status = {code: 'DO', name: constants.COORDINATOR_PLAN_POSITION_STATUS_ADDED};
            values.type='inwp';
            values.amountNet=0;
            values.amountGross=0;
        }
        this.props.onSubmitPlanSubPosition(values, this.state.positionAction);
        this.setState({selected: [values], positionAction: 'edit'});
    };

    handleSubmitSourcePosition = (values) =>{
        if(this.state.positionAction === 'add'){
            values.type='inwp';
            values.amountNet=0;
            values.amountGross=0;
        }
        this.props.onSubmitPlanSubPosition(values, this.state.positionAction);
        this.setState({selected: [values]});
    }

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    };

    handleDeletePosition = (event, action) => {
        this.setState(state => ({ positionAction: action}));
    }

    handleCancelDelete = () => {
        this.setState({ positionAction: '', selected: [] });
    }

    handleConfirmDelete = () => {
        this.props.onDeleteTargetUnit(this.state.selected[0], this.props.action);
        this.setState(state => ({ positionAction: '', selected: []}));
    }

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: []});
    };

    handleDeleteSource = (values) => {
        this.props.onDeleteSource(values, this.state.selected, this.props.action)
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

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues.subPositions !== prevProps.initialValues.subPositions){
            if(this.state.positionAction !== 'add'){
                if(this.state.selected.length > 0){
                this.setState(prevState =>{
                    let selected = [...prevState.selected];
                    const idx = this.props.initialValues.subPositions.findIndex(position => position.targetUnit.code === selected[0].targetUnit.code)
                    selected[0] = this.props.initialValues.subPositions[idx];
                    return {selected}
                })
            }
            }
        }
    }

    render(){

        const {handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues, action, planStatus, vats, foundingSources, unassignedUnits, investmentCategories } = this.props;
        const {headSource, headUnits, selected, openPositionDetails, positionAction, formChanged } = this.state;

        return(
            <>
                {positionAction === "delete" &&
                    <ModalDialog
                        message={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_DELETE_TARGET_UNIT_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDelete}
                    />
                }
                { openPositionDetails
                    ?
                        <PlanInvestmentPositionsFormContainer
                            initialValues={positionAction === 'add' ? {name: initialValues.task, fundingSources:[]} : selected[0]}
                            action={positionAction}
                            planStatus={planStatus}
                            units={unassignedUnits}
                            targetUnits={initialValues.subPositions}
                            foundingSources={foundingSources}
                            positionFundingSources={initialValues.positionFundingSources}
                            onSubmit={this.handleSubmitPosition}
                            onSubmitSource={this.handleSubmitSourcePosition}
                            onDeleteSource={this.handleDeleteSource}
                            onClose={this.handleCloseDetails}
                        />
                    :
                        <form onSubmit={handleSubmit} >
                            { submitting && <Spinner /> }
                            {formChanged === true &&
                                <ModalDialog
                                    message={constants.MODAL_DIALOG_FORM_CHANGE_MSG}
                                    variant="warning"
                                    onConfirm={this.handleConfirmClose}
                                    onClose={this.handleCancelClose}
                                />
                            }
                            <div className={classes.form}>
                                <Typography
                                    variant="h6"
                                >
                                    { action === "add" ?
                                        constants.COORDINATOR_PLAN_POSITION_CREATE_DETAILS_TITLE
                                            :  constants.COORDINATOR_PLAN_POSITION_EDIT_DETAILS_TITLE + `${initialValues.task}`
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
                                            <Grid item xs={12} >
                                                <FormTextField
                                                    name="name"
                                                    label={constants.APPLICATION_POSITION_DETAILS_POSITION_NAME}
                                                    disabled={planStatus!=='WY' && true}
                                                    inputProps={{ maxLength: 200 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <FormTextField
                                                    name="task"
                                                    label={constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK}
                                                    isRequired={true}
                                                    disabled={planStatus!=='ZP' && true}
                                                    inputProps={{ maxLength: 200 }}
                                                />
                                            </Grid>
                                            <Grid item xs={8}>
                                                <FormSelectField
                                                    isRequired={true}
                                                    name="category"
                                                    label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_CATEGORY}
                                                    options={investmentCategories}
                                                    disabled={planStatus!=='ZP' && true}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <FormDateField
                                                    name="realizationDate"
                                                    label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_REALIZATION_DATE}
                                                    disablePast
                                                    isRequired={true}
                                                    disabled={action ==='add' ? false :
                                                        initialValues.status !== undefined && initialValues.status.code !=='ZP' ? true :
                                                            false
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <FormSelectField
                                                    isRequired={true}
                                                    name="vat"
                                                    label={constants.COORDINATOR_PLAN_POSITION_VAT}
                                                    value={initialValues.vat !== undefined ? initialValues.vat : ""}
                                                    options={vats}
                                                    disabled={planStatus!=='ZP' && true}
                                                />
                                            </Grid>
                                            <Grid item xs={1} >
                                                <InputField
                                                    name="status"
                                                    label={constants.APPLICATION_POSITION_DETAILS_STATUS}
                                                    disabled
                                                    value={ Object.keys(initialValues).length !== 0 && initialValues.status ? initialValues.status.name : ''}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormAmountField
                                                    name="taskPositionGross"
                                                    label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_TASK_GROSS}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormAmountField
                                                    name="amountAwardedGross"
                                                    label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_AWARDED_GROSS}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormAmountField
                                                    name="amountRequestedGross"
                                                    label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormAmountField
                                                    name="expensesPositionAwardedGross"
                                                    label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_AWARDED_GROSS}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={6} >
                                                <FormTextField
                                                    name="application"
                                                    label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_APPLICATION}
                                                    multiline
                                                    rows="1"
                                                    disabled={planStatus!=='ZP' && true}
                                                    inputProps={{ maxLength: 200 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} >
                                                <FormTextField
                                                    name="substantiation"
                                                    label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_SUBSTANTIATION}
                                                    multiline
                                                    rows="1"
                                                    disabled={planStatus!=='ZP' && true}
                                                    inputProps={{ maxLength: 200 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div className={classes.section}>
                                                    <Toolbar className={classes.toolbar}>
                                                        <AccountBalanceWallet className={classes.toolbarHeaderIcon} fontSize="small" />
                                                        <Typography variant="subtitle1" >
                                                            {constants.COORDINATOR_PLAN_POSITION_INVESTMENT_FUNDING_SOURCES}
                                                        </Typography>
                                                    </Toolbar>
                                                    <Table
                                                        className={classes.sourceTableWrapper}
                                                        name="positionFundingSources"
                                                        headCells={headSource}
                                                        rows={initialValues.positionFundingSources}
                                                        onSelect={() => {}}
                                                        onExcelExport={this.handleExcelExport}
                                                        rowKey="id"
                                                        defaultOrderBy="id"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} >
                                                <div className={classes.section}>
                                                    <Toolbar className={classes.toolbar}>
                                                        <AccountTree className={classes.toolbarHeaderIcon} fontSize="small" />
                                                        <Typography variant="subtitle1" >
                                                            {constants.COORDINATOR_PLAN_POSITION_INVESTMENT_TARGET_UNITS}
                                                        </Typography>
                                                    </Toolbar>
                                                    <FormTableField
                                                        className={classes.tableWrapper}
                                                        name="subPositions"
                                                        head={headUnits}
                                                        allRows={initialValues.subPositions}
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
                                                        onDoubleClick={this.handleDoubleClick}
                                                        multiChecked={false}
                                                        checkedColumnFirst={true}
                                                        onSelect={this.handleSelect}
                                                        orderBy="id"
                                                    />
                                                </div>
                                            </Grid>

                                        </Grid>
                                    </div>
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
                }
            </>
        );
    };
};

PlanInvestmentContentPosition.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanInvestmentContentPosition);
