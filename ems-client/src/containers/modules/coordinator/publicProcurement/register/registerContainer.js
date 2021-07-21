import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PublicProcurementApplicationApi from 'api/modules/coordinator/publicProcurement/publicProcurementApplicationApi';
import Register from 'components/modules/coordinator/publicProcurement/register/register';
import {publicProcurementEstimationTypes, findSelectFieldPosition} from 'utils/';

class RegisterContainer extends Component {

    state ={
        estimationTypes: publicProcurementEstimationTypes(),
        planPositions:[],
    };

    handlePlanPositions = () =>{
        this.props.loading(true);
        PublicProcurementApplicationApi.getPlanPositions()
        .then(response => {
            this.setState( prevState =>{
                let planPositions = [...prevState.planPositions];
                planPositions = response.data.data;
                planPositions.map(position => (
                    Object.assign(position,
                        {
                            estimationType: position.estimationType = findSelectFieldPosition(this.state.estimationTypes, position.estimationType),
                        }
                )))
                return {planPositions}
            })
            this.props.loading(false)
        })
        .catch(error => {});
    }

    componentDidMount(){
        this.handlePlanPositions();
    }

    render(){
        const { isLoading, loading, error, clearError } = this.props;
        const { estimationTypes, planPositions } = this.state;

        return(
            <Register
                estimationTypes={estimationTypes}
                planPositions={planPositions}
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);