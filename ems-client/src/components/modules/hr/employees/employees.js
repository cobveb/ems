import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Divider, Grid } from '@material-ui/core/';
import { ModalDialog, Spinner} from 'common/';
import * as constants from 'constants/uiNames';
import { Button, SearchField } from 'common/gui';
import { TablePageable } from 'containers/common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import EmployeeContainer from 'containers/modules/hr/employees/employeeContainer';
import { setChangedSearchConditions } from 'utils';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
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
})

class Employees extends Component {
    state = {
        rows: [],
        headCells: [
            {
                id: 'id',
                label: constants.EMPLOYEES_TABLE_HEAD_ROW_ID,
                type:'text',
            },
            {
                id: 'surname',
                label: constants.EMPLOYEES_TABLE_HEAD_ROW_SURNAME,
                type: 'text',
            },
            {
                id: 'name',
                label: constants.EMPLOYEES_TABLE_HEAD_ROW_NAME,
                type:'text',
            },
        ],
        selected: {},
        isDetailsVisible: false,
        surname: '',
        name: '',
        action: null,
        searchConditionsChange: false,
        searchConditions: [
            {
                name: 'name',
                value: '',
                type: 'text'
            },
            {
                name: 'surname',
                value: '',
                type: 'text'
            }
        ]
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleSearch = (event) => {
        this.setState({[event.target.id]: event.target.value})
    }

    onChangeSearchConditions = (event) => {
        event.persist();
        this.setState(prevState => {
            const searchConditions = [...prevState.searchConditions];
            let searchConditionsChange = prevState.searchConditionsChange;

            return setChangedSearchConditions(event.target.name, event.target.value, searchConditions, searchConditionsChange);
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

    handleDoubleClick = (row) => {
        this.setState({
            selected: row,
            isDetailsVisible: !this.state.isDetailsVisible,
            action: 'edit',
        });
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    handleClose = (employee) =>{
        this.setState(state => ({
                isDetailsVisible: false,
                action: null,
                selected: {},
            })
        );
    }

    handleCloseDialog = () =>{
        if(this.props.error !== null){
            this.props.clearError(null);
        }
        this.setState(state => ({
                action: null,
            })
        );
    }

    handleDelete = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleConfirmDelete = () => {
        this.props.onDelete(this.state.selected);
        this.setState({
            action: null,
            selected: {},
        });
    }

    handleExcelExport = (exportType) =>{
        this.props.onExcelExport(exportType, this.state.headCells);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues,
            });
        }
        if(this.state.searchConditionsChange){
            this.props.onSetSearchConditions(this.state.searchConditions)
            this.setState({
                searchConditionsChange: false,
            })
        }
    }

    componentDidMount() {
        this.setState({rows: this.props.initialValues});
    }


    render(){
        const { classes, isLoading, error, levelAccess } = this.props;
        const { headCells, rows, selected, isDetailsVisible, action, surname, name, searchConditionsChange } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {action === "delete" &&
                    <ModalDialog
                        message={constants.EMPLOYEES_EMPLOYEE_DELETE_MSG}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                { isDetailsVisible ?
                        <EmployeeContainer
                            initialValues={action === 'add' ? {} : selected}
                            action={action}
                            levelAccess={levelAccess}
                            onClose={this.handleClose}
                        />
                    :
                        <>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                                className={classes.root}
                            >
                                <Typography variant="h6">{constants.HR_MENU_EMPLOYEES_EMPLOYEES}</Typography>
                                <Divider />
                                <div className={classes.content}>
                                    <Grid container spacing={0} direction="row" justifyContent="center" className={classes.container}>
                                        <Grid item xs={6} className={classes.item}>
                                            <SearchField
                                                name="surname"
                                                onChange={this.handleSearch}
                                                onBlur={this.handleBlur}
                                                onKeyDown={(e) => this.handleKeyDown(e)}
                                                label={constants.EMPLOYEES_SEARCH_SURNAME}
                                                placeholder={constants.EMPLOYEES_SEARCH_SURNAME}
                                                valueType="all"
                                                value={surname}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <SearchField
                                                name="name"
                                                onChange={this.handleSearch}
                                                onBlur={this.handleBlur}
                                                onKeyDown={this.handleKeyDown}
                                                label={constants.EMPLOYEES_SEARCH_NAME}
                                                placeholder={constants.EMPLOYEES_SEARCH_NAME}
                                                valueType="all"
                                                value={name}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={0} direction="row" justifyContent="flex-start" className={classes.container}>
                                        <TablePageable
                                            className={classes.tableWrapper}
                                            rows={rows}
                                            headCells={headCells}
                                            onSelect={this.handleSelect}
                                            onDoubleClick={this.handleDoubleClick}
                                            onExcelExport={this.handleExcelExport}
                                            resetPageableProperties={searchConditionsChange}
                                            rowKey="id"
                                            orderBy={headCells[1]}
                                        />
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="flex-start"
                                className={classes.container}
                            >
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="flex-start"
                                    >
                                        { levelAccess !== 'asi' &&
                                            <Button
                                                label={constants.BUTTON_ADD}
                                                icon=<Add/>
                                                iconAlign="right"
                                                variant="add"
                                                onClick = { (event) => this.handleChangeVisibleDetails(event, 'add', )}
                                                data-action="add"
                                            />
                                        }
                                        <Button
                                            label={constants.BUTTON_EDIT}
                                            icon=<Edit/>
                                            iconAlign="right"
                                            disabled={Object.keys(selected).length === 0}
                                            variant="edit"
                                            onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                            data-action="edit"
                                        />
                                        { levelAccess !== 'asi' &&
                                            <Button
                                                label={constants.BUTTON_DELETE}
                                                icon=<Delete/>
                                                iconAlign="right"
                                                disabled={Object.keys(selected).length === 0 }
                                                onClick = {(event) => this.handleDelete(event, 'delete', )}
                                                variant="delete"
                                            />
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                }
            </>
        );
    };
};


Employees.propTypes = {
	classes: PropTypes.object.isRequired,
	levelAccess: PropTypes.string.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
};

export default withStyles(styles)(Employees);
