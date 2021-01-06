import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import Spinner from 'common/spinner';
import { Button } from 'common/gui';
import { FormTableField } from 'common/form';
import { RecentActors, Save, Cancel, Edit } from '@material-ui/icons/';
import FunctionFormContainer from 'containers/modules/hr/staff/forms/functionFormContainer';


const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(28)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    subheaderIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        maxWidth: '100%',
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(40.5)}px)`,
    },
});

class WorkerFunctionsForm extends Component {

    state = {
        tableHead: [
            {
                id: 'commission',
                label: constants.WORKER_FUNCTIONS_TABLE_HEAD_ROW_COMMISSION,
                type: 'object',
            },
            {
                id: 'function',
                label: constants.WORKER_FUNCTIONS_TABLE_HEAD_ROW_FUNCTION,
                type: 'object',
            },
            {
                id: 'date_from',
                label: constants.WORKER_FUNCTIONS_TABLE_HEAD_ROW_DATE_FROM,
                type: 'date',
            },
            {
                id: 'date_to',
                label: constants.WORKER_FUNCTIONS_TABLE_HEAD_ROW_DATE_TO,
                type: 'date',
            }
        ],
        rows: [],
        selected: {},
        openFunctionDetails: null,
        opeDetailsAction: null,
    }

    handleOpenFunctionDetails = (event, action) => {
        this.setState({openFunctionDetails: !this.state.openFunctionDetails, opeDetailsAction: action});
    };

    handleCloseFunctionDetails = () => {
            this.setState({openFunctionDetails: !this.state.openFunctionDetails, selected: null});
    };
    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, action, initialValues, onClose } = this.props;
        const { tableHead, rows, selected, openFunctionDetails, opeDetailsAction } = this.state;
        return(
            <>
                { openFunctionDetails &&
                    <FunctionFormContainer
                        initialValues={opeDetailsAction==="add" ? {}: selected[0]}
                        action={opeDetailsAction}
                        open={openFunctionDetails}
                        onClose={this.handleCloseFunctionDetails}
                        onSubmit={this.handleSubmitFunctions}
                    />
                }
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <RecentActors className={classes.subheaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.WORKER_FUNCTIONS}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={0} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={12} >
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="years"
                                        head={tableHead}
                                        allRows={rows}
                                        checkedRows={selected ? selected : []}
                                        toolbar={true}
                                        editButtonProps={{
                                            label :constants.BUTTON_EDIT,
                                            icon : <Edit/>,
                                            variant: "edit",
                                        }}
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
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Button
                                label={constants.BUTTON_SAVE}
                                icon=<Save />
                                iconAlign="left"
                                type='submit'
                                variant="submit"
                                disabled={pristine || submitting || invalid || submitSucceeded }
                            />
                            <Button
                                label={constants.BUTTON_CLOSE}
                                icon=<Cancel />
                                iconAlign="left"
                                variant="cancel"
                                onClick={onClose}
                            />
                        </Grid>
                    </div>
                </form>
            </>
        );
    };
};

export default withStyles(styles)(WorkerFunctionsForm);