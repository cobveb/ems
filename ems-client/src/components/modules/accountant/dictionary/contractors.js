import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { Table, Button, SearchField } from 'common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import { Spinner, ModalDialog } from 'common/';
import ContractorContainer from 'containers/modules/accountant/dictionary/contractorContainer';
import {escapeSpecialCharacters} from 'utils/';

const styles = theme => ({
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
})


class Contractors extends Component {
    state = {
        headCells: [
            {
                id: 'code',
                label: constants.ACCOUNTANT_CONTRACTORS_TABLE_HEAD_ROW_CODE,
                type: 'text',
            },
            {
                id: 'name',
                label: constants.ACCOUNTANT_CONTRACTORS_TABLE_HEAD_ROW_NAME,
                type: 'text',
            },
        ],
        rows: this.props.initialValues,
        selected: {},
        isDetailsVisible: false,
        codeNameSearch: '',
        action: '',
    };

    filter = () => {
        let contractors = this.props.initialValues;
        const codeNameSearch = escapeSpecialCharacters(this.state.codeNameSearch)
        return contractors.filter((contractor) => {
            return contractor.code.toLowerCase().search(
                codeNameSearch.toLowerCase()) !== -1 ||
                contractor.name.toLowerCase().search(
                codeNameSearch.toLowerCase()) !== -1
        });
    }

    handleChangeSearch = (event) => {
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

    handleClose = (contractor) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: {},
            action: '',
            rows: this.props.onClose(contractor),
        }));
    }

    handleCloseDialog = () => {
        this.props.clearError(null);
        this.setState({action: ''});
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    handleDelete = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleConfirmDelete = () => {
        this.props.onDelete(this.state.selected.id);
        this.setState({
            action: '',
            selected: {},
        });
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues,
            });
        } else if (this.state.codeNameSearch !== prevState.codeNameSearch){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const { classes, isLoading, error } = this.props;
        const { headCells, rows, selected, action, isDetailsVisible } = this.state;

        return(
            <>
                { isLoading && <Spinner /> }
                { error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/> }
                {action === "delete" &&
                    <ModalDialog
                        message={constants.ACCOUNTANT_CONTRACTOR_CONFIRM_DELETE_MESSAGE}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                { isDetailsVisible &&
                    <ContractorContainer
                        initialValues={selected}
                        open={isDetailsVisible}
                        action={action}
                        onClose={this.handleClose}
                    />
                }
                <Grid
                    container
                    direction="column"
                    spacing={0}
                >
                    <Typography variant="h6">{constants.ACCOUNTANT_SUBMENU_DICTIONARIES_CONTRACTORS}</Typography>
                    <Divider />
                    <Grid container spacing={1} direction="row">
                        <Grid item xs={12}>
                            <SearchField
                                name="codeNameSearch"
                                onChange={this.handleChangeSearch}
                                label={constants.ACCOUNTANT_CONTRACTORS_SEARCH_CODE_NAME}
                                placeholder={constants.ACCOUNTANT_CONTRACTORS_SEARCH_CODE_NAME}
                                valueType='all'
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
                        defaultOrderBy="code"
                        rowKey="id"
                    />
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="flex-end"
                >
                    <Button
                        label={constants.BUTTON_ADD}
                        icon=<Add className={classes.icon}/>
                        iconAlign="right"
                        variant="add"
                        onClick = { (event) => this.handleChangeVisibleDetails(event, 'add', )}
                        data-action="add"
                    />
                    <Button
                        label={constants.BUTTON_EDIT}
                        icon=<Edit className={classes.icon}/>
                        iconAlign="right"
                        disabled={Object.keys(selected).length === 0}
                        variant="edit"
                        onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                        data-action="edit"
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

            </>
        );
    };
};

Contractors.propType = {
    classes: PropTypes.func.isRequired,
    initialValues: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isLoading,
    error: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(Contractors);