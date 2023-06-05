import React, { Component } from 'react';
import { connect } from "react-redux";
import PlaceFormContainer from 'containers/modules/hr/dictionary/forms/placeFormContainer';
import WorkplacesApi from 'api/modules/hr/dictionary/workplacesApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import { findSelectFieldPosition } from 'utils';

class WorkplaceContainer extends Component {

    state = {
        initData: this.props.initialValues,
        action: this.props.action,
    }

    handleSubmit = (values, action) => {
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        WorkplacesApi.saveWorkplace(payload)
        .then(response => {
            response.data.data.group = findSelectFieldPosition(this.props.groups, response.data.data.group.code);
            this.props.onClose(response.data.data);
            this.props.loading(false)
        })
        .catch(error => {});
    }

    render(){
        return (
            <PlaceFormContainer
                initialValues={this.state.initData}
                groups={this.props.groups}
                positions={this.props.positions}
                changeVisibleDetails={this.props.handleChangeVisibleDetails}
                action={this.state.action}
                isLoading={this.props.isLoading}
                error={this.props.error}
                clearError={this.props.clearError}
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkplaceContainer);