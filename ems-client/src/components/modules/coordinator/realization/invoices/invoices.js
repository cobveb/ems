import React, { Component } from 'react';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Delete, Add, Edit } from '@material-ui/icons/';
import { Button, Table, SearchField, DatePicker } from 'common/gui';
import InvoiceContainer from 'containers/modules/coordinator/realization/invoices/invoiceContainer';

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
        isDetailsVisible: false,
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
    };

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleDataChange = (id) => (date) => {
        this.setState({[id]: date})
    }

    filter = () => {
        let invoices = this.props.initialValues;

        return invoices.filter((invoice) => {
            return this.state.number !== '' ?
                invoice.number !== null ?
                    invoice.number.toLowerCase().search(
                        this.state.number.toLowerCase()) !== -1
                : null
            : invoice
            && (
                (this.state.saleFrom !== null && this.state.saleTo !== null) ?
                    new Date(invoice.sellDate) >= this.state.saleFrom && new Date(invoice.sellDate) <= this.state.saleTo :
                     this.state.saleFrom !== null ?
                        new Date(invoice.sellDate) >= this.state.saleFrom :
                            this.state.saleFrom === null && this.state.saleTo === null ?
                                invoice :
                                    new Date(invoice.sellDate) <= this.state.saleTo
            )
        })
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

    handleDataChange = (id) => (date) => {
        this.setState({[id]: new Date(date.setHours(0,0,0,0))})
    }

    handleCloseDialogError = () => {
        this.props.clearError(null);
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState({isDetailsVisible: !this.state.isDetailsVisible, action: action});
    }

    handleCloseDetails = (invoice) => {
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
            selected: {},
            action: null,
            rows: this.props.onClose(invoice),
        });
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
            this.state.saleFrom !== prevState.saleFrom ||
            this.state.saleTo !== prevState.saleTo
        ){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const { classes, isLoading, error } = this.props;
        const { headCells, rows, saleFrom, saleTo, selected, isDetailsVisible, action } = this.state;
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
                        applications={this.props.applications}
                        contracts={this.props.contracts}
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
                                    <Grid item xs={4} className={classes.item}>
                                        <SearchField
                                            name="number"
                                            onChange={this.handleSearch}
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_NUMBER}
                                            valueType="all"
                                        />
                                    </Grid>
                                    <Grid item xs={4} className={classes.item}>
                                        <DatePicker
                                            id="saleFrom"
                                            onChange={this.handleDataChange('saleFrom')}
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_SALE_FROM}
                                            value={saleFrom}
                                        />
                                    </Grid>
                                    <Grid item xs={4} className={classes.item}>
                                        <DatePicker
                                            id="saleTo"
                                            onChange={this.handleDataChange('saleTo')}
                                            label={constants.COORDINATOR_REALIZATION_INVOICE_SALE_TO}
                                            value={saleTo}
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

export default withStyles(styles)(Invoices);