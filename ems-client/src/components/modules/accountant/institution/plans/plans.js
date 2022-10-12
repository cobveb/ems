import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography} from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import { Table, Button, DatePicker, SelectField } from 'common/gui';
import { Visibility } from '@material-ui/icons/';
import PlanContainer from 'containers/modules/accountant/institution/plans/planContainer';
import PlanPzpContainer from 'containers/modules/publicProcurement/institution/plans/planContainer';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
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
})

class Plans extends Component {
    state = {
        headCells: [
            {
                id: 'year',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR,
                type:'date',
                dateFormat: 'yyyy',
            },
            {
                id: 'type.name',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_TYPE,
                type:'object',
            },
            {
                id: 'amountRequestedGross',
                label: constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REQUESTED_GROSS,
                suffix: 'zł.',
                type:'amount',
            },
            {
                id: 'amountAwardedGross',
                label: constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_AWARDED_GROSS,
                suffix: 'zł.',
                type:'amount',
            },
            {
                id: 'amountRealizedGross',
                label: constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REALIZED_GROSS,
                suffix: 'zł.',
                type:'amount',
            },
            {
                id: 'isCorrected',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_UPDATE,
                type: 'boolean',
            },
            {
                id: 'updateNumber',
                label: constants.PUBLIC_COORDINATOR_PLANS_TABLE_HEAD_ROW_UPDATE_NUMBER,
                type:'number',
            },
            {
                id: 'status.name',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_STATUS,
                type: 'object',
            },
        ],
        rows: [],
        year: null,
        type:'',
        selected: {},
        isDetailsVisible: false,
    }

    handleDataChange = (id) => (date) => {
        this.setState({[id]: date})
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleChangeVisibleDetails = () =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible}));
    }

    handleClose = (plan) =>{
        this.setState({
            selected: {},
            isDetailsVisible: !this.state.isDetailsVisible,
            rows: this.props.onClose(plan),
        });
    }

    filter = () => {
        let plans = this.props.initialValues;

        return plans.filter((plan) => {
            return plan.type.code.toLowerCase().search(
                this.state.type.toLowerCase()) !== -1 &&
                (
                this.state.year === null ?
                    plan :
                        plan.year === this.state.year.getFullYear()
                )
        })
    }

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            isDetailsVisible: !this.state.isDetailsVisible,
        });
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headCells)
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.filter(),
            });
        } else if (this.state.year !== prevState.year ||
            this.state.type !== prevState.type
        ){
            this.setState({
              rows: this.filter(),
            })
        }
        if(this.props.levelAccess === 'director'){
            // Filter rows on close application
            if(Object.keys(this.state.selected).length === 0 && this.state.selected !== prevState.selected){
                this.setState({
                    rows: this.filter(),
                });
            }
        }
    }

    render(){
        const { classes, isLoading, error, types, statuses, levelAccess } = this.props;
        const { headCells, rows, year, selected, isDetailsVisible, type } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                { isDetailsVisible ?
                    selected.type.code === 'FIN' ?
                        <PlanContainer
                            initialValues={selected}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            types={types}
                            statuses={statuses}
                            levelAccess={levelAccess}
                            onClose={this.handleClose}
                        />
                    :
                        <PlanPzpContainer
                            initialValues={selected}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            types={types}
                            statuses={statuses}
                            levelAccess={levelAccess}
                            onClose={this.handleClose}
                        />
                :
                    <>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                        >
                            <Typography variant="h6">{constants.ACCOUNTANT_INSTITUTION_PLANS_TITLE}</Typography>
                            <div className={classes.content}>
                                <Grid container spacing={0} direction="row" justify="center" className={classes.container}>
                                    <Grid item xs={levelAccess === 'director' ? 6 : 12} className={classes.item}>
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
                                    { levelAccess === 'director' &&
                                        <Grid item xs={6} className={classes.item}>
                                            <SelectField
                                                name="type"
                                                onChange={this.handleSearch}
                                                label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_TYPE}
                                                options={types}
                                                value={type}
                                            />
                                        </Grid>
                                    }
                                    <Grid container spacing={0} direction="row" justify="flex-start" className={classes.container}>
                                        <Table
                                            className={classes.tableWrapper}
                                            rows={rows}
                                            headCells={headCells}
                                            onSelect={this.handleSelect}
                                            onDoubleClick={this.handleDoubleClick}
                                            onExcelExport={this.handleExcelExport}
                                            rowKey='id'
                                            defaultOrderBy="id"
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
                            <Grid item xs={11}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                >
                                    <Button
                                        label={constants.BUTTON_PREVIEW}
                                        icon={<Visibility/>}
                                        iconAlign="right"
                                        disabled={Object.keys(selected).length === 0}
                                        variant={"cancel"}
                                        onClick={this.handleChangeVisibleDetails}
                                        data-action="edit"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                }
            </>
        );
    };
};

Plans.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
    loading: PropTypes.func,
};

export default withStyles(styles)(Plans);