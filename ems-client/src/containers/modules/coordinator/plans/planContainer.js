import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import Plan from 'components/modules/coordinator/plans/plan';
import DictionaryApi from 'api/common/dictionaryApi';
import PlansApi from 'api/modules/coordinator/plansApi';
import CostTypeApi from 'api/modules/accountant/costTypeApi';
import * as constants from 'constants/uiNames';
import {findIndexElement, publicProcurementEstimationTypes, findSelectFieldPosition, generateExportLink, getCoordinatorPlanPositionsStatuses} from 'utils/';

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
        vats: [
            {
                code: 1.08,
                name: "8%",
            },
            {
                code: 1.23,
                name: "23%",
            },
        ],
        orderTypes: [
            {
                code: 'DST',
                name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_DELIVERY,
            },
            {
                code: 'USL',
                name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_SERVICE,
            }
        ],
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

    handleGetPlanPositions = () => {
        this.props.loading(true);
        PlansApi.getPlanPositions(this.props.initialValues.id)
        .then(response =>{
            switch(this.props.initialValues.type.code){
                case ("FIN"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        Object.assign(initData, this.props.initialValues);
                        initData.positions = response.data.data;
                        initData["positions"].map(position => (
                            Object.assign(position,
                                {
                                    vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                                    status: position.status = findSelectFieldPosition(this.state.statuses, position.status),
                                }
                            )
                        ))
                        return {initData};
                    });
                    this.handleGetDictionaryUnits();
                    this.handleGetCostsTypes();
                break;
                case("PZP"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        Object.assign(initData, this.props.initialValues);
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
                                }
                            )
                        ))
                        return {initData};
                    });
                    this.handleGetDictionaryFoundingSources();
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
        } else if (action === 'edit'){
            payload.status = values.status.code;
        }
        payload.type = this.state.initData.type.code.toLowerCase();
        if(payload.type === 'pzp'){
            payload.orderType = payload.orderType.code;
            payload.estimationType = payload.estimationType.code;
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
                        console.log(this.state.costsTypes)
                        console.log(tmp.costType)
                        tmp.status = findSelectFieldPosition(this.state.statuses, tmp.status);
                        tmp.costType = findSelectFieldPosition(this.state.costsTypes, tmp.costType.code);
                        newPosition = tmp;
                        this.setUpPlanValueOnSubmitPosition(values, initData, tmp, action);
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
                        return {initData, newPosition};
                    });
                break;
                default:
                    return null;
            }
            this.props.loading(false);
        })
        .catch(error => {
            this.setState({
                initData: values,
            });
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
            console.log(response)
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
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
        }
    }

    componentDidMount(prevState) {
        if (this.props.action !== 'add'){
            this.handleGetPlanPositions();
        }
    }
    render(){
        const {changeVisibleDetails, plans, action, handleClose, types, modes, error, isLoading } = this.props;
        const {initData, newPosition, units, vats, costsTypes, assortmentGroups, orderTypes, estimationTypes, foundingSources} = this.state;
        return(
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
                isSubmit={this.handleIsSubmit}
            />
        );
    };
};

PlanContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
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
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlanContainer);
