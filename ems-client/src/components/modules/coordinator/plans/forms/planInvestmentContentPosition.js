import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { InputField } from 'common/gui';
import { FormTextField, FormSelectField, FormTableField } from 'common/form';
import { withStyles, Grid, Toolbar, Typography } from '@material-ui/core/';
import { Edit, Visibility, LibraryBooks } from '@material-ui/icons/';
import PlanFoundingSourcesFormContainer from 'containers/modules/coordinator/plans/forms/planFoundingSourcesFormContainer';

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
                id: 'foundingSource.name',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_SOURCES,
                type: 'object',
            },
            {
                id: 'amountRequestedNet',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_NET,
                type: 'amount',
            },
            {
                id: 'expensesPlanNet',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_NET,
                type: 'amount',
            },
        ],
        selected: [],
        openPositionDetailsDetails: false,
        positionAction: '',
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    };

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: []});
    };

    render(){
        const {classes, initialValues, planStatus, vats, categories, foundingSources} = this.props;
        const {head, selected, openPositionDetails, positionAction } = this.state;
        return(
            <>
                {openPositionDetails &&
                    <PlanFoundingSourcesFormContainer
                        initialValues={positionAction === 'add' ? {} : selected[0]}
                        action={positionAction}
                        planStatus={planStatus}
                        positionInfo={initialValues}
                        vats={vats}
                        foundingSources={foundingSources}
                        open={openPositionDetails}
                        onClose={this.handleCloseDetails}
                    />
                }
                <Grid item xs={12} >
                    <FormTextField
                        name="task"
                        label={constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK}
                        isRequired={true}
                    />
                </Grid>
                <Grid item xs={8}>
                    <FormSelectField
                        name="category"
                        label={constants.COORDINATOR_PLAN_POSITION_INVESTMENT_CATEGORY}
                        isRequired={true}
                        value={initialValues.type !== undefined ? initialValues.type : ""}
                        options={categories}
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
                            allRows={initialValues.foundingSources}
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
