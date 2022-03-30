import React, { Component } from 'react';
import { connect } from "react-redux";
import Contractors from 'components/modules/accountant/dictionary/contractors';
import ContractorApi from 'api/modules/accountant/dictionary/contractorApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import {updateOnCloseDetails } from 'utils';

class ContractorsContainer extends Component {
    state = {
        contractors: [],
    }

    handleGetContractors = () => {
        this.props.loading(true);
        ContractorApi.getContractors()
        .then(response => {
            this.setState({
                contractors: response.data.data,
            })
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleUpdateOnClose = (contractor) => {
        let contractors = this.state.contractors;
        return updateOnCloseDetails(contractors, contractor);
    }

    handleDelete = (id) => {
        this.props.loading(true);
        ContractorApi.deleteContractor(id)
        .then(response => {
            this.setState(prevState => {
                let contractors = [...prevState.contractors];
                contractors = contractors.filter(contractor => contractor.id !== id)
                return {contractors};
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount() {
        this.handleGetContractors();
    }

    render(){
        const { isLoading, error, clearError } = this.props;
        const { contractors } = this.state;
        return(
            <Contractors
                initialValues = {contractors}
                isLoading = {isLoading}
                error = {error}
                clearError={clearError}
                onClose={this.handleUpdateOnClose}
                onDelete={this.handleDelete}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContractorsContainer);