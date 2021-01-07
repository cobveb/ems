import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import {Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Button } from 'common/gui';
import * as constants from 'constants/uiNames';
import { FormTableField } from 'common/form';
import { Save, Cancel, LibraryBooks, Edit, Visibility } from '@material-ui/icons/';
import PlanPositionFormContainer from 'containers/modules/coordinator/plans/forms/planPositionFormContainer';

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
        marginBottom: theme.spacing(0),
    },
    subHeaderIcon: {
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
        height: `calc(100vh - ${theme.spacing(38.6)}px)`,
    },
});


class PlanPositionsForm extends Component {
    state = {
        openPositionDetails: false,
        positionAction: '',
        selected: [],
        nextValPosition: 1,
        headFin: [
            {
                id: 'name',
                label: constants.COORDINATOR_PLAN_POSITIONS_FINANCIAL_HEAD_NAME,
                type: 'text',
            },
            {
                id: 'costType.number',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_COST_TYPE,
                type: 'object',
            },
            {
                id: 'amountRequestedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
                type: 'amount',
            },
        ],
        headInv: [
            {
                id: 'task',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASK,
                type: 'text',
            },
            {
                id: 'category.name',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_CATEGORY,
                type: 'object',
            },
            //TODO: Zmienić na typ amount w momoencie przesyłania podsumowania wydatków
            {
                id: 'amountRequested',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
                type: 'text',
            },
            //TODO: Zmienić na typ amount w momoencie przesyłania podsumowania wydatków
            {
                id: 'amountAwarded',
                label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS,
                type: 'text',
            },
        ],
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

        handleOpenPositionDetails = (event, action) => {
            this.setState({openPositionDetails: !this.state.openPositionDetails, positionAction: action});
        };

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: []});
    };

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, onClose, initialValues, planStatus, planType, vats, units, categories, foundingSources, costsTypes } = this.props
        const { openPositionDetails, positionAction, selected, headFin, headInv } = this.state;
        console.log(initialValues)
        return(
            <>
                {positionAction === "delete" &&
                        <ModalDialog
                            message={constants.COORDINATOR_PLAN_POSITIONS_CONFIRM_DELETE_POSITION_MESSAGE}
                            variant="warning"
                            onConfirm={this.handleConfirmDelete}
                            onClose={this.handleCancelDelete}
                        />
                }
                {openPositionDetails &&
                    <PlanPositionFormContainer
                        initialValues={positionAction === 'add' ? {} : selected[0]}
                        action={positionAction}
                        planStatus={planStatus}
                        planType={planType}
                        vats={vats}
                        units={units}
                        categories={categories}
                        costsTypes={costsTypes}
                        foundingSources={foundingSources}
                        open={openPositionDetails}
                        onClose={this.handleCloseDetails}
                    />
                }
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.POSITIONS}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={0} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={12} >
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="positions"
                                        head={planType === "FIN" ? headFin : headInv}
                                        allRows={initialValues}
                                        checkedRows={selected}
                                        toolbar={true}
                                        addButtonProps={{
                                            disabled : (planStatus === null || planStatus !== 'ZP') ? true : false
                                        }}
                                        editButtonProps={{
                                            label : (planStatus === 'ZP') ?  constants.BUTTON_EDIT : constants.BUTTON_PREVIEW,
                                            icon : (planStatus === 'ZP') ?  <Edit/> : <Visibility/>,
                                            variant: (planStatus === 'ZP') ?  "edit" : "cancel",
                                        }}
                                        deleteButtonProps={{
                                            disabled : (initialValues.length === 0 || planStatus === 'ZP'
                                                ?
                                                    selected.length > 0  && (selected[0].status.code === 'DO' || selected[0].status.code === 'ZP') ?  false : true
                                                :
                                                    true
                                            )
                                        }}
                                        onAdd={(event) => this.handleOpenPositionDetails(event, "add")}
                                        onEdit={(event) => this.handleOpenPositionDetails(event, 'edit')}
                                        onDelete={(event) => this.handleDeletePosition(event, 'delete', )}
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
                            {planStatus === 'ZP' &&
                                <Button
                                    label={constants.BUTTON_SAVE}
                                    icon=<Save/>
                                    iconAlign="left"
                                    type='submit'
                                    variant="submit"
                                    disabled={pristine || submitting || invalid || submitSucceeded }
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

PlanPositionsForm.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    initialValues: PropTypes.array.isRequired,
}

export default withStyles(styles)(PlanPositionsForm)
