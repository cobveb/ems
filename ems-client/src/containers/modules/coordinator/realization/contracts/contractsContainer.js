import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import Contracts from 'components/modules/coordinator/realization/contracts/contracts';
import {updateOnCloseDetails} from 'utils/';
import ContractApi from 'api/modules/coordinator/realization/contractApi';
import PublicProcurementApplicationApi from 'api/modules/coordinator/publicProcurement/publicProcurementApplicationApi';

class ContractsContainer extends Component {
    state = {
        contracts: [],
        financialPlanPositions:[],
        investmentPlanPositions:[],
        applications:[],
    }

    handleGetApplications = () =>{
        PublicProcurementApplicationApi.getApplicationsInRealization()
        .then(response =>{
            this.setState(prevState => {
                let applications = [...prevState.applications];
                applications = response.data.data;
                applications.map(application => (
                    Object.assign(application,
                        {
                            code: application.code = application.number !== null ? application.number : "",
                            name: application.name = application.orderedObject !== null ? application.orderedObject : "",
                        }
                    )
                ))
                return {applications};
            });
        })
        .catch(error =>{});
    }

    handleGetFinancialPlanPositions = () => {
        PublicProcurementApplicationApi.getPlanPositions('FIN')
        .then(response => {
            this.setState( prevState =>{
                let financialPlanPositions = [...prevState.financialPlanPositions];
                financialPlanPositions = response.data.data;
                return {financialPlanPositions}
            })
        })
        .catch(error => {});
    }

    handleGetInvestmentPlanPositions = () => {
        PublicProcurementApplicationApi.getPlanPositions('INW')
        .then(response => {
            this.setState( prevState =>{
                let investmentPlanPositions = [...prevState.investmentPlanPositions];
                investmentPlanPositions = response.data.data;
                return {investmentPlanPositions}
            })
        })
        .catch(error => {});
    }

    handleGetContracts = () =>{
        this.props.loading(true);
        ContractApi.getContracts(new Date().getFullYear())
        .then(response =>{
            this.setState({
                contracts: response.data.data,
            })
            this.props.loading(false);
            this.handleGetApplications();
            this.handleGetFinancialPlanPositions();
            this.handleGetInvestmentPlanPositions();
        })
        .catch(error => {})
    }

    handleDelete = (contractId) => {
        this.props.loading(true);
        ContractApi.deleteContract(contractId)
        .then(response => {
            const idx = this.state.contracts.findIndex(contract => contract.id === contractId);
            this.setState(prevState => {
                const contracts = [...prevState.contracts];
                contracts.splice(idx, 1);
                return {contracts}
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleChangeYear = (year) => {
        if((year instanceof Date && !Number.isNaN(year.getFullYear())) || year === null ){
            this.props.loading(true);
            ContractApi.getContracts(year instanceof Date ? year.getFullYear() : 0)
            .then(response =>{
                this.setState({
                    contracts: response.data.data,
                })
                this.props.loading(false);
            })
            .catch(error => {})
        }
    }

    handleUpdateOnCloseDetails = (contract) => {
        return updateOnCloseDetails(this.state.contracts, contract);
    }

    componentDidMount(){
        this.handleGetContracts();
    }

    render(){
        const { isLoading, error, clearError } = this.props;
        return(
            <>
                <Contracts
                    initialValues={this.state.contracts}
                    financialPlanPositions={this.state.financialPlanPositions}
                    investmentPlanPositions={this.state.investmentPlanPositions}
                    applications={this.state.applications}
                    isLoading={isLoading}
                    error={error}
                    clearError={clearError}
                    onChangeYear={this.handleChangeYear}
                    onDelete={this.handleDelete}
                    onClose={this.handleUpdateOnCloseDetails}
                />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ContractsContainer);