import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import PlanBasicInfoForm from 'containers/modules/director/coordinator/plans/planBasicInfoFormContainer';
import {findSelectFieldPosition, generateExportLink} from 'utils';
import PlansApi from 'api/modules/director/coordinator/plansApi';
import CostTypeApi from 'api/modules/accountant/costTypeApi';
import DictionaryApi from 'api/common/dictionaryApi';
import * as constants from 'constants/uiNames';
import {publicProcurementEstimationTypes} from 'utils/';

class PlanContainer extends Component {
    state = {
        initData: {
            positions: [],
        },
        units: [],
        costsTypes:[],
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
                code: 'ZA',
                name: constants.COORDINATOR_PLAN_POSITION_STATUS_ACCEPT,
            },
            {
                code: 'SK',
                name: constants.COORDINATOR_PLAN_POSITION_STATUS_CORRECT,
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
        CostTypeApi.getCostTypeByCoordinatorAndYear(new Date(this.state.initData.year).getFullYear(), this.state.initData.coordinator.code)
        .then(response => {
            this.setState({
                costsTypes: response.data.data,
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
                                    status: position.status = findSelectFieldPosition(this.state.statuses, position.status)
                                }
                            )
                        ))
                        return {initData};
                    });
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
                default:
                    return null;
            }
        this.props.loading(false)
        })
        .catch(error =>{});
    };

    handleApproveDirector = () => {
        this.props.loading(true);
        PlansApi.approveDirector(this.state.initData.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                initData.directorAcceptUser = response.data.data.directorAcceptUser;
                return {initData};
            });
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
    }

    handleApproveChief = () => {
        this.props.loading(true);
        PlansApi.approveChief(this.state.initData.id)
        .then(response =>{
            this.setState( prevState => {
                let initData = {...prevState.initData};
                initData.status = findSelectFieldPosition(this.props.statuses, response.data.data.status);
                initData.chiefAcceptUser = response.data.data.chiefAcceptUser;
                return {initData};
            });
            this.props.loading(false)
            this.props.handleClose(this.state.initData);
        })
        .catch(error =>{});
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        PlansApi.exportPlanPositionsToExcel(exportType, this.state.initData.type.code, this.state.initData.id, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount() {
            this.handleGetPlanPositions();
    }
    render(){
        const {changeVisibleDetails, action, handleClose, error, isLoading } = this.props;
        const {initData, units, vats, costsTypes } = this.state;
        return(
            <PlanBasicInfoForm
                initialValues={initData}
                changeVisibleDetails={changeVisibleDetails}
                action={action}
                error={error}
                isLoading={isLoading}
                onApproveDirector={this.handleApproveDirector}
                onApproveChief={this.handleApproveChief}
                onExcelExport={this.handleExcelExport}
                onClose={handleClose}
                units={units}
                costsTypes={costsTypes}
                vats={vats}
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
