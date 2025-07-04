import React, { Component } from 'react';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Delete, Add, Edit } from '@material-ui/icons/';
import { Button, SearchField, DatePicker } from 'common/gui';
import { TablePageable } from 'containers/common/gui';
import InvoiceContainer from 'containers/modules/coordinator/realization/invoices/invoiceContainer';
import {escapeSpecialCharacters, setChangedSearchConditions} from 'utils/';

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

class Invoices extends Component {

    state = {
        selected: {},
        rows: [],
        number: '',
        saleFrom: null,
        saleTo: null,
        action: null,
        year: new Date(),
        isDetailsVisible: false,
        searchConditionsChange: false,
        headCells: [
            {
                id: 'number',
                label: constants.COORDINATOR_REALIZATION_INVOICE_NUMBER,
                type: 'text',
            },
            {
                id: 'sellDate',
                label: constants.COORDINATOR_REALIZATION_INVOICE_SALE_DATE,
                type:'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'invoiceValueGross',
                label: constants.COORDINATOR_REALIZATION_INVOICE_VALUE_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'contractor.name',
                label: constants.COORDINATOR_REALIZATION_INVOICE_CONTRACTOR,
                type: 'object',
                subtype: 'text'
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
                name: 'saleFrom',
                value: '',
                type: 'date'
            },
            {
                name: 'saleTo',
                value: '',
                type: 'date'
            }
        ]
    };

    handleSearch = (event) => {
        this.setState({[event.target.name]: escapeSpecialCharacters(event.target.value)})
    }

    handleDataChange = (id) => (date) => {
        this.setState({[id]: date})
    }

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

    handleDataChange = (id) => (date) => {
        this.setState(prevState => {
            let searchConditions = [...prevState.searchConditions];
            let searchConditionsChange = prevState.searchConditionsChange;
            switch(id) {
                case "saleTo":
                    let saleTo = `prevState.${id}`;
                    saleTo = date;
                    if(!isNaN(date)){
                        const saleToResult = setChangedSearchConditions(id, date instanceof Date ? date : '', searchConditions, searchConditionsChange)
                        searchConditions = Object.values(saleToResult)[0];
                        searchConditionsChange = Object.values(saleToResult)[1];
                    }
                    return {saleTo, searchConditions, searchConditionsChange};
                case "saleFrom":
                    let saleFrom = `prevState.${id}`;
                    saleFrom = date;
                    if(!isNaN(date)){
                        const saleFromResult = setChangedSearchConditions(id, date instanceof Date ? date : '', searchConditions, searchConditionsChange)
                        searchConditions = Object.values(saleFromResult)[0];
                        searchConditionsChange = Object.values(saleFromResult)[1];
                    }
                    return {saleFrom, searchConditions, searchConditionsChange};
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
            selected: {},
            action: null,
        });
        if(isUpdate){
            this.props.onClose(isUpdate);
        }
    };

    handleDelete = (event, action) => {
        this.setState({action: action});
    }

    handleConfirmDelete = () => {
        this.props.onDelete(this.state.selected.id);
    }

    handleCloseDialog = () => {
        this.setState({action: null});
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headCells)
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
        const { headCells, rows, saleFrom, saleTo, selected, isDetailsVisible, action, year, searchConditionsChange, number } = this.state;
        return (
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialogError} variant="error"/>}
                {action === 'delete' &&
                    <ModalDialog
                        message={constants.COORDINATOR_REALIZATION_INVOICE_DELETE_MSG}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                { isDetailsVisible ?
                    <InvoiceContainer
                        initialValues={action === 'add' ? {} : selected}
                        action={action}
                        financialPlanPositions={this.props.financialPlanPositions}
                        investmentPlanPositions={this.props.investmentPlanPositions}
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
                            <Typography variant="h6">{constants.COORDINATOR_REALIZATION_INVOICES_TITLE}</Typography>
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
                                        <SearchField
                                            name="number"
                                            onChange={this.handleSearch}
                                            onBlur={this.handleBlur}
                                            onKeyDown={(e) => this.handleKeyDown(e)}
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_NUMBER}
                                            valueType="all"
                                            value={number}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <DatePicker
                                            id="saleFrom"
                                            onChange={this.handleDataChange('saleFrom')}
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_SALE_FROM}
                                            value={saleFrom}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <DatePicker
                                            id="saleTo"
                                            onChange={this.handleDataChange('saleTo')}
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_SALE_TO}
                                            value={saleTo}
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
                                        orderBy={this.props.searchConditions.sort.orderBy !== undefined ? {id: this.props.searchConditions.sort.orderBy} : headCells[1]}
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
                    </>
                }
            </>
        );
    }
};

Invoices.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
    loading: PropTypes.func,
};

Invoices.defaultProps = {
    onSetSearchConditions: () => {},
};

export default withStyles(styles)(Invoices);