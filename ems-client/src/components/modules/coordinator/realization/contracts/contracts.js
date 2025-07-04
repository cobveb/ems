import React, { Component } from 'react';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Delete, Add, Edit } from '@material-ui/icons/';
import { Button, SearchField, DatePicker } from 'common/gui';
import { TablePageable } from 'containers/common/gui';
import ContractContainer from 'containers/modules/coordinator/realization/contracts/contractContainer';
import { setChangedSearchConditions } from 'utils/';

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

class Contracts extends Component {
    state = {
        selected: [],
        rows: [],
        number: '',
        contractObject: '',
        signedFrom: null,
        signedTo: null,
        action: null,
        year: new Date(),
        isDetailsVisible: false,
        searchConditionsChange: false,
        headCells: [
            {
                id: 'number',
                label: constants.COORDINATOR_REALIZATION_CONTRACTS_NUMBER,
                type: 'text',
            },
            {
                id: 'contractObject',
                label: constants.COORDINATOR_REALIZATION_CONTRACT_OBJECTS,
                type: 'text',
            },
            {
                id: 'signingDate',
                label: constants.COORDINATOR_REALIZATION_CONTRACT_SIGNED_DATE,
                type:'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'periodFrom',
                label: constants.COORDINATOR_REALIZATION_CONTRACT_PERIOD_FROM,
                type:'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'periodTo',
                label: constants.COORDINATOR_REALIZATION_CONTRACT_PERIOD_TO,
                type:'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'contractValueGross',
                label: constants.COORDINATOR_REALIZATION_CONTRACT_VALUE_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'realizedValueGross',
                label: constants.COORDINATOR_REALIZATION_CONTRACT_ORDER_REALIZED_VALUE_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        searchConditions: [
            {
                name: 'year',
                value: new Date().getFullYear(),
                type: 'number'
            },
            {
                name: 'number',
                value: '',
                type: 'text'
            },
            {
                name: 'contractObject',
                value: '',
                type: 'text'
            },
            {
                name: 'signedFrom',
                value: '',
                type: 'date'
            },
            {
                name: 'signedTo',
                value: '',
                type: 'date'
            }
        ]
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            isDetailsVisible: !this.state.isDetailsVisible,
            action: 'edit',
        });
    }

    onChangeSearchConditions = (event) => {
        event.persist();
        this.setState(prevState => {
            const searchConditions = [...prevState.searchConditions];
            let searchConditionsChange = prevState.searchConditionsChange;
            return setChangedSearchConditions(event.target.name, event.target.value, searchConditions, searchConditionsChange);
        });
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
        if(!['number', 'contractObject'].includes(event.target.name)){
            this.onChangeSearchConditions(event);
        }
    }

    handleDataChange = (id) => (date) => {
        this.setState({[id]: date})
    }

    handleDataChange = (id) => (date) => {
        this.setState(prevState => {
            let searchConditions = [...prevState.searchConditions];
            let searchConditionsChange = prevState.searchConditionsChange;
            switch(id) {
                case "signedTo":
                    let signedTo = `prevState.${id}`;
                    signedTo = date;
                    if(!isNaN(date)){
                        const signedToResult = setChangedSearchConditions(id, date instanceof Date ? date : '', searchConditions, searchConditionsChange)
                        searchConditions = Object.values(signedToResult)[0];
                        searchConditionsChange = Object.values(signedToResult)[1];
                    }
                    return {signedTo, searchConditions, searchConditionsChange};
                case "signedFrom":
                    let signedFrom = `prevState.${id}`;
                    signedFrom = date;
                    if(!isNaN(date)){
                        const signedFromResult = setChangedSearchConditions(id, date instanceof Date ? date : '', searchConditions, searchConditionsChange)
                        searchConditions = Object.values(signedFromResult)[0];
                        searchConditionsChange = Object.values(signedFromResult)[1];
                    }
                    return {signedFrom, searchConditions, searchConditionsChange};
                default:
                    let year = `prevState.${id}`;
                    if(!isNaN(date)){
                        const yearResult = setChangedSearchConditions(id, date instanceof Date ? date.getFullYear() : 0, searchConditions, searchConditionsChange)
                        year = date;
                        searchConditions = Object.values(yearResult)[0];
                        searchConditionsChange = Object.values(yearResult)[1];
                    }
                    return {year, searchConditions, searchConditionsChange};
            }
        });
    }

    handleBlur = (event) => {
        this.onChangeSearchConditions(event);
    }

    handleKeyDown = (event) => {
       if (event.key === "Enter") {
          this.onChangeSearchConditions(event);
       }
    }

    handleCloseDialogError = () => {
        this.props.clearError(null);
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState({isDetailsVisible: !this.state.isDetailsVisible, action: action});
    }

    handleCloseDetails = (isUpdate) => {
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
            selected: [],
            action: null,
        });
        if(isUpdate){
            this.props.onClose(isUpdate)
        }
    };

    handleDelete = (event, action) => {
        this.setState({action: action});
    }

    handleConfirmDelete = () => {
        this.props.onDelete(this.state.selected.id);
        this.setState({action: null, selected: []});
    }

    handleCloseDialog = () => {
        this.setState({action: null, selected: []});
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headCells);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues,
            });
        }
        if(this.state.searchConditionsChange){
            this.setState({
                searchConditionsChange: false,
                selected: {},
                action: ''
            })
            this.props.onSetSearchConditions(this.state.searchConditions);
        }
    }

    componentDidMount() {
        this.props.onSetSearchConditions(this.state.searchConditions);
        this.setState({rows: this.props.initialValues});
    }

    render(){
        const { classes, isLoading, error } = this.props;
        const { headCells, rows, selected, signedFrom, signedTo, isDetailsVisible, action, number, contractObject, year, searchConditionsChange } = this.state;
        return (
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialogError} variant="error"/>}
                {action === 'delete' &&
                    <ModalDialog
                        message={constants.COORDINATOR_REALIZATION_CONTRACT_DELETE_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                { isDetailsVisible ?
                    <ContractContainer
                        initialValues={action === 'add' ? {signingPlace: "Katowice"} : selected}
                        action={action}
                        contracts={this.props.initialValues}
                        onClose={this.handleCloseDetails}
                    />
                :
                    <>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                            className={classes.root}
                        >
                            <Typography variant="h6">{constants.COORDINATOR_REALIZATION_CONTRACTS_TITLE}</Typography>
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
                                    <Grid item xs={2} className={classes.item}>
                                        <SearchField
                                            name="number"
                                            onChange={this.handleSearch}
                                            onBlur={this.handleBlur}
                                            onKeyDown={(e) => this.handleKeyDown(e)}
                                            label={constants.COORDINATOR_REALIZATION_CONTRACTS_NUMBER}
                                            valueType="all"
                                            value={number}
                                        />
                                    </Grid>
                                    <Grid item xs={4} className={classes.item}>
                                        <SearchField
                                            name="contractObject"
                                            onChange={this.handleSearch}
                                            onBlur={this.handleBlur}
                                            onKeyDown={(e) => this.handleKeyDown(e)}
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_OBJECTS}
                                            valueType="all"
                                            value={contractObject}
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.item}>
                                        <DatePicker
                                            id="signedFrom"
                                            onChange={this.handleDataChange('signedFrom')}
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_SIGNED_FROM}
                                            value={signedFrom}
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.item}>
                                        <DatePicker
                                            id="signedTo"
                                            onChange={this.handleDataChange('signedTo')}
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_SIGNED_TO}
                                            value={signedTo}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={0} direction="row" justify="flex-start" className={classes.container}>
                                    <TablePageable
                                        className={classes.tableWrapper}
                                        rows={rows}
                                        headCells={headCells}
                                        onSelect={this.handleSelect}
                                        onDoubleClick={this.handleDoubleClick}
                                        onExcelExport={this.handleExcelExport}
                                        resetPageableProperties={searchConditionsChange}
                                        rowKey="id"
                                        orderBy={this.props.searchConditions.sort.orderBy !== undefined ? {id: this.props.searchConditions.sort.orderBy} : headCells[2]}
                                        orderType={this.props.searchConditions.sort.orderType !== undefined ? this.props.searchConditions.sort.orderType : "desc"}
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
                            <Button
                                label={constants.BUTTON_ADD}
                                icon=<Add/>
                                iconAlign="right"
                                variant="add"
                                onClick = { (event) => this.handleChangeVisibleDetails(event, 'add', )}
                            />
                            <Button
                                label={constants.BUTTON_EDIT}
                                icon=<Edit/>
                                iconAlign="right"
                                disabled={Object.keys(selected).length === 0}
                                variant="edit"
                                onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
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
                    </>
                }
            </>
        );
    }
};

Contracts.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
    loading: PropTypes.func,
};

export default withStyles(styles)(Contracts);