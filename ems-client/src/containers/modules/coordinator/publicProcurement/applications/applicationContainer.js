import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import PublicProcurementApplicationApi from 'api/modules/coordinator/publicProcurement/publicProcurementApplicationApi';
import ApplicationFormContainer from 'containers/modules/coordinator/publicProcurement/applications/forms/applicationFormContainer';
import {findIndexElement, findSelectFieldPosition, generateExportLink} from 'utils/';
import ContractorApi from 'api/modules/accountant/dictionary/contractorApi';
import ApplicationProtocolApi from 'api/modules/coordinator/publicProcurement/applicationProtocolApi';
import PublicApplicationsApi from 'api/modules/publicProcurement/coordinator/applicationsApi';

class ApplicationContainer extends Component {
    state = {
        initData: {
            isParts: false,
            isCombined: false,
            assortmentGroups: [],
            parts: [],
            criteria: [],
            applicationProtocol: {
                email: false,
                phone: false,
                internet: false,
                paper: false,
                other: false,
                renouncement: false,
                prices: [],
                contractor:{
                    code:'',
                    name:''
                },
            },
        },
        planPositions: [],
        applicationTypes: [],
        contractors: [],
        action: this.props.action,
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

    handleApplicationDetails = () => {
        this.props.loading(true);
        PublicProcurementApplicationApi.getApplication(this.props.initialValues.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                response.data.data.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                response.data.data.mode = findSelectFieldPosition(this.props.modes, response.data.data.mode);
                response.data.data.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.estimationType);
                response.data.data.orderIncludedPlanType= findSelectFieldPosition(this.props.planTypes, response.data.data.orderIncludedPlanType);
                if(response.data.data.orderProcedure !== null){
                    response.data.data.orderProcedure = findSelectFieldPosition(this.props.orderProcedures, response.data.data.orderProcedure.code);
                }
                if(response.data.data.replaySourceApplication !== null){
                    response.data.data.replaySourceApplication = this.props.applications.filter(application => application.id === response.data.data.replaySourceApplication.id)[0];
                }
                if(response.data.data.applicationProtocol === null){
                    response.data.data.applicationProtocol = prevState.initData.applicationProtocol;
                }
                Object.assign(initData, response.data.data);
                if(initData["assortmentGroups"].length > 0){
                    initData.assortmentGroups.map(group => {
                        if(group.applicationProcurementPlanPosition.estimationType.code === undefined){
                            Object.assign(group,
                            {
                                applicationProcurementPlanPosition: group.applicationProcurementPlanPosition = Object.assign(group.applicationProcurementPlanPosition,{
                                    estimationType: group.applicationProcurementPlanPosition.estimationType = findSelectFieldPosition(this.props.estimationTypes, group.applicationProcurementPlanPosition.estimationType),
                                    vat: group.applicationProcurementPlanPosition.vat = findSelectFieldPosition(this.props.vats, group.applicationProcurementPlanPosition.vat),
                                }),
                                vat: group.vat = findSelectFieldPosition(this.props.vats, group.vat),
                                subsequentYears: group.subsequentYears.length > 0 ? this.parseSubsequentYearsToJson(group.subsequentYears) : [],
                                applicationAssortmentGroupPlanPositions: group.applicationAssortmentGroupPlanPositions.length > 0 ? this.parseApplicationAssortmentGroupPlanPositions(group.applicationAssortmentGroupPlanPositions) :[],
                            })
                        }
                        return group;
                    })
                }
                if(initData["parts"].length > 0){
                    initData.parts.map(part => {
                        return Object.assign(part,
                            {
                                vat: part.vat = findSelectFieldPosition(this.props.vats, part.vat),
                                reasonNotRealized: part.reasonNotRealized = part.reasonNotRealized !== null ? findSelectFieldPosition(this.props.reasonsNotRealizedApplication, part.reasonNotRealized.code) : part.reasonNotRealized,
                                applicationAssortmentGroup: part.applicationAssortmentGroup = Object.assign(part.applicationAssortmentGroup,
                                    {
                                        name: part.applicationAssortmentGroup.applicationProcurementPlanPosition.name,
                                    }
                                )
                            }
                        )
                    })
                }
                if(initData["applicationProtocol"].prices.length > 0){
                    initData.applicationProtocol.prices.map(price => {
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
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    parseApplicationAssortmentGroupPlanPositions = (positions) => {
        positions.map(position => {
            return Object.assign(position, {
                vat: position.vat = findSelectFieldPosition(this.props.vats, position.vat),
                subsequentYears: position.subsequentYears.length > 0 ? this.parseSubsequentYearsToJson(position.subsequentYears) : [],
            })
        })
        return positions;
    }

    parseApplicationAssortmentGroupPlanPositionsToPayload = (positions) => {
        positions.map(position => {
            return Object.assign(position, {
                vat: position.vat = position.vat.code,
            })
        })
        return positions;
    }

    parseSubsequentYearsToJson = (years) => {
        years.map(year => {
            return Object.assign(year, {
                year: new Date(`${year.year}`,0,1).toJSON(),
                vat: year.vat = findSelectFieldPosition(this.props.vats, year.vat),
            })
        })
        return years
    }

    parseSubsequentYearsToPayload = (years) => {
        years.map(subsequentYear => {
            return Object.assign(subsequentYear, {
                year: new Date(subsequentYear.year).getFullYear(),
                vat: subsequentYear.vat = subsequentYear.vat.code,
            })
        })
        return years
    }

    handlePlanPositions = () =>{
        PublicProcurementApplicationApi.getApplicationProcurementPlanPosition()
        .then(response => {
            this.setState( prevState =>{
                let planPositions = [...prevState.planPositions];
                planPositions = response.data.data;
                planPositions.map(position => (
                    Object.assign(position,
                        {
                            estimationType: position.estimationType = findSelectFieldPosition(this.props.estimationTypes, position.estimationType),
                            vat: position.vat = findSelectFieldPosition(this.props.vats, position.vat),
                        }
                )))
                return {planPositions}
            })
        })
        .catch(error => {});
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
            payload.orderIncludedPlanType = payload.orderIncludedPlanType.code;
            if(!payload.isCombined && payload.coordinatorCombined !== null){
                payload.coordinatorCombined = null;
            }
            if(payload.replaySourceApplication != null && payload.replaySourceApplication.code !== 'err' && payload.isReplay === true){
                payload.replaySourceApplication.estimationType = payload.replaySourceApplication.estimationType.code;
                payload.replaySourceApplication.mode = payload.replaySourceApplication.mode.code;
                payload.replaySourceApplication.status = payload.replaySourceApplication.status.code;
            } else if (payload.replaySourceApplication != null && payload.isReplay === false){
                payload.replaySourceApplication = null;
            }
            if(this.state.action === "edit"){
                if(payload.assortmentGroups.length > 0){
                    payload.assortmentGroups.map(group => (
                        Object.assign(group,
                            {
                                applicationProcurementPlanPosition: group.applicationProcurementPlanPosition = Object.assign(group.applicationProcurementPlanPosition,{
                                    estimationType: group.applicationProcurementPlanPosition.estimationType = group.applicationProcurementPlanPosition.estimationType.code,
                                }),
                               vat: group.vat = group.vat.code,
                               applicationAssortmentGroupPlanPositions: [],
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
                if(payload.assortmentGroups.length > 0){
                    payload.assortmentGroups.map(group => {
                        if(group.subsequentYears.length > 0){
                            group.subsequentYears = [];
                        }
                        return group;
                    })
                }
                if(payload.applicationProtocol !== undefined && payload.applicationProtocol !== null && payload.applicationProtocol.prices.length > 0){
                    payload.applicationProtocol.prices.map(price => {
                        Object.assign(price,
                            {
                                applicationAssortmentGroup: price.applicationAssortmentGroup = Object.assign(price.applicationAssortmentGroup,{
                                    vat: price.applicationAssortmentGroup.vat = price.applicationAssortmentGroup.vat.code,
                                }),
                                vat: price.vat = price.vat.code,
                            }
                        )
                        return price;
                    })
                }
            }
            PublicProcurementApplicationApi.saveApplication(this.state.action, payload)
            .then(response => {
                this.setState( prevState => {
                    const initData = {...prevState.initData};
                    let action = prevState.action;
                    if(response.data.data.applicationProtocol === null){
                        response.data.data.applicationProtocol = prevState.initData.applicationProtocol;
                    } else {
                        if(response.data.data.applicationProtocol.contractor === null){
                            response.data.data.applicationProtocol.contractor = {code:"", name:""};
                        }
                        if(response.data.data.applicationProtocol.prices.length > 0){
                            response.data.data.applicationProtocol.prices.map(price => {
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
                    }
                    Object.assign(initData, response.data.data);
                    initData.mode = values.mode;
                    initData.orderIncludedPlanType = values.orderIncludedPlanType;
                    initData.orderProcedure = values.orderProcedure;
                    initData.status = values.status !== undefined ? values.status : findSelectFieldPosition(this.props.statuses, response.data.data.status);
                    initData.estimationType = response.data.data.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.estimationType);
                    if(response.data.data.replaySourceApplication !== null){
                        initData.replaySourceApplication = this.props.applications.filter(application => application.id === response.data.data.replaySourceApplication.id)[0];
                    }
                    initData.assortmentGroups = values.assortmentGroups;
                    if(initData["assortmentGroups"].length > 0){
                        initData.assortmentGroups.map(group => {
                            if(group.applicationProcurementPlanPosition.estimationType.code === undefined){
                                Object.assign(group,
                                {
                                    subsequentYears: group.subsequentYears.length > 0 ? this.parseSubsequentYearsToJson(group.subsequentYears) : [],
                                    applicationAssortmentGroupPlanPositions: group.applicationAssortmentGroupPlanPositions.length > 0 ? this.parseApplicationAssortmentGroupPlanPositions(group.applicationAssortmentGroupPlanPositions) :[],
                                })
                            }
                            return group;
                        })
                    }

                    action = "edit";
                    return {initData, action};
                });
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
            PublicProcurementApplicationApi.printApplication(this.state.initData.id)
            .then(response => {
                generateExportLink(response);
                this.props.loading(false);
            })
            .catch(error => {});
    }

    handleSubmitAssortmentGroup = (values, action) => {
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        payload.vat = payload.vat.code;
        payload.applicationProcurementPlanPosition.estimationType = payload.applicationProcurementPlanPosition.estimationType.code;
        if(payload.subsequentYears !== undefined && payload.subsequentYears.length > 0){
            payload.subsequentYears.map(subsequentYear => {
                return Object.assign(subsequentYear, {
                    year: new Date(subsequentYear.year).getFullYear(),
                    vat: subsequentYear.vat!== undefined ? subsequentYear.vat.code : null,
                })
            })
        }

        if(payload.applicationAssortmentGroupPlanPositions !== undefined && payload.applicationAssortmentGroupPlanPositions.length > 0){
            payload.applicationAssortmentGroupPlanPositions.map(planPosition => {
                return Object.assign(planPosition, {
                    subsequentYears: planPosition.subsequentYears !== undefined && planPosition.subsequentYears.length > 0 ? this.parseSubsequentYearsToPayload(planPosition.subsequentYears) : [],
                    vat: planPosition.vat.code,
                })
            })
        }
        PublicProcurementApplicationApi.saveApplicationAssortmentGroup(this.state.initData.id, action, payload)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                if(response.data.data.applicationProtocol === null){
                    response.data.data.applicationProtocol = initData.applicationProtocol;
                }
                if(response.data.data.orderProcedure !== null){
                    response.data.data.orderProcedure = findSelectFieldPosition(this.props.orderProcedures, response.data.data.orderProcedure.code);
                }
                if(response.data.data.replaySourceApplication !== null){
                    response.data.data.replaySourceApplication = this.props.applications.filter(application => application.id === response.data.data.replaySourceApplication.id)[0];
                }
                Object.assign(response.data.data,
                    {
                        status: response.data.data.status = initData.status,
                        mode: response.data.data.mode = findSelectFieldPosition(this.props.modes, response.data.data.mode),
                        estimationType: response.data.data.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.estimationType),
                        orderIncludedPlanType: initData.orderIncludedPlanType,
                    }
                )
                response.data.data.assortmentGroups.map(group => (
                    Object.assign(group,
                        {
                            applicationProcurementPlanPosition: group.applicationProcurementPlanPosition = Object.assign(group.applicationProcurementPlanPosition,{
                                estimationType: group.applicationProcurementPlanPosition.estimationType = findSelectFieldPosition(this.props.estimationTypes, group.applicationProcurementPlanPosition.estimationType),
                                vat: group.applicationProcurementPlanPosition.vat = findSelectFieldPosition(this.props.vats, group.applicationProcurementPlanPosition.vat),
                                }),
                            vat: group.vat = findSelectFieldPosition(this.props.vats, group.vat),
                            subsequentYears: group.subsequentYears.length > 0 ? this.parseSubsequentYearsToJson(group.subsequentYears) : [],
                            applicationAssortmentGroupPlanPositions: group.applicationAssortmentGroupPlanPositions !== null && group.applicationAssortmentGroupPlanPositions.length > 0 ? this.parseApplicationAssortmentGroupPlanPositions(group.applicationAssortmentGroupPlanPositions) :[],
                        }
                    )
                ))
                initData = response.data.data;
                if(initData.applicationProtocol != null && initData["applicationProtocol"].prices.length > 0){
                    initData.applicationProtocol.prices.map(price => {
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
                if(initData["parts"].length > 0){
                    initData.parts.map(part => {
                        return Object.assign(part,
                            {
                                vat: part.vat = findSelectFieldPosition(this.props.vats, part.vat),
                                reasonNotRealized: part.reasonNotRealized = part.reasonNotRealized !== null ? findSelectFieldPosition(this.props.reasonsNotRealizedApplication, part.reasonNotRealized.code) : part.reasonNotRealized,
                                applicationAssortmentGroup: part.applicationAssortmentGroup = Object.assign(part.applicationAssortmentGroup,
                                    {
                                        name: part.applicationAssortmentGroup.applicationProcurementPlanPosition.name,
                                    }
                                )
                            }
                        )
                    })
                }
                if(['ZA'].includes(initData.status.code )){
                    //Changed status to realized if save first part amount contract value or reason not realized
                    initData.status = findSelectFieldPosition(this.props.statuses, 'RE');
                }
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error => {
            this.setState({
                initData: values,
            });
            this.props.loading(false);
        });
    }

    handleSubmitAssortmentGroupPlanPosition = (groupId, values, action) => {

        const assortmentGroup = this.state.initData.assortmentGroups.filter(group => group.id === groupId)[0];

        if(this.state.initData.orderIncludedPlanType.code === 'INW'){
            values.coordinatorPlanPosition.type = 'inw';
        } else {
            values.coordinatorPlanPosition.type = 'fin';
        };
        if(action === 'add'){
            if(assortmentGroup.applicationAssortmentGroupPlanPositions === null){
                 return Object.assign(assortmentGroup, {
                    applicationAssortmentGroupPlanPositions: [values],
                 })
            }
            assortmentGroup.applicationAssortmentGroupPlanPositions.push(values);

        } else {
            const idx = findIndexElement(values, assortmentGroup.applicationAssortmentGroupPlanPositions);
            if(idx !== null){
                assortmentGroup.applicationAssortmentGroupPlanPositions.splice(idx, 1, values);
            }
        }
        this.handleSubmitAssortmentGroup(assortmentGroup, 'edit')
    }

    handleDeleteAssortmentGroupPlanPosition = (assortmentGroupId, values) => {
        PublicProcurementApplicationApi.deleteApplicationAssortmentGroupPlanPosition(values.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                if(response.data.data.applicationProtocol === null){
                    response.data.data.applicationProtocol = initData.applicationProtocol;
                }
                Object.assign(response.data.data,
                    {
                        status: response.data.data.status = initData.status,
                        mode: response.data.data.mode = findSelectFieldPosition(this.props.modes, response.data.data.mode),
                        estimationType: response.data.data.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.estimationType),
                        orderIncludedPlanType: initData.orderIncludedPlanType,
                    }
                )
                response.data.data.assortmentGroups.map(group => (
                    Object.assign(group,
                        {
                            applicationProcurementPlanPosition: group.applicationProcurementPlanPosition = Object.assign(group.applicationProcurementPlanPosition,{
                                estimationType: group.applicationProcurementPlanPosition.estimationType = findSelectFieldPosition(this.props.estimationTypes, group.applicationProcurementPlanPosition.estimationType),
                                vat: group.applicationProcurementPlanPosition.vat = findSelectFieldPosition(this.props.vats, group.applicationProcurementPlanPosition.vat),
                                }),
                            vat: group.vat = findSelectFieldPosition(this.props.vats, group.vat),
                            subsequentYears: group.subsequentYears.length > 0 ? this.parseSubsequentYearsToJson(group.subsequentYears) : [],
                            applicationAssortmentGroupPlanPositions: group.applicationAssortmentGroupPlanPositions !== null && group.applicationAssortmentGroupPlanPositions.length > 0 ? this.parseApplicationAssortmentGroupPlanPositions(group.applicationAssortmentGroupPlanPositions) :[],
                        }
                    )
                ))
                initData = response.data.data;
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error => {
            this.setState({
                initData: values,
            });
            this.props.loading(false);
        });
    }

    handleSubmitAssortmentGroupSubsequentYear = (assortmentGroupPlanPositionId, values, action) => {
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        payload.year =  new Date(payload.year).getFullYear();
        payload.vat =  payload.vat.code;
        PublicProcurementApplicationApi.saveAssortmentGroupSubsequentYear(assortmentGroupPlanPositionId, action, payload)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                const idx = findIndexElement(response.data.data, this.state.initData.assortmentGroups);
                if(idx !== null){
                    Object.assign(response.data.data,
                        {
                            applicationProcurementPlanPosition: response.data.data.applicationProcurementPlanPosition = Object.assign(response.data.data.applicationProcurementPlanPosition,{
                                estimationType: response.data.data.applicationProcurementPlanPosition.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.applicationProcurementPlanPosition.estimationType),
                                vat: response.data.data.applicationProcurementPlanPosition.vat = findSelectFieldPosition(this.props.vats, response.data.data.applicationProcurementPlanPosition.vat),
                            }),
                            vat: response.data.data.vat = findSelectFieldPosition(this.props.vats, response.data.data.vat),
                            subsequentYears: response.data.data.subsequentYears.length > 0 ? this.parseSubsequentYearsToJson(response.data.data.subsequentYears) : [],
                            applicationAssortmentGroupPlanPositions: response.data.data.applicationAssortmentGroupPlanPositions !== null && response.data.data.applicationAssortmentGroupPlanPositions.length > 0 ? this.parseApplicationAssortmentGroupPlanPositions(response.data.data.applicationAssortmentGroupPlanPositions) :[],
                        }
                    )
                    initData.assortmentGroups.splice(idx, 1, response.data.data);
                }

                return {initData};
            })
            this.props.loading(false);
        })
        .catch(error => {
            this.props.loading(false);
        });
    }

    handleDeleteAssortmentGroupSubsequentYear = (assortmentGroupPlanPositionId, values) => {
        this.props.loading(true)
        PublicProcurementApplicationApi.deleteAssortmentGroupSubsequentYear(assortmentGroupPlanPositionId, values.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                const idx = findIndexElement(response.data.data, this.state.initData.assortmentGroups);
                if(idx !== null){
                    Object.assign(response.data.data,
                        {
                            applicationProcurementPlanPosition: response.data.data.applicationProcurementPlanPosition = Object.assign(response.data.data.applicationProcurementPlanPosition,{
                                estimationType: response.data.data.applicationProcurementPlanPosition.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.applicationProcurementPlanPosition.estimationType),
                                vat: response.data.data.applicationProcurementPlanPosition.vat = findSelectFieldPosition(this.props.vats, response.data.data.applicationProcurementPlanPosition.vat),
                            }),
                            vat: response.data.data.vat = findSelectFieldPosition(this.props.vats, response.data.data.vat),
                            subsequentYears: response.data.data.subsequentYears.length > 0 ? this.parseSubsequentYearsToJson(response.data.data.subsequentYears) : [],
                            applicationAssortmentGroupPlanPositions: response.data.data.applicationAssortmentGroupPlanPositions !== null && response.data.data.applicationAssortmentGroupPlanPositions.length > 0 ? this.parseApplicationAssortmentGroupPlanPositions(response.data.data.applicationAssortmentGroupPlanPositions) :[],

                        }
                    )
                    initData.assortmentGroups.splice(idx, 1, response.data.data);
                }
                return {initData};
            })
            this.props.loading(false);
        })
        .catch(error => {
            this.props.loading(false);
        });
    }

    handleDeleteAssortmentGroup = (values) => {
        this.props.loading(true);
        PublicProcurementApplicationApi.deleteApplicationAssortmentGroup(values.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                Object.assign(response.data.data,
                    {
                        status: response.data.data.status = initData.status,
                        mode: response.data.data.mode = findSelectFieldPosition(this.props.modes, response.data.data.mode),
                        estimationType: response.data.data.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.estimationType),
                        orderIncludedPlanType: initData.orderIncludedPlanType,
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
        payload.applicationAssortmentGroup.applicationProcurementPlanPosition.estimationType = payload.applicationAssortmentGroup.applicationProcurementPlanPosition.estimationType.code;
        payload.applicationAssortmentGroup.vat = payload.applicationAssortmentGroup.vat.code;
        payload.applicationAssortmentGroup.subsequentYears = [];
        payload.applicationAssortmentGroup.applicationAssortmentGroupPlanPositions = [];
        return PublicProcurementApplicationApi.savePart(this.state.initData.id, action, payload)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                Object.assign(response.data.data,
                    {
                        vat: response.data.data.vat = findSelectFieldPosition(this.props.vats, response.data.data.vat),
                        reasonNotRealized: response.data.data.reasonNotRealized = response.data.data.reasonNotRealized !== null ? findSelectFieldPosition(this.props.reasonsNotRealizedApplication, response.data.data.reasonNotRealized.code): response.data.data.reasonNotRealized,
                        applicationAssortmentGroup: response.data.data.applicationAssortmentGroup = Object.assign(response.data.data.applicationAssortmentGroup,
                            {
                                name: response.data.data.applicationAssortmentGroup.applicationProcurementPlanPosition.name,
                            }
                        )
                    }
                )
                if(action === "add"){
                    initData.parts.push(response.data.data)
                    initData.isParts = true;
                } else {
                    const idx = findIndexElement(response.data.data, this.state.initData.parts);
                    if(idx !== null){
                        initData.parts.splice(idx, 1, response.data.data);
                    }
                }
                if(['ZA', 'RE'].includes(initData.status.code )){
                    const idx = findIndexElement(response.data.data.applicationAssortmentGroup, initData.assortmentGroups);
                    if(initData.parts.length > 0) {
                        let tmpAwaNet = 0;
                        let tmpAwaGross = 0;
                        initData.parts.forEach(part => {
                            if(part.applicationAssortmentGroup.id === initData.assortmentGroups[idx].id ){
                                tmpAwaNet += part.amountContractAwardedNet;
                                tmpAwaGross += part.amountContractAwardedGross;
                            }
                        })
                        initData.assortmentGroups[idx].amountContractAwardedNet = tmpAwaNet
                        initData.assortmentGroups[idx].amountContractAwardedGross = tmpAwaGross
                    }
                    //Changed status to realized if save first part amount contract value or reason not realized
                    initData.status = findSelectFieldPosition(this.props.statuses, 'RE');
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
        PublicProcurementApplicationApi.deletePart(values.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                const idx = findIndexElement(values, this.state.initData.parts);
                if(idx !== null){
                    initData.parts.splice(idx, 1);
                }
                if(initData.parts.length === 0 && initData.isParts === true){
                    initData.isParts = false;
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
        return PublicProcurementApplicationApi.saveCriterion(this.state.initData.id, action, values)
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
        PublicProcurementApplicationApi.deleteCriterion(values.id)
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
        PublicProcurementApplicationApi.sendApplication(this.state.initData.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                initData.sendUser = response.data.data.sendUser;
                initData.number = response.data.data.number;
                initData.assortmentGroups = response.data.data.assortmentGroups;
                initData.assortmentGroups.map(group => {
                    if(group.applicationProcurementPlanPosition.estimationType.code === undefined){
                        Object.assign(group,
                        {
                            applicationProcurementPlanPosition: group.applicationProcurementPlanPosition = Object.assign(group.applicationProcurementPlanPosition,{
                                estimationType: group.applicationProcurementPlanPosition.estimationType = findSelectFieldPosition(this.props.estimationTypes, group.applicationProcurementPlanPosition.estimationType),
                                vat: group.applicationProcurementPlanPosition.vat = findSelectFieldPosition(this.props.vats, group.applicationProcurementPlanPosition.vat),
                            }),
                            vat: group.vat = findSelectFieldPosition(this.props.vats, group.vat),
                            subsequentYears: group.subsequentYears.length > 0 ? this.parseSubsequentYearsToJson(group.subsequentYears) : [],
                            applicationAssortmentGroupPlanPositions: group.applicationAssortmentGroupPlanPositions.length > 0 ? this.parseApplicationAssortmentGroupPlanPositions(group.applicationAssortmentGroupPlanPositions) :[],
                        })
                    }
                    return group;
                })
                return {initData};
            });
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
        if(values.applicationAssortmentGroup.subsequentYears.length > 0){
            values.applicationAssortmentGroup.subsequentYears = [];
        }
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
        ApplicationProtocolApi.saveProtocol(payload)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.applicationProtocol = response.data.data;
                if(initData["applicationProtocol"].prices.length > 0){
                    initData.applicationProtocol.prices.map(price => {
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
        ApplicationProtocolApi.deleteProtocolPrice(this.state.initData.applicationProtocol.id, values.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.applicationProtocol = response.data.data;
                if(initData["applicationProtocol"].prices.length > 0){
                    initData.applicationProtocol.prices.map(price => {
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
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handleConfirmRealization = () =>{
        this.props.loading(true);
        PublicApplicationsApi.confirmRealization(this.state.initData.id)
        .then(response => {
            this.setUpApplicationDetails(response);
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handleRollbackPartRealization = () =>{
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(this.state.initData.parts));
        payload.forEach(part =>{
            part.vat = part.vat.code;
        })
        PublicApplicationsApi.rollbackPartRealization(this.state.initData.id, payload)
        .then(response => {
            this.setUpApplicationDetails(response);
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handleRollbackAllRealization = () => {
        this.props.loading(true);
        PublicApplicationsApi.rollbackRealization(this.state.initData.id)
        .then(response => {
            this.setUpApplicationDetails(response);
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    handleRollbackRealization = (event, action) => {
        if(action === "parts"){
            this.handleRollbackPartRealization();
        } else {
            this.handleRollbackAllRealization();
        }
    }

    setUpApplicationDetails = (response) => {
        this.setState(prevState => {
            let initData = {...prevState.initData};
            response.data.data.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
            response.data.data.mode = findSelectFieldPosition(this.props.modes, response.data.data.mode);
            response.data.data.estimationType = findSelectFieldPosition(this.props.estimationTypes, response.data.data.estimationType);
            response.data.data.orderIncludedPlanType= findSelectFieldPosition(this.props.planTypes, response.data.data.orderIncludedPlanType);
            if(response.data.data.orderProcedure !== null){
                response.data.data.orderProcedure = findSelectFieldPosition(this.props.orderProcedures, response.data.data.orderProcedure.code);
            }
            if(response.data.data.applicationProtocol === null){
                response.data.data.applicationProtocol = prevState.initData.applicationProtocol;
            }
            Object.assign(initData, response.data.data);
            if(initData["assortmentGroups"].length > 0){
                initData.assortmentGroups.map(group => {
                    if(group.applicationProcurementPlanPosition.estimationType.code === undefined){
                        Object.assign(group,
                        {
                            applicationProcurementPlanPosition: group.applicationProcurementPlanPosition = Object.assign(group.applicationProcurementPlanPosition,{
                                estimationType: group.applicationProcurementPlanPosition.estimationType = findSelectFieldPosition(this.props.estimationTypes, group.applicationProcurementPlanPosition.estimationType),
                                vat: group.applicationProcurementPlanPosition.vat = findSelectFieldPosition(this.props.vats, group.applicationProcurementPlanPosition.vat),
                            }),
                            vat: group.vat = findSelectFieldPosition(this.props.vats, group.vat),
                            subsequentYears: group.subsequentYears.length > 0 ? this.parseSubsequentYearsToJson(group.subsequentYears) : [],
                            applicationAssortmentGroupPlanPositions: group.applicationAssortmentGroupPlanPositions.length > 0 ? this.parseApplicationAssortmentGroupPlanPositions(group.applicationAssortmentGroupPlanPositions) :[],
                        })
                    }
                    return group;
                })
            }
            if(initData["parts"].length > 0){
                initData.parts.map(part => {
                    return Object.assign(part,
                        {
                            vat: part.vat = findSelectFieldPosition(this.props.vats, part.vat),
                            reasonNotRealized: part.reasonNotRealized = part.reasonNotRealized !== null ? findSelectFieldPosition(this.props.reasonsNotRealizedApplication, part.reasonNotRealized.code) : part.reasonNotRealized,
                            applicationAssortmentGroup: part.applicationAssortmentGroup = Object.assign(part.applicationAssortmentGroup,
                                {
                                    name: part.applicationAssortmentGroup.applicationProcurementPlanPosition.name,
                                }
                            )
                        }
                    )
                })
            }
            if(initData["applicationProtocol"].prices.length > 0){
                initData.applicationProtocol.prices.map(price => {
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
            return {initData};
        });
    }

    handlePartsExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PublicProcurementApplicationApi.exportApplicationPartToExcel(exportType, this.state.initData.id, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount(){
        if(this.state.action === "edit"){
            this.handleApplicationDetails();
        }
        if(this.props.levelAccess === undefined){
            this.handlePlanPositions();
            this.handleContractors()
        }
    }


    render(){
        const { isLoading, estimationTypes, vats, coordinators, modes, reasonsNotRealizedApplication } = this.props;
        const { initData, planPositions, applicationTypes, contractors, action } = this.state;
        return(
            <ApplicationFormContainer
                isLoading={isLoading}
                initialValues={initData}
                levelAccess={this.props.levelAccess}
                action={action}
                estimationTypes={estimationTypes}
                applicationTypes={applicationTypes}
                applications={this.props.applications}
                vats={vats}
                planPositions={planPositions}
                coordinators={coordinators}
                modes={modes}
                planTypes={this.props.planTypes}
                orderProcedures={this.props.orderProcedures}
                financialPlanPositions={this.props.financialPlanPositions}
                investmentPlanPositions={this.props.investmentPlanPositions}
                reasonsNotRealizedApplication={reasonsNotRealizedApplication}
                contractors={contractors}
                onPrint={this.handlePrintApplication}
                onSave={this.handleSaveApplication}
                onSaveAssortmentGroup={this.handleSubmitAssortmentGroup}
                onSaveAssortmentGroupApplicationPlanPosition={this.handleSubmitAssortmentGroupPlanPosition}
                onDeleteAssortmentGroupApplicationPlanPosition={this.handleDeleteAssortmentGroupPlanPosition}
                onSaveAssortmentGroupSubsequentYear={this.handleSubmitAssortmentGroupSubsequentYear}
                onDeleteAssortmentGroupSubsequentYear={this.handleDeleteAssortmentGroupSubsequentYear}
                onDeleteAssortmentGroup={this.handleDeleteAssortmentGroup}
                onSavePart={this.handleSubmitPart}
                onDeletePart={this.handleDeletePart}
                onSaveCriterion={this.handleSubmitCriterion}
                onDeleteCriterion={this.handleDeleteCriterion}
                onSaveProtocolPrice={this.handleSaveProtocolPrice}
                onDeleteProtocolPrice={this.handleDeleteProtocolPrice}
                onApproveApplication={this.props.onApproveApplication}
                onSendBackApplication={this.props.onSendBackApplication}
                onRollbackRealisation={this.props.handleRollbackRealization}
                onSend={this.handleSendApplication}
                onRealized={this.handleConfirmRealization}
                onExcelPartsExport={this.handlePartsExcelExport}
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
