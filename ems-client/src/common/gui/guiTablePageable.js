import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, TableFooter, TablePagination, Menu, MenuItem, ListItemIcon, ListItemText, IconButton } from '@material-ui/core/';
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight, GetApp } from '@material-ui/icons/';
import { grey } from '@material-ui/core/colors/';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import format from "date-fns/format";
import { pl } from 'date-fns/locale'
import { numberWithSpaces } from 'utils/';
import { Checkbox } from 'common/gui';
import * as constants from 'constants/uiNames';

const tablePagination = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {

    const classes = tablePagination();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange, firstPage, lastPage } = props;

    function handleFirstPageButtonClick(event) {
        onPageChange(event, 0);
    }

    function handleBackButtonClick(event) {
        onPageChange(event, page - 1);
    }

    function handleNextButtonClick(event) {
        onPageChange(event, page + 1);
    }

    function handleLastPageButtonClick(event) {
        onPageChange(event, Math.max(1, Math.ceil(count / rowsPerPage) - 1));
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={firstPage}
                aria-label="First Page"
            >
                {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={firstPage}
                aria-label="Previous Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            {constants.TABLE_PAGINATION_PAGE} {page +1}
            <IconButton
                onClick={handleNextButtonClick}
                disabled={lastPage}
                aria-label="Next Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={lastPage}
                aria-label="Last Page"
            >
                {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const styles = theme => ({
    content:{
        flexGrow: 1,
        width: '100%',
        maxWidth: '100%',
        padding: `${theme.spacing(1)}px ${theme.spacing(0.1)}px 0 ${theme.spacing(0.1)}px`,

    },
    paper:{
        overflowX: "auto",
    },
    //TODO: Długość tabeli
//    table:{
//        width: 2000,
//    },
    tableBody: {
        height: `calc(100vh - ${theme.spacing(43)}px)`,
        overflow: 'auto',
    },
    icon: {
        marginLeft: theme.spacing(1),
    },
    spacer: {
        flex: '0 1 40%',
    },
    colCode: {
        minWidth: theme.spacing(30),
        width:theme.spacing(30),
        maxWidth: theme.spacing(30)
    },
    tableFooter: {
        backgroundColor: grey[50],
    },
    tableCell:{
        padding: `${theme.spacing(1.25)}px ${theme.spacing(2)}px`,
    },
    headCell: {
        position: "sticky",
        top: 0,
        zIndex: 10,
    }
})

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: grey[200],
    },
}))(TableCell);


class TablePageable extends Component {

    state = {
        selected: {},
        orderType: 'asc',
        orderBy: {},
        cellType: 'text',
        initialContextState:{
            mouseX: null,
            mouseY: null,
            open: false,
        },
        searchConditions:[],
    };

    handleContextClick = (event) =>{
        const { clientX, clientY } = event;

        event.preventDefault();
        this.setState(prevState =>{
            const initialContextState = {...prevState.initialContextState};
            initialContextState.open = !initialContextState.open;
            initialContextState.mouseX = clientX - 2;
            initialContextState.mouseY = clientY - 4;
            return {initialContextState};
        });
    }

    handleContextClose = (event, exportType) =>{
        this.setState(prevState =>{
            const initialContextState = {...prevState.initialContextState};
            initialContextState.mouseX = null;
            initialContextState.mouseY = null;
            initialContextState.open = false;
            return {initialContextState};
        });
        if(exportType !== undefined){
            this.props.onExcelExport(exportType);
        }
    }

    handleRequestSort = property => event => {
        const order = this.state.orderType === 'desc' ? 'asc' : 'desc';
        this.setState({
            orderBy: property,
            orderType : order,
        })
        this.props.onSetSort({"orderBy": property.id, "orderType": order});
    }

    handleChangePage = (event, newPage) => {
        this.props.onSetPage(newPage);
    }


    labelPaginationTableRow = ( {from, to, count }) => {
        return(`${from}-${to} z ${count}`)
    }

    handleClick = (event, row) => {
        if(this.state.selected !== row[this.props.rowKey]){
            this.setState({selected: row[this.props.rowKey]});
            this.props.onSelect(row);
        } else {
            this.setState({selected: {}});
            this.props.onSelect({});
        }
    }

    handleDoubleClick = (event, row) =>{
        this.props.onDoubleClick(row);
    }

    componentDidUpdate (prevProps) {
        if (this.props.resetPageableProperties){
            this.props.onSetPage(0);
            this.setState({selected: {}});
        }
    }

    componentDidMount(prevProps){
        this.setState({
            rows: this.props.rows,
            orderBy: this.props.orderBy,
            orderType: this.props.orderType,
        });

        if(this.props.orderBy.id !== this.props.cond.sort.orderBy){
            this.props.onSetSort({"orderBy": this.props.orderBy.id, "orderType": this.props.orderType});
        }
    }

    render(){
        const { classes, rows, headCells, rowKey, pageableTableProperties, page, rowsPerPage } = this.props;
        const { initialContextState, orderBy, orderType, selected } = this.state;
        return(
            <>
                <div className={classes.content}>
                    <Paper className={classes.paper}>
                        <div className={classNames(classes.tableBody, this.props.className)} onContextMenu={event => this.handleContextClick(event)} style={{ cursor: 'context-menu' }}>
                            <Table size='small' stickyHeader  className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        {headCells.map(row => (
                                            <StyledTableCell
                                                key={row.id}
                                                align={row.type === 'numeric' ? 'right' : 'left'}
                                                className={classNames(
                                                    classes.headCell,
                                                    headCells.length > 2 ? null : row.id === rowKey ? classes.colCode: null
                                                )}
                                            >
                                                <TableSortLabel
                                                    active={orderBy.id === row.id}
                                                    direction={orderType}
                                                    onClick={this.handleRequestSort(row)}
                                                >
                                                    {row.label}
                                                </TableSortLabel>
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows
                                        .map((row, key) => (
                                            <TableRow
                                                hover
                                                key={key}
                                                onClick={event => this.handleClick(event, row)}
                                                onDoubleClick ={event => this.handleDoubleClick(event, row)}
                                                selected={selected === row[rowKey] ? true : false}
                                            >
                                                {headCells.map((cell, key) =>
                                                    <TableCell
                                                        key={key}
                                                    >
                                                        {cell.type === 'boolean'
                                                            ?
                                                                <Checkbox
                                                                    checked={row[cell.id]}
                                                                    disabled={true}
                                                                />
                                                            :
                                                                cell.type === 'object' ?
                                                                    cell.subtype === 'amount'
                                                                        ?
                                                                            row[cell.id.substring(0, cell.id.lastIndexOf('.'))] !== null ?
                                                                                `${numberWithSpaces((row[cell.id.substring(0, cell.id.lastIndexOf('.'))][cell.id.substring(cell.id.lastIndexOf('.') +1)]))}${cell.suffix !== undefined ? ' ' + cell.suffix : ''}` :
                                                                                    `${numberWithSpaces(0)}${cell.suffix !== undefined ? ' ' + cell.suffix : ''}`
                                                                        :
                                                                        row[cell.id.substring(0, cell.id.indexOf('.'))] !== undefined ?row[cell.id.substring(0, cell.id.indexOf('.'))][cell.id.substring(cell.id.indexOf('.') +1)] : null
                                                                    :
                                                                        cell.type === 'date' && row[cell.id] !== null
                                                                            ?
                                                                                format(
                                                                                    new Date(Date.parse(row[cell.id])),
                                                                                    cell.dateFormat !== null ? cell.dateFormat : 'dd-MM-yyyy',
                                                                                    { locale: pl }
                                                                                )
                                                                            :
                                                                                cell.type==='amount' && row[cell.id] !== undefined
                                                                                    ?
                                                                                        row[cell.id] !== null && `${numberWithSpaces(row[cell.id])}${cell.suffix !== undefined ? ' ' + cell.suffix : ''}`
                                                                                    :
                                                                                        row[cell.id]
                                                        }
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                     ))}
                                </TableBody>
                            </Table>
                            <Menu
                                keepMounted
                                open={initialContextState.open === true}
                                onClose={event => this.handleContextClose(event)}
                                anchorReference="anchorPosition"
                                anchorPosition={
                                    initialContextState.open === true
                                        ? { top: initialContextState.mouseY, left: initialContextState.mouseX }
                                    : undefined
                                }
                            >
                                <MenuItem onClick={event => this.handleContextClose(event, "XLSX")}>
                                    <ListItemIcon><GetApp fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Export do xlsx" />
                                </MenuItem>
                            </Menu>
                        </div>
                        <div>
                            <Table>
                                <TableFooter classes={{root: classes.tableFooter}}>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[rowsPerPage]}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            count={pageableTableProperties.totalElements}
                                            onPageChange={this.handleChangePage}
                                            labelDisplayedRows={this.labelPaginationTableRow}
                                            ActionsComponent={(props) =>
                                                <TablePaginationActions
                                                    {...props}
                                                    firstPage={pageableTableProperties.firstPage}
                                                    lastPage={pageableTableProperties.lastPage}
                                                />
                                            }
                                            classes={{spacer: classes.spacer}}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </Paper>
                </div>
            </>

        )
    }
}


TablePageable.propTypes ={
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    clearSelect: PropTypes.bool,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    resetPageableProperties: PropTypes.bool,
    orderBy: PropTypes.object,
    orderType: PropTypes.string,
    onSetPage: PropTypes.func,
    onSetSort: PropTypes.func,
    rows: PropTypes.array,
    headCells: PropTypes.array.isRequired,
    rowKey: PropTypes.string,
};

TablePageable.defaultProps = {
    rowKey: 'id',
    orderBy: {id:'id'},
    orderType: 'asc',
    page: 0,
    rowsPerPage: 50,
    resetPageableProperties: false,
    headCells: [],
    onSelect: () => {},
    onDoubleClick: () => {},
    onExcelExport: () => {},
    onSetSort: () => {},
    onSetPage: () => {},
};

export default withStyles(styles)(TablePageable);