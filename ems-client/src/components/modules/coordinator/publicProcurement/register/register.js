import React, { Component } from 'react';
import * as constants from 'constants/uiNames';
import { Spinner } from 'common/';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Table, Button, SelectField, DatePicker } from 'common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import RegisterPositionFormContainer from 'containers/modules/coordinator/publicProcurement/register/forms/registerPositionFormContainer';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        height: `calc(100vh - ${theme.spacing(18)}px)`,
        overflow: 'auto',
        padding: 0,
        maxWidth: '100%',
    },
    container: {
        width: '100%',
        padding: 0,
        margin: 0,
    },
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
    item: {
        paddingRight: theme.spacing(1),
    },
});

class Register extends Component {
    state = {
        isDetailsVisible: false,
        year: null,
        rows: [],
        headCells: [
            {
                id: 'orderedObject',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT,
                type: 'text',
            },
            {
                id: 'assortmentGroup',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP,
                type: 'text',
            },
            {
                id: 'orderingMode',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE,
                type: 'text',
            },
            {
                id: 'orderValue',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET,
                type: 'amount',
            },
            {
                id: 'startDate',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_REGISTER_TABLE_HEAD_ROW_START_DATE,
                type: 'number',
            },
            {
                id: 'endDate',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_REGISTER_TABLE_HEAD_ROW_END_DATE,
                type: 'number',
            },
        ],
        selected:[],
        estimationType: '',
        planPosition: '',
        action: null,
    };

    handleDataChange = (id) => (date) => {
        this.setState({[id]: date})
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState({isDetailsVisible: !this.state.isDetailsVisible, action: action});
    }

    handleCloseDetails = () => {
        this.setState({isDetailsVisible: !this.state.isDetailsVisible, selected: []});
    };

    render(){
        const { classes, isLoading, estimationTypes, planPositions } = this.props;
        const { isDetailsVisible, year, rows, headCells, selected, estimationType, planPosition, action } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                <div>
                    { isDetailsVisible &&
                        <RegisterPositionFormContainer
                            initialValues={action === 'add' ? {} : selected[0]}
                            action={action}
                            estimationTypes={estimationTypes}
                            planPositions={planPositions}
                            open={isDetailsVisible}
                            onClose={this.handleCloseDetails}
                        />
                    }
                    <Grid
                        container
                        direction="column"
                        spacing={0}
                        className={classes.root}
                    >
                        <Typography variant="h6">{constants.COORDINATOR_PUBLIC_PROCUREMENT_REGISTER_TITLE}</Typography>
                        <Divider />
                        <div className={classes.content}>
                            <Grid container spacing={0} direction="row" justify="center" className={classes.container}>
                                <Grid item xs={2} className={classes.item}>
                                    <DatePicker
                                        id="year"
                                        onChange={this.handleDataChange('year')}
                                        label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR}
                                        placeholder={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR}
                                        value={year}
                                        format="yyyy"
                                        mask="____"
                                        views={["year"]}
                                    />
                                </Grid>
                                <Grid item xs={4} className={classes.item}>
                                    <SelectField
                                        name="estimationTypes"
                                        onChange={this.handleSearch}
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE}
                                        options={estimationTypes}
                                        value={estimationType}
                                    />
                                </Grid>
                                <Grid item xs={6} className={classes.item}>
                                    <SelectField
                                        name="planPosition"
                                        onChange={this.handleSearch}
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                        options={planPositions}
                                        value={planPosition}
                                    />
                                </Grid>
                                <Grid container spacing={0} direction="row" justify="flex-start" className={classes.container}>
                                    <Table
                                        className={classes.tableWrapper}
                                        rows={rows}
                                        headCells={headCells}
                                        onSelect={this.handleSelect}
                                        rowKey="id"
                                        defaultOrderBy="year"
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="flex-start"
                        className={classes.container}
                    >
                        <Grid item xs={12}>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                            >
                                <Button
                                    label={constants.BUTTON_ADD}
                                    icon=<Add/>
                                    iconAlign="right"
                                    variant="add"
                                    onClick = { (event) => this.handleChangeVisibleDetails(event, 'add', )}
                                    data-action="add"
                                />
                                <Button
                                    label={constants.BUTTON_EDIT}
                                    icon=<Edit/>
                                    iconAlign="right"
                                    disabled={Object.keys(selected).length === 0}
                                    variant="edit"
                                    onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                    data-action="edit"
                                />
                                <Button
                                    label={constants.BUTTON_DELETE}
                                    icon=<Delete/>
                                    iconAlign="right"
                                    disabled={ Object.keys(selected).length === 0 }
                                    onClick = {(event) => this.handleDelete(event, 'delete', )}
                                    variant="delete"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </>
        );
    };
};

Register.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
    loading: PropTypes.func,
};

export default withStyles(styles)(Register);