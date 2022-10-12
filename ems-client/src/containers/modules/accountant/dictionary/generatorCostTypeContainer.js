import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import GeneratorCostsTypesFormContainer from  'containers/modules/accountant/dictionary/forms/generatorCostTypeFormContainer';
import CostTypeApi from 'api/modules/accountant/costTypeApi';

class GeneratorCostsTypesContainer extends Component {
    state = {
        initData: null,
    }
    handleSubmit = (values) => {
        this.props.loading(true);
        CostTypeApi.generateCostsTypes(new Date(values.sourceYear).getFullYear(), new Date(values.targetYear).getFullYear())
        .then(response => {
            this.props.setupGenerateMsg(response.data.data);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    render(){
        const { isLoading, error, clearError } = this.props;
        return (
            <GeneratorCostsTypesFormContainer
                open={this.props.open}
                isLoading={isLoading}
                error={error}
                clearError={clearError}
                onSubmit={this.handleSubmit}
                onClose={this.props.onClose}
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

export default connect(mapStateToProps, mapDispatchToProps)(GeneratorCostsTypesContainer);