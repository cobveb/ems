import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import ApplicationProtocolFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationProtocolFormContainer';
import ApplicationProtocolApi from 'api/modules/coordinator/publicProcurement/applicationProtocolApi';
import { findIndexElement, findSelectFieldPosition, generateExportLink } from 'utils/';

class ApplicationProtocolContainer extends Component {
    state = {
        initData: {
            applicationDetails:{},
            email: false,
            phone: false,
            internet: false,
            paper: false,
            other: false,
            renouncement: false,
            prices: [],
        },
    }

    handleProtocolDetails = () =>{
        this.props.loading(true);
        ApplicationProtocolApi.getProtocolByApplication(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.applicationDetails.number = this.props.initialValues.number;
                initData.applicationDetails.orderedObject = this.props.initialValues.orderedObject;
                Object.assign(initData, response.data.data);
                if(initData.contractor === undefined){
                    initData.contractor = null;
                }
                if(initData.prices.length > 0){
                    initData.prices.map(price => {
                        return Object.assign(price,
                            {
                                vat: price.vat = findSelectFieldPosition(this.props.vats, price.vat),
                                applicationAssortmentGroup: price.applicationAssortmentGroup = Object.assign(price.applicationAssortmentGroup,
                                    {
                                        name: price.applicationAssortmentGroup.applicationProcurementPlanPosition.name,
                                        vat: findSelectFieldPosition(this.props.vats, price.applicationAssortmentGroup.vat),
                                    }
                                )
                            }
                        )
                    })
                }
                return {initData}
            })
            this.props.loading(false);
        })
        .catch(error =>{});
    }

    handleSubmit = (values) => {
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(values));
        payload.prices.map(price =>{
            Object.assign(price,
                {
                    vat: price.vat.code,
                    applicationAssortmentGroup: price.applicationAssortmentGroup = Object.assign(price.applicationAssortmentGroup,
                        {
                            vat: price.applicationAssortmentGroup.vat.code,
                            applicationProcurementPlanPosition: price.applicationAssortmentGroup.applicationProcurementPlanPosition = Object.assign(price.applicationAssortmentGroup.applicationProcurementPlanPosition,
                                {
                                    estimationType: price.applicationAssortmentGroup.applicationProcurementPlanPosition.estimationType.code,
                                }
                            ),
                            applicationAssortmentGroupPlanPositions: [],
                            subsequentYears: [],
                        }
                    )
                }
            )
            return price;
        })
        ApplicationProtocolApi.saveProtocolByApplication(payload, this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, response.data.data);
                if(initData.prices.length > 0){
                    initData.prices.map(price => {
                        return Object.assign(price,
                            {
                                vat: price.vat = findSelectFieldPosition(this.props.vats, price.vat),
                                applicationAssortmentGroup: price.applicationAssortmentGroup = Object.assign(price.applicationAssortmentGroup,
                                    {
                                        name: price.applicationAssortmentGroup.applicationProcurementPlanPosition.name,
                                        vat: findSelectFieldPosition(this.props.vats, price.applicationAssortmentGroup.vat),
                                    }
                                )
                            }
                        )
                    })
                }
                return {initData}
            })
            this.props.loading(false);
        })
        .catch(error =>{});
    }

    handleSaveProtocolPrice = (values, protocol, action) => {
        this.props.loading(true);
        if(action === "add"){
            protocol.prices.push(values)
        } else {
            const idx = findIndexElement(values, protocol.prices);
            if(idx !== null){
              protocol.prices.splice(idx, 1, values);
            }
        }
        const payload = JSON.parse(JSON.stringify(protocol));
        payload.prices.map(price =>{
            Object.assign(price,
                {
                    vat: price.vat.code,
                    applicationAssortmentGroup: price.applicationAssortmentGroup = Object.assign(price.applicationAssortmentGroup,
                        {
                            vat: price.applicationAssortmentGroup.vat.code,
                            applicationProcurementPlanPosition: price.applicationAssortmentGroup.applicationProcurementPlanPosition = Object.assign(price.applicationAssortmentGroup.applicationProcurementPlanPosition,
                                {
                                    estimationType: price.applicationAssortmentGroup.applicationProcurementPlanPosition.estimationType.code,
                                }
                                ),
                            applicationAssortmentGroupPlanPositions: [],
                            subsequentYears: [],
                        }
                    )
                }
            )
            return price;
        })
        ApplicationProtocolApi.saveProtocolByApplication(payload, this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, response.data.data);
                if(initData.prices.length > 0){
                    initData.prices.map(price => {
                        return Object.assign(price,
                            {
                                vat: price.vat = findSelectFieldPosition(this.props.vats, price.vat),
                                applicationAssortmentGroup: price.applicationAssortmentGroup = Object.assign(price.applicationAssortmentGroup,
                                    {
                                        name: price.applicationAssortmentGroup.applicationProcurementPlanPosition.name,
                                        vat: findSelectFieldPosition(this.props.vats, price.applicationAssortmentGroup.vat),
                                    }
                                )
                            }
                        )
                    })
                }
                return {initData}
            })
            this.props.loading(false);
        })
        .catch(error =>{});
    }

    handleDeleteProtocolPrice = (values) => {
        this.props.loading(true);
        ApplicationProtocolApi.deleteProtocolPrice(this.state.initData.id, values.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                const idx = findIndexElement(values, this.state.initData.prices);
                if(idx !== null){
                    initData.prices.splice(idx, 1);
                }
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handleSend = () => {
        this.props.loading(true);
        ApplicationProtocolApi.sendProtocol(this.state.initData.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.status = "WY";
                initData.sendUser = response.data.data.sendUser;
//                Object.assign(initData, response.data.data);
//                if(initData.prices.length > 0){
//                    initData.prices.map(price => {
//                        return Object.assign(price,
//                            {
//                                vat: price.vat = findSelectFieldPosition(this.props.vats, price.vat),
//                                applicationAssortmentGroup: price.applicationAssortmentGroup = Object.assign(price.applicationAssortmentGroup,
//                                    {
//                                        name: price.applicationAssortmentGroup.applicationProcurementPlanPosition.name,
//                                        vat: findSelectFieldPosition(this.props.vats, price.applicationAssortmentGroup.vat),
//                                    }
//                                )
//                            }
//                        )
//                    })
//                }
                return {initData}
            })
        this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handlePrintProtocol = () => {
        this.props.loading(true);
            ApplicationProtocolApi.printProtocol(this.state.initData.id)
            .then(response => {
                generateExportLink(response);
                this.props.loading(false);
            })
            .catch(error => {});
    }

    handleApproveProtocol = (approveLevel) => {
        console.log(approveLevel)
        this.props.loading(true);
        switch(approveLevel){
            case "public":
                console.log(approveLevel)
                ApplicationProtocolApi.approvePublic(this.state.initData.id)
                .then(response =>{
                    this.setState(prevState => {
                        const initData = {...prevState.initData};
                        initData.status = "AZ";
                        initData.publicAcceptUser = response.data.data.publicAcceptUser;
                        return {initData};
                    });
                    this.props.loading(false)
                })
                .catch(error =>{});
                break;
            case "accountant":
                ApplicationProtocolApi.approveAccountant(this.state.initData.id)
                .then(response =>{
                    this.setState(prevState => {
                        const initData = {...prevState.initData};
                        initData.status = "AK";
                        initData.accountantAcceptUser = response.data.data.accountantAcceptUser;
                        return {initData};
                    });
                    this.props.loading(false)
                })
                .catch(error =>{});
                break;
            case "chief":
                ApplicationProtocolApi.approveChief(this.state.initData.id)
                .then(response =>{
                    this.setState(prevState => {
                        const initData = {...prevState.initData};
                        initData.status = "ZA";
                        initData.chiefAcceptUser = response.data.data.chiefAcceptUser;
                        return {initData};
                    });
                    this.props.loading(false)
                })
                .catch(error =>{});
                break;
            // no default
        }
    }

    handleSendBack = () => {
        this.props.loading(true);
        ApplicationProtocolApi.sendBackProtocol(this.state.initData.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.status = "ZP";
                return {initData}
            })
            this.props.loading(false);
        })
        .catch(error =>{})
    }

    componentDidMount(){
        this.handleProtocolDetails();
    }

    render(){
        const { contractors, assortmentGroups, vats, applicationStatus, levelAccess } = this.props;
        const { initData } = this.state;

        return(
            <ApplicationProtocolFormContainer
                initialValues={initData}
                assortmentGroups={assortmentGroups}
                vats={vats}
                contractors={contractors}
                applicationStatus={applicationStatus}
                levelAccess={levelAccess}
                onSubmit={this.handleSubmit}
                onSavePrice={this.handleSaveProtocolPrice}
                onDeletePrice={this.handleDeleteProtocolPrice}
                onSend={this.handleSend}
                onSendBack={this.handleSendBack}
                onApprove={this.handleApproveProtocol}
                onPrint={this.handlePrintProtocol}
                onClose={this.props.onClose}
            />
        )
    }
}


ApplicationProtocolContainer.propTypes = {
    initialValues: PropTypes.object,
    handleClose: PropTypes.func,
    error: PropTypes.string,
    levelAccess: PropTypes.string,
    clearError: PropTypes.func,
    isLoading: PropTypes.bool,
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

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationProtocolContainer);
