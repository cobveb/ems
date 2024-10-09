import React, { Component } from 'react';
import { connect } from "react-redux";
import * as constants from 'constants/uiNames';
import { bindActionCreators } from 'redux';
import { loading, setError, setConditions, resetSearchConditions, setPageableTableProperties } from 'actions/';
import Contracts from 'components/modules/accountant/realization/contracts/contracts';
import { generateExportLink } from 'utils/';
import ContractApi from 'api/modules/accountant/realization/contractApi';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';

class ContractsContainer extends Component {
    state = {
        contracts: [],
        coordinators: [
            {
                code: '',
                name: constants.HEADING_COORDINATOR,
            },
        ],
    }

    handleGetContracts = () =>{
        this.props.loading(true);
        this.props.searchConditions.rowsPerPage = 25;
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

    handleGetCoordinators(){
        this.props.loading(true);
        return OrganizationUnitsApi.getCoordinators()
        .then(response => {
            this.setState(prevState => {
                let coordinators = [...prevState.coordinators];
                coordinators =  coordinators.concat(response.data.data);
                return {coordinators};
            });
            this.props.loading(false)
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

    componentDidMount(){
        this.handleGetCoordinators();
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
                    coordinators={this.state.coordinators}
                    isLoading={isLoading}
                    error={error}
                    clearError={clearError}
                    searchConditions={this.props.searchConditions}
                    onSetSearchConditions={this.props.onSetSearchConditions}
                    onExcelExport={this.handleExcelExport}
                />
            </>
        );
    };
}

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
        setPageableTableProperties : bindActionCreators(setPageableTableProperties, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ContractsContainer);