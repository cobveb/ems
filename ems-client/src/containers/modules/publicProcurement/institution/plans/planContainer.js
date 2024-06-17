import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import Plan from 'components/modules/publicProcurement/institution/plans/plan';
import { findSelectFieldPosition, publicProcurementEstimationTypes, publicProcurementOrderTypes, generateExportLink, findIndexElement, getCoordinatorPlanPositionsStatuses } from 'utils';
import PlansApi from 'api/modules/publicProcurement/institution/plansApi';

class PlanContainer extends Component {
    state = {
        initData: {
            year: '',
            planPositions:[]
        },
        orderTypes: publicProcurementOrderTypes(),
        estimationTypes: publicProcurementEstimationTypes(),
        positionStatuses: getCoordinatorPlanPositionsStatuses(),
    }

    handleGetPlanPositions = () => {
        this.props.loading(true);
        PlansApi.getPlanPositions(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                initData.planPositions = response.data.data;
                initData["planPositions"].map(position => (
                    Object.assign(position,
                    {
                        orderType: position.orderType = findSelectFieldPosition(this.state.orderTypes, position.orderType),
                        estimationType: position.estimationType = findSelectFieldPosition(this.state.estimationTypes, position.estimationType),
                        status: position.status = findSelectFieldPosition(this.state.positionStatuses, position.status),
                        amountCorrect: position.correctionPlanPosition !== null ?
                        position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet === 0 ?
                            null : position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet :
                        position.amountRequestedNet,
                    }
                )))
                return {initData}
            })
             this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleGetPositionDetails = (position) => {
        this.props.loading(true);
        console.log(position)
        PlansApi.getPositionDetails(position.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                const idx = findIndexElement(position, this.state.initData.planPositions);
                if(idx !== null){
                    response.data.data.map(subPosition => (
                        Object.assign(subPosition,
                            {
                                estimationType: subPosition.estimationType = findSelectFieldPosition(this.state.estimationTypes, subPosition.estimationType),
                                orderType: subPosition.orderType = findSelectFieldPosition(this.state.orderTypes, subPosition.orderType),
                            }
                        )
                    ))
                    initData.planPositions[idx].subPositions = response.data.data;
                }

                return {initData}
            })
            this.props.loading(false);
        })
        .catch(error =>{});
    }

    handleCorrectPlanPosition = (values) => {
        this.props.loading(true);
        const payload = [JSON.parse(JSON.stringify(values))];
        payload[0].estimationType = payload[0].estimationType.code;
        payload[0].orderType = payload[0].orderType.code;
        payload[0].status = payload[0].status.code;
        payload[0].subPositions.forEach(subPosition => {
            subPosition.type = 'pzp'
            subPosition.orderType = subPosition.orderType.code;
            subPosition.estimationType = subPosition.estimationType.code;
        });
        PlansApi.correctPlanPositions(payload[0])
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                const idx = findIndexElement(values, this.state.initData.planPositions);
                if(idx !== null){
                    values["subPositions"].map(subPosition => (
                        Object.assign(subPosition,
                            {
                                estimationType: subPosition.estimationType = values.estimationType,
                                orderType: subPosition.orderType = values.orderType,
                            }
                        )
                    ))
                    values.status = findSelectFieldPosition(this.state.positionStatuses, "SK");
                    initData.planPositions.splice(idx, 1, values);
                    return {initData}
                }
            })
            this.props.loading(false);
        })
        .catch(error =>{});
    }

    handleApprovePlanPosition = (position) => {
        this.props.loading(true);
        PlansApi.approvePlanPositions(position.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                const idx = findIndexElement(position, this.state.initData.planPositions);
                if(idx !== null){
                    position.status = findSelectFieldPosition(this.state.positionStatuses, "ZA");
                    initData.planPositions.splice(idx, 1, position);
                    return {initData}
                }
            });
            this.props.loading(false);
        })
        .catch(error =>{});
    }

    handleApprovePlan = () => {
        this.props.loading(true);
        PlansApi.approvePlan(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.status = response.data.data.status;
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error =>{})
    }


    handleWithdrawPlan = () => {
        this.props.loading(true);
        PlansApi.withdrawPlan(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.status = response.data.data.status;
                initData.approveUser = null;
                return {initData};
            });
            this.props.onClose(this.state.initData);
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handlePrintPlan = (event, type) =>{
        this.props.loading(true);
        PlansApi.printPlan(this.state.initData.id, type)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PlansApi.exportPlanPositionsToExcel(exportType, this.state.initData.id, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount(){
        this.handleGetPlanPositions();
    }
    render(){
        const { levelAccess } = this.props;
        const { initData, estimationTypes, orderTypes } = this.state;
        return(
            <Plan
                initialValues={initData}
                levelAccess={levelAccess}
                getPositionDetails={this.handleGetPositionDetails}
                estimationTypes={estimationTypes}
                orderTypes={orderTypes}
                onCorrectPlanPosition={this.handleCorrectPlanPosition}
                onApprovePlan={this.handleApprovePlan}
                onApprovePlanPosition={this.handleApprovePlanPosition}
                onWithdrawPlan={this.handleWithdrawPlan}
                onPrintPlan={this.handlePrintPlan}
                onExcelExport={this.handleExcelExport}
                isLoading={this.props.isLoading}
                error={this.props.error}
                clearError={this.props.clearError}
                onClose={this.props.onClose}
            />
        );
    };
};

PlanContainer.propTypes = {
    initialValues: PropTypes.object,
    handleClose: PropTypes.func,
    error: PropTypes.string,
    clearError: PropTypes.func,
    isLoading: PropTypes.bool,
}

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
		error: state.ui.error,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlanContainer);