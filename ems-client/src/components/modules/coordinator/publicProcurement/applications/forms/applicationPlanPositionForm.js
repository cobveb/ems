import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Toolbar } from '@material-ui/core/';
import {Spinner, ModalDialog } from 'common/';
import { Close, Save, Cancel, LibraryBooks, Edit, Description } from '@material-ui/icons/';
import { Button } from 'common/gui';
import { FormAmountField, FormSelectField, FormDictionaryField, FormTableField } from 'common/form';
import SubsequentYearsFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/subsequentYearsFormContainer';

const styles = theme => ({
    dialog:{
        height: `calc(100vh - ${theme.spacing(40)}px)`,
        maxHeight: `calc(100vh - ${theme.spacing(20)}px)`,
        width: '100%',
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(0),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    tableWrapper: {
        overflow: 'auto',
        height: theme.spacing(30),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    container: {
        width: '100%',
        padding: 0,
    },
    toolbar: {
        minHeight: theme.spacing(4),
    },
    dialogTitle: {
        paddingBottom: theme.spacing(1),
    },
})

class ApplicationPlanPositionForm extends Component {

    state = {
        selected: [],
        allowAddYear: true,
        openYearDetails: false,
        subsequentYears:[],
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
    }

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    };

    handleSelect = (row) => {
        this.setState({selected: row});
    }

    handleDoubleClick = (row) =>{
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let openYearDetails = {...prevState.openYearDetails};
            let positionAction = {...prevState.positionAction};
            selected[0] = row;
            openYearDetails =  !this.state.openYearDetails;
            positionAction = 'edit';
            return {selected, openYearDetails, positionAction}
        });
    }

    allowAddSubsequentYear = (orderValueYearNet) =>{
        this.setState(prevState => {
            let allowAddYear = true;
            let subsequentYearsValue = 0;
            if(this.props.initialValues.subsequentYears.length > 0){
                this.props.initialValues.subsequentYears.forEach(year => {
                    subsequentYearsValue += year.yearExpenditureNet
                })
                if(orderValueYearNet <= subsequentYearsValue){
                    allowAddYear = false;
                }
            } else {
                allowAddYear = false;
            }
            return {allowAddYear}
        })
    }

    handleOpenPositionDetails = (event, action) => {
        this.setState({openYearDetails: !this.state.openYearDetails, positionAction: action});
    };

    handleDelete = (event, action) => {
        this.setState({ positionAction: action })
    }

    handleConfirmDelete = () => {
        this.props.onDeleteSubsequentYear(this.state.selected[0]);
    }

    handleCancelDelete = () => {
        this.setState({
            positionAction: '',
            selected: [],
        })
    }

    handleCloseDetails = () => {
        this.setState({openYearDetails: !this.state.openYearDetails, selected: [], positionAction: ''});
    };

    handleSubmitYear = (values) =>{
        this.props.onSaveSubsequentYear(values, this.state.positionAction);
        this.handleCloseDetails();

    }

    componentDidUpdate(prevProps){
        const {positionAmountNet, vat} = this.props;
        if((vat !== prevProps.vat && vat !== undefined && positionAmountNet !== undefined) || (positionAmountNet !== undefined && prevProps.positionAmountNet !== positionAmountNet && vat !== undefined)){
            this.props.dispatch(change('ApplicationPlanPositionForm', 'positionAmountGross', parseFloat((Math.round((positionAmountNet * vat.code) * 100) / 100).toFixed(2))));
        }
        //Update on change subsequent years
        if(prevProps.initialValues.subsequentYears !== this.props.initialValues.subsequentYears){
            this.setState({ subsequentYears: this.props.initialValues.subsequentYears});
//            this.allowAddSubsequentYear(this.props.orderValueYearNet);
        }
    }

    componentDidMount(){
        this.setState({ subsequentYears: this.props.initialValues.subsequentYears !== undefined ?  this.props.initialValues.subsequentYears  : []});
//        this.allowAddSubsequentYear(this.props.orderValueYearNet);
    }
    render(){
        const { classes, pristine, invalid, handleSubmit, submitting, submitSucceeded, isLoading, open, action, applicationStatus, vats, orderIncludedPlanType, planPositions } = this.props;
        const { tableHeadYears, selected, allowAddYear, openYearDetails, positionAction, subsequentYears } = this.state;
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
                { openYearDetails &&
                    <SubsequentYearsFormContainer
                        isLoading={isLoading}
                        open={openYearDetails}
                        initialValues={positionAction === 'add' ? {vat: this.props.vat} : selected[0]}
                        action={positionAction}
                        applicationStatus={applicationStatus}
                        vats={vats}
                        orderGroupValue={this.props.orderGroupValueNet}
                        orderValueYearNet={this.props.orderValueYearNet}
                        subsequentYears={subsequentYears}
                        onClose={this.handleCloseDetails}
                        onSubmit={this.handleSubmitYear}
                    />
                }

                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="lg"
                    disableBackdropClick={true}
                >
                    {(submitting || isLoading) && <Spinner /> }
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
                                        {action === "add" ?
                                            constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_PLAN_POSITION_TITLE_CREATE :
                                                constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_PLAN_POSITION_TITLE_EDIT
                                        }
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
                                        {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_PLAN_POSITION_INFO}
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={12}>
                                        <FormDictionaryField
                                            isRequired={true}
                                            name="coordinatorPlanPosition"
                                            dictionaryName={orderIncludedPlanType === 'FIN' ?
                                                constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_FINANCIAL_PLAN_POSITION :
                                                    constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_INVESTMENT_PLAN_POSITION
                                            }
                                            label={orderIncludedPlanType === 'FIN' ?
                                                constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_FINANCIAL_PLAN_POSITION :
                                                    constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_INVESTMENT_PLAN_POSITION
                                            }
                                            items={planPositions}
                                            disabled={applicationStatus !== undefined && applicationStatus.code !== 'ZP'}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormAmountField
                                            name="coordinatorPlanPosition.amountAwardedNet"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_PLAN_POSITION_AMOUNT_NET}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormAmountField
                                            name="coordinatorPlanPosition.amountAwardedGross"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_PLAN_POSITION_AMOUNT_GROSS}
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
                                        {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_POSITION_INFO}
                                    </Typography>
                                </Toolbar>
                                <Grid container spacing={1} justify="center" className={classes.container}>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            name="positionAmountNet"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_POSITION_NET}
                                            isRequired={true}
                                            disabled={applicationStatus !== undefined && applicationStatus.code !== 'ZP' && true}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormSelectField
                                            name="vat"
                                            isRequired={true}
                                            label={constants.VAT}
                                            options={vats}
                                            disabled={applicationStatus !== undefined && applicationStatus.code !== 'ZP' && true}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormAmountField
                                            name="positionAmountGross"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_POSITION_GROSS}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Toolbar className={classes.toolbarTable}>
                                            <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                            <Typography variant="subtitle1" >{constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_NEXT_YEARS}</Typography>
                                        </Toolbar>
                                        <FormTableField
                                            className={classes.tableWrapper}
                                            name="subsequentYears"
                                            head={tableHeadYears}
                                            allRows={subsequentYears}
                                            checkedRows={selected}
                                            toolbar={true}
                                            addButtonProps={{
                                                disabled : ((applicationStatus !== undefined && applicationStatus.code !== 'ZP') ||(!allowAddYear || action === 'add'))  && true,
                                            }}
                                            editButtonProps={{
                                                label: constants.BUTTON_EDIT,
                                                icon: <Edit/>,
                                                variant: "edit",
                                                disabled: ((applicationStatus !== undefined && applicationStatus.code !== 'ZP') && selected.length > 0) && true
                                            }}
                                            deleteButtonProps={{
                                                disabled : (applicationStatus !== undefined && applicationStatus.code !== 'ZP') ? true
                                                    : selected.length > 0 ? false : true,
                                            }}
                                            onAdd={(event) => this.handleOpenPositionDetails(event, 'add')}
                                            onEdit={(event) => this.handleOpenPositionDetails(event, 'edit')}
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
                                {(applicationStatus !== undefined && applicationStatus.code === 'ZP') &&
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
        );
    };
};

ApplicationPlanPositionForm.propTypes = {
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApplicationPlanPositionForm);