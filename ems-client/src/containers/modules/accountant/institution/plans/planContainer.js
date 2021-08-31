import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import Plan from 'components/modules/accountant/institution/plans/plan';
import PlansApi from 'api/modules/accountant/institution/plansApi';
import {findSelectFieldPosition, getCoordinatorPlanTypes} from 'utils';

class PlanContainer extends Component {
    state = {
        initData:{
            year:'',
            planPositions:[],
        }
    }

    handleGetPlan(){
        this.props.loading(true);
        PlansApi.getPlan(this.props.initialValues.id)
        .then(response =>{
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData = response.data.data;
                initData.type = findSelectFieldPosition(this.props.types, response.data.data.type);
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error =>{
            this.props.loading(false)
        });
    }

    handleClosePosition = () => {
        this.handleGetPlan();
    }

    handleApprovePlan = () => {
        this.props.loading(true);
        PlansApi.approvePlan(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.status = response.data.data.status;
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error =>{
            this.props.loading(false)
        })
    }

    handleWithdrawPlan = () => {
        this.props.loading(true);
        PlansApi.withdrawPlan(this.props.initialValues.id)
        .then(response => {
            console.log(response.data.data)
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.status = response.data.data.status;
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error =>{
            this.props.loading(false)
        })
    }

    componentDidMount() {
        this.handleGetPlan();
    }
    render(){
        const {initialValues} = this.props;
        const {initData} = this.state;
        return(
            <Plan
                initialValues={initData}
                onClosePosition={this.handleClosePosition}
                onApprovePlan={this.handleApprovePlan}
                onWithdrawPlan={this.handleWithdrawPlan}
                onClose={this.props.onClose}
            />
        );
    };
};

PlanContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
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