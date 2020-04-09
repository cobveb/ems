import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography, Paper} from '@material-ui/core/';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Button, Checkbox } from 'common/gui';


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

function not(a, b) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter(value => b.indexOf(value) !== -1);
}

function setUniqueAll(all, b) {
    b.filter((value) => {
        let index = all.findIndex(a => JSON.stringify(a) === JSON.stringify(value))
        if(index !== -1){
            all.splice(index, 1)
        }
        return all;
    });
    return all;
}


function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;

    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" size="small" >
                    <Checkbox
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                        checked={numSelected === rowCount && rowCount !==0}
                    />
                </TableCell>
            {headCells.map(headCell => (
                <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding="none"
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
    orderBy: PropTypes.string.isRequired,
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

    const { headCells, rows, checked, setChecked, defaultOrderBy } = props;
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
        setChecked(newSelected)
    };

    const isSelected = row => checked.indexOf(row) !== -1;
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className={classes.tableWrapper}>
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
                                        <TableCell padding="checkbox" key={index}>
                                            <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </TableCell>
                                        {headCells.map((rowCell, key) =>
                                            <TableCell
                                                key={key}
                                                padding="none"
                                                size="small"
                                                align={rowCell.numeric ? 'right' : 'left'}
                                            >
                                                {row[rowCell.id]}
                                            </TableCell>
                                        )}
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


export default function TableTransferList({ fields, head, leftSide, rightSide, leftSideLabel, rightSideLabel, ...custom}, ) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(setUniqueAll(leftSide, rightSide));
    const [prevLeft, setPrevLeft] = React.useState(left.length);
    const [right, setRight] = React.useState(rightSide);
    const [prevRight, setPrevRight] = React.useState(right.length);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);


    React.useEffect(() => {
        if(prevLeft !== leftSide.length){
            setLeft(setUniqueAll(leftSide, rightSide))
            setPrevLeft(left.length)
        }
        if(prevRight !== rightSide.length){
            setRight(rightSide)
            setPrevRight(right.length)
        }
    }, [prevLeft, leftSide, prevRight, rightSide, left.length, right.length]);

    const handleToggle = (value) => {
        setChecked(value);
    };

    const setValues = (value) => {

        fields.removeAll();

        if (value.length > 0){
            value.map(group => fields.push(group));
        }
    }

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
        setChecked([]);
        setValues(right.concat(left));
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        setValues(right.concat(leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
        setValues(not(right, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
        setChecked([])
        setValues([]);
    };

    return (

        <Grid container spacing={1} className={classes.root}>
            <Grid item xs={12} sm={5}>
                <Typography
                    variant="subtitle2"
                    gutterBottom
                >
                    {leftSideLabel}
                </Typography>
                <EnhancedTable headCells={head} rows={left} checked={leftChecked} setChecked={handleToggle} defaultOrderBy={custom.orderBy !== null ? custom.orderBy : ''} />
            </Grid>
            <Grid item xs={2} sm={2}>
                <Grid container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={classes.buttonContainer}
                    spacing={1}
                >
                    <Button
                        label={constants.TRANSFER_LIST_ALL_RIGHT}
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label="move all right"
                        variant="cancel"
                    />
                    <Button
                        label={constants.TRANSFER_LIST_SELECTED_RIGHT}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                        variant="cancel"
                    />
                    <Button
                        label={constants.TRANSFER_LIST_SELECTED_LEFT}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                        variant="cancel"
                    />
                    <Button
                        label={constants.TRANSFER_LIST_ALL_LEFT}
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label="move all left"
                        variant="cancel"
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Typography
                    variant="subtitle2"
                    gutterBottom
                >
                    {rightSideLabel}
                </Typography>
                <EnhancedTable headCells={head} rows={right} checked={rightChecked} setChecked={handleToggle} defaultOrderBy={custom.orderBy !== null ? custom.orderBy : ''}  />
            </Grid>
        </Grid>
    );
}