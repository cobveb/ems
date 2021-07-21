import React, { Component } from 'react';
import { connect } from "react-redux";
import Plans from 'components/modules/coordinator/plans/plans';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import {updateOnCloseDetails, findSelectFieldPosition, generateExportLink, getCoordinatorPlanTypes} from 'utils';
import PlansApi from 'api/modules/coordinator/plansApi';
import DictionaryApi from 'api/common/dictionaryApi';


class PlansContainer extends Component {
    state = {
        plans: [],
        modes:[],
        statuses:[
            {
                code: '',
                name: constants.COORDINATOR_PLAN_STATUS,
            },
            {
                code: 'ZP',
                name: constants.COORDINATOR_PLAN_STATUS_SAVED,
            },
            {
                code: 'WY',
                name: constants.COORDINATOR_PLAN_STATUS_SENT,
            },
            {
                code: 'RO',
                name: constants.COORDINATOR_PLAN_STATUS_ADOPTED,
            },
            {
                code: 'AK',
                name: constants.COORDINATOR_PLAN_STATUS_APPROVED_ACCOUNTANT,
            },
            {
                code: 'SK',
                name: constants.COORDINATOR_PLAN_STATUS_CORRECTED,
            },
            {
                code: 'AZ',
                name: constants.COORDINATOR_PLAN_STATUS_APPROVED_PUBLIC_PROCUREMENT,
            },
            {
                code: 'AD',
                name: constants.COORDINATOR_PLAN_STATUS_APPROVED_DIRECTOR,
            },
            {
                code: 'ZA',
                name: constants.COORDINATOR_PLAN_STATUS_APPROVED_CHIEF,
            },
            {
                code: 'RE',
                name: constants.COORDINATOR_PLAN_STATUS_REALIZED,
            },
            {
                code: 'ZR',
                name: constants.COORDINATOR_PLAN_STATUS_EXECUTED,
            },
        ],
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

     handleGetPlans(){
        this.props.loading(true);
        PlansApi.getPlans()
        .then(response =>{
            this.setState(prevState => {
                let plans = [...prevState.plans];
                plans = response.data.data;
                plans.map(plan => (
                    Object.assign(plan,
                        {
                            year: plan.year = new Date(plan.year,0,1).toJSON(),
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
            let plans = this.state.plans;
            plans = plans.filter(plan => plan.id !== planId)
            this.setState({
                plans: plans,
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleUpdateOnCloseDetails = (plan) => {
        let plans = this.state.plans;
        return updateOnCloseDetails(plans, plan);
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
    }

    render(){
        const {isLoading, loading, error, clearError} = this.props;
        const { types, statuses, plans, modes } = this.state;
        return(
            <Plans
                initialValues={plans}
                types={types}
                statuses={statuses}
                modes={modes}
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