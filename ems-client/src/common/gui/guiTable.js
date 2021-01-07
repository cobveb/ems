import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Paper, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, TablePagination, TableFooter, IconButton } from '@material-ui/core/';
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons/';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors/';
import { Checkbox } from 'common/gui';
import format from "date-fns/format";
import { pl } from 'date-fns/locale';
import { numberWithSpaces } from 'utils/';

const tablePagination = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5),
    },
}));

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: grey[50],
    },
}))(TableCell);

function TablePaginationActions(props) {
    const classes = tablePagination();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    function handleFirstPageButtonClick(event) {
        onChangePage(event, 0);
    }

    function handleBackButtonClick(event) {
        onChangePage(event, page - 1);
    }

    function handleNextButtonClick(event) {
        onChangePage(event, page + 1);
    }

    function handleLastPageButtonClick(event) {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="First Page"
            >
                {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="Previous Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            Strona: {page}
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Next Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Last Page"
            >
                {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
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

class ContainedTable extends Component {
    state = {
        curPage: 0,
        rowsPerPage: 50,
        selected: '',
        order: 'asc',
        orderBy: '',
        cellType: 'text',
    };

    desc(a, b, orderBy) {
        switch(this.state.cellType){
            case 'object' :
                if (b[orderBy.substring(0, orderBy.indexOf('.'))][orderBy.substring(orderBy.indexOf('.') +1)] < a[orderBy.substring(0, orderBy.indexOf('.'))][orderBy.substring(orderBy.indexOf('.') +1)]) {
                    return -1;
                }
                if (b[orderBy.substring(0, orderBy.indexOf('.'))][orderBy.substring(orderBy.indexOf('.') +1)] > a[orderBy.substring(0, orderBy.indexOf('.'))][orderBy.substring(orderBy.indexOf('.') +1)]) {
                    return 1;
                }
                break;
            case 'text':
            case 'numeric':
            case 'boolean':
            case 'amount':
                if (b[orderBy] < a[orderBy]) {
                    return -1;
                } else if (b[orderBy] > a[orderBy]) {
                    return 1;
                } else {
                    return 0;
                }

            case 'date':
                if (b[orderBy] !== null && a[orderBy] !== null){
                    if(b[orderBy] < a[orderBy]){
                        return -1;
                    } else if(b[orderBy] > a[orderBy]){
                        return 1;
                    } else {
                        return 0;
                    }
                } else if (b[orderBy] !== null && a[orderBy] === null ) {
                    return 1;
                } else if (b[orderBy] === null && a[orderBy] !== null){
                    return -1;
                }
                break;
            default:
                return 0;
        }
    };

    getSorting(order, orderBy) {
        return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => - this.desc(a, b, orderBy);
    };

    stableSort(array, cmp) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
                return a[1] - b[1];
            }
        );
        return stabilizedThis.map(el => el[0]);
    };

    createSortHandler = row => event => {
        this.setState({cellType: row.type});
        this.handleRequestSort(event, row.id);
    };

    handleChangePage = (event, newPage) => {
        this.setState({curPage: newPage});
    }

    labelRows = ( {from, to, count }) => {
        return(`${from}-${to} z ${count}`)
    }

    handleClick = (event, row) => {
        if(this.state.selected !== row[this.props.rowKey]){
            this.setState({selected: row[this.props.rowKey]});
            this.props.onSelect(row);
        } else {
            this.setState({selected: ''});
            this.props.onSelect('');
        }
    }

    handleRequestSort = (event, property) => {
        const isDesc = this.state.orderBy === property && this.state.order === 'desc';
        this.setState({
            orderBy: property,
            order : isDesc ? 'asc' : 'desc',
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.clearSelect === true && (this.props.clearSelect !== prevProps.clearSelect)){
            this.setState({selected: ''});
        }
    }

    componentDidMount(){
        this.setState({
            rows: this.props.rows,
            orderBy: this.props.defaultOrderBy,
        });
    }

    render(){
        const { classes, rows, headCells, rowKey } = this.props;
        const { curPage, rowsPerPage, selected, order, orderBy  } = this.state;
        return(
            <>
                <div className={classes.content}>
                    <Paper>
                        <div className={classNames(classes.tableBody, this.props.className)}>
                            <Table size='small' stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {headCells.map(row => (
                                            <StyledTableCell
                                                key={row.id}
                                                align={row.type === 'numeric' ? 'right' : 'left'}
                                                padding="default"
                                                sortDirection={orderBy === row.id ? order : false}
                                                className={classNames(
                                                    classes.headCell,
                                                    headCells.length > 2 ? null : row.id === rowKey ? classes.colCode: null
                                                )}
                                            >
                                                <TableSortLabel
                                                    active={orderBy === row.id}
                                                    direction={order}
                                                    onClick={this.createSortHandler(row)}
                                                >
                                                    {row.label}
                                                </TableSortLabel>
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody >
                                    {this.stableSort(rows, this.getSorting(order, orderBy))
                                    .slice(curPage * rowsPerPage, curPage * rowsPerPage + rowsPerPage)
                                    .map((row, key) => (
                                        <TableRow
                                            hover
                                            key={key}
                                            onClick={event => this.handleClick(event, row)}
                                            selected={selected === row[rowKey] ? true : false}
                                        >
                                            {headCells.map((cell, key) =>
                                                <TableCell
                                                    key={key}
                                                    padding={cell.type === 'boolean' ? "checkbox" : "default"}
                                                    align={cell.type === 'numeric' ? 'right' : cell.boolean ? 'center' : 'left'}
                                                    classes={{ sizeSmall: classes.tableCell }}
                                                >
                                                    {cell.type === 'boolean'
                                                        ?
                                                            <Checkbox
                                                                checked={row[cell.id]}
                                                                disabled={true}
                                                            />
                                                        :
                                                            cell.type === 'object' ? (row[cell.id.substring(0, cell.id.indexOf('.'))][cell.id.substring(cell.id.indexOf('.') +1)])
                                                                :
                                                                    cell.type === 'date' && row[cell.id] !== null
                                                                        ?
                                                                            format(
                                                                                new Date(Date.parse(row[cell.id])),
                                                                                cell.dateFormat !== null ? cell.dateFormat : 'dd-MM-yyyy',
                                                                                { locale: pl }
                                                                            )
                                                                        :
                                                                            cell.type==='amount' && row[cell.id] !== null
                                                                                ?
                                                                                    numberWithSpaces(row[cell.id])
                                                                                :
                                                                                    row[cell.id]
                                                    }
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            <Table>
                                <TableFooter
                                    classes={{root: classes.tableFooter}}
                                >
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[rowsPerPage]}
                                            rowsPerPage={rowsPerPage}
                                            count = {rows.length}
                                            page = {curPage}
                                            onChangePage={this.handleChangePage}
                                            ActionsComponent={TablePaginationActions}
                                            labelDisplayedRows={this.labelRows}
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

ContainedTable.propTypes ={
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    clearSelect: PropTypes.bool,
    defaultOrderBy: PropTypes.string,
    rows: PropTypes.array,
    headCells: PropTypes.array.isRequired,
    rowKey: PropTypes.string,
};

ContainedTable.defaultProps = {
    rowKey: 'code',
    defaultOrderBy: 'code',
};

export default withStyles(styles)(ContainedTable);