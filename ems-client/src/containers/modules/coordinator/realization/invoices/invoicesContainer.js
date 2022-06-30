import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import Invoices from 'components/modules/coordinator/realization/invoices/invoices';
import PublicProcurementApplicationApi from 'api/modules/coordinator/publicProcurement/publicProcurementApplicationApi';
import InvoicesApi from 'api/modules/coordinator/realization/invoicesApi';
import ContractApi from 'api/modules/coordinator/realization/contractApi';
import {updateOnCloseDetails} from 'utils/';

class InvoicesContainer extends Component {
    state = {
        applications:[],
        invoices:[],
        financialPlanPositions:[],
        investmentPlanPositions:[],
        contracts:[],
    }

    handleGetInvoices = () =>{
        this.props.loading(true);
        InvoicesApi.getInvoices()
        .then(response =>{
            this.setState({
                invoices: response.data.data,
            })
            this.props.loading(false);

        })
        .catch(error => {})
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

    handleGetContracts = () =>{
        ContractApi.getContracts()
        .then(response =>{
            this.setState({
                contracts: response.data.data,
            })
        })
        .catch(error => {})
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

    handleDelete = (invoiceId) => {
        this.props.loading(true);
        InvoicesApi.deleteInvoice(invoiceId)
        .then(response => {
            const idx = this.state.invoices.findIndex(invoice => invoice.id === invoiceId);
            this.setState(prevState => {
                const invoices = [...prevState.invoices];
                invoices.splice(idx, 1);
                return {invoices}
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleUpdateOnCloseDetails = (invoice) => {
        return updateOnCloseDetails(this.state.invoices, invoice);
    }

    componentDidMount(){
        this.handleGetInvoices();
        this.handleGetApplications();
        this.handleGetContracts();
        this.handleGetFinancialPlanPositions();
        this.handleGetInvestmentPlanPositions();
    }

    render(){
        const { isLoading, error, clearError } = this.props;
        return(
            <>
                <Invoices
                    initialValues={this.state.invoices}
                    isLoading={isLoading}
                    applications={this.state.applications}
                    contracts={this.state.contracts}
                    financialPlanPositions={this.state.financialPlanPositions}
                    investmentPlanPositions={this.state.investmentPlanPositions}
                    onDelete={this.handleDelete}
                    error={error}
                    clearError={clearError}
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

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesContainer);