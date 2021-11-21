import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import Plans from 'components/modules/accountant/institution/plans/plans';
import PlansApi from 'api/modules/director/institution/plansApi';
import {updateOnCloseDetails, findSelectFieldPosition, getCoordinatorPlanTypes, generateExportLink} from 'utils';

class PlansContainer extends Component {
    state = {
        plans: [],
        types: getCoordinatorPlanTypes(),
    }

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
                            type: plan.type = findSelectFieldPosition(this.state.types, plan.type),
                        }
                    )
                ))
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

    handleUpdateOnCloseDetails = (plan) => {
        let plans = this.state.plans;
        return updateOnCloseDetails(plans, plan).filter(pl => pl.status !== "UT");
    }

    componentDidMount() {
        this.handleGetPlans();
    }

    render(){
        const {isLoading, error, levelAccess} = this.props;
        const {plans, types} = this.state;
        return(
            <Plans
                initialValues={plans}
                levelAccess={levelAccess}
                isLoading={isLoading}
                types={types}
                error={error}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlansContainer);