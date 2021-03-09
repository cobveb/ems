import React, { Component } from 'react';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { InputField, Button } from 'common/gui';
import {Spinner, ModalDialog } from 'common/';
import { FormDictionaryField, FormSelectField, FormAmountField, FormTableField } from 'common/form';
import { Save, Cancel, Edit, Visibility, LibraryBooks } from '@material-ui/icons/';
import { withStyles, Grid, Toolbar, Typography, Divider  } from '@material-ui/core/';
import PlanFinancialPositionsFormContainer from 'containers/modules/coordinator/plans/forms/planFinancialPositionsFormContainer';
import {findIndexElement} from 'utils/';

const styles = theme => ({
    container: {
        width: '100%',
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(57.2)}px)`,
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
                id: 'amountGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
                type: 'amount',
            },
            {
                id: 'amountCorrectedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS,
                type: 'amount',
            },
            {
                id: 'amountRealizedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS,
                type: 'amount',
            },
        ],
        selected: [],
        openPositionDetailsDetails: false,
        positionAction: '',
        nextValPosition: 0,
        positions: [],
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    calculateValuesAmount = (amountRequestedNet, amountRequestedGross, amountNet, amountGross, values, action) =>{
        let sumAmountRequestedNet = amountRequestedNet;
        let sumAmountRequestedGross = amountRequestedGross;

        if(action === 'edit' || action === 'delete'){
            sumAmountRequestedNet -= amountNet;
            sumAmountRequestedGross -= amountGross;
        }
        if(action === 'add' || action === 'edit'){
            //Create new plan position. Position not saved yet
            if(action === 'add' && sumAmountRequestedNet === undefined)
            {
                sumAmountRequestedNet = 0;
                sumAmountRequestedGross = 0;
            }
            this.props.dispatch(change('PlanFinancialContentPositionForm', 'amountRequestedNet', parseFloat((sumAmountRequestedNet + values.amountNet).toFixed(2))));
            this.props.dispatch(change('PlanFinancialContentPositionForm', 'amountRequestedGross', parseFloat((sumAmountRequestedGross + values.amountGross).toFixed(2))));
        } else if (action === 'delete'){
            this.props.dispatch(change('PlanFinancialContentPositionForm', 'amountRequestedNet', parseFloat(sumAmountRequestedNet.toFixed(2))));
            this.props.dispatch(change('PlanFinancialContentPositionForm', 'amountRequestedGross', parseFloat(sumAmountRequestedGross.toFixed(2))));
        }
    }

    handleSubmitPosition = (values) => {
        const {amountRequestedNet, amountRequestedGross } = this.props;
        switch(this.state.positionAction){
            case 'add':
                values.positionId = this.state.nextValPosition;
                values.status = {code: 'DO', name: constants.COORDINATOR_PLAN_POSITION_STATUS_ADDED};
                values.type='finp';
                this.setState( prevState => {
                    const positions = [...prevState.positions];
                    const selected = [...prevState.selected];
                    let nextValPosition = {...prevState.nextValPosition};
                    let positionAction = {...prevState.positionAction};
                    //update plan position amountRequestedNet and amountRequestedGross
                    this.calculateValuesAmount(amountRequestedNet, amountRequestedGross, null, null, values, this.state.positionAction)
                    positions.push(values);
                    nextValPosition = this.state.nextValPosition + 1;
                    positionAction = 'edit';
                    selected[0]=values;
                    return {nextValPosition, selected, positions, positionAction};
                });
                break;
            case 'edit':
                const index = findIndexElement(values, this.state.positions, "positionId");
                if (index !== null){
                    this.setState( prevState => {
                        const positions = [...prevState.positions];
                        const selected = [...prevState.selected];
                        //update plan position amountRequestedNet and amountRequestedGross
                        if(positions[index].amountNet !== values.amountNet){
                            this.calculateValuesAmount(amountRequestedNet, amountRequestedGross, positions[index].amountNet, positions[index].amountGross, values, this.state.positionAction)
                        }
                        positions.splice(index, 1, values);
                        selected.splice(0, 1, values);
                        return {positions, selected};
                    });
                }
                break;
            default:
                return null;
        }
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
        const index = findIndexElement(this.state.selected[0], this.state.positions, "positionId");
        if (index !== null){
            this.setState( prevState => {
                const positions = [...prevState.positions];
                let selected = [...prevState.selected];
                let positionAction = [...prevState.positionAction];
                //update plan position amountRequestedNet and amountRequestedGross
                this.calculateValuesAmount(this.props.amountRequestedNet, this.props.amountRequestedGross, positions[index].amountNet, positions[index].amountGross, null, this.state.positionAction)
                positions.splice(index, 1);
                selected = []
                positionAction = ''
                return {positions, selected, positionAction};
            });
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.vat !== prevProps.vat && prevProps.vat !== undefined){
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

    componentDidMount(){
        if(this.props.initialValues.subPositions !== undefined && this.props.initialValues.subPositions.length > 0){
            this.setState({
                nextValPosition: this.props.initialValues.subPositions.length+1,
                positions: this.props.initialValues.subPositions,
            })
        }
    }

    render(){
        const {handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues, onClose, action, planStatus, units, costsTypes, vat, vats} = this.props;
        const {head, selected, openPositionDetails, positionAction, positions } = this.state;

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
                    <Typography
                        variant="h6"
                    >
                        { action === "add" ?
                            constants.COORDINATOR_PLAN_POSITION_CREATE_DETAILS_TITLE
                                :  constants.COORDINATOR_PLAN_POSITION_EDIT_DETAILS_TITLE + `  ${initialValues.costType.code}  - ${initialValues.costType.name}`
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
                                        disabled={planStatus!=='ZP' && true}
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
                                <Grid item xs={5}>
                                    <FormAmountField
                                        name="amountRequestedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_NET}
                                        disabled
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
                                        name="amountRequestedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <InputField
                                        name="amountAwardedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_NET}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountAwarded ? initialValues.amountAwarded : ''}
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <InputField
                                        name="amountAwardedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountAwarded ? initialValues.amountAwarded : ''}
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <InputField
                                        name="amountRealizedNet"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_NET}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountAwarded ? initialValues.amountAwarded : ''}
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <InputField
                                        name="amountRealizedGross"
                                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS}
                                        disabled
                                        value={ Object.keys(initialValues).length !== 0 && initialValues.amountAwarded ? initialValues.amountAwarded : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <div className={classes.section}>
                                        <Toolbar className={classes.toolbar}>
                                            <LibraryBooks className={classes.toolbarHeaderIcon} fontSize="small" />
                                            <Typography variant="subtitle1" >
                                                {constants.COORDINATOR_PLAN_POSITIONS}
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
                                                disabled : (planStatus === null || planStatus !== 'ZP' || vat === undefined) ? true : false
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
                                    disabled={pristine || submitting || invalid || submitSucceeded || positions.length === 0 }
                                />
                            }
                            <Button
                                label={constants.BUTTON_CLOSE}
                                icon=<Cancel/>
                                iconAlign="left"
                                variant="cancel"
                                onClick={onClose}
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
