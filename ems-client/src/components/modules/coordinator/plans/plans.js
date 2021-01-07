import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Table, Button, SearchField, SelectField, DatePicker } from 'common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import PlanContainer from 'containers/modules/coordinator/plans/planContainer';
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
        rows: [],
        headCells: [
            {
                id: 'number',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_NUMBER,
                type:'text',
            },
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
                id: 'status.name',
                label: constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_STATUS,
                type: 'object',
            },
        ],
        selected: {},
        isDetailsVisible: false,
        action: null,
        number: '',
        type:'',
        status: '',
        year: null,
    }

    handleClose = (plan) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: {},
            action: '',
            rows: this.props.onClose(plan),
        }));
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleDataChange = (id) => (date) => {
        this.setState({[id]: date})
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    filter = () => {
        let plans = this.props.initialValues;
        return plans;
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.filter(),
            });
        }
    }
    render(){
        const { classes, isLoading, error, loading, clearError, statuses, types, costsTypes, foundingSources, categories } = this.props;
        const { headCells, rows, selected, isDetailsVisible, action, year, type, status } = this.state;

        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <div>
                    { isDetailsVisible ?
                        <PlanContainer
                            initialValues={action === "add" ? {} : selected}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            action={action}
                            changeAction={this.handleChangeAction}
                            handleClose={this.handleClose}
                            types={types}
                            costsTypes={costsTypes}
                            foundingSources={foundingSources}
                            categories={categories}
                            //TODO: Sprawdzić czy zadziała w dzieciach bez ponownego podłączenia do Redux
                            error={error}
                            clearError={clearError}
                            isLoading={isLoading}
                            loading={loading}
                        />
                    :
                        <>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                            >
                                <Typography variant="h6">{constants.COORDINATOR_PLANS_TITLE}</Typography>
                                <Divider />
                                <div className={classes.content}>
                                    <Grid container spacing={0} direction="row" justify="center" className={classes.container}>
                                        <Grid item xs={3} className={classes.item}>
                                            <SearchField
                                                name="number"
                                                onChange={this.handleSearch}
                                                label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_NUMBER}
                                                placeholder={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_NUMBER}
                                                valueType="all"
                                            />
                                        </Grid>
                                        <Grid item xs={3} className={classes.item}>
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
                                        <Grid item xs={3} className={classes.item}>
                                            <SelectField
                                                name="type"
                                                onChange={this.handleSearch}
                                                label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_TYPE}
                                                options={types}
                                                value={type}
                                            />
                                        </Grid>
                                        <Grid item xs={3} >
                                            <SelectField
                                                name="status"
                                                onChange={this.handleSearch}
                                                label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_STATUS}
                                                options={statuses}
                                                value={status}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={0} direction="row" justify="flex-start" className={classes.container}>
                                        <Table
                                            className={classes.tableWrapper}
                                            rows={rows}
                                            headCells={headCells}
                                            onSelect={this.handleSelect}
                                            rowKey="id"
                                            defaultOrderBy="number"
                                        />
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
                        </>
                    }
                </div>
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