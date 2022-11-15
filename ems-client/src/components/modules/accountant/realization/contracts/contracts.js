import React, { Component } from 'react';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Visibility, } from '@material-ui/icons/';
import { Button, Table, SearchField, DatePicker, SelectField } from 'common/gui';
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
        minHeight: `calc(100vh - ${theme.spacing(38)}px)`,
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
        isDetailsVisible: false,
        year: new Date(),
        coordinator:'',
        headCells: [
            {
                id: 'number',
                label: constants.COORDINATOR_REALIZATION_CONTRACTS_NUMBER,
                type: 'text',
            },
            {
                id: 'coordinator.name',
                label: constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_COORDINATOR,
                type:'object',
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

    handleSearch = (event) => {
        this.setState({[event.target.name]: escapeSpecialCharacters(event.target.value)})
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

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            isDetailsVisible: !this.state.isDetailsVisible,
            action: 'edit',
        });
    }

    handleCloseDetails = (contract) => {
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
            selected: [],
            action: null,
            rows: this.props.onClose(contract),
        });
    };

    filter = () => {
        let contracts = this.props.initialValues;
        return contracts.filter((contract) => {
            return this.state.number !== '' ?
                contract.number !== null ?
                    contract.number.toLowerCase().search(
                        this.state.number.toLowerCase()) !== -1
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
            ) &&
            contract.coordinator.code.toLowerCase().search(
                this.state.coordinator.toLowerCase()) !== -1
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
            this.state.signedTo !== prevState.signedTo ||
            this.state.coordinator !== prevState.coordinator
        ){
            this.setState({
                rows: this.filter(),
            })
        } else if (this.state.year !== prevState.year){
            this.props.onChangeYear(this.state.year);
        }
    }

    render(){
        const { classes, isLoading, error, coordinators } = this.props;
        const { headCells, rows, selected, year, signedFrom, signedTo, isDetailsVisible, action, coordinator } = this.state;
        return (
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialogError} variant="error"/>}
                { isDetailsVisible ?
                    <ContractContainer
                        initialValues={selected}
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
                                        />
                                    </Grid>
                                    <Grid item xs={4} className={classes.item}>
                                        <SelectField
                                            name="coordinator"
                                            onChange={this.handleSearch}
                                            label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_COORDINATOR}
                                            options={coordinators}
                                            value={coordinator}
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
                                    <Grid item xs={12} className={classes.item}>
                                        <SearchField
                                            name="contractObject"
                                            onChange={this.handleSearch}
                                            label={constants.COORDINATOR_REALIZATION_CONTRACT_OBJECTS}
                                            valueType="all"
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
                                label={constants.BUTTON_PREVIEW}
                                icon=<Visibility/>
                                iconAlign="right"
                                variant="cancel"
                                disabled={Object.keys(selected).length === 0}
                                onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                            />
                        </Grid>
                    </>
                }
            </>
        );
    };
}

Contracts.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
    loading: PropTypes.func,
};

export default withStyles(styles)(Contracts);