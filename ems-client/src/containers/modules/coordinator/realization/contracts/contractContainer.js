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
        contracts: this.props.contracts,
        contractors: [],
        action: this.props.action,
        closeInvoice: false,
        isUpdate: false,
    };

    handleGetContractDetails = () =>{
        this.props.loading(true);
        ContractApi.getContractDetails(this.props.initialValues.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, response.data.data);
                return {initData}
            })
            this.handleGetInvoices(response.data.data.id);
        })
        .catch(error => {})
    }


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

    handleGetInvoices = (contractId) =>{
        this.props.loading(true);
        ContractApi.getInvoices(contractId)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                let closeInvoice = prevState.closeInvoice;
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
            //Update contract details on delete invoice
            this.handleGetContractDetails();
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
                let isUpdate = prevState.isUpdate;
                const contracts = [...prevState.contracts];
                Object.assign(initData, response.data.data);
                if (action === 'add'){
                    contracts.push(initData)
                } else {
                    //Update contract realized value on modify header contract like realPrevYearsValue
                    this.setupContractRealizedValues(initData);
                }
                action = 'edit';
                isUpdate = true;
                return {initData, action, contracts, isUpdate}
            });
            this.props.loading(false)
        })
        .catch(error => {})
    }

    handleClose = () => {
        this.props.onClose(this.state.isUpdate);
    }

    handleCloseInvoiceDetails = (isUpdate) =>{
//        this.setState({
////            closeInvoice: !this.state.closeInvoice,
//            isUpdate: isUpdate,
//        })
        if(isUpdate){
            this.handleGetContractDetails();
        }
    }

    componentDidMount(){
        this.setState(prevState =>{
            let initData = {...prevState.initData};
            Object.assign(initData, this.props.initialValues);

            return {initData}
        });
        if(this.props.action !== 'add'){
            this.handleGetContractDetails();
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
                    contracts={this.state.contracts}
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