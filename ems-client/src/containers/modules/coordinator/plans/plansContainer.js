import React, { Component } from 'react';
import { connect } from "react-redux";
import Plans from 'components/modules/coordinator/plans/plans';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import {updateOnCloseDetails, findSelectFieldPosition, generateExportLink, getCoordinatorPlanTypes, getCoordinatorPlanStatuses} from 'utils';
import PlansApi from 'api/modules/coordinator/plansApi';
import DictionaryApi from 'api/common/dictionaryApi';


class PlansContainer extends Component {
    state = {
        plans: [],
        modes:[],
        investmentCategories: [],
        statuses: getCoordinatorPlanStatuses(),
        types:[
            {
                code: '',
                name: constants.COORDINATOR_PLAN_TYPE,
            },
        ].concat(getCoordinatorPlanTypes()),
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
        PlansApi.getPlans()
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
                            year: plan.year = new Date(plan.year,0,1).toJSON(),
                            status: plan.status = findSelectFieldPosition(this.state.statuses, plan.status),
                            type: plan.type = findSelectFieldPosition( this.state.types, plan.type),
                            isUpdate: plan.isUpdate = plan.correctionPlan === null ? false : true,
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
        PlansApi.withdrawPlan(planId)
        .then(response => {
            this.setState(prevState => {
                const plans = [...prevState.plans];
                const index = plans.findIndex(plan => plan.id === response.data.data.id);
                plans[index].status = findSelectFieldPosition(this.state.statuses, response.data.data.status);
                plans[index].sendDate = response.data.data.sendDate;
                return {plans};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleDelete = (planId) => {
        this.props.loading(true);
        PlansApi.deletePlan(planId)
        .then(response => {
            const idx = this.state.plans.findIndex(plan => plan.id === planId);
            //Check that the plan you are removing is an update
            if(this.state.plans[idx].correctionPlan !== null){
                //Deleted plan is an update
                const corIdx = this.state.plans.findIndex(plan => plan.id === this.state.plans[idx].correctionPlan.id)
                this.setState(prevState => {
                    const plans = [...prevState.plans];
                    plans[corIdx].status = findSelectFieldPosition(this.state.statuses, plans[corIdx].planAmountRealizedGross === 0 ? "ZA" : "RE");
                    plans.splice(idx, 1);
                    return {plans};
                })
            } else {
                //Deleted plan is not an update
                this.setState(prevState => {
                    const plans = [...prevState.plans];
                    plans.splice(idx, 1);
                    return {plans}
                })
            }
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleUpdateOnCloseDetails = (plan, action) => {
        if(action !== "update"){
            let plans = this.state.plans;

            if(plan.isUpdate === undefined){
                /* Close after add new plan setup isUpdate value */
                plan.isUpdate = false;
            }
            return updateOnCloseDetails(plans, plan);
        } else {
            /* If action is update plan, change correctionPlan status to "AA" */
            plan.isUpdate = true;
            this.setState(prevState => {
                const plans = [...prevState.plans];
                const corIdx = this.state.plans.findIndex(oldPlan => oldPlan.id === plan.correctionPlan.id)
                plans[corIdx].status = findSelectFieldPosition(this.state.statuses, "AA");
                return {plans}
            })
            return updateOnCloseDetails(this.state.plans, plan);
        }
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

    componentDidMount() {
        this.handleGetPlans();
        this.handleGetDictionaryModes();
        this.handleGetDictionaryInvestmentCategories();
    }

    render(){
        const {isLoading, loading, error, clearError} = this.props;
        const { types, statuses, plans, modes, investmentCategories } = this.state;
        return(
            <Plans
                initialValues={plans}
                types={types}
                statuses={statuses}
                modes={modes}
                investmentCategories={investmentCategories}
                isLoading={isLoading}
                loading={loading}
                error={error}
                clearError={clearError}
                onClose={this.handleUpdateOnCloseDetails}
                onExcelExport={this.handleExcelExport}
                onWithdraw={this.handleWithdraw}
                onDelete={this.handleDelete}
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