import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ModalDialog } from 'common/';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar, FormControl, FormLabel, FormHelperText } from '@material-ui/core/';
import { FormTextField, FormDictionaryField, FormCheckBox, FormTableField } from 'common/form';
import { CheckCircle, Save, Send, Print, Cancel, Assignment, Edit, Done, Redo } from '@material-ui/icons/';
import { Button, InputField } from 'common/gui';
import ApplicationPriceFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationPriceFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        maxWidth: '100%',
        paddingTop: theme.spacing(1),
    },
    container: {
        width: '100%',
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    columnContainer:{
        maxWidth: '100%',
        marginTop: theme.spacing(1),
        paddingLeft: theme.spacing(1),
    },
    formControl: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: '100%',
        maxWidth: '100%',
    },
    formControlError: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: '100%',
        maxWidth: '100%',
        color:'red'
    },
    tableWrapper: {
        overflow: 'auto',
        height: theme.spacing(20),
    },
})

class ProtocolForm extends Component {

    state ={
        selected: [],
        tableHeadPrices: [
            {
                id: 'applicationAssortmentGroup.applicationProcurementPlanPosition.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP,
                type: 'object',
            },
            {
                id: 'amountContractAwardedNet',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE_GROUP_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountContractAwardedGross',
                label: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE_GROUP_GROSS,
                suffix: 'zł.',
                type: 'amount',
            },
        ],
        openPriceDetails: false,
        action: null,
        isDelete: false,
        protocolSendLevel: null
    }

    handleSelect = (row) => {
        this.setState({selected: row});
    }

    handleDoubleClick = (row) => {
        this.setState(prevState => {
            const selected = [...prevState.selected];
            let openPriceDetails = prevState.openPriceDetails;
            let action = prevState.action;

            selected[0] = row;
            openPriceDetails = true;
            action = "edit";
            return {selected, openPriceDetails, action}
        })
    }

    handleClose = () =>{
        this.props.onClose();
        this.props.reset();
    }

    handleOpenPriceDetails = (event, action) => {
        this.setState({openPriceDetails: !this.state.openPriceDetails, action: action});
    };

    handleClosePriceDetails = () => {
        this.setState({openPriceDetails: !this.state.openPriceDetails, selected: [], action: null});
    };

    handleSubmitPrice = (values) => {
        this.props.onSavePrice(values, this.props.formCurrentValues, this.state.action);
        this.handleClosePriceDetails();
    }

    handleDelete = () =>{
        this.setState({isDelete: true})
    }

    handleConfirmDelete = () =>{
        this.props.onDeletePrice(this.state.selected[0])
        this.setState({selected: [], action: null, isDelete: false});
    }

    handleCancelDelete = () =>{
        this.setState({selected: [], action: null, isDelete: false});
    }

    handleSendLevel = (event, level) => {
        this.setState({protocolSendLevel: level});
    }

    renderSendActionDialog = () => {
        return(
            <ModalDialog
                message={this.state.protocolSendLevel === "coordinator" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONFIRM_COORDINATOR_MSG :
                    this.state.protocolSendLevel === "public" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONFIRM_PUBLIC_MSG :
                        this.state.protocolSendLevel === "accountant" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONFIRM_ACCOUNTANT_MSG :
                            this.state.protocolSendLevel === "chief" ? constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONFIRM_CHIEF_MSG :
                                constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONFIRM_SEND_BACK_MSG
                }
                variant="confirm"
                onConfirm={(event) => this.handleConfirmProtocolSend(event, this.state.protocolSendLevel)}
                onClose={() => this.setState(prevState =>{
                    return{
                        ...prevState,
                        protocolSendLevel: null,
                    }
               })}
            />
        )
    }

    handleConfirmProtocolSend = (event, level) => {
        switch(level){
            case 'coordinator':
                this.props.onSend();
                this.setState({protocolSendLevel: null});
            break;
            case 'sendBack':
                this.props.onSendBack();
                this.setState({protocolSendLevel: null});
            break;
            default:
                this.props.onApprove(level)
                this.setState({protocolSendLevel: null});
        }
    }

    render(){
        const { classes, isLoading, vats, handleSubmit, initialValues, pristine, invalid, submitting, submitSucceeded, contractors, formCurrentValues, formErrors, levelAccess } = this.props;
        const { selected, tableHeadPrices, openPriceDetails, action, isDelete, protocolSendLevel } = this.state;
        return(
            <>
                {protocolSendLevel && this.renderSendActionDialog()}
                {isDelete &&
                    <ModalDialog
                        message={constants.COORDINATOR_PLAN_POSITIONS_CONFIRM_DELETE_POSITION_MESSAGE}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDelete}
                    />
                }
                {openPriceDetails &&
                    <ApplicationPriceFormContainer
                        isLoading={isLoading}
                        open={openPriceDetails}
                        initialValues={action === 'add' ?
                            this.props.assortmentGroups.length === 1 ? {applicationAssortmentGroup : this.props.assortmentGroups[0], vat: this.props.assortmentGroups[0].vat} : {}
                                : selected[0]
                        }
                        vats={vats}
                        action={action}
                        assortmentGroups={this.props.assortmentGroups}
                        prices={this.props.initialValues.prices}
                        applicationStatus={this.props.applicationStatus}
                        applicationEstimationType={this.props.applicationEstimationType}
                        protocolStatus={this.props.initialValues.status}
                        onClose={this.handleClosePriceDetails}
                        onSubmit={this.handleSubmitPrice}
                    />
                }
                <form onSubmit={handleSubmit}>
                    <Typography variant='h6'>
                        { constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_TITLE }
                    </Typography>
                    <Divider />
                    <div className={classes.content}>
                        <Grid container spacing={1} className={classes.container}>
                            <Grid item xs={12} >
                                <InputField
                                    name="initialValues.applicationNumber"
                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_APPLICATION_NUMBER}
                                    disabled
                                    value={initialValues.applicationDetails !== undefined &&  initialValues.applicationDetails.number !== undefined && initialValues.applicationDetails.number !== null ? initialValues.applicationDetails.number : ""}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <InputField
                                    name="initialValues.orderedObject"
                                    label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT}
                                    disabled
                                    value={initialValues.applicationDetails !== undefined && initialValues.applicationDetails.orderedObject !== undefined ? initialValues.applicationDetails.orderedObject : ""}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <Toolbar className={classes.toolbar}>
                                    <CheckCircle className={classes.subHeaderIcon} fontSize="small" />
                                    <Typography variant="subtitle1" >{constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_ACCEPT_PATH}</Typography>
                                </Toolbar>
                            </Grid>
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
                                    name="publicAcceptUser"
                                    label={constants.PUBLIC_PLAN_COORDINATOR_ACCEPT_USER}
                                    disabled={true}
                                    value={initialValues.publicAcceptUser !== undefined && initialValues.publicAcceptUser !== null ?
                                        `${initialValues.publicAcceptUser.name} ${initialValues.publicAcceptUser.surname}` :
                                            ''}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <InputField
                                    name="accountantAcceptUser"
                                    label={constants.ACCOUNTANT_PLAN_COORDINATOR_ACCOUNTANT_ACCEPT_USER}
                                    disabled={true}
                                    value={initialValues.accountantAcceptUser !== undefined && initialValues.accountantAcceptUser !== null ?
                                        `${initialValues.accountantAcceptUser.name} ${initialValues.accountantAcceptUser.surname}` :
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
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                {(initialValues.contractor && formCurrentValues.contractor.code)
                                    ?
                                        <FormDictionaryField
                                            name="contractor"
                                            isRequired={true}
                                            dictionaryName={constants.ACCOUNTANT_SUBMENU_DICTIONARIES_CONTRACTORS}
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONTRACTOR_CONTRACT}
                                            items={contractors}
                                            disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') || levelAccess !== undefined}
                                        />
                                    :
                                        <FormTextField
                                            name="contractorDesc"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONTRACTOR_CONTRACT}
                                            isRequired
                                            multiline
                                            inputProps={{ maxLength: 1000 }}
                                            disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') || levelAccess !== undefined}
                                        />
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1} direction="column"  alignItems="flex-start" className={classes.columnContainer}>
                                    <FormControl required className={formErrors.email !== undefined ? classes.formControlError : classes.formControl}>
                                        <FormLabel component="label">{constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT}</FormLabel>
                                        <FormHelperText>{formErrors.email}</FormHelperText>
                                        <FormCheckBox
                                            name="email"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_EMAIL}
                                            labelPlacement="end"
                                            disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                (formCurrentValues !== undefined && formCurrentValues.renouncement) ||
                                                    levelAccess !== undefined
                                            }
                                        />
                                        <FormCheckBox
                                            name="phone"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_PHONE}
                                            labelPlacement="end"
                                            disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                (formCurrentValues !== undefined && formCurrentValues.renouncement) ||
                                                    levelAccess !== undefined
                                            }
                                        />
                                        <FormCheckBox
                                            name="internet"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_INTERNET}
                                            labelPlacement="end"
                                            disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                (formCurrentValues !== undefined && formCurrentValues.renouncement) ||
                                                    levelAccess !== undefined
                                            }
                                        />
                                        <FormCheckBox
                                            name="paper"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_PAPER}
                                            labelPlacement="end"
                                            disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                (formCurrentValues !== undefined && formCurrentValues.renouncement) ||
                                                    levelAccess !== undefined
                                            }
                                        />
                                        <FormCheckBox
                                            name="other"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_OTHER}
                                            labelPlacement="end"
                                            disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                (formCurrentValues !== undefined && formCurrentValues.renouncement) ||
                                                    levelAccess !== undefined
                                            }
                                        />
                                        {formCurrentValues !== undefined && formCurrentValues.other &&
                                            <FormTextField
                                                name="otherDesc"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_OTHER_DESC}
                                                isRequired
                                                multiline
                                                inputProps={{ maxLength: 1000 }}
                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') || levelAccess !== undefined}
                                            />
                                        }
                                        <FormCheckBox
                                            name="renouncement"
                                            label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_RENOUNCEMENT}
                                            labelPlacement="end"
                                            disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') || (formCurrentValues !== undefined &&
                                                (formCurrentValues.other || formCurrentValues.paper || formCurrentValues.internet || formCurrentValues.phone || formCurrentValues.email)) ||
                                                    levelAccess !== undefined
                                            }
                                        />
                                        {formCurrentValues !== undefined && formCurrentValues.renouncement &&
                                            <FormTextField
                                                name="nonCompetitiveOffer"
                                                label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_NON_COMPETITIVE}
                                                isRequired
                                                multiline
                                                inputProps={{ maxLength: 1000 }}
                                                disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                                    levelAccess !== undefined
                                                }
                                            />
                                        }
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <FormControl error>
                                    <Typography variant="subtitle1" ><Assignment className={classes.subHeaderIcon} fontSize="small" /> {constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE}</Typography>
                                    { formErrors !== undefined && formErrors.prices !== undefined &&
                                        <FormHelperText>{formErrors.prices}</FormHelperText>
                                    }
                                </FormControl>
                                <FormTableField
                                    className={classes.tableWrapper}
                                    name="prices"
                                    head={tableHeadPrices}
                                    allRows={this.props.initialValues !== null && this.props.initialValues.prices.length > 0 ?
                                        this.props.initialValues.prices : []
                                    }
                                    checkedRows={selected}
                                    toolbar={true}
                                    addButtonProps={{
                                        disabled: ((initialValues.status !== undefined && initialValues.status.code !== 'ZP') || initialValues.status === undefined)
                                    }}
                                    editButtonProps={{
                                        label: constants.BUTTON_EDIT,
                                        icon: <Edit/>,
                                        variant: "edit",
                                        disabled: (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                            selected.length > 0 ? false : true,
                                    }}
                                    deleteButtonProps={{
                                        disabled : (initialValues.status !== undefined && initialValues.status.code !== 'ZP') ? true :
                                            selected.length > 0 ? false : true,
                                    }}
                                    onAdd={(event) => this.handleOpenPriceDetails(event, "add")}
                                    onEdit={(event) => this.handleOpenPriceDetails(event, 'edit')}
                                    onDelete={this.handleDelete}
                                    multiChecked={false}
                                    checkedColumnFirst={true}
                                    onSelect={this.handleSelect}
                                    onDoubleClick={this.handleDoubleClick}
                                    orderBy="id"
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <FormTextField
                                    name="receivedOffers"
                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_RECEIVED_OFFERS}
                                    multiline
                                    isRequired
                                    inputProps={{ maxLength: 4000 }}
                                    disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                        levelAccess !== undefined
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <FormTextField
                                    name="justificationChoosingOffer"
                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_JUSTIFICATION_CHOOSING_OFFER}
                                    multiline
                                    isRequired
                                    inputProps={{ maxLength: 4000 }}
                                    disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                        levelAccess !== undefined
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <FormTextField
                                    name="comments"
                                    label={constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_COMMENTS}
                                    multiline
                                    inputProps={{ maxLength: 1000 }}
                                    disabled = {(initialValues.status !== undefined && initialValues.status.code !== 'ZP') ||
                                        levelAccess !== undefined
                                    }
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="flex-start"
                    >
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={2}>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                            >
                                <Button
                                    label={constants.BUTTON_PRINT}
                                    icon=<Print/>
                                    iconAlign="left"
                                    variant="cancel"
                                    disabled={initialValues.status === undefined ||
                                        (initialValues.status !== undefined && initialValues.status.code === 'ZP')
                                    }
                                    onClick={this.props.onPrint}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                            >
                                <Button
                                    label={constants.BUTTON_SAVE}
                                    icon={<Save/>}
                                    iconAlign="left"
                                    type='submit'
                                    variant='submit'
                                    disabled={(initialValues.status !== undefined && initialValues.status.code !== 'ZP') || pristine || submitting || invalid || submitSucceeded}
                                />
                                    {(initialValues.status === undefined || (initialValues.status !== undefined && ((initialValues.status.code === 'ZP' && levelAccess === undefined) ||
                                        ([undefined, 'ZP', 'WY'].includes(initialValues.status.code) && levelAccess === 'public') ||
                                            (initialValues.status.code === 'AZ' && levelAccess === 'accountant' ) ||
                                                 (initialValues.status.code === 'AK' && levelAccess === 'director')
                                    ))) &&
                                        <Button
                                            label={levelAccess === undefined ? constants.BUTTON_SEND :
                                                levelAccess !== undefined && levelAccess === 'public' && (initialValues.status !== undefined && [undefined, 'ZP'].includes(initialValues.status.code)) ? constants.BUTTON_SEND :
                                                    levelAccess !== undefined && levelAccess === 'public' && (initialValues.status !== undefined && initialValues.status.code === 'WY') ? constants.BUTTON_ACCEPT :
                                                        levelAccess !== undefined && levelAccess === 'accountant' ? constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_ACCOUNTANT :
                                                            constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_CHIEF
                                            }
                                            icon={levelAccess === undefined ?  <Send/> :
                                                levelAccess !== undefined && levelAccess === 'public' && (initialValues.status !== undefined && [undefined, 'ZP'].includes(initialValues.status.code)) ? <Send/> :
                                                    levelAccess !== undefined && levelAccess === 'public' && (initialValues.status !== undefined && initialValues.status.code === 'WY') ? <Done/> : <Done/>
                                            }
                                            iconAlign="left"
                                            variant='submit'
                                            disabled = {!pristine || formErrors.prices !== undefined || submitting || submitSucceeded}
                                            onClick={levelAccess === undefined ? (event) =>  this.handleSendLevel(event, "coordinator") :
                                                levelAccess !== undefined && levelAccess === 'public' && (initialValues.status !== undefined && [undefined, 'ZP', 'WY'].includes(initialValues.status.code)) ? (event) => this.handleSendLevel(event, "public") :
                                                    levelAccess !== undefined && levelAccess === 'accountant' ? (event) => this.handleSendLevel(event, "accountant") : (event) => this.handleSendLevel(event, "chief")
                                            }
                                        />
                                    }
                                    {(initialValues.status !== undefined && levelAccess !== undefined && ((levelAccess === 'public' && initialValues.status.code === 'WY') ||
                                        (levelAccess === 'accountant' && initialValues.status.code === 'AZ') || (levelAccess === 'director' && initialValues.status.code === 'AK')
                                    )) &&
                                        <Button
                                            label={constants.BUTTON_SEND_BACK}
                                            icon=<Redo/>
                                            iconAlign="left"
                                            variant="delete"
                                            onClick={(event) => this.handleSendLevel(event, "sendBack")}
                                        />
                                    }
                            </Grid>
                        </Grid>
                        <Grid item xs={2}>
                            <Grid
                                container
                                direction="row"
                                justify="flex-end"
                                alignItems="flex-start"
                            >
                                <Button
                                    label={constants.BUTTON_CLOSE}
                                    icon=<Cancel/>
                                    iconAlign="left"
                                    variant="cancel"
                                    onClick={this.handleClose}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </>
        );
    };
};

ProtocolForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProtocolForm);