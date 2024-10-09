import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError, setDictionaryPageableTableProperties, resetDictionarySearchConditions, setDictionaryConditions, setDictionaryName} from 'actions/';
import * as constants from 'constants/uiNames';
import InvoiceFormContainer from 'containers/modules/coordinator/realization/invoices/forms/invoiceFormContainer';
import { getPlanTypes, getVats, findSelectFieldPosition, findIndexElement } from 'utils/';
import ContractorApi from 'api/modules/accountant/dictionary/contractorApi';
import InvoicesApi from 'api/modules/coordinator/realization/invoicesApi';
import PublicProcurementApplicationApi from 'api/modules/coordinator/publicProcurement/publicProcurementApplicationApi';
import ContractApi from 'api/modules/coordinator/realization/contractApi';

class InvoiceContainer extends Component {
    state = {
        initData: {
            invoicePositions: [],
        },
        planTypes: getPlanTypes(),
        vats: [
            {
                code: 'R',
                name:  constants.VAT_DIFF,
            }
        ].concat(getVats()),
        contractors: [],
        financialPlanPositions:[],
        investmentPlanPositions:[],
        action: this.props.action,
        applications: [],
        contracts: [],
        isUpdate: false,
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

    handleGetApplications = () =>{
        this.props.loading(true)
        PublicProcurementApplicationApi.getApplicationsDictionary(this.props.dictionarySearchConditions)
        .then(response =>{
            this.setState(prevState => {
                this.props.setDictionaryPageableTableProperties({
                    totalElements: response.data.data.totalElements,
                    lastPage: response.data.data.last,
                    firstPage: response.data.data.first,
                })
                let applications = [...prevState.applications];
                applications = response.data.data.content;
                return {applications};
            });
            this.props.loading(false)
        })
        .catch(error =>{});
    }

    handleGetContracts = () =>{
        this.props.loading(true)
        ContractApi.getContractsDictionary(this.props.dictionarySearchConditions)
        .then(response =>{
            this.setState(prevState => {
                this.props.setDictionaryPageableTableProperties({
                    totalElements: response.data.data.totalElements,
                    lastPage: response.data.data.last,
                    firstPage: response.data.data.first,
                })
                let contracts = [...prevState.contracts];
                contracts = response.data.data.content;
                return {contracts};
            });
            this.props.loading(false)
        })
        .catch(error => {})
    }

    handleGetInvoiceDetails = () =>{
        this.props.loading(true);
        InvoicesApi.getInvoiceDetails(this.props.initialValues.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                response.data.data.invoicePositions.map(position =>(
                    this.setupPositionIncludedPlanType(position)
                ))
                Object.assign(initData, response.data.data);
                return {initData}
            })
            this.props.loading(false)
        })
        .catch(error => {})
    }

    handleGetInvoicePositions = () =>{
        InvoicesApi.getInvoicePositions(this.props.initialValues.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                response.data.data.map(position =>(
                    this.setupPositionIncludedPlanType(position)
                ))
                initData.invoicePositions = response.data.data;
                return {initData}
            })
            this.props.loading(false);
        })
        .catch(error => {})
    }

    handleGetFinancialPlanPositions = (sellDate) => {
        InvoicesApi.getPlanPositions(new Date(sellDate).getFullYear(), 'FIN')
        .then(response => {
            this.setState( prevState =>{
                let financialPlanPositions = [...prevState.financialPlanPositions];
                financialPlanPositions = response.data.data;
                return {financialPlanPositions}
            })
        })
        .catch(error => {});
    }

    handleGetInvestmentPlanPositions = (sellDate) => {
        InvoicesApi.getPlanPositions(new Date(sellDate).getFullYear(), 'INW')
        .then(response => {
            this.setState( prevState =>{
                let investmentPlanPositions = [...prevState.investmentPlanPositions];
                investmentPlanPositions = response.data.data;
                return {investmentPlanPositions}
            })
        })
        .catch(error => {});
    }

    handleSubmit = (values) =>{
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        if(this.state.action === "edit" && payload.invoicePositions.length > 0){
            payload.invoicePositions.forEach(position => {
                position.positionIncludedPlanType =  position.positionIncludedPlanType.code;
                position.vat =  position.vat.code;
            });
        }
        InvoicesApi.saveInvoice(this.state.action, payload)
        .then(response => {
            this.setState(prevState =>{
                let initData = {...prevState.initData};
                let action = prevState.action;
                let isUpdate = prevState.isUpdate;
                Object.assign(initData, response.data.data);
                initData.invoicePositions = values.invoicePositions;
                /* Get plans position on add invoice action */
                this.handleGetFinancialPlanPositions(response.data.data.sellDate);
                this.handleGetInvestmentPlanPositions(response.data.data.sellDate);


                action = 'edit';
                isUpdate = true;
                return {initData, action, isUpdate}
            });
            this.props.loading(false)
        })
        .catch(error => {})
    }

    setupPositionIncludedPlanType = (position) =>{
        Object.assign(position,
            {
                positionIncludedPlanType: position.positionIncludedPlanType = findSelectFieldPosition(this.state.planTypes, position.positionIncludedPlanType),
                vat: position.vat = position.vat !== null ? findSelectFieldPosition(this.state.vats, position.vat) : this.state.vats[0],
            }
        )
    }

    handleSubmitPosition = (values, action) => {
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(values));
        payload.positionIncludedPlanType = payload.positionIncludedPlanType.code;
        payload.coordinatorPlanPosition.type = payload.positionIncludedPlanType.toLowerCase();
        payload.vat = payload.vat.code !== 'R' ? payload.vat.code : null;
        InvoicesApi.saveInvoicePosition(this.state.initData.id, action, payload)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                let isUpdate = prevState.isUpdate;
                this.setupPositionIncludedPlanType(response.data.data);
                if(action === 'add'){
                    initData.invoicePositions.push(response.data.data);
                    initData.invoiceValueNet = initData.invoiceValueNet + response.data.data.amountNet;
                    initData.invoiceValueGross = initData.invoiceValueGross + response.data.data.amountGross;
                } else {
                    const idx = findIndexElement(response.data.data, this.state.initData.invoicePositions);
                    if(idx !== null){
                        initData.invoiceValueNet = initData.invoiceValueNet - this.state.initData.invoicePositions[idx].amountNet;
                        initData.invoiceValueGross = initData.invoiceValueGross - this.state.initData.invoicePositions[idx].amountGross;
                        initData.invoicePositions.splice(idx, 1, response.data.data);
                        initData.invoiceValueNet = initData.invoiceValueNet + response.data.data.amountNet;
                        initData.invoiceValueGross = initData.invoiceValueGross + response.data.data.amountGross;
                    }
                }
                isUpdate = true;
                return {initData, isUpdate};
            })
            this.props.loading(false);
        })
        .catch(error => {})
    }

    handleDeletePosition = (position) => {
        this.props.loading(true);
        const idx = findIndexElement(position, this.state.initData.invoicePositions);
        if(idx !== null){
            InvoicesApi.deleteInvoicePosition(position.id)
            .then(response => {
                this.setState(prevState => {
                    let initData = {...prevState.initData};
                    initData.invoicePositions.splice(idx, 1);
                    initData.invoiceValueNet = initData.invoiceValueNet - position.amountNet;
                    initData.invoiceValueGross = initData.invoiceValueGross - position.amountGross;
                    return {initData};
                })
            })
            .catch(error => {})
        }
        this.props.loading(false);
    }

    handleClose = () => {
        this.props.onClose(this.state.isUpdate);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState(prevState =>{
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                return {initData}
            });
        }

        if(this.props.dictionarySearchConditions !== prevProps.dictionarySearchConditions){
            if(this.props.dictionarySearchConditions.dictionaryName === constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_TITLE){
                this.handleGetApplications();
            } else if (this.props.dictionarySearchConditions.dictionaryName === constants.COORDINATOR_REALIZATION_INVOICE_CONTRACT){
                this.handleGetContracts();
            }
        }
    }

    componentDidMount(){
        if(this.props.action === "add"){
            this.setState(prevState =>{
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                return {initData}
            });
        } else {
            this.handleGetInvoiceDetails();
            this.handleGetFinancialPlanPositions(this.props.initialValues.sellDate);
            this.handleGetInvestmentPlanPositions(this.props.initialValues.sellDate);
        }
        this.handleContractors()
    }

    componentWillUnmount(){
        this.props.resetDictionarySearchConditions();
    }

    render(){
        return(
            <>
                <InvoiceFormContainer
                    initialValues={this.state.initData}
                    action= {this.state.action}
                    isLoading={this.props.isLoading}
                    planTypes={this.state.planTypes}
                    vats={this.state.vats}
                    contractors={this.state.contractors}
                    applications={this.state.applications}
                    contracts={this.state.contracts}
                    financialPlanPositions={this.state.financialPlanPositions}
                    investmentPlanPositions={this.state.investmentPlanPositions}
                    error={this.props.error}
                    clearError={this.props.clearError}
                    onChangeDictionarySearchConditions={this.props.setDictionarySearchConditions}
                    onSetDictionaryName={this.props.setDictionaryName}
                    onSubmit={this.handleSubmit}
                    onSubmitPosition={this.handleSubmitPosition}
                    onDeletePosition={this.handleDeletePosition}
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
		dictionarySearchConditions: state.dictionarySearch,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
        resetDictionarySearchConditions : bindActionCreators(resetDictionarySearchConditions, dispatch),
        setDictionarySearchConditions : bindActionCreators(setDictionaryConditions, dispatch),
        setDictionaryPageableTableProperties : bindActionCreators(setDictionaryPageableTableProperties, dispatch),
        setDictionaryName : bindActionCreators(setDictionaryName, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceContainer);