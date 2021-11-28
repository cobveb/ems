import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider, Toolbar, InputAdornment} from '@material-ui/core/';
import { Description, Print, Cancel, Visibility, LibraryBooks } from '@material-ui/icons/';
import { Table, InputField, Button, SearchField, SplitButton } from 'common/gui';
import { numberWithSpaces, escapeSpecialCharacters } from 'utils/';
import { Spinner, ModalDialog } from 'common/';
import PlanSubPositionsContainer from 'containers/modules/publicProcurement/institution/plans/planSubPositionsContainer';

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
        selected:{},
        codeNameSearch: '',
        isDetailsVisible: false,
        headPzp: [
            {
                id: 'coordinator.name',
                label: constants.COORDINATOR,
                type: 'object',
            },
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
        ],
        splitOptions:[
            {
                label: constants.BUTTON_PRINT_DETAILS,
                onClick: (() => this.props.onPrintPlan("details")),
                disabled: false,
                icon:<Print className={this.props.classes.splitButtonIcon} />,
            },
            {
                label: constants.BUTTON_PRINT_BASIC,
                onClick: (() => this.props.onPrintPlan("basic")),
                disabled: false,
                icon:<Print className={this.props.classes.splitButtonIcon} />,
            },
        ],

    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            isDetailsVisible: !this.state.isDetailsVisible,
        });
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
    }

    handleClosePlanPosition = () =>{
        this.setState({
            selected: {},
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

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues.planPositions,
            })
        } else if (this.state.codeNameSearch !== prevState.codeNameSearch){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    render(){
        const { classes, isLoading, error, initialValues, levelAccess } = this.props;
        const { selected, headPzp, rows, isDetailsVisible, splitOptions } = this.state;
        return(
            <>
               {isLoading && <Spinner />}
               {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}

                {isDetailsVisible ?
                    <PlanSubPositionsContainer
                        initialValues={selected}
                        levelAccess={levelAccess}
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
                                                headCells={headPzp}
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
                            <Grid item xs={9}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="flex-start"
                                    className={classes.containerBtn}
                                >
                                    <Button
                                        label={constants.BUTTON_PREVIEW}
                                        icon={<Visibility/>}
                                        iconAlign="right"
                                        disabled={Object.keys(selected).length === 0}
                                        variant={"cancel"}
                                        onClick={this.handleChangeVisibleDetails}
                                        data-action="edit"
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