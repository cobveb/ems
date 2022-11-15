import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import { Table, Button, SearchField, SelectField } from 'common/gui';
import { Visibility } from '@material-ui/icons/';
import ApplicationProtocolContainer from 'containers/modules/coordinator/publicProcurement/applications/applicationProtocolContainer';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content: {
        height: `calc(100vh - ${theme.spacing(18)}px)`,
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
});


class Protocols extends Component {

    state = {
        selected:{},
        isDetailsVisible: false,
        number: '',
        status: '',
        coordinator:'',
        rows:[],
        headCells: [
            {
                id: 'number',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_NUMBER,
                type: 'text',
            },
            {
                id: 'orderedObject',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT,
                type: 'text',
            },
            {
                id: 'status.name',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS,
                type: 'object',
            },
        ]
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleChangeVisibleDetails = () => {
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
        });
    }

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            isDetailsVisible: !this.state.isDetailsVisible,
        });
    }

    handleDataChange = (id) => (date) => {
       this.setState({[id]: date})
    }

    handleCloseDialog = () => {
        this.props.clearError(null);
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    filter = () => {
        let protocols = this.props.initialValues;
        return protocols.filter((protocol) => {
            return protocol.status.code.toLowerCase().search(
                this.state.status.toLowerCase()) !== -1 &&
                protocol.applicationCoordinator.code.toLowerCase().search(
                    this.state.coordinator.toLowerCase()) !== -1 &&
                (
                    this.state.number !== '' ?
                        protocol.number !== null ?
                            protocol.number.toLowerCase().search(
                                this.state.number.toLowerCase()) !== -1
                        : null
                    : protocol
                )
        })
    }

    handleCloseDetails = (protocol, action) => {
        this.props.onClose(protocol, action);
        this.setState(prevState => {
            let rows = [...prevState.rows];
            let isDetailsVisible = prevState.isDetailsVisible;
            let selected = {...prevState.selected}

            rows = this.filter();
            isDetailsVisible = !isDetailsVisible;
            selected = {};

            return {rows, isDetailsVisible, selected };
        });
    };

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.filter(),
            });
        } else if (this.state.coordinator !== prevState.coordinator ||
            this.state.status !== prevState.status ||
            this.state.number !== prevState.number)
        {
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const { classes, isLoading, error, coordinators, statuses, levelAccess, vats } = this.props;
        const { selected, isDetailsVisible, status, headCells, rows, coordinator, number } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                {isDetailsVisible ?
                    <>
                        <ApplicationProtocolContainer
                            initialValues={selected}
                            assortmentGroups={[]}
                            vats={vats}
                            contractors={[]}
                            statuses={statuses}
                            applicationStatus={selected.applicationStatus}
                            levelAccess={levelAccess}
//                            onClose={this.handleChangeVisibleDetails}
                            onClose={this.handleCloseDetails}
                        />

                    </>
                :
                    <>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                            className={classes.root}
                        >
                            <Typography variant="h6">{constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOLS_TITLE}</Typography>
                            <Divider />
                            <div className={classes.content}>
                                <Grid container spacing={0} direction="row" justify="center" className={classes.container}>
                                    <Grid item xs={3} className={classes.item}>
                                        <SearchField
                                            name="number"
                                            onChange={this.handleSearch}
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_NUMBER}
                                            placeholder={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_NUMBER}
                                            value={number}
                                            valueType="all"
                                        />
                                    </Grid>
                                    <Grid item xs={7} className={classes.item}>
                                        <SelectField
                                            name="coordinator"
                                            onChange={this.handleSearch}
                                            label={constants.ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_COORDINATOR}
                                            options={coordinators}
                                            value={coordinator}
                                        />
                                    </Grid>
                                    <Grid item xs={2} className={classes.item}>
                                        <SelectField
                                            name="status"
                                            onChange={this.handleSearch}
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS}
                                            options={statuses}
                                            value={status}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className={classes.item}>
                                        <Table
                                            className={classes.tableWrapper}
                                            rows={rows}
                                            headCells={headCells}
                                            onSelect={this.handleSelect}
                                            onDoubleClick={this.handleDoubleClick}
                                            onExcelExport={this.handleExcelExport}
                                            rowKey="id"
                                            defaultOrderBy="id"
                                        />
                                    </Grid>
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
                                        label={constants.BUTTON_PREVIEW}
                                        icon=<Visibility />
                                        iconAlign="right"
                                        variant="cancel"
                                        disabled={Object.keys(selected).length === 0}
                                        onClick = {this.handleChangeVisibleDetails}
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

Protocols.propTypes = {
	initialValues: PropTypes.array.isRequired,
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
    coordinators: PropTypes.array.isRequired,
    statuses: PropTypes.array.isRequired,
    levelAccess: PropTypes.string.isRequired,
};

export default withStyles(styles)(Protocols);
