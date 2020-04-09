import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Paper, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, TablePagination, TableFooter, IconButton } from '@material-ui/core/';
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons/';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors/';
import { Checkbox } from 'common/gui';

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
    root: {
        flexGrow: 1,
        marginTop: theme.spacing(1),
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
        rowsPerPage: 10,
        selected: '',
        order: 'asc',
        orderBy: '',
    };

    desc(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
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

    createSortHandler = property => event => {
        this.handleRequestSort(event, property);
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

    componentDidMount(){
        this.setState({
            rows: this.state.rows,
            orderBy: this.props.defaultOrderBy,
        });
    }

    render(){
        const { classes, rows, headCells, rowKey } = this.props;
        const { curPage, rowsPerPage, selected, order, orderBy  } = this.state;
        return(
            <>
                <Paper className={classes.root}>
                    <div className={classNames(classes.tableBody, this.props.className)}>
                        <Table size='small' stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {headCells.map(row => (
                                        <StyledTableCell
                                            key={row.id}
                                            align={row.numeric ? 'right' : 'left'}
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
                                                onClick={this.createSortHandler(row.id)}
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
                                                padding={cell.boolean ? "checkbox" : "default"}
                                                align={cell.numeric ? 'right' : cell.boolean ? 'center' : 'left'}
                                                classes={{ sizeSmall: classes.tableCell }}
                                            >
                                                {cell.boolean ? <Checkbox
                                                                    checked={row[cell.id]}
                                                                    disabled={true}
                                                                />
                                                                : row[cell.id]
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
            </>
        )
    }
}

ContainedTable.propTypes ={
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
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