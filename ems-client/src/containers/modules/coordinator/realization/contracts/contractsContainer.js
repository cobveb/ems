import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError, setConditions, resetSearchConditions, setPageableTableProperties } from 'actions/';
import Contracts from 'components/modules/coordinator/realization/contracts/contracts';
import { generateExportLink } from 'utils/';
import ContractApi from 'api/modules/coordinator/realization/contractApi';

class ContractsContainer extends Component {
    state = {
        contracts: [],
    }

    handleGetContracts = () => {
        this.props.loading(true);
        ContractApi.getContracts(this.props.searchConditions)
        .then(response =>{
            this.props.setPageableTableProperties({
                totalElements: response.data.data.totalElements,
                lastPage: response.data.data.last,
                firstPage: response.data.data.first,
            })
            this.setState({
                contracts: response.data.data.content,
            })
            this.props.loading(false);
        })
        .catch(error => {})
    }

    handleDelete = (contractId) => {
        this.props.loading(true);
        ContractApi.deleteContract(contractId)
        .then(response => {
            this.handleGetContracts();
        })
        .catch(error => {});
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        ContractApi.exportContractsToExcel(exportType, headRow, this.props.searchConditions)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidUpdate(prevProps){
        if(this.props.searchConditions !== prevProps.searchConditions){
            this.handleGetContracts();
        }
    }

    componentWillUnmount(){
        this.props.resetSearchConditions();
    }

    render(){
        const { isLoading, error, clearError } = this.props;
        return(
            <>
                <Contracts
                    initialValues={this.state.contracts}
                    isLoading={isLoading}
                    error={error}
                    clearError={clearError}
                    searchConditions={this.props.searchConditions}
                    onSetSearchConditions={this.props.onSetSearchConditions}
                    onDelete={this.handleDelete}
                    onExcelExport={this.handleExcelExport}
                    onClose={this.handleGetContracts}
                />
            </>
        );
    };

};

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
		error: state.ui.error,
		searchConditions: state.search,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
        onSetSearchConditions : bindActionCreators(setConditions, dispatch),
        resetSearchConditions : bindActionCreators(resetSearchConditions, dispatch),
        setPageableTableProperties : bindActionCreators(setPageableTableProperties, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ContractsContainer);