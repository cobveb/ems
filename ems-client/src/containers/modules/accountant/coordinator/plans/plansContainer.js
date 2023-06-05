import React, { Component } from 'react';
import { connect } from "react-redux";
import Plans from 'components/modules/accountant/coordinator/plans/plans';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import {updateOnCloseDetails, findSelectFieldPosition, generateExportLink, getCoordinatorPlanTypes, getCoordinatorPlanStatuses } from 'utils';
import PlansApi from 'api/modules/accountant/coordinator/plansApi';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';
import DictionaryApi from 'api/common/dictionaryApi';

class PlansContainer extends Component {
    state = {
        plans: [],
        coordinators: [
            {
                code: '',
                name: constants.HEADING_COORDINATOR,
            },
        ],
        statuses: [
            {
              code: '',
              name: constants.COORDINATOR_PLAN_STATUS,
            },
        ].concat(getCoordinatorPlanStatuses()),
        types:[
            {
                code: '',
                name: constants.COORDINATOR_PLAN_TYPE,
            },
        ].concat(getCoordinatorPlanTypes()),
        investmentCategories: [],
        modes:[],
    }

    handleGetDictionaryModes(){
       return DictionaryApi.getDictionary('slTryUdzZp')
        .then(response => {
            this.setState({
                modes: response.data.data.items,
            })
        })
        .catch(error => {});
    };

    handleUpdateOnCloseDetails = (plan) => {
        let plans = this.state.plans;
        return updateOnCloseDetails(plans, plan);
    }

    handleGetCoordinators(){
        return OrganizationUnitsApi.getCoordinators()
        .then(response => {
            this.setState(prevState => {
                let coordinators = [...prevState.coordinators];
                coordinators =  coordinators.concat(response.data.data);
                return {coordinators};
            });
        })
        .catch(error => {});
    }

    handleGetDictionaryInvestmentCategories(){
        return DictionaryApi.getDictionary('slKatPlInw')
        .then(response => {
            this.setState({
                investmentCategories: response.data.data.items,
            })
        })
        .catch(error => {});
    }

     handleGetPlans(){
        this.props.loading(true);
        PlansApi.getPlans(new Date().getFullYear())
        .then(response =>{
            this.setState(prevState => {
                let plans = [...prevState.plans];
                const statuses = [...prevState.statuses];
                statuses.unshift(
                    {
                        code: '',
                        name: constants.COORDINATOR_PLAN_STATUS,
                    },
                );
                plans = response.data.data;
                plans.map(plan => (
                    Object.assign(plan,
                        {
                            status: plan.status = findSelectFieldPosition(this.state.statuses, plan.status),
                            type: plan.type = findSelectFieldPosition( this.state.types, plan.type),
                        }
                    )
                ))
                return {plans};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleWithdraw = (planId) => {
        this.props.loading(true);
        PlansApi.withdrawApprovedPlan(planId)
        .then(response => {
            this.setState(prevState => {
                const plans = [...prevState.plans];
                const index = plans.findIndex(plan => plan.id === response.data.data.id);
                plans[index].status = findSelectFieldPosition(this.state.statuses, response.data.data.status);
                plans[index].planAcceptUser = null;
                return {plans};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PlansApi.exportPlansToExcel(exportType, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleChangeYear = (year) => {
        if((year instanceof Date && !Number.isNaN(year.getFullYear())) || year === null ){
            this.props.loading(true);
            PlansApi.getPlans(year instanceof Date ? year.getFullYear() : 0)
            .then(response =>{
                this.setState(prevState => {
                    let plans = [...prevState.plans];
                    plans = response.data.data;
                    plans.map(plan => (
                        Object.assign(plan,
                            {
                                status: plan.status = findSelectFieldPosition(this.state.statuses, plan.status),
                                type: plan.type = findSelectFieldPosition( this.state.types, plan.type),
                            }
                        )
                    ))
                    return {plans};
                });
                this.props.loading(false);
            })
            .catch(error => {})
        }
    }

    componentDidMount() {
        this.handleGetPlans();
        this.handleGetDictionaryModes();
        this.handleGetCoordinators();
    }

    render(){
        const {isLoading, loading, error, clearError} = this.props;
        const { statuses, plans, coordinators, investmentCategories, modes, types } = this.state;
        return(
            <Plans
                initialValues={plans}
                coordinators={coordinators}
                statuses={statuses}
                investmentCategories={investmentCategories}
                modes={modes}
                types={types}
                levelAccess="accountant"
                isLoading={isLoading}
                loading={loading}
                error={error}
                clearError={clearError}
                onChangeYear={this.handleChangeYear}
                onWithdraw={this.handleWithdraw}
                onClose={this.handleUpdateOnCloseDetails}
                onExcelExport={this.handleExcelExport}
            />
        )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(PlansContainer);