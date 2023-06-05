import React, { Component } from 'react';
import { connect } from "react-redux";
import Plans from 'components/modules/director/coordinator/plans/plans';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import {updateOnCloseDetails, findSelectFieldPosition, generateExportLink, getCoordinatorPlanStatuses, getCoordinatorPlanTypes} from 'utils';
import PlansApi from 'api/modules/director/coordinator/plansApi';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';
import DictionaryApi from 'api/common/dictionaryApi';

class PlansContainer extends Component {
    state = {
        plans: [],
        modes:[],
        coordinators: [
            {
                code: '',
                name: constants.HEADING_COORDINATOR,
            },
        ],
        statuses: getCoordinatorPlanStatuses(),
        types:[
            {
              code: '',
              name: constants.COORDINATOR_PLAN_TYPE,
            },
        ].concat(getCoordinatorPlanTypes()),
    }

    handleUpdateOnCloseDetails = (plan) => {
        let plans = this.state.plans;
        return updateOnCloseDetails(plans, plan);
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
                            planAmountRequestedNet: plan.planAmountRequestedNet = plan.type !== 'PZP' ? null : plan.planAmountRequestedNet,
                            planAmountRequestedGross: plan.planAmountRequestedGross = plan.type !== 'PZP' ? plan.planAmountRequestedGross : null,
                            planAmountAwardedGross: plan.planAmountAwardedGross = plan.type !== 'PZP' ? plan.planAmountAwardedGross : null,
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
                                planAmountRequestedNet: plan.planAmountRequestedNet = plan.type !== 'PZP' ? null : plan.planAmountRequestedNet,
                                planAmountRequestedGross: plan.planAmountRequestedGross = plan.type !== 'PZP' ? plan.planAmountRequestedGross : null,
                                planAmountAwardedGross: plan.planAmountAwardedGross = plan.type !== 'PZP' ? plan.planAmountAwardedGross : null,
                                type: plan.type = findSelectFieldPosition( this.state.types, plan.type),
                                isUpdate: plan.isUpdate = plan.correctionPlan === null ? false : true,
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
        this.handleGetCoordinators()
    }

    render(){
        const {isLoading, loading, error, clearError} = this.props;
        const { types, statuses, plans, coordinators, modes } = this.state;
        return(
            <Plans
                initialValues={plans}
                types={types}
                coordinators={coordinators}
                modes={modes}
                statuses={statuses}
                levelAccess="director"
                isLoading={isLoading}
                loading={loading}
                error={error}
                clearError={clearError}
                onChangeYear={this.handleChangeYear}
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