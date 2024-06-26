import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import ApplicationProtocolFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationProtocolFormContainer';
import ApplicationProtocolApi from 'api/modules/coordinator/publicProcurement/applicationProtocolApi';
import { findIndexElement, findSelectFieldPosition, generateExportLink, getPublicProcurementProtocolStatuses } from 'utils/';

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
        /*
            If access from application menu get details by initialValues ID.
            If access from protocol menu get details by initialValues APPLICATION ID.
        */
        ApplicationProtocolApi.getProtocolByApplication(this.props.levelAccess === undefined ?
            this.props.initialValues.id : this.props.initialValues.applicationId === undefined ?
                this.props.initialValues.id : this.props.initialValues.applicationId)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.applicationDetails.id = this.props.initialValues.applicationId === undefined ? this.props.initialValues.id : this.props.initialValues.applicationId;
                initData.applicationDetails.number = this.props.initialValues.number;
                initData.applicationDetails.orderedObject = this.props.initialValues.orderedObject;
                initData.applicationCoordinator = this.props.initialValues.applicationCoordinator;
                initData.number = this.props.initialValues.number;
                initData.applicationId = this.props.initialValues.applicationId;
                initData.orderedObject = this.props.initialValues.orderedObject;
                Object.assign(initData, response.data.data);
                if(this.props.levelAccess !== undefined && response.data.data !== null){
                    initData.status = findSelectFieldPosition(getPublicProcurementProtocolStatuses(), response.data.data.status);
                } else if (response.data.data !== null){
                    /* Setup protocol status in coordinator module if protocol is saved */
                    initData.status = findSelectFieldPosition(getPublicProcurementProtocolStatuses(), response.data.data.status);
                }
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
        payload.status = payload.status !== undefined ? payload.status.code : "ZP";
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
        ApplicationProtocolApi.saveProtocolByApplication(payload, this.state.initData.applicationDetails.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, response.data.data);
                initData.status = findSelectFieldPosition(getPublicProcurementProtocolStatuses(), response.data.data.status);
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
        payload.status = payload.status.code;
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
        ApplicationProtocolApi.saveProtocolByApplication(payload, this.state.initData.applicationDetails.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, response.data.data);
                initData.status = findSelectFieldPosition(getPublicProcurementProtocolStatuses(), response.data.data.status);
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
        this.props.loading(true);
        switch(approveLevel){
            case "public":
                ApplicationProtocolApi.approvePublic(this.state.initData.id)
                .then(response =>{
                    this.setState(prevState => {
                        const initData = {...prevState.initData};
                        initData.status = findSelectFieldPosition(getPublicProcurementProtocolStatuses(), response.data.data.status);
                        initData.publicAcceptUser = response.data.data.publicAcceptUser;
                        return {initData};
                    });
                    this.props.onClose(this.state.initData, "approve");
                    this.props.loading(false)
                })
                .catch(error =>{});
                break;
            case "accountant":
                ApplicationProtocolApi.approveAccountant(this.state.initData.id)
                .then(response =>{
                    this.setState(prevState => {
                        const initData = {...prevState.initData};
                        initData.status = findSelectFieldPosition(getPublicProcurementProtocolStatuses(), response.data.data.status);
                        initData.accountantAcceptUser = response.data.data.accountantAcceptUser;
                        return {initData};
                    });
                    this.props.onClose(this.state.initData, "approve");
                    this.props.loading(false)
                })
                .catch(error =>{});
                break;
            case "chief":
                ApplicationProtocolApi.approveChief(this.state.initData.id)
                .then(response =>{
                    this.setState(prevState => {
                        const initData = {...prevState.initData};
                        initData.status = findSelectFieldPosition(getPublicProcurementProtocolStatuses(), response.data.data.status);
                        initData.chiefAcceptUser = response.data.data.chiefAcceptUser;
                        return {initData};
                    });
                    this.props.onClose(this.state.initData, "approve");
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
                initData.status = findSelectFieldPosition(getPublicProcurementProtocolStatuses(), response.data.data);
                return {initData}
            })
            if(this.props.levelAccess !== 'coordinator'){
                this.props.onClose(this.state.initData, "sendBack");
            }
            this.props.loading(false);
        })
        .catch(error =>{})
    }

    handleClose = () => {
        console.log(this.state.initData)
        this.props.onClose(this.state.initData);
    }

    componentDidMount(){
        this.handleProtocolDetails();
    }

    render(){
        const { assortmentGroups, vats, applicationStatus, applicationEstimationType, levelAccess } = this.props;
        const { initData } = this.state;
        return(
            <ApplicationProtocolFormContainer
                initialValues={initData}
                assortmentGroups={assortmentGroups}
                vats={vats}
                applicationStatus={applicationStatus}
                applicationEstimationType={applicationEstimationType}
                levelAccess={levelAccess}
                onSubmit={this.handleSubmit}
                onSavePrice={this.handleSaveProtocolPrice}
                onDeletePrice={this.handleDeleteProtocolPrice}
                onSend={this.handleSend}
                onSendBack={this.handleSendBack}
                onApprove={this.handleApproveProtocol}
                onPrint={this.handlePrintProtocol}
                onClose={this.handleClose}
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
