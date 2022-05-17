import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import Plan from 'components/modules/coordinator/plans/plan';
import PlanUpdateFormContainer from 'containers/modules/coordinator/plans/forms/planUpdateFormContainer';
import DictionaryApi from 'api/common/dictionaryApi';
import PlansApi from 'api/modules/coordinator/plansApi';
import CostTypeApi from 'api/modules/accountant/costTypeApi';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';
import {findIndexElement, publicProcurementEstimationTypes, publicProcurementOrderTypes, findSelectFieldPosition, generateExportLink, getCoordinatorPlanPositionsStatuses, getVats} from 'utils/';

class PlanContainer extends Component {
    state = {
        initData: {
            positions: [],
        },
        newPosition: null,
        units: [],
        costsTypes:[],
        assortmentGroups:[],
        foundingSources:[],
        unassignedUnits:[],
        vats: getVats(),
        orderTypes: publicProcurementOrderTypes(),
        estimationTypes: publicProcurementEstimationTypes(),
        statuses: getCoordinatorPlanPositionsStatuses(),
    }

    setNewPositionToNull = () =>{
        this.setState({
            newPosition: null,
        })
    }

    handleGetCostsTypes(){
        return CostTypeApi.getCostTypeByCoordinatorAndYear(new Date(this.state.initData.year).getFullYear(), this.state.initData.coordinator.code)
        .then(response => {
            this.setState({
                costsTypes: response.data.data,
            })
        })
        .catch(error => {});
    };

    handleGetDictionaryUnits(){
       return DictionaryApi.getDictionary('jedMiar')
        .then(response => {
            this.setState({
                units: response.data.data.items,
            })
        })
        .catch(error => {});
    };

    handleGetDictionaryAssortmentGroups(){
       return DictionaryApi.getDictionary('slAsortGr')
        .then(response => {
            this.setState({
                assortmentGroups: response.data.data.items,
            })
        })
        .catch(error => {});
    };

    handleGetDictionaryFoundingSources(){
       return DictionaryApi.getDictionary('dicFunSour')
        .then(response => {
            this.setState({
                foundingSources: response.data.data.items,
            })
        })
        .catch(error => {});
    };

    handleGetOrganizationUnits(){
        return OrganizationUnitsApi.getActiveOu()
        .then(response => {
            this.setState({
                unassignedUnits: response.data.data,
            })
        })
        .catch(error => {});
    }

    setUpPlanValue = (values) =>{
        let planAmountNet = 0;
        let planAmountGross = 0;
        if(this.state.initData.type !== undefined){
            if(this.state.initData.type.code === 'FIN'){
                values.positions.map(position => {
                    planAmountNet += position.amountAwardedNet;
                    planAmountGross += position.amountAwardedGross;
                    return position;
                })
                values.planAmountAwardedNet = planAmountNet
                values.planAmountAwardedGross = planAmountGross
            } else if (this.state.initData.type.code === 'PZP'){
                values.positions.map(position => {
                    planAmountNet += position.amountRequestedNet;
                    planAmountGross += position.amountRequestedGross;
                    return position;
                })
                values.planAmountRequestedNet = planAmountNet
                values.planAmountAwardedGross = planAmountGross
            }
        }
    }

    handleGetPlanPositions = (planId) => {
        this.props.loading(true);
        PlansApi.getPlanPositions(planId)
        .then(response =>{
            switch(this.props.initialValues.type.code){
                case ("FIN"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        if(this.props.action !== "update"){
                            Object.assign(initData, this.props.initialValues);
                        }
                        initData.positions = response.data.data;
                        initData["positions"].map(position => (
                            Object.assign(position,
                                {
                                    vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                                    status: position.status = findSelectFieldPosition(this.state.statuses, position.status),
                                }
                            )
                        ))
                        if(initData.isUpdate){
                            initData["positions"].map(position => (
                                Object.assign(position,
                                    {
                                        amountCorrect: position.correctionPlanPosition !== null ?
                                            position.amountAwardedGross - position.correctionPlanPosition.amountAwardedGross :
                                            position.amountAwardedGross,
                                    }
                                )
                            ))
                            this.setUpPlanValue(initData);
                        }
                        return {initData};
                    });
                    this.handleGetDictionaryUnits();
                    this.handleGetCostsTypes();
                break;
                case("PZP"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        //If current action plan is not update
                        if(this.props.action !== 'update'){
                            Object.assign(initData, this.props.initialValues);
                        }
                        initData.positions = response.data.data;
                        initData["positions"].map(position => (
                            Object.assign(position,
                            {
                                vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                                orderType: position.orderType = findSelectFieldPosition(this.state.orderTypes, position.orderType),
                                status: position.status = findSelectFieldPosition(this.state.statuses, position.status),
                                mode: position.mode = findSelectFieldPosition(this.props.modes, position.mode.code),
                                estimationType: position.estimationType = findSelectFieldPosition(this.state.estimationTypes, position.estimationType),
                            }
                        )))
                        if(initData.isUpdate){
                            initData["positions"].map(position => (
                                Object.assign(position,
                                    {
                                        amountCorrect: position.correctionPlanPosition !== null ?
                                            position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet === 0 ?
                                                null : position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet :
                                            position.amountRequestedNet,
                                    }
                                )
                            ))
                            this.setUpPlanValue(initData);
                        }
                        return {initData};
                    });
                    this.handleGetDictionaryAssortmentGroups();
                break;
                case('INW'):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        Object.assign(initData, this.props.initialValues);
                        initData.positions = response.data.data;
                        initData["positions"].map(position => (
                            Object.assign(position,
                                {
                                    vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                                    status: position.status = findSelectFieldPosition(this.state.statuses, position.status),
                                    category: position.category = findSelectFieldPosition(this.props.investmentCategories, position.category.code),
                                },
                                position.subPositions.map(subPosition =>(
                                    subPosition.fundingSources.map(source =>(
                                        Object.assign(source,
                                            {
                                                type: source.type = findSelectFieldPosition(this.state.foundingSources, source.type.code),
                                            }
                                        )
                                    ))
                                ))
                            )
                        ))
                        return {initData};
                    });
                break;
                // no default
            }
        this.props.loading(false)
        })
        .catch(error =>{});
    };

    setUpPlanValueOnSubmitPosition = (values, initData, tmp, action) =>{
        if(action ==='add'){
            initData.positions.push(tmp);
            initData.planAmountRequestedNet = parseFloat((initData.planAmountRequestedNet + tmp.amountRequestedNet).toFixed(2))
            initData.planAmountRequestedGross = parseFloat((initData.planAmountRequestedGross + tmp.amountRequestedGross).toFixed(2))
        } else if (action ==='correct'){
            const index = findIndexElement(values, initData.positions, "positionId");
            if(index !== null){
                if(this.state.initData.type.code === 'FIN'){
                    initData.planAmountAwardedNet = initData.planAmountAwardedNet - initData.positions[index].amountAwardedNet
                    initData.planAmountAwardedGross = initData.planAmountAwardedGross - initData.positions[index].amountAwardedGross
                    initData.positions.splice(index, 1, tmp);
                    initData.planAmountAwardedNet = initData.planAmountAwardedNet + tmp.amountAwardedNet
                    initData.planAmountAwardedGross = initData.planAmountAwardedGross + tmp.amountAwardedGross
                } else if (this.state.initData.type.code === 'PZP') {
                    initData.planAmountRequestedNet = initData.planAmountRequestedNet - initData.positions[index].amountRequestedNet
                    initData.planAmountRequestedGross = initData.planAmountRequestedGross - initData.positions[index].amountRequestedGross
                    initData.positions.splice(index, 1, tmp);
                    initData.planAmountRequestedNet = initData.planAmountRequestedNet + tmp.amountRequestedNet
                    initData.planAmountRequestedGross = initData.planAmountRequestedGross + tmp.amountRequestedGross
                }
            }
        } else {
            const index = findIndexElement(values, initData.positions, "positionId");
            if(index !== null){
                initData.planAmountRequestedNet = parseFloat((initData.planAmountRequestedNet - initData.positions[index].amountRequestedNet).toFixed(2))
                initData.planAmountRequestedGross = parseFloat((initData.planAmountRequestedGross - initData.positions[index].amountRequestedGross).toFixed(2))
                initData.positions.splice(index, 1, tmp);
                initData.planAmountRequestedNet = parseFloat((initData.planAmountRequestedNet + tmp.amountRequestedNet).toFixed(2))
                initData.planAmountRequestedGross = parseFloat((initData.planAmountRequestedGross + tmp.amountRequestedGross).toFixed(2))
            }
        }
    }

    setUpCorrectValue = (values) =>{
        if(this.state.initData.type.code === 'FIN'){
            values.map(position => (
                Object.assign(position,
                    {
                        amountCorrect: position.correctionPlanPosition !== null ?
                            position.amountAwardedGross - position.correctionPlanPosition.amountAwardedGross : position.amountAwardedGross,
                    }
                )
            ))
        }
        else if (this.state.initData.type.code === 'PZP'){
            values.map(position => (
                Object.assign(position,
                    {
                        amountCorrect: position.correctionPlanPosition !== null ?
                            position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet === 0 ?
                                null : position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet :
                            position.amountRequestedNet,
                    }
                )
            ))
        }
    }

    handleSubmitPlanPosition = (values, action) => {
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(values));
        payload.vat = values.vat.code;
        if(action === 'add'){
            payload.status = 'ZP';
            payload.plan = JSON.parse(JSON.stringify(this.state.initData));
            payload.plan.status = payload.plan.status.code;
            payload.plan.type = payload.plan.type.code;
            payload.plan.year = new Date(payload.plan.year).getFullYear();
        } else if (action === 'edit' || action === 'correct'){
            payload.status = values.status.code;
        }
        payload.type = this.state.initData.type.code.toLowerCase();
        if(payload.type === 'pzp'){
            payload.orderType = payload.orderType.code;
            payload.estimationType = payload.estimationType.code;
            //If estimationType is UE parse euroExchangeRate parameter value
            if(payload.estimationType === 'UE139'){
                if(isNaN(payload.euroExchangeRate)){
                    payload.euroExchangeRate = parseFloat(payload.euroExchangeRate.replace(",", "."));
                }
            }
        }
        if(payload.type === 'inw'){
            payload.subPositions.map(subPosition =>{
                if(values.task !== subPosition.name){
                    subPosition.name = values.task;
                }
                return subPosition;
            })
        }
        PlansApi.savePlanPosition(this.state.initData.id, action, payload)
        .then(response => {
            switch(this.state.initData.type.code){
                case ("FIN"):
                    this.setState(prevState => {
                        let initData = {...prevState.initData};
                        let newPosition = {...prevState.newPosition};
                        const tmp =  response.data.data;
                        tmp.vat = findSelectFieldPosition(this.state.vats, tmp.vat);
                        tmp.status = findSelectFieldPosition(this.state.statuses, tmp.status);
                        tmp.costType = findSelectFieldPosition(this.state.costsTypes, tmp.costType.code);
                        newPosition = tmp;
                        this.setUpPlanValueOnSubmitPosition(values, initData, tmp, action);
                        if(action === 'add' && initData.isUpdate){
                            this.setUpCorrectValue(initData.positions)
                            this.setUpPlanValue(initData)
                        }
                        if(action === 'correct'){
                            this.setUpCorrectValue(initData.positions)
                        }
                        return {initData, newPosition};
                    });
                break;
                case("PZP"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        let newPosition = {...prevState.newPosition};
                        const tmp =  response.data.data;
                        tmp.vat = findSelectFieldPosition(this.state.vats, tmp.vat);
                        tmp.orderType = findSelectFieldPosition(this.state.orderTypes, tmp.orderType);
                        tmp.status = findSelectFieldPosition(this.state.statuses, tmp.status);
                        tmp.assortmentGroup = findSelectFieldPosition(this.state.assortmentGroups, tmp.assortmentGroup.code);
                        tmp.mode = findSelectFieldPosition(this.props.modes, tmp.mode.code);
                        tmp.estimationType = findSelectFieldPosition(this.state.estimationTypes, tmp.estimationType);
                        newPosition = tmp;
                        this.setUpPlanValueOnSubmitPosition(values, initData, tmp, action);
                        if(action === 'add' && initData.isUpdate){
                            this.setUpCorrectValue(initData.positions)
                            this.setUpPlanValue(initData)
                        }
                        if(action === 'correct'){
                            this.setUpCorrectValue(initData.positions)
                        }
                        return {initData, newPosition};
                    });
                break;
                case("INW"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        let newPosition = {...prevState.newPosition};
                        const tmp =  response.data.data;
                        tmp.vat = findSelectFieldPosition(this.state.vats, tmp.vat);
                        tmp.category = findSelectFieldPosition(this.props.investmentCategories, tmp.category.code);
                        tmp.status = findSelectFieldPosition(this.state.statuses, tmp.status);
                        newPosition = tmp;
                        tmp.subPositions.map(subPosition =>(
                            subPosition.fundingSources.map(source =>(
                                Object.assign(source,
                                    {
                                        type: source.type = findSelectFieldPosition(this.state.foundingSources, source.type.code),
                                    }
                                )
                            ))
                        ))
                        this.setUpPlanValueOnSubmitPosition(values, initData, tmp, action);
                        return {initData, newPosition};
                    });
                break;
                // no default
            }
            this.props.loading(false);
        })
        .catch(error => {
            //update position value if error exist
            if(action === 'add'){
                values.status = "ZP";
                values.plan = JSON.parse(JSON.stringify(this.state.initData));
                values.plan.year = new Date(values.plan.year).getFullYear();
                values.plan.status = values.plan.status.code;
                values.plan.type = values.plan.type.code;
                this.setState({
                    newPosition: values,
                });
            } else if (action === 'edit') {
                values.status = values.status.code;
                const idx = findIndexElement(values, this.state.initData.positions);
                if(idx !== null){
                    this.setState( prevState => {
                        const initData = {...prevState.initData};
                        initData.positions.splice(idx, 1, values);
                    })
                }
            }
        });
    }

    handleDeletePlanSubPosition = (position, subPosition) => {
        this.props.loading(true);
        const indexPosition = findIndexElement(position, this.state.initData.positions);
        if (indexPosition !== null){
            PlansApi.deletePlanSubPosition(position.id, subPosition)
            .then(response =>{
                this.setState( prevState => {
                    const initData = {...prevState.initData};
                    response.data.data.vat = findSelectFieldPosition(this.state.vats,  response.data.data.vat);
                    response.data.data.status = findSelectFieldPosition(this.state.statuses, response.data.data.status);
                    if(this.state.initData.type.code === 'PZP'){
                        response.data.data.estimationType = findSelectFieldPosition(this.state.estimationTypes, response.data.data.estimationType)
                        response.data.data.orderType = findSelectFieldPosition(this.state.orderTypes, response.data.data.orderType)
                        response.data.data.mode = findSelectFieldPosition(this.props.modes, response.data.data.mode.code)
                    }
                    if(initData.isUpdate){
                        Object.assign(response.data.data,
                            {
                                amountCorrect: position.correctionPlanPosition !== null ?
                                    position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet === 0 ?
                                        null : position.amountRequestedNet - position.correctionPlanPosition.amountRequestedNet :
                                    position.amountRequestedNet,
                            }
                        )
                    }
                    initData.positions.splice(indexPosition, 1, response.data.data);
                    initData.planAmountRequestedNet = parseFloat((initData.planAmountRequestedNet - subPosition.amountNet).toFixed(2))
                    initData.planAmountRequestedGross = parseFloat((initData.planAmountRequestedGross - subPosition.amountGross).toFixed(2))
                    return {initData};
                });
                this.props.loading(false);
            })
            .catch(error =>{})
        }
    }

    handleDeletePlanPosition = (position) => {
        const index = findIndexElement(position, this.state.initData.positions);
        if(index !== null){
            PlansApi.deletePlanPosition(this.state.initData.id, position.id)
            .then(response => {
                this.setState( prevState => {
                    const initData = {...prevState.initData};
                    initData.positions.splice(index, 1);
                    initData.planAmountRequestedNet = parseFloat((initData.planAmountRequestedNet - position.amountRequestedNet).toFixed(2))
                    initData.planAmountRequestedGross = parseFloat((initData.planAmountRequestedGross - position.amountRequestedGross).toFixed(2))
                    return {initData};
                });
            })
            .catch(error => {});
        }
    }

    handleDeleteInvestmentTargetUnit = (unit) => {
        PlansApi.deleteTargetUnit(unit.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                const tmp =  response.data.data;
                tmp.vat = findSelectFieldPosition(this.state.vats, tmp.vat);
                tmp.category = findSelectFieldPosition(this.props.investmentCategories, tmp.category.code);
                tmp.status = findSelectFieldPosition(this.state.statuses, tmp.status);
                tmp.subPositions.map(subPosition =>(
                    subPosition.fundingSources.map(source =>(
                        Object.assign(source,
                            {
                                type: source.type = findSelectFieldPosition(this.state.foundingSources, source.type.code),
                            }
                        )
                    ))
                ))
                const idx = findIndexElement(tmp, this.state.initData.positions);
                if (idx !== null){
                    initData.planAmountRequestedNet = parseFloat((initData.planAmountRequestedNet - initData.positions[idx].amountRequestedNet).toFixed(2))
                    initData.planAmountRequestedGross = parseFloat((initData.planAmountRequestedGross - initData.positions[idx].amountRequestedGross).toFixed(2))
                    initData.positions.splice(idx, 1, tmp);
                    initData.planAmountRequestedNet = parseFloat((initData.planAmountRequestedNet + tmp.amountRequestedNet).toFixed(2))
                    initData.planAmountRequestedGross = parseFloat((initData.planAmountRequestedGross + tmp.amountRequestedGross).toFixed(2))
                }
                return {initData};
            });
        })
        .catch(error => {})
    }

    handleDeleteInvestmentPositionSource = (source, position) => {
        PlansApi.deleteInvestmentSource(position[0].id, source.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                const tmp =  response.data.data;
                tmp.vat = findSelectFieldPosition(this.state.vats, tmp.vat);
                tmp.category = findSelectFieldPosition(this.props.investmentCategories, tmp.category.code);
                tmp.status = findSelectFieldPosition(this.state.statuses, tmp.status);
                tmp.subPositions.map(subPosition =>(
                    subPosition.fundingSources.map(source =>(
                        Object.assign(source,
                            {
                                type: source.type = findSelectFieldPosition(this.state.foundingSources, source.type.code),
                            }
                        )
                    ))
                ))
                const idx = findIndexElement(tmp, this.state.initData.positions);
                if (idx !== null){
                    initData.planAmountRequestedNet = parseFloat((initData.planAmountRequestedNet - initData.positions[idx].amountRequestedNet).toFixed(2))
                    initData.planAmountRequestedGross = parseFloat((initData.planAmountRequestedGross - initData.positions[idx].amountRequestedGross).toFixed(2))
                    initData.positions.splice(idx, 1, tmp);
                    initData.planAmountRequestedNet = parseFloat((initData.planAmountRequestedNet + tmp.amountRequestedNet).toFixed(2))
                    initData.planAmountRequestedGross = parseFloat((initData.planAmountRequestedGross + tmp.amountRequestedGross).toFixed(2))
                }
                return {initData};
            });
        })
        .catch(error => {})
    }

    handleSubmitPlan = (values) => {
        this.props.loading(true)
        const payload = JSON.parse(JSON.stringify(values));
        payload.year =  new Date(payload.year).getFullYear();
        if(payload.status !== undefined){
            payload.status = payload.status.code;
        } else {
            // Add plan mode
            payload.status = 'ZP';
        }
        payload.type = payload.type.code;
        delete payload.positions;
        PlansApi.savePlan(this.props.action, payload)
        .then(response => {
            this.setState( prevState => {
                const initData = {...prevState.initData};
                Object.assign(initData, response.data.data);
                initData.year = new Date(initData.year,0,1).toJSON();
                initData.status = findSelectFieldPosition(this.props.statuses, initData.status);
                initData.type = findSelectFieldPosition( this.props.types, initData.type);
                return {initData};
            });
            this.props.changeAction('edit');
        })
        .catch(error => {
            this.setState({
                initData: values,
            });
        });
        this.props.loading(false)
    }

    handleSendPlan = () => {
        this.props.loading(true);
        PlansApi.sendPlan(this.state.initData.id)
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

    handleExcelExport = (exportType, headRow, level, positionId) =>{
        this.props.loading(true);
        if(level === "position"){
            PlansApi.exportPlanPositionsToExcel(exportType, this.state.initData.type.code, this.state.initData.id, headRow)
            .then(response => {
                generateExportLink(response);
                this.props.loading(false);
            })
            .catch(error => {});
        } else if (level === "subPositions") {
            PlansApi.exportPlanPositionSubPositionsToExcel(exportType, this.state.initData.type.code, positionId, headRow)
            .then(response => {
                generateExportLink(response);
                this.props.loading(false);
            })
            .catch(error => {});
        }
    }

    handlePrintPlan = () =>{
        this.props.loading(true);
        PlansApi.printPlan(this.state.initData.id)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleUpdate = () => {
        this.props.loading(true);
        PlansApi.updatePlan(this.props.initialValues.id)
        .then(response => {
            this.setState( prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, response.data.data);
                initData.year = new Date(initData.year,0,1).toJSON();
                initData.status = findSelectFieldPosition(this.props.statuses, initData.status);
                initData.type = findSelectFieldPosition( this.props.types, initData.type);
                initData.isUpdate = true;
                return {initData}
            })
            this.handleGetPlanPositions(this.state.initData.id);
            this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false);
        })
    }

    componentDidUpdate(prevProps, prevState){
        //Add mode load dictionary values
        if(this.props.action === 'edit' && prevProps.action ==='add'){
            if(this.state.initData.type.code === 'FIN'){
                this.handleGetDictionaryUnits();
                this.handleGetCostsTypes();
            } else if (this.state.initData.type.code === 'PZP'){
                this.handleGetDictionaryAssortmentGroups();
            }
        else if (this.props.initialValues.type === undefined && this.state.initData.type !== undefined && this.state.initData.type.code === 'INW'){
                this.handleGetOrganizationUnits();
                this.handleGetDictionaryFoundingSources();
            }
        }
    }

    componentDidMount(prevState) {
        if (this.props.action !== 'add'){
            if(this.props.action === 'update'){
                this.handleUpdate();
            } else {
                this.handleGetPlanPositions(this.props.initialValues.id);
            }
        }
        if(this.props.initialValues.type !== undefined && this.props.initialValues.type.code === 'INW'){
            this.handleGetDictionaryFoundingSources();
            this.handleGetOrganizationUnits();
        }
    }
    render(){
        const {changeVisibleDetails, plans, action, handleClose, types, modes, error, isLoading } = this.props;
        const {initData, newPosition, units, vats, costsTypes, assortmentGroups, orderTypes, estimationTypes, foundingSources, unassignedUnits} = this.state;
        return(
            <>
                {!initData.isUpdate ?
                    <Plan
                        initialValues={initData}
                        newPosition={newPosition}
                        setNewPositionToNull={this.setNewPositionToNull}
                        plans={plans}
                        changeVisibleDetails={changeVisibleDetails}
                        action={action}
                        error={error}
                        isLoading={isLoading}
                        onSubmitPlanPosition={this.handleSubmitPlanPosition}
                        onDeletePlanPosition={this.handleDeletePlanPosition}
                        onSubmitPlanSubPosition={this.handleSubmitPlanPosition}
                        onDeletePlanSubPosition={this.handleDeletePlanSubPosition}
                        onDeleteTargetUnit={this.handleDeleteInvestmentTargetUnit}
                        onDeleteSource={this.handleDeleteInvestmentPositionSource}
                        onSubmitPlan={this.handleSubmitPlan}
                        onSendPlan={this.handleSendPlan}
                        onPrintPlan={this.handlePrintPlan}
                        onExcelExport={this.handleExcelExport}
                        onClose={handleClose}
                        units={units}
                        costsTypes={costsTypes}
                        types={types}
                        vats={vats}
                        modes={modes}
                        assortmentGroups={assortmentGroups}
                        foundingSources={foundingSources}
                        unassignedUnits={unassignedUnits}
                        investmentCategories={this.props.investmentCategories}
                        orderTypes={orderTypes}
                        estimationTypes={estimationTypes}
                        isSubmit={this.handleIsSubmit}
                        euroExchangeRate={this.props.euroExchangeRate}
                    />
                :
                    <PlanUpdateFormContainer
                        initialValues={initData}
                        newPosition={newPosition}
                        setNewPositionToNull={this.setNewPositionToNull}
                        plans={plans}
                        changeVisibleDetails={changeVisibleDetails}
                        action={action}
                        error={error}
                        isLoading={isLoading}
                        onSubmitPlanPosition={this.handleSubmitPlanPosition}
                        onSubmitPlanSubPosition={this.handleSubmitPlanPosition}
                        onDeletePlanSubPosition={this.handleDeletePlanSubPosition}
                        onSubmitPlan={this.handleSubmitPlan}
                        onSendPlan={this.handleSendPlan}
                        onPrintPlan={this.handlePrintPlan}
                        onExcelExport={this.handleExcelExport}
                        onClose={handleClose}
                        units={units}
                        costsTypes={costsTypes}
                        types={types}
                        vats={vats}
                        modes={modes}
                        assortmentGroups={assortmentGroups}
                        foundingSources={foundingSources}
                        orderTypes={orderTypes}
                        estimationTypes={estimationTypes}
                        euroExchangeRate={this.props.euroExchangeRate}
                    />
                }
            </>
        );
    };
};

PlanContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    action: PropTypes.oneOf(['add', 'edit', 'update']).isRequired,
    changeAction: PropTypes.func,
    handleClose: PropTypes.func,
    error: PropTypes.string,
    clearError: PropTypes.func,
    isLoading: PropTypes.bool,
}

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
		error: state.ui.error,
		euroExchangeRate: state.ui.euroRate,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlanContainer);
