import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import PlanBasicInfoForm from 'containers/modules/director/coordinator/plans/planBasicInfoFormContainer';
import {findSelectFieldPosition, generateExportLink} from 'utils';
import PlansApi from 'api/modules/director/coordinator/plansApi';
import CostTypeApi from 'api/modules/accountant/costTypeApi';
import DictionaryApi from 'api/common/dictionaryApi';
import {publicProcurementEstimationTypes, publicProcurementOrderTypes, findIndexElement, getCoordinatorPlanPositionsStatuses, getVats} from 'utils/';

class PlanContainer extends Component {
    state = {
        initData: {
            positions: [],
        },
        units: [],
        costsTypes:[],
        fundingSources:[],
        vats: getVats(),
        orderTypes: publicProcurementOrderTypes(),
        estimationTypes: publicProcurementEstimationTypes(),
        statuses: getCoordinatorPlanPositionsStatuses(),
        isDetailsVisible: false,
    }

    handleGetCostsTypes(){
        CostTypeApi.getCostTypeByCoordinatorAndYear(new Date(this.state.initData.year).getFullYear(), this.state.initData.coordinator.code)
        .then(response => {
            this.setState({
                costsTypes: response.data.data,
            })
        })
        .catch(error => {});
    };

    handleGetDictionaryAssortmentGroups(){
       return DictionaryApi.getDictionary('slAsortGr')
        .then(response => {
            this.setState({
                assortmentGroups: response.data.data.items,
            })
        })
        .catch(error => {});
    };

    handleGetDictionaryFoundingSources(){
       return DictionaryApi.getDictionary('dicFunSour')
        .then(response => {
            this.setState({
                fundingSources: response.data.data.items,
            })
        })
        .catch(error => {});
    };

    setUpCorrectValue = (values) =>{
        if(this.props.initialValues.type.code === 'FIN'){
            values.map(position => (
                Object.assign(position,
                    {
                        amountCorrect: position.correctionPlanPosition !== null ?
                            position.amountAwardedGross - position.correctionPlanPosition.amountAwardedGross : position.amountAwardedGross,
                    }
                )
            ))
//        }
//        else if (this.props.initialValues.type.code === 'PZP'){
//            values.map(position => (
//                Object.assign(position,
//                    {
//                        amountCorrect: position.correctionPlanPosition !== null ?
//                            position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet === 0 ?
//                                null : position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet :
//                            position.amountRequestedNet,
//                    }
//                )
//            ))
        } else if (this.props.initialValues.type.code === 'INW') {
            values.map(position => (
                Object.assign(position,
                    {
                        amountCorrect: position.correctionPlanPosition !== null ?
                            position.taskPositionGross - position.correctionPlanPosition.taskPositionGross === 0 ?
                                null : position.taskPositionGross - position.correctionPlanPosition.taskPositionGross :
                            position.taskPositionGross,
                        expensesAmountCorrect: position.correctionPlanPosition !== null ?
                            position.expensesPositionAwardedGross - position.correctionPlanPosition.expensesPositionAwardedGross === 0 ?
                                null : position.expensesPositionAwardedGross - position.correctionPlanPosition.expensesPositionAwardedGross :
                            position.expensesPositionAwardedGross,
                    }
                )
            ))
        }
    }

    handleGetPlanPositions = () => {
        this.props.loading(true);
        PlansApi.getPlanPositions(this.props.initialValues.id)
        .then(response =>{
            switch(this.props.initialValues.type.code){
                case ("FIN"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        Object.assign(initData, this.props.initialValues);
                        initData.positions = response.data.data;
                        initData["positions"].map(position => (
                            Object.assign(position,
                                {
                                    vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                                    status: position.status = findSelectFieldPosition(this.state.statuses, position.status),
                                    isDescCor: position.isDescCor = position.coordinatorDescription === null ? false : true,
                                    isDescMan: position.isDescMan = position.managementDescription === null ? false : true,
                                }
                            )
                        ))
                        return {initData};
                    });
                    this.handleGetCostsTypes();
                break;
                case("PZP"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        Object.assign(initData, this.props.initialValues);
                        initData.positions = response.data.data;
                        initData["positions"].map(position => (
                            Object.assign(position,
                            {
                                vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                                orderType: position.orderType = findSelectFieldPosition(this.state.orderTypes, position.orderType),
                                status: position.status = findSelectFieldPosition(this.state.statuses, position.status),
                                mode: position.mode = findSelectFieldPosition(this.props.modes, position.mode.code),
                                estimationType: position.estimationType = findSelectFieldPosition(this.state.estimationTypes, position.estimationType),
                            }
                        )))
                        return {initData};
                    });
                    this.handleGetDictionaryAssortmentGroups();
                break;
                case("INW"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        Object.assign(initData, this.props.initialValues);
                        initData.positions = response.data.data;
                        initData["positions"].map(position => (
                            Object.assign(position,
                                {
                                    vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                                    status: position.status = findSelectFieldPosition(this.state.statuses, position.status),
                                    isDescCor: position.isDescCor = position.coordinatorDescription === null ? false : true,
                                    isDescMan: position.isDescMan = position.managementDescription === null ? false : true,
                                },
                                position.positionFundingSources.map(source =>(
                                    Object.assign(source,
                                        {
                                            type: source.type = findSelectFieldPosition(this.state.fundingSources, source.type.code),
                                        }
                                    )
                                ))
                            )
                        ))
                        if(initData.isUpdate && initData.positions.length > 0){
                            this.setUpCorrectValue(initData.positions)
                        }
                        return {initData};
                    });
                break;
                // no default
            }
        this.props.loading(false)
        })
        .catch(error =>{});
    };

    handleApproveDirector = () => {
        this.props.loading(true);
        PlansApi.approveDirector(this.state.initData.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                initData.directorAcceptUser = response.data.data.directorAcceptUser;
                return {initData};
            });
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
    }

    handleApproveEconomic = () => {
        this.props.loading(true);
        PlansApi.approveEconomic(this.state.initData.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                initData.economicAcceptUser = response.data.data.economicAcceptUser;
                return {initData};
            });
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
    }

    handleApproveChief = () => {
        this.props.loading(true);
        PlansApi.approveChief(this.state.initData.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                initData.chiefAcceptUser = response.data.data.chiefAcceptUser;
                return {initData};
            });
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
    }

    handleReturnPlan = () => {
        this.props.loading(true)
        PlansApi.returnPlan(this.state.initData.id)
        .then(response =>{
            this.props.loading(false)
            this.props.handleCloseOnReturn(this.state.initData);
        })
        .catch(error=>{});
    }

    handleSubmitPlanPositions = () =>{
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(this.state.initData.positions))
        if(this.state.initData.type.code === 'FIN'){
            payload.forEach(position =>{
                position.type = 'fin';
                position.status = position.status.code;
                position.vat = position.vat.code;
            })
        }
        PlansApi.savePlanPositions(this.state.initData.id, payload)
        .then(response =>{
            switch(this.state.initData.type.code){
                case ("FIN"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        initData.planAmountAwardedNet = response.data.data.planAmountAwardedNet;
                        initData.planAmountAwardedGross = response.data.data.planAmountAwardedGross;
                        initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status)
                        initData["positions"].map(position => (
                            Object.assign(position,
                                {
                                    isDescCor: position.isDescCor = position.coordinatorDescription === null ? false : true,
                                    isDescMan: position.isDescMan = (position.managementDescription === null || position.managementDescription.length === 0) ? false : true,
                                }
                            )
                        ))

                        return {initData};
                    });
                break;
                default:
                    return null;
            }
        this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleRemarksPlanPosition = (values) => {
        const index = findIndexElement(values, this.state.initData.positions);
        if(index !== null){
            this.state.initData.positions.splice(index, 1, values);
        }
        this.handleSubmitPlanPositions();
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PlansApi.exportPlanPositionsToExcel(exportType, this.state.initData.type.code, this.state.initData.id, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handlePrintPlan = () =>{
        this.props.loading(true);
        PlansApi.printPlan(this.state.initData.id)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }
    componentDidMount() {
        this.handleGetPlanPositions();
        if(this.props.initialValues.type !== undefined && this.props.initialValues.type.code === 'INW'){
            this.handleGetDictionaryFoundingSources();
        }
    }

    render(){
        const {changeVisibleDetails, action, handleClose, error, isLoading } = this.props;
        const {initData, units, vats, costsTypes, fundingSources } = this.state;
        return(
            <PlanBasicInfoForm
                initialValues={initData}
                changeVisibleDetails={changeVisibleDetails}
                action={action}
                error={error}
                isLoading={isLoading}
                onApproveDirector={this.handleApproveDirector}
                onApproveEconomic={this.handleApproveEconomic}
                onApproveChief={this.handleApproveChief}
                onReturnPlan={this.handleReturnPlan}
                onRemarksPlanPosition={this.handleRemarksPlanPosition}
                onPrintPlan={this.handlePrintPlan}
                onExcelExport={this.handleExcelExport}
                onClose={handleClose}
                units={units}
                costsTypes={costsTypes}
                fundingSources={fundingSources}
                vats={vats}
            />
        );
    };
};

PlanContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    changeAction: PropTypes.func,
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
