import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import PlanBasicInfoForm from 'containers/modules/accountant/coordinator/plans/forms/planBasicInfoFormContainer';
import PlanUpdateFormContainer from 'containers/modules/accountant/coordinator/plans/forms/planUpdateFormContainer';
import {findSelectFieldPosition, generateExportLink, findIndexElement, getVats, getCoordinatorPlanPositionsStatuses} from 'utils';
import PlansApi from 'api/modules/accountant/coordinator/plansApi';
import DictionaryApi from 'api/common/dictionaryApi';

class PlanContainer extends Component {
    state = {
        initData: {
            positions: [],
        },
        fundingSources:[],
        vats: getVats(),
        statuses: getCoordinatorPlanPositionsStatuses(),
    }

    handleGetDictionaryFoundingSources(){
       return DictionaryApi.getDictionary('dicFunSour')
        .then(response => {
            this.setState({
                fundingSources: response.data.data.items,
            })
        })
        .catch(error => {});
    };


    handleGetPlan = () => {
        this.props.loading(true);
        PlansApi.getPlan(this.props.initialValues.planId)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData = response.data.data;
                initData.status = findSelectFieldPosition(this.props.statuses, initData.status)
                initData.type = findSelectFieldPosition(this.props.types, initData.type)
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
            this.props.loading(false)
        })
        .catch(error =>{
            this.props.loading(false)
        });
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
                        if(initData.isUpdate){
                            initData["positions"].map(position => (
                                Object.assign(position,
                                    {
                                        amountCorrect: position.correctionPlanPosition !== null ?
                                            position.amountAwardedGross - position.correctionPlanPosition.amountAwardedGross : position.amountAwardedGross,
                                    }
                                )
                            ))
                        }
                        return {initData};
                    });
                break;
                case ("INW"):
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
                        return {initData};
                    });
                break;
                // no default
            }
        this.props.loading(false)
        })
        .catch(error =>{});
    };

    handleSubmitPlanPositions = () =>{
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(this.state.initData.positions))
        payload.forEach(position =>{
            position.type = 'fin';
            position.status = position.status.code;
            position.vat = position.vat.code;
        })
        PlansApi.savePlanPositions(this.state.initData.id, payload)
        .then(response =>{
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
                            amountCorrect: position.amountCorrect = initData.isUpdate ?
                                position.correctionPlanPosition !== null ?
                                    position.amountAwardedGross - position.correctionPlanPosition.amountAwardedGross
                                        : position.amountAwardedGross : null,
                        }
                    )
                ))
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    setUpPlanValueOnSubmitPosition = (values, initData, tmp) =>{
        const index = findIndexElement(values, initData.positions, "positionId");
        if(index !== null){
            initData.planAmountAwardedNet = parseFloat((initData.planAmountAwardedNet - initData.positions[index].expensesPositionAwardedNet).toFixed(2))
            initData.planAmountAwardedGross = parseFloat((initData.planAmountAwardedGross - initData.positions[index].expensesPositionAwardedGross).toFixed(2))
            initData.positions.splice(index, 1, tmp);
            initData.planAmountAwardedNet = parseFloat((initData.planAmountAwardedNet + tmp.expensesPositionAwardedNet).toFixed(2))
            initData.planAmountAwardedGross = parseFloat((initData.planAmountAwardedGross + tmp.expensesPositionAwardedGross).toFixed(2))
        }
    }

    handleUpdateInvestmentPosition = (values) =>{
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(values))
        payload.type = 'inw';
        payload.status = payload.status.code;
        payload.vat = payload.vat.code;
        PlansApi.updatePlanPosition(this.state.initData.id, payload)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                const idx = findIndexElement(response.data.data, this.state.initData.positions);
                if(idx !== null){
                    initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.plan.status);
                    initData.planAcceptUser = response.data.data.planAcceptUser;
                    response.data.data.isDescCor = response.data.data.coordinatorDescription === null ? false : true;
                    response.data.data.isDescMan = response.data.data.managementDescription === null ? false : true;
                    response.data.data.status =  findSelectFieldPosition(this.state.statuses, response.data.data.status);
                    response.data.data.vat =  findSelectFieldPosition(this.state.vats, response.data.data.vat);
                    response.data.data.positionFundingSources.map(source =>(
                        Object.assign(source,
                            {
                                type: source.type = findSelectFieldPosition(this.state.fundingSources, source.type.code),
                            }
                        )
                   ));
                   this.setUpPlanValueOnSubmitPosition(values, initData, response.data.data);
                }
                return {initData};
            })
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleRemarksPlanPosition = (values) => {
        if(this.state.initData.type.code === 'FIN'){
            const index = findIndexElement(values, this.state.initData.positions);
            if(index !== null){
                this.state.initData.positions.splice(index, 1, values);
            }
            this.handleSubmitPlanPositions();
        } else if (this.state.initData.type.code === 'INW') {
            this.handleUpdateInvestmentPosition(values)
        }
    }

    handleCorrectPlanPosition = (values) =>{
        const index = findIndexElement(values, this.state.initData.positions);
        if(index !== null){
            values.amountRequestedNet !== values.amountAwardedNet ?
                values.status = findSelectFieldPosition(this.state.statuses, "SK") :
                    values.status = findSelectFieldPosition(this.state.statuses, "ZA");
            this.state.initData.positions.splice(index, 1, values);
        }
        this.handleSubmitPlanPositions();
    }

    handleAcceptPlanPositions = (values) =>{
        values.map(position => {
            const index = findIndexElement(position, this.state.initData.positions);
            if(index !== null){
                position['amountAwardedNet'] = position['amountRequestedNet'];
                position['amountAwardedGross'] = position['amountRequestedGross'];
                position.status = findSelectFieldPosition(this.state.statuses, "ZA");
                this.state.initData.positions.splice(index, 1, position);
            }
            return position;
        })
        this.handleSubmitPlanPositions();
    }

    handleApprovePlan = () => {
        this.props.loading(true);
        PlansApi.approvePlan(this.state.initData.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                initData.planAcceptUser = response.data.data.planAcceptUser;
                return {initData};
            });
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
    }

    handleForwardPlan = () => {
        this.props.loading(true);
        PlansApi.forwardPlan(this.state.initData.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                return {initData};
            });
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
    }

    handleWithdrawPlan = () => {
        this.props.loading(true);
        PlansApi.withdrawPlan(this.state.initData.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                return {initData};
            });
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
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

    componentDidMount() {
        if (this.props.action === 'plan'){
            this.handleGetPlan();
        } else if (this.props.action !== 'add'){
            this.handleGetPlanPositions();
        }
        if(this.props.initialValues.type !== undefined && this.props.initialValues.type.code === 'INW'){
            this.handleGetDictionaryFoundingSources();
        }
    }
    render(){
        const {action, handleClose, error, isLoading, levelAccess } = this.props;
        const {initData, vats, fundingSources } = this.state;
        return(
            <>
                {!initData.isUpdate ?
                    <PlanBasicInfoForm
                        initialValues={initData}
                        levelAccess={levelAccess}
                        action={action}
                        error={error}
                        isLoading={isLoading}
                        onAcceptPlanPositions={this.handleAcceptPlanPositions}
                        onCorrectPlanPosition={this.handleCorrectPlanPosition}
                        onRemarksPlanPosition={this.handleRemarksPlanPosition}
                        onUpdateInvestmentPosition={this.handleUpdateInvestmentPosition}
                        onApprovePlan={this.handleApprovePlan}
                        onForwardPlan={this.handleForwardPlan}
                        onWithdrawPlan={this.handleWithdrawPlan}
                        onClose={handleClose}
                        onExcelExport={this.handleExcelExport}
                        fundingSources={fundingSources}
                        vats={vats}
                    />
                :
                    <PlanUpdateFormContainer
                        initialValues={initData}
                        onSubmit={this.handleApprovePlan}
                        vats={vats}
                        onSubmitPlanPosition={this.handleCorrectPlanPosition}
                        onClose={handleClose}
                        error={error}
                        isLoading={isLoading}
                    />
                }
            </>
        );
    };
};

PlanContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    action: PropTypes.oneOf(['add', 'edit', 'plan']).isRequired,
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
