import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import Plan from 'components/modules/coordinator/plans/plan';
import DictionaryApi from 'api/common/dictionaryApi';
import {findSelectFieldPosition} from 'utils';
import PlansApi from 'api/modules/coordinator/plansApi';
import CostTypeApi from 'api/modules/accountant/costTypeApi';
import * as constants from 'constants/uiNames';
import {findIndexElement} from 'utils/';

class PlanContainer extends Component {
    state = {
        initData: {
            positions: [],
        },
        submit: false,
        units: [],
        costsTypes:[],
        assortmentGroups:[],
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
        estimationTypes: [
            {
                code: 'DO50',
                name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_DO50,
            },
            {
                code: 'D0130',
                name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_D0130,
            },
            {
                code: 'PO130',
                name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_PO130,
            },
            {
                code: 'UE139',
                name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_UE139,
            },
            {
                code: 'WR',
                name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_WR,
            },
            {
                code: 'COVID',
                name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_COVID,
            }
        ],
        statuses:[
            {
                code: 'DO',
                name: constants.COORDINATOR_PLAN_POSITION_STATUS_ADDED,
            },
            {
                code: 'ZP',
                name: constants.COORDINATOR_PLAN_POSITION_STATUS_SAVED,
            },
            {
                code: 'WY',
                name: constants.COORDINATOR_PLAN_POSITION_STATUS_SENT,
            },
            {
                code: 'PR',
                name: constants.COORDINATOR_PLAN_POSITION_STATUS_EXCEEDED,
            },
            {
                code: 'ZA',
                name: constants.COORDINATOR_PLAN_POSITION_STATUS_APPROVED,
            },
            {
                code: 'RE',
                name: constants.COORDINATOR_PLAN_POSITION_STATUS_REALIZED,
            },
            {
                code: 'ZR',
                name: constants.COORDINATOR_PLAN_POSITION_STATUS_EXECUTED,
            },
        ],
    }

    handleGetCostsTypes(){
        CostTypeApi.getCostTypeAll()
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
                        initData["positions"].map(position => ((
                            Object.assign(position,
                            {
                                vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                                orderType: position.orderType = findSelectFieldPosition(this.state.orderTypes, position.orderType),
                            }),
                            position.subPositions.map(subPosition => (
                                Object.assign(subPosition,{
                                    mode: subPosition.mode = findSelectFieldPosition(this.props.modes, subPosition.mode.code),
                                    estimationType: subPosition.estimationType = findSelectFieldPosition(this.state.estimationTypes, subPosition.estimationType),
                                })
                            ))
                        )));
                        return {initData};
                    });
                    this.handleGetDictionaryAssortmentGroups();
                break;
                default:
                    return null;
            }
        this.props.loading(false)
        })
        .catch(error =>{});
    };

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
        }
        payload.type = this.state.initData.type.code.toLowerCase();
        if(payload.type === 'pzp'){
            payload.orderType = payload.orderType.code;
            payload.subPositions.map(subPosition => (
                Object.assign(subPosition,{
                    estimationType: subPosition.estimationType = subPosition.estimationType.code,
                })
            ));
        }
        PlansApi.savePlanPosition(this.state.initData.id, action, payload)
        .then(response => {
            switch(this.state.initData.type.code){
                case ("FIN"):
                    this.setState(prevState => {
                        let initData = {...prevState.initData};
                        const tmp =  response.data.data;
                        tmp.vat = findSelectFieldPosition(this.state.vats, tmp.vat);
                        if(action ==='add'){
                            initData.positions.push(tmp);
                        } else {
                            const index = findIndexElement(values, initData.positions, "positionId");
                            if(index !== null){
                                initData.positions.splice(index, 1, tmp);
                            }
                        }
                        return {initData};
                    });
                break;
                case("PZP"):
                    this.setState( prevState => {
                        let initData = {...prevState.initData};
                        const tmp =  response.data.data;
                        tmp.vat = findSelectFieldPosition(this.state.vats, tmp.vat);
                        tmp.orderType = findSelectFieldPosition(this.state.orderTypes, tmp.orderType);
                        tmp.subPositions.map(subPosition => (
                            Object.assign(subPosition,{
                                mode: subPosition.mode = findSelectFieldPosition(this.props.modes, subPosition.mode.code),
                                estimationType: subPosition.estimationType = findSelectFieldPosition(this.state.estimationTypes, subPosition.estimationType),
                            })
                        ));
                        if(action ==='add'){
                            initData.positions.push(tmp);
                        } else {
                            const index = findIndexElement(values, initData.positions, "positionId");
                            if(index !== null){
                                initData.positions.splice(index, 1, tmp);
                            }
                        }
                        return {initData};
                    });
                break;
                default:
                    return null;
            }
            this.setState({
                submit: true,
            })
            this.props.loading(false);
        })
        .catch(error => {
            this.setState({
                initData: values,
            });
        });
    }

    handleDeletePlanPosition = (position) => {
        const index = findIndexElement(position, this.state.initData.positions);
        if(index !== null){
            PlansApi.deletePlanPosition(this.state.initData.id, position.id)
            .then(response => {
                this.setState( prevState => {
                    const initData = {...prevState.initData};
                    initData.positions.splice(index, 1);
                    return {initData};
                });
            })
         .catch(error => {});
        }
    }

    handleIsSubmit = () => {
        this.setState({
            submit: !this.state.submit,
        })
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
                Object.assign(initData, response.data.data);
                initData.year = new Date(initData.year,0,1).toJSON();
                initData.status = findSelectFieldPosition(this.props.statuses, initData.status);
                initData.type = findSelectFieldPosition( this.props.types, initData.type);
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error =>{});
    }

    componentDidUpdate(prevProps){
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

    componentDidMount() {
        if (this.props.action !== 'add'){
            this.handleGetPlanPositions();
        }
    }
    render(){
        const {changeVisibleDetails, plans, action, handleClose, types, modes, error, isLoading } = this.props;
        const {initData, units, vats, costsTypes, assortmentGroups, orderTypes, estimationTypes, submit} = this.state;
        return(
            <Plan
                initialValues={initData}
                plans={plans}
                changeVisibleDetails={changeVisibleDetails}
                action={action}
                error={error}
                isLoading={isLoading}
                onSubmitPlanPosition={this.handleSubmitPlanPosition}
                onDeletePlanPosition={this.handleDeletePlanPosition}
                onSubmitPlan={this.handleSubmitPlan}
                onSendPlan={this.handleSendPlan}
                onClose={handleClose}
                units={units}
                costsTypes={costsTypes}
                types={types}
                vats={vats}
                modes={modes}
                assortmentGroups={assortmentGroups}
                orderTypes={orderTypes}
                estimationTypes={estimationTypes}
                submit={submit}
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
