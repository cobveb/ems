import React, { Component } from 'react';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Delete, Add, Edit } from '@material-ui/icons/';
import { Button, Table, SearchField, DatePicker } from 'common/gui';
import ContractContainer from 'containers/modules/coordinator/realization/contracts/contractContainer';
import {escapeSpecialCharacters} from 'utils/';

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
        headCells: [
            {
                id: 'number',
                label: constants.COORDINATOR_REALIZATION_CONTRACTS_NUMBER,
                type: 'text',
            },
            {
                id: 'contractObject.content',
                label: constants.COORDINATOR_REALIZATION_CONTRACT_OBJECTS,
                type: 'object',
            },
            {
                id: 'signingDate',
                label: constants.COORDINATOR_REALIZATION_CONTRACT_SIGNED_DATE,
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

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleDataChange = (id) => (date) => {
        this.setState({[id]: date})
    }

    handleCloseDialogError = () => {
        this.props.clearError(null);
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState({isDetailsVisible: !this.state.isDetailsVisible, action: action});
    }

    handleCloseDetails = (contract) => {
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
            selected: [],
            action: null,
            rows: this.props.onClose(contract),
        });
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

    filter = () => {
        let contracts = this.props.initialValues;
        return contracts.filter((contract) => {
            return this.state.number !== '' ?
                contract.number !== null ?
                    contract.number.toLowerCase().search(
                        escapeSpecialCharacters(this.state.number.toLowerCase())) !== -1
                : null
            : contract
            && (
                (this.state.signedFrom !== null && this.state.signedTo !== null) ?
                    new Date(contract.signingDate) >= this.state.signedFrom && new Date(contract.signingDate) <= this.state.signedTo :
                     this.state.signedFrom !== null ?
                        new Date(contract.signingDate) >= this.state.signedFrom :
                            this.state.signedFrom === null && this.state.signedTo === null ?
                                contract :
                                    new Date(contract.signingDate) <= this.state.signedTo
            )
            && (
                this.state.contractObject !== '' ?
                contract.contractObject.content !== null ?
                    contract.contractObject.content.toLowerCase().search(
                        this.state.contractObject.toLowerCase()) !== -1
                : null
            : contract
            )
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.filter(),
            });
        } else if(this.state.action !== prevState.action){
            this.setState({
                rows: this.filter(),
            })
        } else if (this.state.number !== prevState.number ||
            this.state.contractObject !== prevState.contractObject ||
            this.state.signedFrom !== prevState.signedFrom ||
            this.state.signedTo !== prevState.signedTo
        ){
            this.setState({
                rows: this.filter(),
            })
        } else if (this.state.year !== prevState.year){
            this.props.onChangeYear(this.state.year);
        }
    }

    render(){
        const { classes, isLoading, error } = this.props;
        const { headCells, rows, selected, signedFrom, signedTo, isDetailsVisible, action, number, contractObject, year } = this.state;
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
                        financialPlanPositions={this.props.financialPlanPositions}
                        investmentPlanPositions={this.props.investmentPlanPositions}
                        contracts={this.props.initialValues}
                        applications={this.props.applications}
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
                                            label={constants.COORDINATOR_REALIZATION_CONTRACTS_NUMBER}
                                            valueType="all"
                                            value={number}
                                        />
                                    </Grid>
                                    <Grid item xs={4} className={classes.item}>
                                        <SearchField
                                            name="contractObject"
                                            onChange={this.handleSearch}
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
                                    <Table
                                        className={classes.tableWrapper}
                                        rows={rows}
                                        headCells={headCells}
                                        onSelect={this.handleSelect}
                                        onDoubleClick={this.handleDoubleClick}
                                        rowKey="id"
                                        defaultOrderBy="id"
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