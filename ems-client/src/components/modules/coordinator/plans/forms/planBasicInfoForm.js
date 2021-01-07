import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { Spinner } from 'common/';
import PropTypes from 'prop-types';
import { Button, InputField, Table } from 'common/gui';
import * as constants from 'constants/uiNames';
import { FormDateField, FormSelectField } from 'common/form';
import { Save, Cancel, Send, Description, LibraryBooks } from '@material-ui/icons/';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(27)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    section: {
        marginBottom: theme.spacing(1),
    },
    subheaderIcon: {
        marginRight: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        width: '100%',
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(53.9)}px)`,
    },
});


class PlanBasicInfoForm extends Component {
    state = {
        positions: [],
        headFin: [
            {
                id: 'costType',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_COST_TYPE,
                type: 'text',
            },
            {
                id: 'amountRequested',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
                type: 'text',
            },
            {
                id: 'amountAwarded',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS,
                type: 'text',
            },
        ],
        headInv: [
            {
                id: 'task',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK,
                type: 'text',
            },
            {
                id: 'category',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_CATEGORY,
                type: 'text',
            },
            {
                id: 'amountRequested',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
                type: 'text',
            },
            {
                id: 'amountAwarded',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS,
                type: 'text',
            },
        ],
    };

    handleOpenPositionDetails = (event, action) => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
    };

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, onClose, initialValues, types } = this.props
        const { positions, headFin, headInv } = this.state;
        return(
            <>
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <Description className={classes.subheaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.HEADING}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="number"
                                        label={constants.HEADING_NUMBER}
                                        disabled={true}
                                        value={initialValues.number ? initialValues.number : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormDateField
                                        name="year"
                                        label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR}
                                        mask="____"
                                        dateFormat="yyyy"
                                        views={["year"]}
                                        isRequired={true}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    { (Object.keys(initialValues).length === 0 || initialValues.status.code === 'ZP')
                                        ?
                                            <FormSelectField
                                                name="type"
                                                label={constants.COORDINATOR_PLAN_FORM_TYPE}
                                                isRequired={true}
                                                value={initialValues.type !== undefined ? initialValues.type : ""}
                                                options={types}
                                            />
                                        :
                                            <InputField
                                                name="type"
                                                label={constants.COORDINATOR_PLAN_FORM_TYPE}
                                                disabled={true}
                                                isRequired={true}
                                                value={initialValues.type && initialValues.type.name}
                                            />
                                    }
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="status"
                                        label={constants.HEADING_STATUS}
                                        disabled={true}
                                        value={initialValues.status ? initialValues.status.name : ''}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div>
                            <Toolbar className={classes.toolbar}>
                                <LibraryBooks className={classes.subheaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {initialValues.type.code === "FIN" ? constants.COORDINATOR_PLAN_POSITIONS_HEAD_COSTS_TYPE : constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASKS}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={0} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={12} >
                                    <Table
                                        className={classes.tableWrapper}
                                        headCells={initialValues.type.code === "FIN" ? headFin : headInv}
                                        rows={positions}
                                        rowKey="id"
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
                            className={classes.container}
                        >
                            {(Object.keys(initialValues).length === 0 || initialValues.status.code === 'ZP') &&
                                <Button
                                    label={constants.BUTTON_SAVE}
                                    icon=<Save/>
                                    iconAlign="left"
                                    type='submit'
                                    variant="submit"
                                    disabled={pristine || submitting || invalid || submitSucceeded }
                                />
                            }
                            {(Object.keys(initialValues).length === 0 || initialValues.status.code === 'ZP') &&
                                <Button
                                    label={constants.BUTTON_SEND}
                                    icon=<Send/>
                                    iconAlign="left"
                                    variant="submit"
                                    disabled={!pristine || submitting || invalid || initialValues.positions === undefined || initialValues.positions.length === 0}
                                    onClick={this.handleSend}
                                />
                            }
                            <Button
                                label={constants.BUTTON_CLOSE}
                                icon=<Cancel/>
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

PlanBasicInfoForm.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
}

export default withStyles(styles)(PlanBasicInfoForm)
