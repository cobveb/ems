import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError, setConditions, resetSearchConditions, setPageableTableProperties } from 'actions/';
import Invoices from 'components/modules/coordinator/realization/invoices/invoices';
import InvoicesApi from 'api/modules/coordinator/realization/invoicesApi';
import {generateExportLink} from 'utils/';

class InvoicesContainer extends Component {
    state = {
        invoices:[],
        financialPlanPositions:[],
        investmentPlanPositions:[],
        contracts:[],
    }

    handleGetInvoices = () =>{
        this.props.loading(true);
        InvoicesApi.getInvoicesPageable(this.props.searchConditions)
        .then(response =>{
            this.props.setPageableTableProperties({
                totalElements: response.data.data.totalElements,
                lastPage: response.data.data.last,
                firstPage: response.data.data.first,
            })
            this.setState({
                invoices: response.data.data.content,
            })
            this.props.loading(false);
        })
        .catch(error => {})
    }


    handleDelete = (invoiceId) => {
        this.props.loading(true);
        InvoicesApi.deleteInvoice(invoiceId)
        .then(response => {
            this.handleGetInvoices();
        })
        .catch(error => {});
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        InvoicesApi.exportInvoicesToExcel(exportType, headRow, this.props.searchConditions)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidUpdate(prevProps){
        if(this.props.searchConditions !== prevProps.searchConditions){
            this.handleGetInvoices();
        }
    }

    componentWillUnmount(){
        this.props.resetSearchConditions();
    }

    render(){
        const { isLoading, error, clearError } = this.props;
        return(
            <>
                <Invoices
                    initialValues={this.state.invoices}
                    isLoading={isLoading}
                    financialPlanPositions={this.state.financialPlanPositions}
                    investmentPlanPositions={this.state.investmentPlanPositions}
                    onDelete={this.handleDelete}
                    error={error}
                    clearError={clearError}
                    searchConditions={this.props.searchConditions}
                    onSetSearchConditions={this.props.onSetSearchConditions}
                    onExcelExport={this.handleExcelExport}
                    onClose={this.handleGetInvoices}
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

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesContainer);