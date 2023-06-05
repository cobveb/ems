import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Table, Button, SearchField, SelectField } from 'common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import WorkplaceContainer from 'containers/modules/hr/dictionary/workplaceContainer';
import {escapeSpecialCharacters} from 'utils/';

const styles = theme => ({
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
})

class Workplaces extends Component {
    state = {
        headCells: [
            {
                id: 'code',
                label: constants.TABLE_HEAD_ROW_CODE,
                type: 'text',
            },
            {
                id: 'name',
                label: constants.TABLE_HEAD_ROW_NAME,
                type: 'text',
            },
            {
                id: 'group.name',
                label: constants.HR_WORKPLACE_SEARCH_GROUP,
                type: 'object',
            },
            {
                id: 'active',
                label: constants.TABLE_HEAD_ROW_ACTIVE,
                type: 'boolean',
            },
        ],
        selected: {},
        rows: this.props.initialValues,
        codeNameSearch: '',
        group: '',
        isDetailsVisible: false,
        action: null,
    }

    filter = () => {
        let workplaces = this.props.initialValues;
        const codeNameSearch = escapeSpecialCharacters(this.state.codeNameSearch)
        return workplaces.filter((workplace) => {
            return (workplace.code.toLowerCase().search(
                    codeNameSearch.toLowerCase()) !== -1 ||
                workplace.name.toLowerCase().search(
                    codeNameSearch.toLowerCase()) !== -1) &&
                workplace.group.code.toLowerCase().search(
                    this.state.group.toLowerCase()) !== -1
        });
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) => {
        this.setState({
            selected: row,
            isDetailsVisible: !this.state.isDetailsVisible,
            action: 'edit',
        });
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headCells)
    }

    handleClose = (workplace) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: {},
            action: null,
            rows: this.props.onClose(workplace),
        }));
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    handleCloseDialog = () => {
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

    componentDidUpdate(prevProps, prevState){
        // Filter rows on close workplace
        if(this.state.action === null && this.state.action !== prevState.action){
            this.setState({
                rows: this.filter(),
            });
        }
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues,
            });
        } else if (this.state.codeNameSearch !== prevState.codeNameSearch ||
            this.state.group !== prevState.group
        ){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const { classes, isLoading, error, groups, initialValues } = this.props;
        const { headCells, rows, selected, action, codeNameSearch, group, isDetailsVisible } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {action === "delete" &&
                    <ModalDialog
                        message={constants.HR_PLACE_DELETE_MSG}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <div>
                    {isDetailsVisible ?
                        <WorkplaceContainer
                            initialValues={action === 'add' ? {active: true, type: 'WP'} : selected}
                            groups={groups.filter(group => group.code !== "")}
                            positions={initialValues}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            action={action}
                            onClose={this.handleClose}
                        />
                    :
                        <>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                            >
                                <Typography variant="h6">{constants.HR_MENU_EMPLOYEES_DICTIONARIES_WORKPLACES}</Typography>
                                <Divider />
                                <Grid container spacing={1} direction="row">
                                    <Grid item xs={9}>
                                        <SearchField
                                            name="codeNameSearch"
                                            onChange={this.handleSearch}
                                            label={constants.SEARCH_CODE_NAME}
                                            placeholder={constants.SEARCH_CODE_NAME}
                                            valueType='all'
                                            value={codeNameSearch}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <SelectField
                                            name="group"
                                            onChange={this.handleSearch}
                                            label={constants.HR_WORKPLACE_SEARCH_GROUP}
                                            options={groups}
                                            value={group}
                                        />
                                    </Grid>
                                </Grid>
                                <Table
                                    className={classes.tableWrapper}
                                    rows={rows}
                                    headCells={headCells}
                                    onSelect={this.handleSelect}
                                    onDoubleClick={this.handleDoubleClick}
                                    onExcelExport={this.handleExcelExport}
                                    defaultOrderBy="name"
                                    rowKey="id"
                                />
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start"
                                    >
                                        <Button
                                            label={constants.BUTTON_ADD}
                                            icon=<Add className={classes.icon}/>
                                            iconAlign="right"
                                            variant="add"
                                            onClick = { (event) => this.handleChangeVisibleDetails(event, 'add', )}
                                        />
                                        <Button
                                            label={constants.BUTTON_EDIT}
                                            icon=<Edit className={classes.icon}/>
                                            iconAlign="right"
                                            disabled={Object.keys(selected).length === 0}
                                            variant="edit"
                                            onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                        />
                                        <Button
                                            label={constants.BUTTON_DELETE}
                                            icon=<Delete className={classes.icon}/>
                                            iconAlign="right"
                                            disabled={Object.keys(selected).length === 0}
                                            onClick = {(event) => this.handleDelete(event, 'delete', )}
                                            variant="delete"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    }
                </div>
            </>
        );
    };
};

Workplaces.propType = {
    classes: PropTypes.func.isRequired,
    initialValues: PropTypes.array.isRequired,
    groups: PropTypes.array,
    isLoading: PropTypes.bool.isLoading,
    error: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(Workplaces);
