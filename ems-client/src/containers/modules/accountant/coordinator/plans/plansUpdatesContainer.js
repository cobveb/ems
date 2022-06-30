import React, { Component } from 'react';
import { connect } from "react-redux";
import PlansUpdates from 'components/modules/accountant/coordinator/plans/plans';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import {updateOnCloseDetails, findSelectFieldPosition, getCoordinatorPlanStatuses, getCoordinatorPlanTypes} from 'utils';
import PlansApi from 'api/modules/publicProcurement/coordinator/plansApi';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';
import DictionaryApi from 'api/common/dictionaryApi';

class PlansUpdatesContainer extends Component {

    state = {
        plans: [],
        modes:[],
        coordinators: [
            {
                code: '',
                name: constants.HEADING_COORDINATOR,
            },
        ],
        statuses:[
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
        this.props.loading(true);
        return OrganizationUnitsApi.getCoordinators()
        .then(response => {
            this.setState(prevState => {
                let coordinators = [...prevState.coordinators];
                coordinators =  coordinators.concat(response.data.data);
                return {coordinators};
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleGetPlanUpdates(){
        this.props.loading(true);
        PlansApi.getPlanUpdates(this.props.levelAccess)
        .then(response =>{
            this.setState(prevState => {
                let plans = [...prevState.plans];
                plans = response.data.data;
                plans.map(plan => (
                    Object.assign(plan,
                        {
                            status: plan.status = findSelectFieldPosition(this.state.statuses, plan.status),
                            type: plan.type = findSelectFieldPosition( this.state.types, plan.type),
                            isUpdate: plan.isUpdate = true,
                        }
                    )
                ))
                return {plans};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    componentDidMount() {
        this.handleGetPlanUpdates();
        this.handleGetCoordinators();
        this.handleGetDictionaryModes();
    }

    render(){

        const { isLoading, loading, error, clearError, levelAccess } = this.props;
        const { types, modes, statuses, plans, coordinators } = this.state;

        return(
            <PlansUpdates
                initialValues={plans}
                types={types}
                coordinators={coordinators}
                statuses={statuses}
                modes={modes}
                isLoading={isLoading}
                isUpdatesPlansAccess={true}
                levelAccess={levelAccess}
                loading={loading}
                error={error}
                clearError={clearError}
                onClose={this.handleUpdateOnCloseDetails}
                onExcelExport={this.handleExcelExport}
            />
        );
    };
};


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

export default connect(mapStateToProps, mapDispatchToProps)(PlansUpdatesContainer);