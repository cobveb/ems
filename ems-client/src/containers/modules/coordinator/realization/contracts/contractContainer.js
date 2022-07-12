import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import ContractFormContainer from 'containers/modules/coordinator/realization/contracts/forms/contractFormContainer';
import { getPlanTypes } from 'utils/';
import ContractorApi from 'api/modules/accountant/dictionary/contractorApi';
import ContractApi from 'api/modules/coordinator/realization/contractApi';
import InvoicesApi from 'api/modules/coordinator/realization/invoicesApi';

class ContractContainer extends Component {
    state = {
        initData: {
            invoices: [],
        },
        planTypes: getPlanTypes(),

        contractors: [],
        action: this.props.action,
        closeInvoice: false,
    };

    handleContractors = () => {
        ContractorApi.getActiveContractors()
        .then(response =>{
            this.setState({
                contractors: response.data.data,
            })
        })
        .catch(error =>{})
    }

    setupContractRealizedValues = (contract) =>{
        if(contract.invoices !== undefined){
            let tmpAwaNet = 0;
            let tmpAwaGross = 0;
            contract.invoices.forEach(invoice =>{
                tmpAwaNet += invoice.invoiceValueNet;
                tmpAwaGross += invoice.invoiceValueGross;
            })
            contract.invoicesValueNet = tmpAwaNet;
            contract.invoicesValueGross = tmpAwaGross;

            contract.realizedValueNet = contract.realPrevYearsValueNet + contract.invoicesValueNet;
            contract.realizedValueGross = contract.realPrevYearsValueGross + contract.invoicesValueGross;
            contract.valueToRealizeNet = contract.contractValueNet - contract.realizedValueNet;
            contract.valueToRealizeGross = contract.contractValueGross - contract.realizedValueGross;
        }
    }

    handleGetInvoices = () =>{
        this.props.loading(true);
        ContractApi.getInvoices(this.props.initialValues.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                let closeInvoice = prevState.closeInvoice;
                Object.assign(initData, this.props.initialValues);
                initData.invoices = response.data.data;
                //Update contract realized value on close invoice
                if(closeInvoice){
                    this.setupContractRealizedValues(initData);
                    closeInvoice = !closeInvoice;
                }
                return {initData, closeInvoice}
            })
        this.props.loading(false);
        })
        .catch(error => {})
    }

    handleDeleteInvoice = (invoiceId) => {
        this.props.loading(true);
        InvoicesApi.deleteInvoice(invoiceId)
        .then(response => {
            const idx = this.state.initData.invoices.findIndex(invoice => invoice.id === invoiceId);
            this.setState(prevState => {
                const initData = {...prevState.initData};
                initData.invoices.splice(idx, 1);
                //Update contract realized value on delete invoice
                this.setupContractRealizedValues(initData);
                return {initData}
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }


    handleSubmit = (values) =>{
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        ContractApi.saveContract(this.state.action, payload)
        .then(response => {
            this.setState(prevState =>{
                let initData = {...prevState.initData};
                let action = prevState.action;
                Object.assign(initData, response.data.data);
                action = 'edit';
                return {initData, action}
            });
            this.props.loading(false)
        })
        .catch(error => {})
    }

    handleClose = () => {
        this.props.onClose(this.state.initData);
    }

    handleCloseInvoiceDetails = () =>{
        this.setState({
            closeInvoice: !this.state.closeInvoice,
        })
        this.handleGetInvoices();
    }

    componentDidMount(){

        if(this.props.action !== 'add'){
            this.handleGetInvoices();
        } else {
            this.setState(prevState =>{
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                return {initData}
            });
        }
        this.handleContractors();
    }

    render(){
        return(
            <>
                <ContractFormContainer
                    initialValues= {this.state.initData}
                    action= {this.state.action}
                    isLoading={this.props.isLoading}
                    contractors={this.state.contractors}
                    financialPlanPositions={this.props.financialPlanPositions}
                    investmentPlanPositions={this.props.investmentPlanPositions}
                    contracts={this.props.contracts}
                    applications={this.props.applications}
                    error={this.props.error}
                    clearError={this.props.clearError}
                    onSubmit={this.handleSubmit}
                    onCloseInvoiceDetails={this.handleCloseInvoiceDetails}
                    onDeleteInvoice={this.handleDeleteInvoice}
                    onClose={this.handleClose}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContractContainer);