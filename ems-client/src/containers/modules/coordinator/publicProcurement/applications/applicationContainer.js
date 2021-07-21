import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import PublicProcurementApi from 'api/modules/coordinator/publicProcurement/publicProcurementApi';
import Application from 'components/modules/coordinator/publicProcurement/applications/application';
import {findIndexElement, findSelectFieldPosition, generateExportLink} from 'utils/';

class ApplicationContainer extends Component {
    state = {
        initData: {
            isParts: true,
            isCombined: false,
            assortmentGroups: [],
            parts: [],
            criteria: [],
        },
    }

    handleSaveApplication = (values) => {
        this.props.loading(true)
            const payload = JSON.parse(JSON.stringify(values));
            if(payload.status !== undefined){
                payload.status = payload.status.code;
            } else {
                // Add application mode
                payload.status = 'ZP';
            }
            if(payload.estimationType !== undefined && payload.estimationType !== null){
                payload.estimationType = payload.estimationType.code;
            }
            payload.mode = payload.mode.code;
            if(this.props.action === "edit"){
                if(payload.assortmentGroups.length > 0){
                    payload.assortmentGroups.map(group => (
                        Object.assign(group,
                            {
                               applicationProcurementPlanPosition: group.applicationProcurementPlanPosition = Object.assign(group.applicationProcurementPlanPosition,{
                                    estimationType: group.applicationProcurementPlanPosition.estimationType = group.applicationProcurementPlanPosition.estimationType.code,
                                    vat: group.applicationProcurementPlanPosition.vat = group.applicationProcurementPlanPosition.vat.code,
                               }),
                               vat: group.vat = group.vat.code
                            }
                        )

                    ))
                }
                if(payload.parts.length > 0){
                    payload.parts.map(part => (
                        Object.assign(part,
                            {
                               vat: part.vat = part.vat.code
                            }
                        )

                    ))
                }
            }
            PublicProcurementApi.saveApplication(this.props.action, payload)
            .then(response => {
                this.setState( prevState => {
                    const initData = {...prevState.initData};
                    Object.assign(initData, response.data.data);
                    initData.mode = response.data.data.mode = findSelectFieldPosition(this.props.modes, response.data.data.mode);
                    initData.status = values.status;
                    initData.estimationType = response.data.data.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.estimationType);
                    initData.assortmentGroups = values.assortmentGroups;
                    return {initData};
                });
            this.props.onClose(this.state.initData);
            })
            .catch(error => {
                this.setState({
                    initData: values,
                });
            });
            this.props.loading(false)
    }

    handlePrintApplication = () => {
        this.props.loading(true);
                PublicProcurementApi.printApplication(this.state.initData.id)
                .then(response => {
                    generateExportLink(response);
                    this.props.loading(false);
                })
                .catch(error => {});
    }

    handleSubmitAssortmentGroup = (values, action, close) => {
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        payload.vat = payload.vat.code;
        payload.applicationProcurementPlanPosition.estimationType = payload.applicationProcurementPlanPosition.estimationType.code;
        payload.applicationProcurementPlanPosition.vat = payload.applicationProcurementPlanPosition.vat.code;
        PublicProcurementApi.saveApplicationAssortmentGroup(this.state.initData.id, action, payload)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                 Object.assign(response.data.data,
                    {
                        status: response.data.data.status = initData.status,
                        mode: response.data.data.mode = findSelectFieldPosition(this.props.modes, response.data.data.mode),
                        estimationType: response.data.data.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.estimationType)
                    }
                )
                response.data.data.assortmentGroups.map(group => (
                    Object.assign(group,
                        {
                           applicationProcurementPlanPosition: group.applicationProcurementPlanPosition = Object.assign(group.applicationProcurementPlanPosition,{
                                estimationType: group.applicationProcurementPlanPosition.estimationType = findSelectFieldPosition(this.props.estimationTypes, group.applicationProcurementPlanPosition.estimationType),
                                vat: group.applicationProcurementPlanPosition.vat = findSelectFieldPosition(this.props.vats, group.applicationProcurementPlanPosition.vat),
                           }),
                           vat: group.vat = findSelectFieldPosition(this.props.vats, group.vat)
                        }
                    )
                ))
                initData = response.data.data;
                return {initData};
            });
            this.props.loading(false);
            close();
        })
        .catch(error => {
            this.setState({
                initData: values,
            });
            this.props.loading(false);
        });
    }

    handleDeleteAssortmentGroup = (values) => {
        this.props.loading(true);
        PublicProcurementApi.deleteApplicationAssortmentGroup(values.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                Object.assign(response.data.data,
                    {
                        status: response.data.data.status = initData.status,
                        mode: response.data.data.mode = findSelectFieldPosition(this.props.modes, response.data.data.mode),
                        estimationType: response.data.data.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.estimationType)
                    }
                )
                response.data.data.assortmentGroups.map(group => (
                    Object.assign(group,
                        {
                            applicationProcurementPlanPosition: group.applicationProcurementPlanPosition = Object.assign(group.applicationProcurementPlanPosition,{
                                estimationType: group.applicationProcurementPlanPosition.estimationType = findSelectFieldPosition(this.props.estimationTypes, group.applicationProcurementPlanPosition.estimationType),
                                vat: group.applicationProcurementPlanPosition.vat = findSelectFieldPosition(this.props.vats, group.applicationProcurementPlanPosition.vat),
                            }),
                            vat: group.vat = findSelectFieldPosition(this.props.vats, group.vat)
                        }
                    )
                ))
                initData = response.data.data;
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handleSubmitPart = (values, action, close) => {
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        payload.vat = payload.vat.code;
        return PublicProcurementApi.savePart(this.state.initData.id, action, payload)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                Object.assign(response.data.data,
                    {
                        vat: response.data.data.vat = findSelectFieldPosition(this.props.vats, response.data.data.vat)
                    }
                )
                if(action === "add"){
                    initData.parts.push(response.data.data)
                } else {
                    const idx = findIndexElement(response.data.data, this.state.initData.parts);
                    if(idx !== null){
                        initData.parts.splice(idx, 1, response.data.data);
                    }
                }
                return {initData};
            });
            this.props.loading(false)
            close();
        })
        .catch(error => {
            this.setState({
                initData: values,
            });
            this.props.loading(false);
        });
    }

    handleDeletePart = (values) => {
        this.props.loading(true);
        PublicProcurementApi.deletePart(values.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                const idx = findIndexElement(values, this.state.initData.parts);
                if(idx !== null){
                    initData.parts.splice(idx, 1);
                }
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handleSubmitCriterion = (values, action, close) => {
        this.props.loading(true)
        return PublicProcurementApi.saveCriterion(this.state.initData.id, action, values)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                if(action === "add"){
                    initData.criteria.push(response.data.data)
                } else {
                    const idx = findIndexElement(response.data.data, this.state.initData.criteria);
                    if(idx !== null){
                        initData.criteria.splice(idx, 1, response.data.data);
                    }
                }
                return {initData};
            });
            this.props.loading(false)
            close();
        })
        .catch(error => {
            this.setState({
                initData: values,
            });
            this.props.loading(false);
        });
    }

    handleDeleteCriterion = (values) => {
        this.props.loading(true);
        PublicProcurementApi.deleteCriterion(values.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                const idx = findIndexElement(values, this.state.initData.criteria);
                if(idx !== null){
                    initData.criteria.splice(idx, 1);
                }
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handleClose = () => {
        this.props.onClose(this.state.initData);
    }

    handleSendApplication = () => {
        this.props.loading(true);
        PublicProcurementApi.sendApplication(this.state.initData.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                initData.sendUser = response.data.data.sendUser;
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error =>{});
    }


    componentDidMount(){
        this.setState( prevState => {
            let initData = {...prevState.initData};
            Object.assign(initData, this.props.initialValues);
            if(this.props.action === "edit"){
                if(initData["assortmentGroups"].length > 0){
                    initData.assortmentGroups.map(group => {
                        if(group.applicationProcurementPlanPosition.estimationType.code === undefined){
                            Object.assign(group,
                            {
                                applicationProcurementPlanPosition: group.applicationProcurementPlanPosition = Object.assign(group.applicationProcurementPlanPosition,{
                                    estimationType: group.applicationProcurementPlanPosition.estimationType = findSelectFieldPosition(this.props.estimationTypes, group.applicationProcurementPlanPosition.estimationType),
                                    vat: group.applicationProcurementPlanPosition.vat = findSelectFieldPosition(this.props.vats, group.applicationProcurementPlanPosition.vat),
                                }),
                                vat: group.vat = findSelectFieldPosition(this.props.vats, group.vat)
                            })
                        }
                        return group;
                    })
                }
                if(initData["parts"].length > 0){
                    initData.parts.map(part => {
                        return Object.assign(part,
                            {
                               vat: part.vat = findSelectFieldPosition(this.props.vats, part.vat)
                            }
                        )
                    })
                }
            }
         return {initData};
        });

    }


    render(){
        const { action, isLoading, estimationTypes, vats, planPositions, coordinators, modes } = this.props;
        const { initData } = this.state;
        return(
            <Application
                isLoading={isLoading}
                initialValues={initData}
                action={action}
                estimationTypes={estimationTypes}
                vats={vats}
                planPositions={planPositions}
                coordinators={coordinators}
                modes={modes}
                onPrint={this.handlePrintApplication}
                onSave={this.handleSaveApplication}
                onSaveAssortmentGroup={this.handleSubmitAssortmentGroup}
                onDeleteAssortmentGroup={this.handleDeleteAssortmentGroup}
                onSavePart={this.handleSubmitPart}
                onDeletePart={this.handleDeletePart}
                onSaveCriterion={this.handleSubmitCriterion}
                onDeleteCriterion={this.handleDeleteCriterion}
                onSendApplication={this.handleSendApplication}
                onClose={this.handleClose}
            />
        )
    }
}

ApplicationContainer.propTypes = {
    initialValues: PropTypes.object,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    handleClose: PropTypes.func,
    error: PropTypes.string,
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

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationContainer);
