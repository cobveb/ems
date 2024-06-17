import React, { Component } from 'react';
import { connect } from "react-redux";
import EntitlementSystems from 'components/modules/asi/dictionary/employees/entitlementSystems';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import { updateOnCloseDetails,findIndexElement } from 'utils';
import EntitlementSystemApi from 'api/modules/asi/dictionary/employee/entitlementSystemApi';

class EntitlementSystemsContainer extends Component {
    state = {
        systems: [],
    }

    handleUpdateOnClose = (system) => {
        let systems = this.state.systems;
        return updateOnCloseDetails(systems, system);
    }

    handleGetEntitlementSystems(){
        this.props.loading(true)
        EntitlementSystemApi.getEntitlementSystems()
        .then(response => {
            this.setState(prevState => {
                let systems = [...prevState.systems]
                systems = response.data.data;
                return {systems};
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleDelete = (system) => {
        this.props.loading(true);
        EntitlementSystemApi.deleteEntitlementSystem(system.id)
        .then(response => {
            this.setState(prevState => {
                const systems = [...prevState.systems];
                const idx = findIndexElement(system, systems);
                if(idx !== null){
                    systems.splice(idx, 1);
                }
                return {systems};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount(){
        this.handleGetEntitlementSystems();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {systems} = this.state;
        return(
            <EntitlementSystems
                initialValues = {systems}
                isLoading = {isLoading}
                error = {error}
                clearError={clearError}
                onClose={this.handleUpdateOnClose}
                onDelete={this.handleDelete}
                onExcelExport={this.handleExcelExport}
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

export default connect(mapStateToProps, mapDispatchToProps)(EntitlementSystemsContainer);