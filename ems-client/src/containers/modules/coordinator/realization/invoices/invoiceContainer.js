import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import InvoiceFormContainer from 'containers/modules/coordinator/realization/invoices/forms/invoiceFormContainer';
import { getPlanTypes, getVats, findSelectFieldPosition, findIndexElement } from 'utils/';
import ContractorApi from 'api/modules/accountant/dictionary/contractorApi';
import InvoicesApi from 'api/modules/coordinator/realization/invoicesApi';

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
        action: this.props.action,
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

    handleGetInvoicePositions = () =>{
        this.props.loading(true);
        InvoicesApi.getInvoicePositions(this.props.initialValues.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                if(initData.publicProcurementApplication !== null){
                   initData.publicProcurementApplication = this.setupPublicProcurementApplication(initData.publicProcurementApplication);
                }
                if(initData.contract !== undefined &&  initData.contract !== null){
                   initData.contract = this.setupContract(initData.contract);
                }
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

    handleSubmit = (values) =>{
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        InvoicesApi.saveInvoice(this.state.action, payload)
        .then(response => {
            this.setState(prevState =>{
                let initData = {...prevState.initData};
                let action = prevState.action;
                Object.assign(initData, response.data.data);
                if(initData.publicProcurementApplication !== null){
                   initData.publicProcurementApplication = this.setupPublicProcurementApplication(initData.publicProcurementApplication);
                }
                if(initData.contract !== null){
                   initData.contract = this.setupContract(initData.contract);
                }
                action = 'edit';

                return {initData, action}
            });
            this.props.loading(false)
        })
        .catch(error => {})
    }

    setupPublicProcurementApplication = (publicProcurementApplication) =>{
        if(publicProcurementApplication !== undefined){
            return this.props.applications.filter(application => application.id === publicProcurementApplication.id)[0];
        }
    }

    setupContract = (curContract) =>{
        if(curContract !== undefined){
            return this.props.contracts.filter(contract => contract.id === curContract.id)[0];
        }
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
                return {initData};
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
        this.props.onClose(this.state.initData);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState(prevState =>{
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                if(initData.publicProcurementApplication !== null){
                   initData.publicProcurementApplication = this.setupPublicProcurementApplication(initData.publicProcurementApplication);
                }
                if(initData.contract !== undefined &&  initData.contract !== null){
                   initData.contract = this.setupContract(initData.contract);
                }
                return {initData}
            });
        }
    }

    componentDidMount(){
        this.setState(prevState =>{
            let initData = {...prevState.initData};
            Object.assign(initData, this.props.initialValues);
            if(initData.publicProcurementApplication !== null){
               initData.publicProcurementApplication = this.setupPublicProcurementApplication(initData.publicProcurementApplication);
            }
            if(initData.contract !== undefined &&  initData.contract !== null){
               initData.contract = this.setupContract(initData.contract);
            }
            return {initData}
        });

        if(this.props.action !== "add"){
            this.handleGetInvoicePositions()
        }
        this.handleContractors()
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
                    applications={this.props.applications}
                    contracts={this.props.contracts}
                    financialPlanPositions={this.props.financialPlanPositions}
                    investmentPlanPositions={this.props.investmentPlanPositions}
                    error={this.props.error}
                    clearError={this.props.clearError}
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
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceContainer);