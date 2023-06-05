import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { Spinner } from 'common/';
import { withStyles, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@material-ui/core/';
import { Close, Cancel } from '@material-ui/icons/';
import { Button, Table } from 'common/gui';

const styles = theme => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogTitle: {
        paddingBottom: theme.spacing(1),
    },
})

class PlanPositionRealization extends Component {
    state = {
        headCells: [
            {
                id: 'invoiceNumber',
                label: constants.COORDINATOR_REALIZATION_INVOICE_NUMBER,
                type: 'text',
            },
            {
                id: 'invoiceSellDate',
                label: constants.COORDINATOR_REALIZATION_INVOICE_SALE_DATE,
                type:'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'invoiceContractorName',
                label: constants.COORDINATOR_REALIZATION_INVOICE_CONTRACTOR,
                type: 'text',
            },
            {
                id: 'name.content',
                label: constants.COORDINATOR_REALIZATION_INVOICE_POSITION_NAME,
                type: 'object',
            },
            {
                id: 'amountNet',
                label: constants.COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountGross',
                label: constants.COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        headInstitutionCells: [
            {
                id: 'invoiceNumber',
                label: constants.COORDINATOR_REALIZATION_INVOICE_NUMBER,
                type: 'text',
            },
            {
                id: 'coordinatorName',
                label: constants.ORGANIZATION_UNIT_COORDINATOR,
                type: 'text',
            },
            {
                id: 'invoiceSellDate',
                label: constants.COORDINATOR_REALIZATION_INVOICE_SALE_DATE,
                type:'date',
                dateFormat: 'dd-MM-yyyy',
            },
            {
                id: 'invoiceContractorName',
                label: constants.COORDINATOR_REALIZATION_INVOICE_CONTRACTOR,
                type: 'text',
            },
            {
                id: 'name.content',
                label: constants.COORDINATOR_REALIZATION_INVOICE_POSITION_NAME,
                type: 'object',
            },
            {
                id: 'amountNet',
                label: constants.COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountGross',
                label: constants.COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ]
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.props.isInstitutionPlan ? this.state.headInstitutionCells  : this.state.headCells)
    }


    render(){
        const { classes, initialValues, open, onClose, isLoading, planType, planPosition, isInstitutionPlan } = this.props;
        const { headCells, headInstitutionCells } = this.state;
        return (
            <>
                <Dialog
                    open={open}
                    onClose={onClose}
                    fullWidth={true}
                    maxWidth="xl"
                    disableBackdropClick={true}
                >
                    { isLoading && <Spinner /> }
                        <DialogTitle disableTypography={true} className={classes.dialogTitle}>
                            <Grid
                                container
                                direction="row"
                                spacing={0}
                                className={classes.container}
                            >
                                <Grid item xs={12} >
                                    <Typography variant='h6'>
                                        {constants.COORDINATOR_PLAN_POSITION_REALIZATION_TITLE}
                                            {planType === 'FIN' ? ` ${planPosition.costType.name}` : ` ${planPosition.task}`
                                        }
                                    </Typography>
                                    <IconButton aria-label="Close"
                                        className={classes.closeButton}
                                        onClick={onClose}
                                    >
                                        <Close fontSize='small'/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                            </Grid>
                        </DialogTitle>
                        <DialogContent >
                            <Table
                                className={classes.tableWrapper}
                                rows={initialValues}
                                headCells={isInstitutionPlan ? headInstitutionCells  : headCells}
                                onSelect={()=>{}}
                                onDoubleClick={()=>{}}
                                onExcelExport={this.handleExcelExport}
                                rowKey="id"
                                defaultOrderBy="invoiceSellDate"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12} >
                                    <Divider />
                                </Grid>
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel/>
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={onClose}
                                    />
                            </Grid>
                        </DialogActions>
                </Dialog>
            </>
        )
    }
}

PlanPositionRealization.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.array.isRequired,
};

export default withStyles(styles)(PlanPositionRealization);