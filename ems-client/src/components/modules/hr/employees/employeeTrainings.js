import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import Spinner from 'common/spinner';
import { Button, Table } from 'common/gui';
import { RecentActors, Cancel, Add, Edit, Delete } from '@material-ui/icons/';
import TrainingFormContainer from 'containers/modules/hr/employees/forms/trainingFormContainer';


const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(25.1)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        maxWidth: '100%',
    },
    containerButtons: {
        maxWidth: '100%',
        paddingLeft: theme.spacing(10),
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(39.8)}px)`,
    },
});

class EMPLOYEETrainingForm extends Component {

    state = {
        tableHead: [
            {
                id: 'type',
                label: constants.EMPLOYEE_TRAINING_TABLE_HEAD_ROW_TYPE,
                type: 'object',
            },
            {
                id: 'name',
                label: constants.EMPLOYEE_TRAINING_TABLE_HEAD_ROW_NAME,
                type: 'object',
            },
            {
                id: 'date',
                label: constants.EMPLOYEE_TRAINING_TABLE_HEAD_ROW_DATE,
                type: 'date',
            },
        ],
        rows: [],
        selected: null,
        openTrainingDetails: null,
        opeDetailsAction: null,
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleOpenTrainingDetails = (event, action) => {
        this.setState({openTrainingDetails: !this.state.openTrainingDetails, opeDetailsAction: action});
    };

    handleCloseTrainingDetails = () => {
            this.setState({openTrainingDetails: !this.state.openTrainingDetails, selected: null});
    };
    render(){
        const { classes, action, initialValues, onClose, isLoading } = this.props;
        const { tableHead, rows, selected, openTrainingDetails, opeDetailsAction } = this.state;
        return(
            <>
                { openTrainingDetails &&
                    <TrainingFormContainer
                        initialValues={opeDetailsAction==="add" ? {}: selected[0]}
                        action={opeDetailsAction}
                        open={openTrainingDetails}
                        onClose={this.handleCloseTrainingDetails}
                        onSubmit={this.handleSubmitFunctions}
                    />
                }
                <>
                    { isLoading && <Spinner /> }
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <RecentActors className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.EMPLOYEE_TRAININGS}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={0} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={12} >
                                    <Table
                                        className={classes.tableWrapper}
                                        name="trainings"
                                        headCells={tableHead}
                                        rows={rows}
                                        rowKey="id"
                                        defaultOrderBy="id"
                                        onAdd={(event) => this.handleOpenFunctionDetails(event, "add")}
                                        onEdit={(event) => this.handleOpenFunctionDetails(event, 'edit')}
                                        onDelete={(event) => this.handleDeleteFunction(event, 'delete', )}
                                        multiChecked={false}
                                        checkedColumnFirst={true}
                                        onSelect={this.handleSelect}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <div>
                        <Divider />
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-start"
                        >
                            <Grid item xs={10}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                    className={classes.containerButtons}
                                >
                                    <Button
                                        label={constants.BUTTON_ADD}
                                        icon=<Add/>
                                        iconAlign="right"
                                        variant="add"
                                        onClick = { (event) => this.handleOpenTrainingDetails(event, 'add', )}
                                        data-action="add"
                                    />
                                    <Button
                                        label={constants.BUTTON_EDIT}
                                        icon=<Edit/>
                                        iconAlign="right"
                                        disabled={selected === null}
                                        variant="edit"
                                        onClick = { (event) => this.handleOpenTrainingDetails(event, 'edit', )}
                                        data-action="edit"
                                    />
                                    <Button
                                        label={constants.BUTTON_DELETE}
                                        icon=<Delete/>
                                        iconAlign="right"
                                        disabled={selected === null}
                                        onClick = {this.handleDeleteTraining}
                                        variant="delete"
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={2}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-start"
                                    className={classes.container}
                                >
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel />
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={onClose}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </>
            </>
        );
    };
};

export default withStyles(styles)(EMPLOYEETrainingForm);