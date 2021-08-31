import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import PlanBasicInfoForm from 'containers/modules/accountant/coordinator/plans/forms/planBasicInfoFormContainer';
import {findSelectFieldPosition, generateExportLink, findIndexElement, getVats, getCoordinatorPlanPositionsStatuses} from 'utils';
import PlansApi from 'api/modules/accountant/coordinator/plansApi';
import CostTypeApi from 'api/modules/accountant/costTypeApi';

class PlanContainer extends Component {
    state = {
        initData: {
            positions: [],
        },
        units: [],
        costsTypes:[],
        vats: getVats(),
        statuses: getCoordinatorPlanPositionsStatuses(),
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
                            status: position.status = findSelectFieldPosition(this.state.statuses, position.status)
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
                                    status: position.status = findSelectFieldPosition(this.state.statuses, position.status)
                                }
                            )
                        ))
                        return {initData};
                    });
                    this.handleGetCostsTypes();
                break;
                default:
                    return null;
            }
        this.props.loading(false)
        })
        .catch(error =>{});
    };

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
            switch(this.state.initData.type.code){
                case ("FIN"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                        initData.planAcceptUser = response.data.data.planAcceptUser;
                        return {initData};
                    });
                break;
                default:
                    return null;
            }
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
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

    componentDidMount() {
        if (this.props.action === 'plan'){
            this.handleGetPlan();
        } else if (this.props.action !== 'add'){
            this.handleGetPlanPositions();
        }
    }
    render(){
        const {action, handleClose, error, isLoading } = this.props;
        const {initData, units, vats, costsTypes } = this.state;
        return(
            <PlanBasicInfoForm
                initialValues={initData}
                action={action}
                error={error}
                isLoading={isLoading}
                onAcceptPlanPositions={this.handleAcceptPlanPositions}
                onCorrectPlanPosition={this.handleCorrectPlanPosition}
                onApprovePlan={this.handleApprovePlan}
                onClose={handleClose}
                onExcelExport={this.handleExcelExport}
                units={units}
                costsTypes={costsTypes}
                vats={vats}
            />
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
