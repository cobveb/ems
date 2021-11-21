import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { change } from 'redux-form';
import * as constants from 'constants/uiNames';
import { InputField, Button } from 'common/gui';
import { FormDictionaryField, FormSelectField, FormAmountField, FormTextField, FormTableField } from 'common/form';
import { Save, Cancel, Visibility, LibraryBooks } from '@material-ui/icons/';
import {Spinner, ModalDialog } from 'common/';
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
        height: `calc(100vh - ${theme.spacing(58.7)}px)`,
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

class PlanUpdateFinancialPositionDetails extends Component {

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
        positions: [],
        formChanged: false,
        openPositionDetails: false,
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

    handleOpenPositionDetails = (event) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails});
    };

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: []});
    };

    handleDoubleClick = (row) => {
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let openPositionDetails = {...prevState.openPositionDetails};
            selected[0] = row;
            openPositionDetails = !this.state.openPositionDetails;
            return {selected, openPositionDetails}
        });
    }

    handleExcelExport = (exportType) =>{
        this.props.onExcelExport(exportType, "subPositions", this.state.head, this.props.initialValues.id)
    }

    handleUpdateSubPosition = (values) => {
        this.props.onSubmitPlanSubPosition(values, "edit");
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: []});
    };

    componentDidUpdate(prevProps){
        if(this.props.amountAwardedGross !== prevProps.amountAwardedGross && prevProps.amountAwardedGross !== undefined){
            this.props.dispatch(change('PlanUpdateFinancialContentPositionForm', 'amountAwardedNet', parseFloat((Math.round((((this.props.amountAwardedGross / this.props.vat.code) + Number.EPSILON) * 100) / 100).toFixed(2)))));
        }
        // Add comments to subPosition
        if(this.props.initialValues.subPositions !== prevProps.initialValues.subPositions){
            this.setState({
                positions: this.props.initialValues.subPositions,
            })
        }
    }

    componentDidMount(){
        if(this.props.initialValues.subPositions !== undefined && this.props.initialValues.subPositions.length > 0){
            this.setState({
                positions: this.props.initialValues.subPositions,
            })
        }
    }

    render(){
        const {handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues, action, planStatus, costsTypes, vats, levelAccess} = this.props;
        const {head, selected, positions, formChanged, openPositionDetails } = this.state;

        return(
            <>
                {openPositionDetails &&
                    <PlanFinancialPositionsFormContainer
                        initialValues={selected[0]}
                        action={"edit"}
                        planStatus={planStatus}
                        units={[]}
                        open={openPositionDetails}
                        isUpdatePlan={true}
                        onSubmit={this.handleUpdateSubPosition}
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
                            constants.COORDINATOR_PLAN_POSITION_CREATE_DETAILS_TITLE :
                                constants.COORDINATOR_PLAN_UPDATE_POSITION_DETAILS_TITLE + ` ${initialValues.costType.code}  - ${initialValues.costType.name}`
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
                                        disabled={(planStatus!=='ZP' || action === 'correct') && true}
                                        items={costsTypes}
                                    />
                                </Grid>
                                <Grid item xs={2} >
                                    <InputField
                                        name="status"
                                        label={constants.APPLICATION_POSITION_DETAILS_STATUS}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.status ? initialValues.status.name : ''}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <FormSelectField
                                        isRequired={true}
                                        name="vat"
                                        label={constants.COORDINATOR_PLAN_POSITION_VAT}
                                        value={initialValues.vat !== undefined ? initialValues.vat : ""}
                                        options={vats}
                                        disabled={(planStatus!=='ZP' || action === 'correct') && true}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormAmountField
                                        name="amountRequestedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS}
                                        suffix={'zł.'}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormAmountField
                                        name="correctionPlanPosition.amountAwardedGross"
                                        label={constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_BEFORE_CORRECTED_GROSS}
                                        suffix={'zł.'}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <FormAmountField
                                        isRequired
                                        name="amountAwardedGross"
                                        label={constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_AFTER_CORRECTED_GROSS}
                                        suffix={'zł.'}
                                        disabled={(levelAccess !== 'accountant' && planStatus !== 'ZP') ||
                                            (levelAccess === 'accountant' &&  !['WY','RO'].includes(planStatus)) ? true : false
                                        }
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
                                                label: constants.BUTTON_PREVIEW,
                                                icon: <Visibility/>,
                                                variant: "cancel",
                                                disabled: (selected.length === 0)
                                            }}
                                            editButtonProps={{
                                                hide: true,
                                            }}
                                            deleteButtonProps={{
                                                hide: true,
                                            }}
                                            onAdd={(event) => this.handleOpenPositionDetails(event, "add")}
                                            onEdit={() => {}}
                                            onDelete={() => {}}
                                            multiChecked={false}
                                            checkedColumnFirst={true}
                                            onSelect={this.handleSelect}
                                            onDoubleClick={this.handleDoubleClick}
                                            onExcelExport={this.handleExcelExport}
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
                            {((planStatus === 'ZP' )|| (levelAccess === 'accountant' && ['WY','SK'].includes(initialValues.status.code))) &&
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

PlanUpdateFinancialPositionDetails.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

PlanUpdateFinancialPositionDetails.defaultProps ={
    levelAccess: 'coordinator',
}

export default withStyles(styles)(PlanUpdateFinancialPositionDetails);
