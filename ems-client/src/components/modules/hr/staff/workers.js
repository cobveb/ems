import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Divider, Grid } from '@material-ui/core/';
import { ModalDialog, Spinner} from 'common/';
import * as constants from 'constants/uiNames';
import { Table, Button, SearchField } from 'common/gui';
import { Delete, Add, Edit } from '@material-ui/icons/';
import WorkerContainer from 'containers/modules/hr/staff/workerContainer';

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

class Workers extends Component {
    state = {
        rows: [],
        headCells: [
            {
                id: 'id',
                label: constants.WORKERS_TABLE_HEAD_ROW_ID,
                type:'text',
            },
            {
                id: 'name',
                label: constants.WORKERS_TABLE_HEAD_ROW_NAME,
                type:'text',
            },
            {
                id: 'surname',
                label: constants.WORKERS_TABLE_HEAD_ROW_SURNAME,
                type: 'text',
            },
        ],
        selected: {},
        isDetailsVisible: false,
        action: null,
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    render(){
        const { classes, isLoading, error, loading, clearError } = this.props;
        const { headCells, rows, selected, isDetailsVisible, action } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                { isDetailsVisible ?
                        <WorkerContainer
                            initialValues={selected}
                            changeVisibleDetails={this.handleChangeVisibleDetails}
                            action={action}
                            changeAction={this.handleChangeAction}
                            handleClose={this.handleClose}
                            //TODO: Sprawdzić czy zadziała w dzieciach bez ponownego podłączenia do Redux
                            error={error}
                            clearError={clearError}
                            isLoading={isLoading}
                            loading={loading}
                        />
                    :
                        <>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                                className={classes.root}
                            >
                                <Typography variant="h6">{constants.HR_MENU_STAFF_WORKERS}</Typography>
                                <Divider />
                                <div className={classes.content}>
                                    <Grid container spacing={0} direction="row" justify="center" className={classes.container}>
                                        <Grid item xs={6} className={classes.item}>
                                            <SearchField
                                                name="name"
                                                onChange={this.handleSearch}
                                                label={constants.WORKERS_SEARCH_NAME}
                                                placeholder={constants.WORKERS_SEARCH_NAME}
                                                valueType="all"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <SearchField
                                                name="surname"
                                                onChange={this.handleSearch}
                                                label={constants.WORKERS_SEARCH_SURNAME}
                                                placeholder={constants.WORKERS_SEARCH_SURNAME}
                                                valueType="all"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={0} direction="row" justify="flex-start" className={classes.container}>
                                        <Table
                                            className={classes.tableWrapper}
                                            rows={rows}
                                            headCells={headCells}
                                            onSelect={this.handleSelect}
                                            rowKey="id"
                                            defaultOrderBy="id"
                                        />
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                                className={classes.container}
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
                                            icon=<Add/>
                                            iconAlign="right"
                                            variant="add"
                                            onClick = { (event) => this.handleChangeVisibleDetails(event, 'add', )}
                                            data-action="add"
                                        />
                                        <Button
                                            label={constants.BUTTON_EDIT}
                                            icon=<Edit/>
                                            iconAlign="right"
                                            disabled={Object.keys(selected).length === 0}
                                            variant="edit"
                                            onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                            data-action="edit"
                                        />
                                        <Button
                                            label={constants.BUTTON_DELETE}
                                            icon=<Delete/>
                                            iconAlign="right"
                                            disabled={Object.keys(selected).length === 0 || selected.status.code !== 'ZP'}
                                            onClick = {(event) => this.handleDelete(event, 'delete', )}
                                            variant="delete"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                }
            </>
        );
    };
};


Workers.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
    loading: PropTypes.func,
};

export default withStyles(styles)(Workers);
