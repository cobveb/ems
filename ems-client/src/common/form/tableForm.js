import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import {Grid, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography, Paper, Toolbar, Divider, ButtonGroup } from '@material-ui/core/';
import { numberWithSpaces } from 'utils/';
import PropTypes from 'prop-types';
import { Checkbox } from 'common/gui';
import {AddCircle, Edit, Delete} from '@material-ui/icons';
import * as constants from 'constants/uiNames';
import { Button } from 'common/gui';
import format from "date-fns/format";
import { pl } from 'date-fns/locale';


const useStyles = makeStyles(theme => ({
    root: {
        margin: 0,
        padding: 0,
        maxWidth: "100%",
        height: '100%',
    },
    paper: {
        minWidth: '100%',
        width: '100%',
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}));

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        minHeight: theme.spacing(2),

    },
    spacer: {
        flex: '1 1 100%',
    },

}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { selected, onAdd, onEdit, onDelete, addButtonProps, editButtonProps, deleteButtonProps } = props;
    return (
        <>
            <Toolbar
                className={classes.root}
            >
                <div className={classes.spacer} />
                <div>
                    <ButtonGroup variant="text" color='inherit'>
                        <Button
                            label={addButtonProps && addButtonProps.label ? addButtonProps.label : constants.BUTTON_ADD}
                            icon={addButtonProps && addButtonProps.icon ? addButtonProps.icon : <AddCircle /> }
                            iconAlign="left"
                            variant={addButtonProps && addButtonProps.variant ? addButtonProps.variant : "add" }
                            size="small"
                            version="text"
                            onClick={(event) => onAdd(event, 'add')}
                            disabled={ addButtonProps && addButtonProps.disabled }
                        />
                        <Button
                            label={editButtonProps && editButtonProps.label ? editButtonProps.label : constants.BUTTON_EDIT}
                            icon={editButtonProps && editButtonProps.icon ? editButtonProps.icon : <Edit />}
                            iconAlign="left"
                            variant={editButtonProps && editButtonProps.icon ? editButtonProps.variant : "edit"}
                            size="small"
                            version="text"
                            onClick={(event) => onEdit(event, 'edit')}
                            disabled={selected.length === 0 || (editButtonProps && editButtonProps.disabled) }
                        />
                        <Button
                            label={deleteButtonProps && deleteButtonProps.label ? deleteButtonProps.label : constants.BUTTON_DELETE}
                            icon={deleteButtonProps && deleteButtonProps.icon ? deleteButtonProps.icon : <Delete />}
                            iconAlign="left"
                            variant={deleteButtonProps && deleteButtonProps.variant ? deleteButtonProps.variant : "delete"}
                            size="small"
                            version="text"
                            onClick={(event) => onDelete(event, 'delete')}
                            disabled={selected.length === 0 || (deleteButtonProps && deleteButtonProps.disabled)}
                        />
                    </ButtonGroup>
                </div>
            </Toolbar>
            <Divider/>
        </>
    );
};

EnhancedTableToolbar.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  isAddDisabled: PropTypes.bool,
};

EnhancedTableToolbar.defaultProps = {
  isAddDisabled: false,
};

function desc(a, b, orderBy, cellType) {

    switch(cellType){
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

function getSorting(order, orderBy, row) {

    return order === 'desc' ? (a, b) => desc(a, b, orderBy, row) : (a, b) => -desc(a, b, orderBy, row);
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
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, disableCheckAll, checkedColumnFirst, setCellType } = props;

    const createSortHandler = row => event => {
        onRequestSort(event, row.id);
        setCellType(row.type);
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
            {headCells.map(row => (
                <TableCell
                    key={row.id}
                    align={row.type === 'numeric' ? 'right' : 'left'}
                    padding={checkedColumnFirst ? "default" : "checkbox"}
                    size="small"
                    className={classes.head}
                >
                    <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={createSortHandler(row)}
                    >
                        {row.label}
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
    tableCell:{
        padding: `${theme.spacing(1.25)}px ${theme.spacing(2)}px`,
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
    const [allSelect, setAllSelect] = React.useState(rows.length === checked.length && checked.length !== 0);
    const [cellType, setCellType] = React.useState('text');

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
        setChecked(stableSort(newSelected, getSorting(order, orderBy, cellType)))
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
                            setCellType={setCellType}
                        />
                        <TableBody>

                            {stableSort(rows, getSorting(order, orderBy, cellType)).map((row, index) => {
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
                                        {headCells.map((cell, key) =>
                                            <TableCell
                                                key={key}
                                                padding={cell.type === 'boolean' ? "checkbox" : "default"}
                                                size="small"
                                                align={cell.type === 'numeric' ? 'right' : cell.boolean ? 'center' : 'left'}
                                                classes={{ sizeSmall: classes.tableCell }}
                                            >
                                                {
                                                    cell.type === 'boolean'
                                                        ?
                                                            <Checkbox
                                                                checked={row[cell.id]}
                                                                disabled={true}
                                                            />
                                                        :
                                                            cell.type === 'date' && row[cell.id] !== null
                                                                ?
                                                                    format(
                                                                       new Date(Date.parse(row[cell.id])),
                                                                       cell.dateFormat !== null ? cell.dateFormat : 'dd-MM-yyyy',
                                                                       { locale: pl }
                                                                    )
                                                                :
                                                                    cell.type==='object'
                                                                        ?
                                                                            (row[cell.id.substring(0, cell.id.indexOf('.'))][cell.id.substring(cell.id.indexOf('.') +1)])
                                                                        :
                                                                            cell.type==='amount' && row[cell.id] !== null
                                                                                ?
                                                                                    numberWithSpaces(row[cell.id])
                                                                                :
                                                                                    row[cell.id]
                                                }
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


export default function TableForm({ fields, head, allRows, checkedRows, toolbar, ...custom}, ) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [rows, setRows] = React.useState(allRows);
    const [prevCheckedRows, setPrevCheckedRows] = React.useState([])

    React.useEffect(() => {

        if(toolbar === true){
            setValues(fields, allRows);
        }
        if(rows !== allRows ){
            setRows(allRows);
        } else if((prevCheckedRows.length === 0 && checkedRows.length > 0)) {
            setPrevCheckedRows(checkedRows);
            if(!toolbar || toolbar === false ){
                setChecked(setValues(fields, checkedRows));
            } else {
                setChecked(checkedRows);
            }
        } else if(checkedRows !== prevCheckedRows) {
            setPrevCheckedRows(checkedRows)
            if(!toolbar || toolbar === false ){
                setChecked(setValues(fields, checkedRows))
            } else {
                setChecked(checkedRows);
            }
        }
    },  [checkedRows, prevCheckedRows, rows, allRows, checked, fields, toolbar])

    const handleToggle = (value) => {
        if(!toolbar || toolbar === false ){
            setChecked(setValues(fields, value));
        } else if ((custom.onSelect !== undefined || typeof(custom.onSelect) !== 'function') && custom.multiChecked === false) {
            custom.onSelect(value);
        }
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
                {toolbar &&
                    <EnhancedTableToolbar
                        selected={checked}
                        addButtonProps={custom.addButtonProps}
                        onAdd={custom.onAdd}
                        onEdit={custom.onEdit}
                        editButtonProps={custom.editButtonProps}
                        onDelete={custom.onDelete}
                        deleteButtonProps={custom.deleteButtonProps}
                        isAddDisabled={custom.isAddDisabled}
                    />
                }
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

TableForm.propTypes = {
    fields: PropTypes.object,
    head: PropTypes.array,
    allRows: PropTypes.array,
    checkedRows: PropTypes.array,
    toolbar: PropTypes.bool,
    addButtonProps: PropTypes.object,
    editButtonProps: PropTypes.object,
    deleteButtonProps: PropTypes.object,
    onAdd: function(props, propName, componentName) {
        if ((props['toolbar'] === true && (props[propName] === undefined || typeof(props[propName]) !== 'function'))) {
            return new Error('Please provide a onAdd function!');
        }
    },
    onEdit: function(props, propName, componentName) {
        if ((props['toolbar'] === true && (props[propName] === undefined || typeof(props[propName]) !== 'function'))) {
            return new Error('Please provide a onEdit function!');
        }
    },
    onDelete: function(props, propName, componentName) {
        if ((props['toolbar'] === true && (props[propName] === undefined || typeof(props[propName]) !== 'function'))) {
            return new Error('Please provide a onDelete function!');
        }
    },
};