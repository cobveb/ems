import React, { Component } from 'react';
import { connect } from "react-redux";
import * as constants from 'constants/uiNames';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import Contracts from 'components/modules/accountant/realization/contracts/contracts';
import {updateOnCloseDetails} from 'utils/';
import ContractApi from 'api/modules/accountant/realization/contractApi';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';

class ContractsContainer extends Component {
    state = {
        contracts: [],
        financialPlanPositions:[],
        investmentPlanPositions:[],
        applications:[],
        coordinators: [
            {
                code: '',
                name: constants.HEADING_COORDINATOR,
            },
        ],
    }


    handleGetContracts = () =>{
        this.props.loading(true);
        ContractApi.getContracts(new Date().getFullYear())
        .then(response =>{
            this.setState({
                contracts: response.data.data,
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

    handleChangeYear = (year) => {
        this.props.loading(true);
        if(year !== null){
            ContractApi.getContracts(year.getFullYear())
            .then(response =>{
                this.setState({
                    contracts: response.data.data,
                })
                this.props.loading(false);
            })
            .catch(error => {})
        } else {
            ContractApi.getAllContracts()
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
        this.handleGetCoordinators();
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
                    coordinators={this.state.coordinators}
                    isLoading={isLoading}
                    error={error}
                    clearError={clearError}
                    onChangeYear={this.handleChangeYear}
                    onClose={this.handleUpdateOnCloseDetails}
                />
            </>
        );
    };
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

export default connect(mapStateToProps, mapDispatchToProps)(ContractsContainer);