import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Divider, Grid, Toolbar } from '@material-ui/core/';
import {Spinner, ModalDialog} from 'common/';
import { Table, Button } from 'common/gui';
import * as constants from 'constants/uiNames';
import { Save, Cancel, Edit, Visibility, LibraryBooks, AccountBalanceWallet } from '@material-ui/icons/';
import { FormDictionaryField, FormTableField, FormDigitsField, FormTextField } from 'common/form';
import PlanFoundingSourcesFormContainer from 'containers/modules/coordinator/plans/forms/planFoundingSourcesFormContainer';
import {findIndexElement} from 'utils/';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    container: {
        width: '100%',
    },
    section: {
        marginBottom: theme.spacing(0),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    toolbarHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    tableWrapper: {
        overflow: 'auto',
        height: theme.spacing(26),
    },
});

class PlanInvestmentPositionsForm extends Component {
    state = {
        headSource: [
            {
                id: 'type.name',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_SOURCES,
                type: 'object',
            },
            {
                id: 'sourceAmountGross',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_TASK_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'sourceAmountAwardedGross',
                label: constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AWARDED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'sourceExpensesPlanGross',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'sourceExpensesPlanAwardedGross',
                label: constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AWARDED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        headRealizedSource: [
            {
                id: 'type.name',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_SOURCES,
                type: 'object',
            },
            {
                id: 'sourceRealizedAmountGross',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_REALIZED_PLAN_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        selected: [],
        formChanged : false,
        openPositionDetails: false,
        positionAction: null,
        deleteActionName: null,

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

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    }

    handleClosePositionDetails = () =>{
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected:[]});
    }

    handleSubmitPosition = (values) => {
        let formValues = this.props.formCurrentValues;

        if(this.state.positionAction === "add"){
            formValues.fundingSources.push(values);
        } else {

            const index = findIndexElement(values, formValues.fundingSources);
            formValues.fundingSources.splice(index, 1, values);
        }

        this.props.onSubmitSource(formValues);
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: []});
    }

    handleDeletePosition = (event, action) => {
        this.setState(state => ({ positionAction: action}));
    }

    handleCancelDelete = () => {
        this.setState({ positionAction: null, selected: [] });
    }

    handleConfirmDelete = () => {
        this.props.onDeleteSource(this.state.selected[0]);
        this.setState(state => ({ positionAction: null, selected: []}));
    }

    renderSourceDialog = () => {
        const {initialValues, planStatus, foundingSources} = this.props;
        const {openPositionDetails, positionAction, selected} = this.state;
        return(
            <PlanFoundingSourcesFormContainer
                initialValues={positionAction === 'add' ? {} : selected[0]}
                action={positionAction}
                planStatus={planStatus}
                positionName={initialValues.name}
                positionUnit={initialValues.targetUnit}
                open={openPositionDetails}
                onSubmit={this.handleSubmitPosition}
                onClose={this.handleClosePositionDetails}
                foundingSources={foundingSources}
                positionFundingSources={this.props.positionFundingSources}
                targetUnits={this.props.targetUnits}
                positions={initialValues.fundingSources}
            />
        );
    }

    render(){
        const {handleSubmit, pristine, invalid, submitSucceeded, submitting, initialValues, classes, action, planStatus, units} = this.props;
        const {headSource, headRealizedSource, selected, formChanged, openPositionDetails, positionAction} = this.state;
        return(
            <>
                {positionAction === "delete" &&
                    <ModalDialog
                        message={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_DELETE_SOURCE_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDelete}
                    />
                }
                {openPositionDetails && this.renderSourceDialog()}
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
                            constants.COORDINATOR_PLAN_POSITION_INVESTMENT_CREATE_POSITION_DETAILS_TITLE
                                :  constants.COORDINATOR_PLAN_POSITION_INVESTMENT_EDIT_POSITION_DETAILS_TITLE + `  ${initialValues.targetUnit.name}`
                        }
                    </Typography>
                    <Divider />
                    <div className={classes.content}>
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
                                    label={constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={10}>
                                <FormDictionaryField
                                    isRequired={true}
                                    name="targetUnit"
                                    dictionaryName={constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_TARGET_UNITS_TITLE}
                                    label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_TARGET_UNIT}
                                    disabled={planStatus!=='ZP' && true}
                                    items={units}
                                />
                            </Grid>
                            <Grid item xs={2} >
                                <FormDigitsField
                                    name="quantity"
                                    label={constants.APPLICATION_POSITION_DETAILS_QUANTITY}
                                    isRequired={true}
                                    disabled={planStatus!=='ZP' && true}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} className={classes.container}>
                            <Grid item xs={12}>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <AccountBalanceWallet className={classes.toolbarHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.COORDINATOR_PLAN_POSITION_INVESTMENT_FUNDING_SOURCES}
                                        </Typography>
                                    </Toolbar>
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="fundingSources"
                                        head={headSource}
                                        allRows={initialValues !== undefined ? initialValues.fundingSources : []}
                                        checkedRows={selected}
                                        toolbar={true}
                                        addButtonProps={{
                                            disabled : (planStatus === null || !['ZP', 'PK'].includes(planStatus) || action === 'add' ) ? true : false
                                        }}
                                        editButtonProps={{
                                            label : ['ZP', 'PK'].includes(planStatus)  ?  constants.BUTTON_EDIT : constants.BUTTON_PREVIEW,
                                            icon : ['ZP', 'PK'].includes(planStatus) ?  <Edit/> : <Visibility/>,
                                            variant: ['ZP', 'PK'].includes(planStatus) ?  "edit" : "cancel",
                                        }}
                                        deleteButtonProps={{
                                            disabled : (planStatus === null || planStatus !== 'ZP') ? true : false
                                        }}
                                        onAdd={(event) => this.handleOpenPositionDetails(event, 'add')}
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
                        <Grid container spacing={1} className={classes.container}>
                            <Grid item xs={12}>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <AccountBalanceWallet className={classes.toolbarHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_REALIZED_PLAN_GROSS}
                                        </Typography>
                                    </Toolbar>
                                    <Table
                                        className={classes.tableWrapper}
                                        name="realizedSources"
                                        headCells={headRealizedSource}
                                        rows={initialValues !== undefined ? initialValues.fundingSources : []}
                                        onSelect={()=>{}}
                                        onExcelExport={this.handleExcelExport}
                                        rowKey="id"
                                        defaultOrderBy="id"
                                    />
                                </div>
                            </Grid>
                        </Grid>
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
    }

};


PlanInvestmentPositionsForm.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanInvestmentPositionsForm);