import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import PlanSubPositions from 'components/modules/publicProcurement/institution/plans/planSubPositions.js';
import PlansApi from 'api/modules/publicProcurement/institution/plansApi';

class PlanSubPositionsContainer extends Component {

    state = {
        initData: {
            subPositions: [],
        }
    }

    handleGetSubPositions = () => {
        this.props.loading(true);
        PlansApi.getSubPositions(this.props.initialValues.id)
        .then(response =>{
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                initData.subPositions = response.data.data;
                return { initData }
            })
            this.props.loading(false);
        })
        .catch(error=>{})
    }

    componentDidMount(){
        this.handleGetSubPositions();
    }


    render(){
        const { initData } = this.state;

        return(
            <PlanSubPositions
                initialValues={initData}
                error={this.props.error}
                clearError={this.props.clearError}
                isLoading={this.props.isLoading}
                onClose={this.props.onClose}
            />
        );
    };
};

PlanSubPositionsContainer.propTypes = {
    initialValues: PropTypes.object,
    handleClose: PropTypes.func,
    error: PropTypes.string,
    clearError: PropTypes.func,
    isLoading: PropTypes.bool,
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

export default connect(mapStateToProps, mapDispatchToProps)(PlanSubPositionsContainer);