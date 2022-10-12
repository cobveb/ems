import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Table, Button, SearchField } from 'common/gui';
import { Delete, Add, Edit, Settings } from '@material-ui/icons/';
import CostTypeContainer from 'containers/modules/accountant/dictionary/costTypeContainer';
import {escapeSpecialCharacters} from 'utils/';
import GeneratorCostsTypesContainer from 'containers/modules/accountant/dictionary/generatorCostTypeContainer';

const styles = theme => ({
    tableWrapper: {
            minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
})

class CostsTypes extends Component {
    state = {
        headCells: [
            {
                id: 'code',
                label: constants.ACCOUNTANT_COSTS_TYPES_TABLE_HEAD_ROW_NUMBER,
                type: 'text',
            },
            {
                id: 'name',
                label: constants.ACCOUNTANT_COSTS_TYPES_TABLE_HEAD_ROW_NAME,
                type: 'text',
            },
        ],
        selected: {},
        rows: this.props.initialValues,
        codeNameSearch: '',
        isDetailsVisible: false,
        action:'',
        openGenerator: false,
        generateMsg: null,
    }

    filter = () => {
        let costs = this.props.initialValues;
        const codeNameSearch = escapeSpecialCharacters(this.state.codeNameSearch)
        return costs.filter((cost) => {
            return cost.code.toLowerCase().search(
                codeNameSearch.toLowerCase()) !== -1 ||
                cost.name.toLowerCase().search(
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

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headCells)
    }

    handleClose = (cost) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: {},
            action: '',
            rows: this.props.onClose(cost),
        }));
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    handleChangeAction = (action) => {
        this.setState({
            action: action,
        });
    }

    handleCloseDialog = () => {
        this.props.clearError(null);
        if(this.state.generateMsg !== null){
            this.setState(state => ({ generateMsg: null}));
        }
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

    handleGenerateMsg = (msg) => {
        this.setState({
            generateMsg: msg,
        })
    }

    handleGenerateCostsTypes = (msg) => {
        this.setState({
            openGenerator: !this.state.openGenerator,
        })
    }

    componentDidUpdate(prevProps, prevState){
        // Filter rows on close application
        if(this.state.action === '' && this.state.action !== prevState.action){
            this.setState({
                rows: this.filter(),
            });
        }
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
        const { classes, isLoading, error, coordinators, initialValues} = this.props;
        const { headCells, rows, selected, action, codeNameSearch, openGenerator, generateMsg } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {generateMsg &&
                    <ModalDialog
                        message={generateMsg}
                        variant="info"
                        onClose={this.handleCloseDialog}
                    />
                }
                {action === "delete" &&
                    <ModalDialog
                        message={constants.ACCOUNTANT_COSTS_TYPES_CONFIRM_DELETE_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                { openGenerator &&
                    <GeneratorCostsTypesContainer
                        open={openGenerator}
                        setupGenerateMsg={this.handleGenerateMsg}
                        onClose={this.handleGenerateCostsTypes}
                    />
                }
                <div>
                    {this.state.isDetailsVisible ?
                        <CostTypeContainer
                            initialValues={selected}
                            coordinators={coordinators}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            action={action}
                            changeAction={this.handleChangeAction}
                            onClose={this.handleClose}
                            allCosts={initialValues}
                        />
                    :
                        <>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                            >
                                <Typography variant="h6">{constants.ACCOUNTANT_SUBMENU_DICTIONARIES_COST_TYPES}</Typography>
                                <Divider />
                                <Grid container spacing={1} direction="row">
                                    <Grid item xs={12}>
                                        <SearchField
                                            name="codeNameSearch"
                                            onChange={this.handleChangeSearch}
                                            label={constants.ACCOUNTANT_COSTS_TYPES_SEARCH_NUMBER_NAME}
                                            placeholder={constants.ACCOUNTANT_COSTS_TYPES_SEARCH_NUMBER_NAME}
                                            valueType='all'
                                            value={codeNameSearch}
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
                                alignItems="flex-start"
                            >
                                <Grid item xs={1}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                    >
                                        <Button
                                            label={constants.BUTTON_GENERATE}
                                            icon=<Settings/>
                                            iconAlign="left"
                                            onClick = {this.handleGenerateCostsTypes}
                                            variant="cancel"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={11}>
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
                                </Grid>
                            </Grid>
                        </>
                    }
                </div>
            </>
        );
    };
};

CostsTypes.propType = {
    classes: PropTypes.func.isRequired,
    initialValues: PropTypes.array.isRequired,
    coordinators: PropTypes.array,
    isLoading: PropTypes.bool.isLoading,
    error: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(CostsTypes);
