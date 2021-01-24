import React, { Component } from 'react';
import { connect } from "react-redux";
import CostsTypes from 'components/modules/accountant/dictionary/costsTypes';
import CostTypeApi from 'api/modules/accountant/costTypeApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import {updateOnCloseDetails} from 'utils';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';


class CostsTypesContainer extends Component {
    state = {
        costsTypes: [],
        coordinators: [],
    }

    handleGetCostsTypes(){
        this.props.loading(true);
        CostTypeApi.getCostTypeAll()
        .then(response => {
            this.setState({
                costsTypes: response.data.data,
            })
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleGetCoordinators(){
        return OrganizationUnitsApi.getCoordinators()
        .then(response => {
            this.setState({
                coordinators: response.data.data,
            })
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleUpdateOnClose = (cost) => {
        let costs = this.state.costsTypes;
        return updateOnCloseDetails(costs, cost);
    }

    handleDelete = (costId) => {
        this.props.loading(true);
        CostTypeApi.deleteCostType(costId)
        .then(response => {
            let costs = this.state.costsTypes;
            costs = costs.filter(cost => cost.id !== costId)
            this.setState({
                costsTypes: costs,
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount() {
        this.handleGetCostsTypes();
        this.handleGetCoordinators();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {costsTypes, coordinators} = this.state;
        return(
            <CostsTypes
                initialValues = {costsTypes}
                coordinators = {coordinators}
                isLoading = {isLoading}
                error = {error}
                clearError={clearError}
                onClose={this.handleUpdateOnClose}
                onDelete={this.handleDelete}
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

export default connect(mapStateToProps, mapDispatchToProps)(CostsTypesContainer);