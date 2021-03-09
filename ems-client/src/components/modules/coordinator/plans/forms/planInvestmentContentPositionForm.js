import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { InputField } from 'common/gui';
import { FormTextField, FormSelectField, FormTableField, FormAmountField } from 'common/form';
import { withStyles, Grid, Toolbar, Typography } from '@material-ui/core/';
import { Edit, Visibility, LibraryBooks } from '@material-ui/icons/';
import PlanFoundingSourcesFormContainer from 'containers/modules/coordinator/plans/forms/planFoundingSourcesFormContainer';
import {findIndexElement} from 'utils/';

const styles = theme => ({
    tableWrapper: {
        height: '100%'
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

class PlanInvestmentContentPosition extends Component {
    state = {
        head: [
            {
                id: 'type.name',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_SOURCES,
                type: 'object',
            },
            {
                id: 'sourceAmountRequestedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
                type: 'amount',
            },
            {
                id: 'sourceExpensesPlanGross',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS,
                type: 'amount',
            },
        ],
        selected: [],
        openPositionDetailsDetails: false,
        positionAction: '',
        nextValPosition: null,
        positions: [],
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleSubmitPosition = (values) => {
        switch(this.state.positionAction){
            case 'add':
                values.positionId = this.state.nextValPosition;
                values.status = {code: 'DO', name: constants.COORDINATOR_PLAN_POSITION_STATUS_ADDED};
                this.setState( prevState => {
                    const positions = [...prevState.positions];
                    const selected = [...prevState.selected];
                    let nextValPosition = {...prevState.nextValPosition};
                    let positionAction = {...prevState.positionAction};
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


    componentDidUpdate(prevProps){
        if(this.props.vat !== prevProps.vat){
            this.setState({
                positions: this.props.positionFoundingSources,
            });
        }
    }

    componentDidMount(){
        if(this.props.positionFoundingSources){
            this.setState({
                nextValPosition: this.props.positionFoundingSources.length+1,
                positions: this.props.positionFoundingSources,
            })
        }
    }

    render(){

        const {classes, initialValues, planStatus, vats, foundingSources } = this.props;
        const {head, selected, openPositionDetails, positionAction, positions } = this.state;
        return(
            <>
                {openPositionDetails &&
                    <PlanFoundingSourcesFormContainer
                        initialValues={positionAction === 'add' ? {} : selected[0]}
                        action={positionAction}
                        planStatus={planStatus}
                        positionName={initialValues.name}
                        open={openPositionDetails}
                        onSubmit={this.handleSubmitPosition}
                        onClose={this.handleCloseDetails}
                        foundingSources={foundingSources}
                        positions={positions}
                    />
                }
                <Grid item xs={12} >
                    <FormTextField
                        name="name"
                        label={constants.APPLICATION_POSITION_DETAILS_POSITION_NAME}
                        isRequired={true}
                        disabled={planStatus!=='ZP' && true}
                    />
                </Grid>
                <Grid item xs={12} >
                    <FormTextField
                        name="task"
                        label={constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK}
                        isRequired={true}
                        disabled={planStatus!=='ZP' && true}
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormAmountField
                        name="amountRequestedGross"
                        label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS}
                        disabled
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormAmountField
                        name="expensesPlanGross"
                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS}
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
                <Grid item xs={4} >
                    <InputField
                        name="status"
                        label={constants.APPLICATION_POSITION_DETAILS_STATUS}
                        disabled
                        value={ Object.keys(initialValues).length !== 0 && initialValues.status ? initialValues.status.name : ''}
                    />
                </Grid>
                <Grid item xs={6} >
                    <FormTextField
                        name="application"
                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_APPLICATION}
                        multiline
                        rows="4"
                        disabled={planStatus!=='ZP' && true}
                    />
                </Grid>
                <Grid item xs={6} >
                    <FormTextField
                        name="substantiation"
                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_SUBSTANTIATION}
                        multiline
                        rows="4"
                        disabled={planStatus!=='ZP' && true}
                    />
                </Grid>
                <Grid item xs={12} >
                    <div className={classes.section}>
                        <Toolbar className={classes.toolbar}>
                            <LibraryBooks className={classes.toolbarHeaderIcon} fontSize="small" />
                            <Typography variant="subtitle1" >
                                {constants.COORDINATOR_PLAN_POSITION_INVESTMENT_FUNDING_SOURCES}
                            </Typography>
                        </Toolbar>
                        <FormTableField
                            className={classes.tableWrapper}
                            name="foundingSources"
                            head={head}
                            allRows={positions}
                            checkedRows={selected}
                            toolbar={true}
                            addButtonProps={{
                                disabled : (planStatus === null || planStatus !== 'ZP') ? true : false
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
            </>
        );
    };
};

PlanInvestmentContentPosition.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlanInvestmentContentPosition);
