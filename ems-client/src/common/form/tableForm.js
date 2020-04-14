import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import {Grid, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography, Paper} from '@material-ui/core/';
import PropTypes from 'prop-types';
import { Checkbox } from 'common/gui';


const useStyles = makeStyles(theme => ({
    root: {
        margin: 0,
        padding: 0,
        maxWidth: "100%",
        height: `calc(100vh - ${theme.spacing(35)}px)`,
    },
    paper: {
        minWidth: '100%',
        width: '100%',
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
    buttonContainer: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(33.5)}px)`,
    }
}));

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function setValues (fields, values) {
    fields.removeAll();
    if (values.length > 0){
        values.map(value => fields.push(value));
    }
    return values;
}

function EnhancedTableHeadCheckedColumn(props){
    const {checkedColumnFirst, numSelected, rowCount, disableCheckAll, onChange} = props;

    return (
        <TableCell padding="checkbox" size="small" align={checkedColumnFirst ? "left" : "right"}>
            <Checkbox
                onChange={onChange}
                inputProps={{ 'aria-label': 'select all desserts' }}
                checked={numSelected === rowCount && rowCount !==0 && !disableCheckAll}
                disabled={disableCheckAll}
            />
        </TableCell>
    )
}

EnhancedTableHeadCheckedColumn.propTypes = {
    checkedColumnFirst: PropTypes.bool.isRequired,
    numSelected: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired,
    disableCheckAll: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};


function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, disableCheckAll, checkedColumnFirst } = props;

    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                { checkedColumnFirst &&
                    <EnhancedTableHeadCheckedColumn
                        checkedColumnFirst={checkedColumnFirst}
                        numSelected={numSelected}
                        rowCount={rowCount}
                        disableCheckAll={disableCheckAll}
                        onChange={onSelectAllClick}
                    />
                }
            {headCells.map(headCell => (
                <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={checkedColumnFirst ? "none" : "checkbox"}
                    size="small"
                    className={classes.head}
                >
                    <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={order}
                        onClick={createSortHandler(headCell.id)}
                    >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                            <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                        ) : null}
                    </TableSortLabel>
                </TableCell>
            ))}
                { !checkedColumnFirst &&
                    <EnhancedTableHeadCheckedColumn
                        checkedColumnFirst={checkedColumnFirst}
                        numSelected={numSelected}
                        rowCount={rowCount}
                        disableCheckAll={disableCheckAll}
                        onChange={onSelectAllClick}
                    />
                }
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string,
    rowCount: PropTypes.number.isRequired,
};


const useTableStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
    },
    table: {
        width: '100%',
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(33)}px)`,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    head: {
        lineHeight: theme.spacing(0),
    }
}));

function EnhancedTable(props) {

    const { headCells, rows, checked, setChecked, multiChecked, defaultOrderBy, className, checkedColumnFirst } = props;
    const classes = useTableStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(defaultOrderBy);
    const [allSelect, setAllSelect] = React.useState(rows.length === checked.length && checked.length !== 0)


    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {

        if (event.target.checked) {
            const newSelecteds = rows.map(n => n);
            setChecked(newSelecteds);
            setAllSelect(!allSelect);
        return;
        }
        setChecked([]);
    };

    const handleClick = (event, row) => {
        const selectedIndex = checked.indexOf(row);
        let newSelected = [];

        if(!multiChecked){
            if(selectedIndex === -1){
                newSelected.push(row);
            }
        } else {
            if (selectedIndex === -1) {
                newSelected = newSelected.concat(checked, row);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(checked.slice(1));
            } else if (selectedIndex === checked.length - 1) {
                newSelected = newSelected.concat(checked.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    checked.slice(0, selectedIndex),
                    checked.slice(selectedIndex + 1),
                );
            }
        }
        setChecked(stableSort(newSelected, getSorting(order, orderBy)))
    };


    const isSelected = row => checked.indexOf(row) !== -1;
    return (
        <div className={classes.root} >
            <Paper className={classes.paper} >
                <div className={classNames(classes.tableWrapper, className)}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        stickyHeader={true}
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={checked.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            headCells={headCells}
                            allSelect={allSelect}
                            disableCheckAll={!multiChecked}
                            checkedColumnFirst={checkedColumnFirst}
                        />
                        <TableBody>

                            {stableSort(rows, getSorting(order, orderBy)).map((row, index) => {
                                const isItemSelected = isSelected(row);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        hover
                                        onClick={event => handleClick(event, row)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}
                                    >
                                        { checkedColumnFirst &&
                                            <TableCell padding="checkbox" key={index}>
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                        }
                                        {headCells.map((rowCell, key) =>
                                            <TableCell
                                                key={key}
                                                padding={checkedColumnFirst ? "none" : "checkbox"}
                                                size="small"
                                                align={rowCell.numeric ? 'right' : 'left'}
                                            >
                                                {row[rowCell.id]}
                                            </TableCell>
                                        )}
                                        { !checkedColumnFirst &&
                                            <TableCell padding="checkbox" key={index} align="right">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                        }
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        </div>
    );
}


export default function TableForm({ fields, head, allRows, checkedRows, ...custom}, ) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [rows, setRows] = React.useState(allRows);
    const [prevCheckedRows, setPrevCheckedRows] = React.useState([])

    React.useEffect(() => {
        if(rows !== allRows ){
            setRows(allRows)
        } else if((prevCheckedRows.length === 0 && checkedRows.length > 0)) {
            setPrevCheckedRows(checkedRows)
            setChecked(setValues(fields, checkedRows))
        } else if(checkedRows !== prevCheckedRows) {
            setPrevCheckedRows(checkedRows)
            setChecked(setValues(fields, checkedRows))
        }
    },  [checkedRows, prevCheckedRows, rows, allRows, checked, fields])

    const handleToggle = (value) => {
        setChecked(setValues(fields, value));
    };

    return (
        <Grid container spacing={1} className={classes.root}>
            <Grid item xs={12} sm={12}>
                <Typography
                    variant="subtitle2"
                    gutterBottom
                >
                    {custom.label}
                </Typography>
                <EnhancedTable
                    className={custom.className}
                    headCells={head}
                    rows={rows}
                    checked={checked}
                    setChecked={handleToggle}
                    multiChecked={custom.multiChecked}
                    defaultOrderBy={custom.orderBy !== null ? custom.orderBy : ''}
                    checkedColumnFirst={custom.checkedColumnFirst}
                />
            </Grid>
        </Grid>
    );
}