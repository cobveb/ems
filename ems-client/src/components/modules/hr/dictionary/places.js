import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Table, Button, SearchField, SelectField } from 'common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import PlaceContainer from 'containers/modules/hr/dictionary/placeContainer';
import {escapeSpecialCharacters} from 'utils/';

const styles = theme => ({
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
})

class Places extends Component {
    state = {
        headCells: [
            {
                id: 'code',
                label: constants.TABLE_HEAD_ROW_CODE,
                type: 'number',
            },
            {
                id: 'name',
                label: constants.TABLE_HEAD_ROW_NAME,
                type: 'text',
            },
            {
                id: 'location.name',
                label: constants.HR_PLACE_SEARCH_LOCATION,
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
        location: '',
        isDetailsVisible: false,
        action:null,
    }

    filter = () => {
        let places = this.props.initialValues;
        const codeNameSearch = escapeSpecialCharacters(this.state.codeNameSearch)
        return places.filter((place) => {
            return (place.code.toLowerCase().search(
                    codeNameSearch.toLowerCase()) !== -1 ||
                place.name.toLowerCase().search(
                    codeNameSearch.toLowerCase()) !== -1) &&
                place.location.code.toLowerCase().search(
                    this.state.location.toLowerCase()) !== -1
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

    handleClose = (place) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            selected: {},
            action: null,
            rows: this.props.onClose(place),
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
        // Filter rows on close place
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
            this.state.location !== prevState.location
        ){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const { classes, isLoading, error, locations, initialValues } = this.props;
        const { headCells, rows, selected, action, codeNameSearch, location, isDetailsVisible } = this.state;
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
                        <PlaceContainer
                            initialValues={action === 'add' ? {active: true, type: 'PL'} : selected}
                            locations={locations.filter(location => location.code !== "")}
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
                                <Typography variant="h6">{constants.HR_MENU_EMPLOYEES_DICTIONARIES_PLACES}</Typography>
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
                                            name="location"
                                            onChange={this.handleSearch}
                                            label={constants.HR_PLACE_SEARCH_LOCATION}
                                            options={locations}
                                            value={location}
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

Places.propType = {
    classes: PropTypes.func.isRequired,
    initialValues: PropTypes.array.isRequired,
    locations: PropTypes.array,
    isLoading: PropTypes.bool.isLoading,
    error: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
}

export default withStyles(styles)(Places);
