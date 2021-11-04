import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Divider, Grid, Toolbar } from '@material-ui/core/';
import { Spinner } from 'common/';
import * as constants from 'constants/uiNames';
import { Button, InputField } from 'common/gui';
import { FormTextField, FormDateField, FormAmountField, FormTableField } from 'common/form';
import { Cancel, LibraryBooks, AccountBalanceWallet, AccountTree, Visibility, Save } from '@material-ui/icons/';
import {getInvestmentPositionSourceHead, getInvestmentPositionUnitsHead, findIndexElement} from 'utils/';
import PlanInvestmentPositionsFormContainer from 'containers/modules/coordinator/plans/forms/planInvestmentPositionsFormContainer';
import PlanInvestmentPositionFundingSourcesFormContainer from 'containers/modules/accountant/coordinator/plans/forms/planInvestmentPositionFundingSourcesFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    container: {
        width: '100%',
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    toolbarHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    tableWrapper: {
        overflow: 'auto',
        maxHeight: `calc(100vh - ${theme.spacing(80)}px)`,
    },
    sourceTableWrapper: {
        overflow: 'auto',
        maxHeight: theme.spacing(26.5),
    },
})

class PlanInvestmentPositionsForm extends Component {
    state = {
        formChanged: false,
        selectedSource: [],
        selectedUnit: [],
        headSource: getInvestmentPositionSourceHead(),
        headUnits: getInvestmentPositionUnitsHead(),
        openPositionDetails: false,
        target: null,
    };

    handleClose = () =>{
        if(this.props.pristine === false){
            this.setState({formChanged: !this.state.formChanged});
        } else {
            this.props.onClose();
            this.props.reset();
        }
    };

    handleSelect = (value, action) =>{
        this.setState({[action]: value});
    }

    handleSelectUnit = (id) => {
        this.handleSelect(id, "selectedUnit")
    }

    handleSelectSource = (id) => {
        this.handleSelect(id, "selectedSource")
    }

    handleCloseDetails = (event, target) => {
        this.setState({openPositionDetails: false, [target]: []});
    };

    handleOpenPositionDetails = (event, action, target) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action, target: target});
    };

    handleDoubleClick = (event, target) => {
        switch(target){
            case 'unit':
                this.setState({
                    openPositionDetails: !this.state.openPositionDetails,
                    selectedUnit: [event],
                    positionAction: 'edit',
                    target: target,
                });
            break;
            case 'source':
                if(this.props.initialValues.name !== null){
                    this.setState({
                        openPositionDetails: !this.state.openPositionDetails,
                        selectedSource: [event],
                        positionAction: 'edit',
                        target: target,
                    });
                }
            break;
            // no default
        }
    };


    calculateValuesAmount = (values, initData) => {
//        const { amountAwardedNet, amountAwardedGross, expensesPositionAwardedNet, expensesPositionAwardedGross } = this.props

        const index = findIndexElement(values, initData.positionFundingSources, "positionId");
        if(index !== null){
//            let awardedNet = parseFloat((amountAwardedNet - initData.positionFundingSources[index].sourceAmountAwardedNet).toFixed(2));
//            let awardedGross = parseFloat((amountAwardedGross - initData.positionFundingSources[index].sourceAmountAwardedGross).toFixed(2));
//            let expensesAwardedNet = parseFloat((expensesPositionAwardedNet - initData.positionFundingSources[index].sourceExpensesPlanAwardedNet).toFixed(2));
//            let expensesAwardedGross = parseFloat((expensesPositionAwardedGross - initData.positionFundingSources[index].sourceExpensesPlanAwardedGross).toFixed(2));
//
//            awardedNet =  parseFloat((awardedNet + values.sourceAmountAwardedNet).toFixed(2));
//            awardedGross = parseFloat((awardedGross + values.sourceAmountAwardedGross).toFixed(2));
//            expensesAwardedNet = parseFloat((expensesAwardedNet + values.sourceExpensesPlanAwardedNet).toFixed(2));
//            expensesAwardedGross = parseFloat((expensesAwardedGross + values.sourceExpensesPlanAwardedGross).toFixed(2));
            initData.positionFundingSources.splice(index, 1, values);
        }
    }

    handleSubmitPositionSource = (values) => {

        if(this.state.positionAction === 'add'){
            values.sourceAmountNet=0;
            values.sourceAmountGross=0;
            values.sourceExpensesPlanNet=0;
            values.sourceExpensesPlanGross=0;
            this.props.initialValues.positionFundingSources.push(values);
        } else if (this.state.positionAction === 'edit'){
            const idx = findIndexElement(values, this.props.initialValues.positionFundingSources, "positionId");
            if(idx !== null){
                this.props.initialValues.positionFundingSources.splice(idx, 1, values);
            }
        }
        this.props.onSubmit(this.props.initialValues)
        this.setState({openPositionDetails: false, selectedSource: []});

    }

    renderDetails = () => {
        const {planStatus, initialValues, fundingSources } = this.props;
        const {target, selectedUnit, selectedSource, positionAction, openPositionDetails} = this.state;
        switch(target){
            case 'source':
                return(
                    <PlanInvestmentPositionFundingSourcesFormContainer
                        initialValues={positionAction === "add" ? {} : selectedSource[0]}
                        open={openPositionDetails}
                        action={positionAction}
                        fundingSources={fundingSources}
                        positionSources={initialValues.positionFundingSources}
                        planStatus={planStatus}
                        vat={initialValues.vat}
                        onSubmit={this.handleSubmitPositionSource}
                        onClose={(event) => this.handleCloseDetails(event, 'selectedSource' )}
                    />
                )
            case 'unit':
                return(
                    <PlanInvestmentPositionsFormContainer
                        initialValues={selectedUnit[0]}
                        action={positionAction}
                        planStatus={planStatus}
                        units={[]}
                        targetUnits={initialValues.subPositions}
                        foundingSources={[]}
                        vat={initialValues.vat}
                        onSubmit={() => {}}
                        onSubmitSource={() => {}}
                        onDeleteSource={() =>   {}}
                        onClose={(event) => this.handleCloseDetails(event, 'selectedUnit' )}
                    />
                );
            //no default
        }
    }

    render(){
        const { handleSubmit, submitting, pristine, invalid, submitSucceeded, initialValues, classes, action, planStatus } = this.props;
        const { headSource, headUnits, selectedSource, selectedUnit, openPositionDetails } = this.state;
        console.log(planStatus)
        return(
            <>
                { openPositionDetails && this.renderDetails()}
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <Typography
                        variant="h6"
                    >
                        { action === "add" ?
                            constants.COORDINATOR_PLAN_POSITION_CREATE_DETAILS_TITLE :
                                constants.COORDINATOR_PLAN_UPDATE_POSITION_DETAILS_TITLE + (initialValues.name !== null ? `${initialValues.name}` : `${initialValues.task}`)
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
                                        isRequired
                                        label={constants.APPLICATION_POSITION_DETAILS_POSITION_NAME}
                                        disabled={planStatus !== undefined && !['WY', 'RO'].includes(planStatus.code)}
                                        inputProps={{ maxLength: 200 }}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <FormTextField
                                        name="task"
                                        label={constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <InputField
                                        name="category"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_CATEGORY}
                                        value={initialValues.category !== undefined ? initialValues.category.name : ''}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <FormDateField
                                        name="realizationDate"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_REALIZATION_DATE}
                                        disablePast
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <InputField
                                        name="vat"
                                        label={constants.COORDINATOR_PLAN_POSITION_VAT}
                                        value={initialValues.vat !== undefined ? initialValues.vat.name : ""}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={1} >
                                    <InputField
                                        name="status"
                                        label={constants.APPLICATION_POSITION_DETAILS_STATUS}
                                        disabled
                                        value={ initialValues.status !== undefined ? initialValues.status.name : ''}
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
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6} >
                                    <FormTextField
                                        name="substantiation"
                                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_SUBSTANTIATION}
                                        multiline
                                        rows="1"
                                        disabled
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
                                        <FormTableField
                                            className={classes.sourceTableWrapper}
                                            name="positionFundingSources"
                                            head={headSource}
                                            allRows={initialValues.positionFundingSources}
                                            checkedRows = {selectedSource}
                                            toolbar={true}
                                            addButtonProps={{
                                                disabled: !['WY', 'RO'].includes(planStatus.code) || initialValues.status.code !== 'SK' ? true : false
                                            }}
                                            editButtonProps={{
                                                disabled: !['WY', 'RO'].includes(planStatus.code) || initialValues.status.code !== 'SK'  ? true :
                                                    selectedSource.length > 0 ? false : true,
                                            }}
                                            deleteButtonProps={{
                                                hide: true,
                                            }}
                                            onAdd={(event) => this.handleOpenPositionDetails(event, 'add', 'source')}
                                            onEdit={(event) => this.handleOpenPositionDetails(event, 'edit', 'source')}
                                            onDelete={() => {}}
                                            onDoubleClick={(event) => this.handleDoubleClick(event, 'source' )}
                                            multiChecked={false}
                                            checkedColumnFirst={true}
                                            onSelect={this.handleSelectSource}
                                            onExcelExport={this.handleExcelExport}
                                            orderBy="id"
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
                                            checkedRows={selectedUnit}
                                            toolbar={true}
                                            addButtonProps={{
                                                label : constants.BUTTON_PREVIEW,
                                                icon : <Visibility/>,
                                                variant: "cancel",
                                                disabled: selectedUnit.length > 0 ? false : true,
                                            }}
                                            editButtonProps={{
                                                hide: true,
                                            }}
                                            deleteButtonProps={{
                                                hide: true,
                                            }}
                                            onAdd={(event) => this.handleOpenPositionDetails(event, 'edit', 'unit')}
                                            onEdit={() => {}}
                                            onDelete={() => {}}
                                            onDoubleClick={(event) => this.handleDoubleClick(event, 'unit' )}
                                            multiChecked={false}
                                            checkedColumnFirst={true}
                                            onSelect={this.handleSelectUnit}
                                            orderBy="id"
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
                            {(planStatus !== undefined && ['WY', 'RO'].includes(planStatus.code)) &&
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

PlanInvestmentPositionsForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanInvestmentPositionsForm);