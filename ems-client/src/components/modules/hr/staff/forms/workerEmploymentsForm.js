import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import Spinner from 'common/spinner';
import { Button } from 'common/gui';
import { FormTableField } from 'common/form';
import { Work, Save, Cancel, Edit } from '@material-ui/icons/';
import EmploymentFormContainer from 'containers/modules/hr/staff/forms/employmentFormContainer';

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

class WorkerEmploymentsForm extends Component {

    state = {
        tableHead: [
            {
                id: 'position',
                label: constants.WORKER_EMPLOYMENTS_TABLE_HEAD_ROW_POSITION,
                type: 'object',
            },
            {
                id: 'ou',
                label: constants.WORKER_EMPLOYMENTS_TABLE_HEAD_ROW_OU,
                type: 'object',
            },
            {
                id: 'date_from',
                label: constants.WORKER_EMPLOYMENTS_TABLE_HEAD_ROW_DATE_FROM,
                type: 'date',
            },
            {
                id: 'date_to',
                label: constants.WORKER_EMPLOYMENTS_TABLE_HEAD_ROW_DATE_TO,
                type: 'date',
            }
        ],
        rows: [],
        selected: {},
        openEmploymentDetails: null,
        opeDetailsAction: null,
    }


    handleOpenEmploymentDetails = (event, action) => {
        this.setState({openEmploymentDetails: !this.state.openEmploymentDetails, opeDetailsAction: action});
    };

    handleCloseEmploymentDetails = () => {
            this.setState({openEmploymentDetails: !this.state.openEmploymentDetails, selected: null});
    };

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, action, initialValues, onClose } = this.props;
        const { tableHead, rows, selected, openEmploymentDetails, opeDetailsAction } = this.state;
        return(
            <>
                { openEmploymentDetails &&
                    <EmploymentFormContainer
                        initialValues={opeDetailsAction==="add" ? {}: selected[0]}
                        action={opeDetailsAction}
                        open={openEmploymentDetails}
                        onClose={this.handleCloseEmploymentDetails}
                        onSubmit={this.handleSubmitEmployments}
                    />
                }
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <Work className={classes.subheaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.WORKER_EMPLOYMENTS_PERIODS}
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
                                        onAdd={(event) => this.handleOpenEmploymentDetails(event, "add")}
                                        onEdit={(event) => this.handleOpenEmploymentDetails(event, 'edit')}
                                        onDelete={(event) => this.handleDeleteEmployment(event, 'delete', )}
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

export default withStyles(styles)(WorkerEmploymentsForm);