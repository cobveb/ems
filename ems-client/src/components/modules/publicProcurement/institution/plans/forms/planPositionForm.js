import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider, Toolbar } from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { LibraryBooks, Cancel, Visibility, DoneAll, Edit } from '@material-ui/icons/';
import { InputField, Table, Button } from 'common/gui';
import { FormAmountField, FormSelectField } from 'common/form';
import { Spinner } from 'common/';
import PlanSubPositionsContainer from 'containers/modules/publicProcurement/institution/plans/planSubPositionsContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    container: {
        width: '100%',
    },
    input: {
        padding: theme.spacing(1.5),
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(46)}px)`,
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
})


class PlanPositionForm extends Component {
    state = {
        headCells: [
            {
                id: 'coordinator.name',
                label: constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDER_TYPE,
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
        rows: [],
        selected: [],
        isDetailsVisible: false,
        correctionPossible: false,
        correction: false,
    };

    handleSelect = (id) => {
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            selected[0] = id;
            return {selected}
        });
    }

    handleChangeVisibleDetails = () => {
        this.setState({isDetailsVisible: !this.state.isDetailsVisible});
    }

    handleCloseDetails = () => {
        this.setState({
            isDetailsVisible: !this.state.isDetailsVisible,
            selected: []
        })
    }

    handleDoubleClick = (row) => {
        this.setState(prevState =>{
            const selected = [...prevState.selected];
            let isDetailsVisible = {...prevState.isDetailsVisible};
            selected[0] = row;
            isDetailsVisible =  !this.state.isDetailsVisible;
            return {selected, isDetailsVisible}
        });
    }

    checkCorrectionPossible = (prevProps) => {
        let isPossible = false;
        let isEstimationType = [];
        let isOrderType = [];

        if(this.props.formCurrentValues.subPositions !== undefined){
            if(prevProps.formCurrentValues !== undefined && prevProps.formCurrentValues === this.props.formCurrentValues ){
                isEstimationType = this.props.formCurrentValues.subPositions.filter(position => position.estimationType.code !== this.props.formCurrentValues.estimationType.code);
                isOrderType = this.props.formCurrentValues.subPositions.filter(position => position.orderType.code !== this.props.formCurrentValues.orderType.code);
                if(isEstimationType.length > 0  || isOrderType.length > 0){
                    isPossible = true;
                }

            } else {
                if(this.props.formCurrentValues.estimationType !== prevProps.formCurrentValues.estimationType){
                    isEstimationType = this.props.formCurrentValues.subPositions.filter(position => position.estimationType.code !== this.props.formCurrentValues.estimationType.code);
                    if(isEstimationType.length > 0){
                        isPossible = true;
                    }
                }
                if(this.props.formCurrentValues.orderType !== prevProps.formCurrentValues.orderType){
                    isOrderType = this.props.formCurrentValues.subPositions.filter(position => position.orderType.code !== this.props.formCurrentValues.orderType.code);
                    if(isOrderType.length > 0){
                        isPossible = true;
                    }
                }
            }
        }
        return isPossible;
    }


    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues.subPositions !== undefined && this.props.initialValues.subPositions !== this.state.rows){
            this.setState({
                rows: this.props.initialValues.subPositions,
                correctionPossible: this.checkCorrectionPossible(prevProps),
                correction: !this.checkCorrectionPossible(prevProps),
            });
        }

        if(prevProps.formCurrentValues !== undefined && (this.props.formCurrentValues.estimationType !== prevProps.formCurrentValues.estimationType
            || this.props.formCurrentValues.orderType !== prevProps.formCurrentValues.orderType)){
            this.setState({
                correctionPossible: this.checkCorrectionPossible(prevProps),
            });
        }
        if(this.props.submitSucceeded && this.props.submitSucceeded !== prevProps.submitSucceeded){
            this.setState({
                correction: true,
            });
        }
    }

    componentDidMount(){
        if(this.props.initialValues.subPositions !== undefined){
            this.setState({rows: this.props.initialValues.subPositions});
        }
    }

    render(){
        const { classes, handleSubmit, pristine, initialValues, isLoading, levelAccess, planStatus, orderTypes, estimationTypes } = this.props;
        const { headCells, rows, selected, isDetailsVisible, correctionPossible, correction } = this.state;

        return(
            <>
                {isLoading && <Spinner />}

                {isDetailsVisible && selected[0] !== undefined ?
                    <PlanSubPositionsContainer
                        initialValues={selected[0]}
                        levelAccess={levelAccess}
                        onClose={this.handleCloseDetails}
                    />
                :
                    <form onSubmit={handleSubmit}>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                        >
                            <Typography variant="h6">{constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP +
                                `: ${initialValues.assortmentGroup !== undefined ? initialValues.assortmentGroup.name : ''}`}
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
                                            <FormSelectField
                                                name="orderType"
                                                isRequired={true}
                                                label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDER_TYPE}
                                                options={orderTypes}
                                                disabled={planStatus !== 'UT'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <FormSelectField
                                                name="estimationType"
                                                isRequired={true}
                                                label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE}
                                                options={estimationTypes}
                                                disabled={planStatus !== 'UT'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <FormAmountField
                                                name="amountRequestedNet"
                                                label={constants.COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET}
                                                disabled
                                                suffix={'zł.'}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div className={classes.section}>
                                                <Toolbar className={classes.toolbar}>
                                                    <LibraryBooks className={classes.toolbarHeaderIcon} fontSize="small" />
                                                    <Typography variant="subtitle1" >
                                                        {constants.ACCOUNTANT_INSTITUTION_PLAN_COORDINATOR_POSITIONS}
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
                                                        rowKey="id"
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
                                    <Grid item xs={11}>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="flex-start"
                                            className={classes.containerBtn}
                                        >
                                            {planStatus === 'UT' &&
                                                <Button
                                                    label={constants.BUTTON_APPROVE}
                                                    icon={<DoneAll />}
                                                    iconAlign="left"
                                                    variant={"submit"}
                                                    onClick={this.props.onApprovePlanPosition}
                                                    disabled={!pristine || !['WY', 'SK'].includes(initialValues.status.code)}
                                                />
                                            }
                                            <Button
                                                label={constants.BUTTON_PREVIEW}
                                                icon={<Visibility/>}
                                                iconAlign="left"
                                                disabled={Object.keys(selected).length === 0}
                                                variant={"cancel"}
                                                onClick={this.handleChangeVisibleDetails}
                                            />
                                            {planStatus === 'UT' &&
                                                <Button
                                                    label={constants.BUTTON_CORRECT}
                                                    icon=<Edit />
                                                    iconAlign="left"
                                                    variant="edit"
                                                    type='submit'
                                                    disabled={((!correctionPossible === true && correction === false && pristine === true) ||
                                                        (!correctionPossible === false && correction === true && pristine === true) ||
                                                            (!correctionPossible === true && correction === true && pristine === true)) && true
                                                    }
                                                />
                                            }
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={1}>
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
                                                onClick={this.props.onClose}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    </form>
                }
            </>
        );
    };
}

PlanPositionForm.propTypes = {
	classes: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
};

export default withStyles(styles)(PlanPositionForm);