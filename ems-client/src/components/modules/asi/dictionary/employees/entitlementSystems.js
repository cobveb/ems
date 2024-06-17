import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import { Delete, Add, Edit } from '@material-ui/icons/';
import { Table, Button, SearchField } from 'common/gui';
import { Spinner, ModalDialog } from 'common/';
import EntitlementSystemContainer from 'containers/modules/asi/dictionary/employees/entitlementSystemContainer';
import {escapeSpecialCharacters} from 'utils/';

const styles = theme => ({
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
})

class EntitlementSystems extends Component {
    state = {
        selected: {},
        rows: this.props.initialValues,
        nameSearch: '',
        isDetailsVisible: false,
        action: null,
        headCells: [
            {
                id: 'name',
                label: constants.TABLE_HEAD_ROW_NAME,
                type: 'text',
            },
            {
                id: 'isActive',
                label: constants.USER_TABLE_HEAD_ROW_ACTIVE,
                type: 'boolean',
            },
        ],
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

    filter = () => {
        let systems = this.props.initialValues;
        const nameSearch = escapeSpecialCharacters(this.state.nameSearch)
        return systems.filter((system) => {
            return (system.name.toLowerCase().search(
                nameSearch.toLowerCase()) !== -1)
        });
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    handleClose = (system) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            action: null,
            selected: {},
            rows: this.props.onClose(system),
        }));
    };

    handleDelete = (event, action) => {
        this.setState(state => ({ action: action}));
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

    handleConfirmDelete = () => {
        this.props.onDelete(this.state.selected);
        this.setState({
            action: null,
            selected: {},
        });
    }

    componentDidUpdate(prevProps, prevState){
        // Filter rows on close system
        if(this.state.action === null && this.state.action !== prevState.action){
            this.setState({
                rows: this.filter(),
            });
        }
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues,
            });
        } else if (this.state.nameSearch !== prevState.nameSearch){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const {classes, isLoading, error } = this.props;
        const {selected, rows, nameSearch, headCells, action, isDetailsVisible} = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {action === "delete" &&
                    <ModalDialog
                        message={constants.EMPLOYEE_ENTITLEMENT_SYSTEMS_DELETE_MSG}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                {isDetailsVisible ?
                    <EntitlementSystemContainer
                        initialValues={action === 'add' ? {isActive: true} : selected}
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
                            <Typography variant="h6">{constants.ASI_MENU_DICTIONARY_SYSTEMS}</Typography>
                            <Divider />
                            <Grid container spacing={1} direction="row">
                                <Grid item xs={12}>
                                    <SearchField
                                        name="nameSearch"
                                        onChange={this.handleSearch}
                                        label={constants.SEARCH_NAME}
                                        placeholder={constants.SEARCH_NAME}
                                        valueType='all'
                                        value={nameSearch}
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
            </>
        )
    }

}


EntitlementSystems.propType = {
    classes: PropTypes.func.isRequired,
    initialValues: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isLoading,
    error: PropTypes.string,
    clearError: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onExcelExport: PropTypes.func.isRequired,
}

export default withStyles(styles)(EntitlementSystems);