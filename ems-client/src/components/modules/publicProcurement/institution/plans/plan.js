import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar, InputAdornment} from '@material-ui/core/';
import { Description, Print, Cancel, Visibility, LibraryBooks, DoneAll, Undo } from '@material-ui/icons/';
import { Table, InputField, Button, SearchField, SplitButton } from 'common/gui';
import { numberWithSpaces, escapeSpecialCharacters } from 'utils/';
import { Spinner, ModalDialog } from 'common/';
import PlanPositionFormContainer from 'containers/modules/publicProcurement/institution/plans/forms/planPositionFormContainer';

const styles = theme => ({
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
    section: {
        marginBottom: theme.spacing(0),
    },
    input: {
        padding: theme.spacing(1.5),
    },
    subHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    splitButtonIcon: {
        marginRight: theme.spacing(0.7),
    },
    containerBtn: {
        width: '100%',
        paddingRight: theme.spacing(30),
        margin: 0,
    },
    tableWrapper: {
        height: `calc(100vh - ${theme.spacing(55.3)}px)`,
    },
})

class Plan extends Component {
    state = {
        rows:[],
        selected:[],
        codeNameSearch: '',
        isDetailsVisible: false,
        disabledApprove: true,
        planAction: '',
        headPzp: [
            {
                id: 'assortmentGroup.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP,
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
                id: 'status.name',
                label: constants.PUBLIC_COORDINATOR_PLANS_TABLE_HEAD_ROW_STATUS,
                type: 'object',
            },
        ],
        headPzpUpd: [
            {
                id: 'assortmentGroup.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP,
                type: 'object',
            },
            {
                id: 'estimationType.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE,
                type: 'object',
            },
            {
                id: 'correctionPlanPosition.amountRequestedNet',
                label: constants.COORDINATOR_PLAN_UPDATE_PUBLIC_POSITION_VALUE,
                suffix: 'zł.',
                type: 'object',
                subtype: 'amount',
            },
            {
                id: 'amountCorrect',
                label: constants.COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_CORRECT,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'amountRequestedNet',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET,
                suffix: 'zł.',
                type: 'amount',
            },
            {
                id: 'status.name',
                label: constants.PUBLIC_COORDINATOR_PLANS_TABLE_HEAD_ROW_STATUS,
                type: 'object',
            },
        ],
        splitOptions:[
            {
                label: constants.PUBLIC_INSTITUTION_PLAN_BUTTON_PRINT_UPDATE,
                onClick: ((event) => this.props.onPrintPlan(event, "update")),
                disabled: false,
                icon:<Print className={this.props.classes.splitButtonIcon} />,
            },
            {
                label: constants.PUBLIC_INSTITUTION_PLAN_BUTTON_PRINT_DOUBLE_GROUPS,
                onClick: ((event) => this.props.onPrintPlan(event, "double")),
                disabled: false,
                icon:<Print className={this.props.classes.splitButtonIcon} />,
            },
            {
                label: constants.BUTTON_PRINT_DETAILS,
                onClick: ((event) => this.props.onPrintPlan(event, "details")),
                disabled: false,
                icon:<Print className={this.props.classes.splitButtonIcon} />,
            },
            {
                label: constants.BUTTON_PRINT_BASIC,
                onClick: ((event) => this.props.onPrintPlan(event, "basic")),
                disabled: false,
                icon:<Print className={this.props.classes.splitButtonIcon} />,
            },
        ],
    }

    handleSelect = (id) => {
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            selected[0]= id;
            return {selected}
        });
    }

    handleDoubleClick = (id) => {
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let isDetailsVisible = {...prevState.isDetailsVisible};
            selected[0] = id;
            isDetailsVisible =  !this.state.isDetailsVisible;
            return {selected, isDetailsVisible}
        });
        this.props.getPositionDetails(id)
    }

    handleClosePlan = () => {
        this.props.onClose(this.props.initialValues);
    }

    filter = () => {
        let planPositions = this.props.initialValues.planPositions;
        const codeNameSearch = escapeSpecialCharacters(this.state.codeNameSearch)
        return planPositions.filter(position => {
            return position.assortmentGroup.code.toLowerCase().search(
                codeNameSearch.toLowerCase()) !== -1 ||
                position.assortmentGroup.name.toLowerCase().search(
                codeNameSearch.toLowerCase()) !== -1
        });
    }

    handleChangeSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleChangeVisibleDetails = () =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible}));
        this.props.getPositionDetails(this.state.selected[0])
    }

    handleClosePlanPosition = () =>{
        this.setState({
            selected: [],
            isDetailsVisible: !this.state.isDetailsVisible,
        });
    }

    handleCloseDialog = () => {
        this.setState({planAction: ""})
        this.props.clearError()
    }

    handleExcelExport = (exportType) => {
        this.props.onExcelExport(exportType, this.state.headPzp)
    }

    handleApprovePlanPosition = () => {
        this.props.onApprovePlanPosition(this.state.selected[0]);
        this.handleClosePlanPosition();
    }

    handleConfirmApprovePlan = () =>{
        this.props.onApprovePlan();
    }

    handleConfirmWithdrawPlan = () =>{
        this.props.onWithdrawPlan();
    }

    handlePlanAction = (event, action) => {
        this.setState({planAction: action})
    }

    handleCloseDialog = () => {
        this.setState({planAction: ""})
        this.props.clearError(null);
    }
    renderDialog = () =>{
            switch (this.state.planAction){
                case "approve":
                    return(
                        <ModalDialog
                            message={constants.ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_APPROVE_MESSAGE}
                            variant="confirm"
                            onConfirm={this.handleConfirmApprovePlan}
                            onClose={this.handleCloseDialog}
                        />
                    );
                case "withdraw":
                    return(
                        <ModalDialog
                            message={constants.COORDINATOR_PLANS_CONFIRM_WITHDRAW_MESSAGE}
                            variant="confirm"
                            onConfirm={this.handleConfirmWithdrawPlan}
                            onClose={this.handleCloseDialog}
                        />
                    );
                default:
                    //no default;
            }
        }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState(prevState =>{
                let rows = [...prevState.rows];
                let selected = [...prevState.selected];
                let disabledApprove = {...prevState.disabledApprove}
                rows = this.props.initialValues.planPositions;
                if(rows.filter(row => {return row.status.code !=='ZA'}).length > 0){
                    disabledApprove = true;
                } else {
                    disabledApprove = false;
                }
                if(selected.length > 0){
                    const idx = this.props.initialValues.planPositions.findIndex(position => position.id === this.state.selected[0].id)
                    if(idx !== null){
                        selected[0] = this.props.initialValues.planPositions[idx];
                    }
                }
                return {rows, selected, disabledApprove}
            });
        } else if (this.state.codeNameSearch !== prevState.codeNameSearch){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const { classes, isLoading, error, initialValues, levelAccess } = this.props;
        const { selected, headPzp, headPzpUpd, rows, isDetailsVisible, splitOptions, disabledApprove, planAction } = this.state;
        console.log(initialValues.planPositions)
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                {planAction && this.renderDialog()}

                {isDetailsVisible ?
                    <PlanPositionFormContainer
                        initialValues={selected[0]}
                        levelAccess={levelAccess}
                        planStatus={initialValues.status.code}
                        estimationTypes={this.props.estimationTypes}
                        orderTypes={this.props.orderTypes}
                        isLoading={isLoading}
                        onSubmit={this.props.onCorrectPlanPosition}
                        onApprovePlanPosition={this.handleApprovePlanPosition}
                        onClose={this.handleClosePlanPosition}
                    />
                :
                    <>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                        >
                            <Typography variant="h6">{constants.PUBLIC_INSTITUTION_PLAN_TITLE + ` - ${initialValues.year}`}</Typography>
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
                                        <Grid item xs={12} sm={1}>
                                            <InputField
                                                name="year"
                                                label={constants.COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR}
                                                disabled
                                                value={initialValues.year !== '' ? initialValues.year : ''}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <InputField
                                                name="type"
                                                label={constants.COORDINATOR_PLAN_FORM_TYPE}
                                                disabled
                                                value={initialValues.type !== undefined ? initialValues.type.name : ''}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <InputField
                                                name="amountRequestedNet"
                                                label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET}
                                                disabled
                                                value={numberWithSpaces(initialValues.amountRequestedNet) === 'NaN' ? "" : numberWithSpaces(initialValues.amountRequestedNet) }
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">zł.</InputAdornment>,
                                                    classes: {
                                                        input: classes.input,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <InputField
                                                name="amountRealizedNet"
                                                label={constants.COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_NET}
                                                disabled
                                                value={isNaN(numberWithSpaces(initialValues.amountRealizedNet)) ? "" : numberWithSpaces(initialValues.amountRealizedNet)}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">zł.</InputAdornment>,
                                                    classes: {
                                                        input: classes.input,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className={classes.section}>
                                    <Toolbar className={classes.toolbar}>
                                        <LibraryBooks className={classes.subHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1">{constants.COORDINATOR_PLAN_POSITIONS}</Typography>
                                    </Toolbar>
                                    <Grid container spacing={0} justify="center" className={classes.container}>
                                        <Grid item xs={12}>
                                            <SearchField
                                                name="codeNameSearch"
                                                onChange={this.handleChangeSearch}
                                                label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                                valueType='all'
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <Table
                                                className={classes.tableWrapper}
                                                rows={rows}
                                                headCells={initialValues.isUpdate !== undefined && initialValues.isUpdate ? headPzpUpd : headPzp}
                                                onSelect={this.handleSelect}
                                                onDoubleClick={this.handleDoubleClick}
                                                onExcelExport={this.handleExcelExport}
                                                rowKey='id'
                                                defaultOrderBy="id"
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                            className={classes.container}
                        >
                            <Grid item xs={3}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                >
                                    <SplitButton
                                        options={splitOptions}
                                        variant="cancel"
                                        icon=<Print/>
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={7}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                    className={classes.containerBtn}
                                >
                                    {initialValues.status !== undefined && initialValues.status.code === 'UT' &&
                                        <Button
                                            label={constants.BUTTON_APPROVE}
                                            icon={<DoneAll/>}
                                            iconAlign="left"
                                            variant={"submit"}
                                            disabled={disabledApprove || (initialValues.status.code !== 'UT')}
                                            onClick={(event) => this.handlePlanAction(event, 'approve')}
                                        />
                                    }
                                    <Button
                                        label={constants.BUTTON_PREVIEW}
                                        icon={<Visibility/>}
                                        iconAlign="left"
                                        disabled={Object.keys(selected).length === 0}
                                        variant={"cancel"}
                                        onClick={this.handleChangeVisibleDetails}
                                        data-action="edit"
                                    />
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
                                        label={constants.BUTTON_WITHDRAW}
                                        icon=<Undo />
                                        iconAlign="left"
                                        variant="cancel"
                                        disabled={initialValues.status !== undefined && initialValues.status.code !== 'AZ'}
                                        onClick={(event) => this.handlePlanAction(event, 'withdraw')}
                                    />
                                    <Button
                                        label={constants.BUTTON_CLOSE}
                                        icon=<Cancel/>
                                        iconAlign="left"
                                        variant="cancel"
                                        onClick={this.handleClosePlan}
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

Plan.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
};

export default withStyles(styles)(Plan);