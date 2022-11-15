import React, { Component } from 'react';
import { connect } from "react-redux";
import * as constants from 'constants/uiNames';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import Invoices from 'components/modules/accountant/realization/invoices/invoices';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';
import InvoiceApi from 'api/modules/accountant/realization/invoiceApi';
import {updateOnCloseDetails} from 'utils/';

class InvoicesContainer extends Component {
    state = {
        applications:[],
        invoices:[],
        financialPlanPositions:[],
        investmentPlanPositions:[],
        contracts:[],
        coordinators: [
            {
                code: '',
                name: constants.HEADING_COORDINATOR,
            },
        ],
    }

    handleGetInvoices = () =>{
        this.props.loading(true);
        InvoiceApi.getInvoices(new Date().getFullYear())
        .then(response =>{
            this.setState({
                invoices: response.data.data,
            })
            this.props.loading(false);
        })
        .catch(error => {})
    }

    handleGetCoordinators(){
        return OrganizationUnitsApi.getCoordinators()
        .then(response => {
            this.setState(prevState => {
                let coordinators = [...prevState.coordinators];
                coordinators =  coordinators.concat(response.data.data);
                return {coordinators};
            });
        })
        .catch(error => {});
    }

    handleChangeYear = (year) => {
        if((year instanceof Date && !Number.isNaN(year.getFullYear())) || year === null ){
            this.props.loading(true);
            InvoiceApi.getInvoices(year instanceof Date ? year.getFullYear() : 0)
            .then(response =>{
                this.setState({
                    invoices: response.data.data,
                })
                this.props.loading(false);
            })
            .catch(error => {})
        }
    }

    handleUpdateOnCloseDetails = (invoice) => {
        return updateOnCloseDetails(this.state.invoices, invoice);
    }

    componentDidMount(){
        this.handleGetInvoices();
        this.handleGetCoordinators();
    }

    render(){
        const { isLoading, error, clearError } = this.props;
        return (
            <Invoices
                initialValues={this.state.invoices}
                levelAccess="accountant"
                isLoading={isLoading}
                applications={this.state.applications}
                coordinators={this.state.coordinators}
                contracts={this.state.contracts}
                financialPlanPositions={this.state.financialPlanPositions}
                investmentPlanPositions={this.state.investmentPlanPositions}
                error={error}
                clearError={clearError}
                onChangeYear={this.handleChangeYear}
                onClose={this.handleUpdateOnCloseDetails}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesContainer);