import React, { Component } from 'react';
import { connect } from "react-redux";
import Plans from 'components/modules/coordinator/plans/plans';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import {updateOnCloseDetails} from 'utils';
import {findSelectFieldPosition} from 'utils';
import CostTypeApi from 'api/modules/accountant/costTypeApi';

const response = {
    data: {
        data: [
            {
                "id": 1,
                "number": "1/fin/it/2019",
                "year": new Date(2019,0,1).toJSON(),
                "status": "ZP",
                "type": "FIN",
                "coordinator": {
                    "code": "it",
                    "name": "Dział Informatyki",
                    "shortName": "Dział Informatyki",
                    "nip": null,
                    "regon": null,
                    "city": null,
                    "zipCode": null,
                    "street": null,
                    "building": null,
                    "phone": null,
                    "fax": null,
                    "email": "it@uck.katowice.pl",
                    "active": true,
                    "coordinator": true,
                    "parent": "uck"
                },
            },
            {
                "id": 2,
                "number": "1/inw/it/2019",
                "year": new Date(2019,0,1).toJSON(),
                "status": "ZP",
                "type": "INW",
                "coordinator": {
                    "code": "it",
                    "name": "Dział Informatyki",
                    "shortName": "Dział Informatyki",
                    "nip": null,
                    "regon": null,
                    "city": null,
                    "zipCode": null,
                    "street": null,
                    "building": null,
                    "phone": null,
                    "fax": null,
                    "email": "it@uck.katowice.pl",
                    "active": true,
                    "coordinator": true,
                    "parent": "uck"
                },
            },
        ],
    },
};

const dicFunSour = {
    data:{
        data: [
            {
                "code": "ue",
                "name": "UE",
            },
            {
                "code": "wlasne",
                "name": "Własne",
            },
            {
                "code": "inne",
                "name": "Inne",
            },
        ],
    },
};

const dicCatSum = {
    data:{
        data: [
            {
                "code": "cat1",
                "name": "Kategoria SUM 1",
            },
            {
                "code": "cat2",
                "name": "Kategoria SUM 2",
            },
            {
                "code": "cat3",
                "name": "Kategoria SUM 3",
            },
        ],
    },
};



class PlansContainer extends Component {
    state = {
        plans: [],
        costsTypes:[],
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
                code: 'PR',
                name: constants.COORDINATOR_PLAN_STATUS_ADOPTED,
            },
            {
                code: 'ZA',
                name: constants.COORDINATOR_PLAN_STATUS_ACCEPTED,
            },
        ],
        types:[
            {
                code: '',
                name: constants.COORDINATOR_PLAN_TYPE,
            },
            {
                code: 'FIN',
                name: constants.COORDINATOR_PLAN_TYPE_FINANCIAL,
            },
            {
                code: 'INW',
                name: constants.COORDINATOR_PLAN_TYPE_INVESTMENT,
            },
            {
                code: 'PZP',
                name: constants.COORDINATOR_PLAN_TYPE_PUBLIC_PROCUREMENT,
            },
        ],
        foundingSources:[],
        categories:[],
    }

    handleUpdateOnCloseDetails = (plan) => {
        let plans = this.state.plans;
        return updateOnCloseDetails(plans, plan);
    }

    handleGetPlans(){
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
    }

    handleGetCostsTypes(){
        CostTypeApi.getCostTypeAll()
        .then(response => {
            this.setState({
                costsTypes: response.data.data,
            })
        })
        .catch(error => {});
    };

    handleGetFoundingSource(){
        this.props.loading(true);
//        ApplicationsApi.getApplications()
//        .then(response =>{
            this.setState({
                foundingSources: dicFunSour.data.data,
            });
//        })
//        .catch(error =>{});
    }
    handleGetCategory(){
        this.props.loading(true);
//        ApplicationsApi.getApplications()
//        .then(response =>{
            this.setState({
                categories: dicCatSum.data.data,
            });
//        })
//        .catch(error =>{});
    }

    componentDidMount() {
        this.handleGetPlans();
        this.handleGetCostsTypes();
        this.handleGetFoundingSource();
        this.handleGetCategory();
    }

    render(){
        const { types, statuses, plans, costsTypes, foundingSources, categories } = this.state;
        return(
            <Plans
                initialValues={plans}
                types={types}
                statuses={statuses}
                costsTypes={costsTypes}
                foundingSources={foundingSources}
                categories={categories}
                onClose={this.handleUpdateOnCloseDetails}
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