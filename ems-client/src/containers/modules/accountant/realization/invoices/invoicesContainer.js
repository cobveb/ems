import React, { Component } from 'react';
import { connect } from "react-redux";
import * as constants from 'constants/uiNames';
import { bindActionCreators } from 'redux';
import { loading, setError, setConditions, resetSearchConditions, setPageableTableProperties } from 'actions/';
import Invoices from 'components/modules/accountant/realization/invoices/invoices';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';
import InvoiceApi from 'api/modules/accountant/realization/invoiceApi';
import {generateExportLink} from 'utils/';

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
        InvoiceApi.getInvoicesPageable(this.props.searchConditions)
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

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        InvoiceApi.exportInvoicesToExcel(exportType, headRow, this.props.searchConditions)
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

    componentDidMount(){
        this.handleGetCoordinators();
    }

    componentWillUnmount(){
        this.props.resetSearchConditions();
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
                searchConditions={this.props.searchConditions}
                onSetSearchConditions={this.props.onSetSearchConditions}
                onExcelExport={this.handleExcelExport}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesContainer);