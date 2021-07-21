import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider, Toolbar }  from '@material-ui/core/';
import { Spinner, ModalDialog } from 'common/';
import PropTypes from 'prop-types';
import { Button, InputField } from 'common/gui';
import * as constants from 'constants/uiNames';
import { FormTableField, FormAmountField} from 'common/form';
import { Cancel, Description, LibraryBooks, CheckCircle, DoneAll } from '@material-ui/icons/';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
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
    container: {
        width: '100%',
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(54.5)}px)`,
    },
});


class PlanBasicInfoForm extends Component {
    state = {
        planAction: null,
        approveType: null,
        positions: this.props.initialValues.positions,
        selected:[],
        headFin: [
            {
                id: 'costType.code',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_COST_TYPE,
                type: 'object',
            },
            {
                id: 'costType.name',
                label: constants.COORDINATOR_PLAN_POSITIONS_HEAD_COST_NAME,
                type: 'object',
            },
            {
                id: 'amountRequestedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountAwardedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountRealizedGross',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS,
                suffix: 'zł.',
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
                id: 'amountRequested',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountAwarded',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountRealized',
                label: constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },

        ],
        headPzp: [
            {
                id: 'assortmentGroup.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP,
                type: 'object',
            },
            {
                id: 'orderType.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDER_TYPE,
                type: 'object',
            },
            {
                id: 'estimationType.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE,
                type: 'object',
            },
            {
                id: 'amountRequestedNet',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'initiationTerm',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_INITIATION_TERM,
                suffix: 'zł.',
                type: 'text',
            },
        ],
    };

    handleClose = () =>{
        this.props.onClose(this.props.initialValues);
        this.props.reset();
    };

    handleCancelClose = () => {
        this.setState({formChanged: false});
    }

    handleConfirmClose = () => {
        this.setState({formChanged: false});
        this.props.onClose();
        this.props.reset();
    }

    handleApprove = (event, approveType) => {
        this.setState({ planAction: 'approve', approveType: approveType });
    }

    handleCancelApprove = () => {
        this.setState({ planAction: null, approveType: null });
    }

    handleConfirmApprove = () => {
        if(this.state.approveType === 'approveDirector') {
            this.props.onApproveDirector();
        } else {
            this.props.onApproveChief();
        }
        this.setState({
            selected: [],
            planAction: null,
            approveType: null,
        })
    }

    handleExcelExport = (exportType) => {
        const {initialValues} = this.props;
        const {headFin, headInv, headPzp} = this.state;
        this.props.onExcelExport(exportType, initialValues.type !== undefined && initialValues.type.code === "FIN" ?
            headFin : initialValues.type !== undefined && initialValues.type.code === "INV" ? headInv :
                headPzp)
    }

    componentDidUpdate(prevProps){

        if(this.props.initialValues.positions !== prevProps.initialValues.positions){
            this.setState({
                positions: this.props.initialValues.positions,
            });
        }
    }

    render(){
        const { handleSubmit, submitting, classes, initialValues } = this.props
        const { headFin, headInv, headPzp, selected, positions, planAction } = this.state;
            return(
            <>
                { planAction &&
                    <ModalDialog
                        message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_APPROVE_MESSAGE}
                        variant="confirm"
                        onConfirm={this.handleConfirmApprove}
                        onClose={this.handleCancelApprove}
                    />
                }
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <Typography
                        variant="h6"
                    >
                        { Object.keys(initialValues).length > 1 &&
                            constants.DIRECTOR_COORDINATOR_PLAN_TITLE + `${initialValues.type.name} - ${initialValues.coordinator.name} - ${initialValues.year} `
                        }
                    </Typography>
                    <Divider />
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Toolbar className={classes.toolbar}>
                                <Description className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.HEADING}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="year"
                                        label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR}
                                        value={initialValues.year !== undefined ? initialValues.year : ''}
                                        isRequired={true}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <InputField
                                        name="type"
                                        label={constants.COORDINATOR_PLAN_FORM_TYPE}
                                        disabled={true}
                                        isRequired={true}
                                        value={initialValues.type !== undefined ? initialValues.type.name : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <InputField
                                        name="status"
                                        label={constants.HEADING_STATUS}
                                        disabled={true}
                                        value={initialValues.status !== undefined ? initialValues.status.name : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={initialValues.type !== undefined && initialValues.type.code === 'FIN' ? 4 : 6}>
                                    <FormAmountField
                                        name={initialValues.type !== undefined && initialValues.type.code === 'FIN' ?
                                            "planAmountRequestedGross" : "planAmountRequestedNet"}
                                        label={initialValues.type !== undefined && initialValues.type.code === 'FIN' ?
                                            constants.COORDINATOR_PLAN_FINANCIAL_REQUESTED_VALUE : constants.COORDINATOR_PLAN_PUBLIC_PROCUREMENT_REQUESTED_VALUE}
                                        suffix={'zł.'}
                                        disabled
                                    />
                                </Grid>
                                { (initialValues.type !== undefined && initialValues.type.code === 'FIN') &&
                                    <Grid item xs={12} sm={4}>
                                        <FormAmountField
                                            name="planAmountAwardedGross"
                                            label={constants.COORDINATOR_PLAN_FINANCIAL_AWARDED_VALUE}
                                            suffix={'zł.'}
                                            disabled
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12} sm={initialValues.type !== undefined && initialValues.type.code === 'FIN' ? 4 : 6}>
                                    <FormAmountField
                                        name={initialValues.type !== undefined && initialValues.type.code === 'FIN' ?
                                            "planAmountRealizedGross" : "planAmountRealizedNet"}
                                        label={initialValues.type !== undefined && initialValues.type.code === 'FIN' ?
                                            constants.COORDINATOR_PLAN_FINANCIAL_REALIZED_VALUE : constants.COORDINATOR_PLAN_PUBLIC_PROCUREMENT_REALIZED_VALUE}
                                        suffix={'zł.'}
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                            <Toolbar className={classes.toolbar}>
                                <CheckCircle className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    {constants.COORDINATOR_PLAN_ACCEPT_PATH}
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={1} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="sendUser"
                                        label={constants.COORDINATOR}
                                        disabled={true}
                                        value={initialValues.sendUser !== undefined && initialValues.sendUser !== null ?
                                            `${initialValues.sendUser.name} ${initialValues.sendUser.surname}` :
                                                ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="planAcceptUser"
                                        label={initialValues.type !== undefined && initialValues.type.code !== 'PZP' ?
                                            constants.ACCOUNTANT_PLAN_COORDINATOR_ACCOUNTANT_ACCEPT_USER : constants.PUBLIC_PLAN_COORDINATOR_ACCEPT_USER}
                                        disabled={true}
                                        value={initialValues.planAcceptUser !== undefined && initialValues.planAcceptUser !== null ?
                                            `${initialValues.planAcceptUser.name} ${initialValues.planAcceptUser.surname}` :
                                                ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="directorAcceptUser"
                                        label={constants.ACCOUNTANT_PLAN_COORDINATOR_DIRECTOR_ACCEPT_USER}
                                        disabled={true}
                                        value={initialValues.directorAcceptUser !== undefined && initialValues.directorAcceptUser !== null ?
                                            `${initialValues.directorAcceptUser.name} ${initialValues.directorAcceptUser.surname}` :
                                                ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="chiefAcceptUser"
                                        label={constants.ACCOUNTANT_PLAN_COORDINATOR_CHIEF_ACCEPT_USER}
                                        disabled={true}
                                        value={initialValues.chiefAcceptUser !== undefined && initialValues.chiefAcceptUser !== null ?
                                            `${initialValues.chiefAcceptUser.name} ${initialValues.chiefAcceptUser.surname}` :
                                                ''}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div>
                            <Toolbar className={classes.toolbar}>
                                <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                <Typography variant="subtitle1" >
                                    { initialValues.type !== undefined && initialValues.type.code === "FIN" ? constants.COORDINATOR_PLAN_POSITIONS_HEAD_COSTS_TYPE :
                                        initialValues.type !== undefined && initialValues.type.code === "INW" ? constants.COORDINATOR_PLAN_POSITIONS_HEAD_TASKS :
                                           constants.POSITIONS
                                    }
                                </Typography>
                            </Toolbar>
                            <Grid container spacing={0} justify="center" className={classes.container}>
                                <Grid item xs={12} sm={12} >
                                    <FormTableField
                                        className={classes.tableWrapper}
                                        name="positions"
                                        head={ initialValues.type !== undefined && initialValues.type.code === "FIN" ? headFin : initialValues.type !== undefined && initialValues.type.code === "INV" ? headInv : headPzp}
                                        allRows={positions}
                                        checkedRows={selected}
                                        toolbar={false}
                                        multiChecked={false}
                                        checkedColumnFirst={true}
                                        onExcelExport={this.handleExcelExport}
                                        orderBy="id"
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
                            {(initialValues.status !== undefined && ['AZ','AK','SK','AD'].includes(initialValues.status.code))  &&
                                <Button
                                    label={constants.BUTTON_APPROVE}
                                    icon=<DoneAll/>
                                    iconAlign="left"
                                    variant="submit"
                                    onClick={initialValues.status.code === 'AK' || initialValues.status.code === 'SK' || initialValues.status.code === 'AZ' ?
                                        (event) => this.handleApprove(event, "approveDirector") :
                                            (event) => this.handleApprove(event, "approveChief")}
                                />
                            }
                            <Button
                                label={constants.BUTTON_CLOSE}
                                icon=<Cancel/>
                                iconAlign="left"
                                variant="cancel"
                                onClick={this.handleClose}
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
