import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider, Toolbar, InputAdornment} from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { LibraryBooks, Cancel, Visibility } from '@material-ui/icons/';
import { InputField, Table, Button } from 'common/gui';
import { numberWithSpaces } from 'utils/';
import PlanPublicProcurementPositionDetailsFormContainer from 'containers/modules/coordinator/plans/forms/planPublicProcurementPositionDetailsFormContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    container: {
        width: '100%',
    },
    toolbar: {
        minHeight: theme.spacing(6),
    },
    toolbarHeaderIcon: {
        marginRight: theme.spacing(1),
    },
    section: {
        marginBottom: theme.spacing(0),
        height: '100%',
    },
    input: {
        padding: theme.spacing(1.5),
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(45.5)}px)`,
    },
})

class PlanSubPositions extends Component {
    state = {
        rows:[],
        selected:{},
        openPositionDetails: false,
        headCells:[
            {
                id: 'name',
                label: constants.APPLICATION_POSITION_DETAILS_POSITION_NAME,
                type: 'text',
            },
            {
                id: 'amountNet',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET,
                suffix: 'zł.',
                type: 'amount',
            },
        ]
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            openPositionDetails: !this.state.openPositionDetails,
        });
    }

    handleChangeVisibleDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails});
    }

    handleCloseDialog = () => {
        this.setState({planAction: ""})
        this.props.clearError()
    }

    handleCloseDetails = () => {
        this.setState({openPositionDetails: !this.state.openPositionDetails, selected: []});
    };

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues.subPositions,
            })
        }
    }

    render(){
        const { classes, initialValues } = this.props;
        const { rows, headCells, openPositionDetails, selected } = this.state;
        return(
            <>

                {openPositionDetails &&
                    <PlanPublicProcurementPositionDetailsFormContainer
                        initialValues={selected}
                        action={"preview"}
                        planStatus={"planStatus"}
                        modes={[]}
                        estimationTypes={[]}
                        open={openPositionDetails}
                        onSubmit={()=>{}}
                        onClose={this.handleCloseDetails}
                    />
                }

                <Grid
                    container
                    direction="column"
                    spacing={0}
                >
                    <Typography variant="h6">{constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP +
                        `: ${initialValues.assortmentGroup !== undefined ? initialValues.assortmentGroup.name : ''} - ${initialValues.coordinator !== undefined ? initialValues.coordinator.name : ''}`}
                    </Typography>
                    <Divider />
                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Grid container spacing={1} className={classes.container}>
                                <Grid item xs={12} >
                                    <Toolbar className={classes.toolbar}>
                                        <LibraryBooks className={classes.toolbarHeaderIcon} fontSize="small" />
                                        <Typography variant="subtitle1" >
                                            {constants.COORDINATOR_PLAN_BASIC_INFORMATION}
                                        </Typography>
                                    </Toolbar>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <InputField
                                        name="assortmentGroup"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP}
                                        disabled
                                        value={initialValues.assortmentGroup !== undefined ? initialValues.assortmentGroup.name : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <InputField
                                        name="orderType"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDER_TYPE}
                                        disabled
                                        value={initialValues.orderType ? initialValues.orderType.name : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputField
                                        name="estimationType"
                                        label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE}
                                        disabled
                                        value={initialValues.estimationType ? initialValues.estimationType.name : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
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
                                <Grid item xs={12}>
                                    <div className={classes.section}>
                                        <Toolbar className={classes.toolbar}>
                                            <LibraryBooks className={classes.toolbarHeaderIcon} fontSize="small" />
                                            <Typography variant="subtitle1" >
                                                {constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP_POSITIONS}
                                            </Typography>
                                        </Toolbar>
                                        <Grid item xs={12} sm={12}>
                                            <Table
                                                className={classes.tableWrapper}
                                                rows={rows}
                                                headCells={headCells}
                                                onSelect={this.handleSelect}
                                                onDoubleClick={this.handleDoubleClick}
                                                onExcelExport={this.handleExcelExport}
                                                rowKey='id'
                                                defaultOrderBy="id"
                                            />
                                        </Grid>
                                    </div>
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
                                onClick={this.props.onClose}
                            />
                        </Grid>
                    </div>
                </Grid>
            </>
        );
    };
};

PlanSubPositions.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
};

export default withStyles(styles)(PlanSubPositions);