import React, { Component } from 'react';
import { connect } from "react-redux";
import PlaceFormContainer from 'containers/modules/hr/dictionary/forms/placeFormContainer';
import PlacesApi from 'api/modules/hr/dictionary/placesApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import { findSelectFieldPosition } from 'utils';

class PlaceContainer extends Component {

    state = {
        initData: this.props.initialValues,
        action: this.props.action,
    }

    handleSubmit = (values, action) => {
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        PlacesApi.savePlace(payload)
        .then(response => {
            response.data.data.location = findSelectFieldPosition(this.props.locations, response.data.data.location.code);
            this.props.onClose(response.data.data);
            this.props.loading(false)
        })
        .catch(error => {});
    }

    render(){
        return (
            <PlaceFormContainer
                initialValues={this.state.initData}
                locations={this.props.locations}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlaceContainer);