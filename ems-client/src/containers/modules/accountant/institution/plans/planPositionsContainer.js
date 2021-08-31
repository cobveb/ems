import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import PlanPositionsFormContainer from 'containers/modules/accountant/institution/plans/forms/planPositionsFormContainer';
import PlansApi from 'api/modules/accountant/institution/plansApi';
import {findSelectFieldPosition, getVats, getCoordinatorPlanPositionsStatuses, findIndexElement} from 'utils';

class PlanPositionsContainer extends Component {
    state = {
        initData:{
            planPositions:[]
        },
        vats: getVats(),
        statuses: getCoordinatorPlanPositionsStatuses(),
    }

    handleGetPlanPositions(){
        this.props.loading(true);
        PlansApi.getCoordinatorPlanPositions(this.props.initialValues.id)
        .then(response =>{
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues);
                initData.planPositions = response.data.data
                initData["planPositions"].map(position => (
                    Object.assign(position,
                    {
                        vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                    }
                )))
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error =>{
            this.props.loading(false)
        });
    }

    handleSubmitPlanPositions = () =>{
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(this.state.initData.planPositions))
        if(this.props.planType.code === 'FIN'){
            payload.forEach(position =>{
                position.vat = position.vat.code;
            })
        }
        PlansApi.acceptPlanPositions(this.props.planType.code, this.props.initialValues.id, payload)
        .then(response =>{
            switch(this.props.planType.code){
                case ("FIN"):
                    this.setState(prevState => {
                        let initData = {...prevState.initData};
                        initData.planPositions = response.data.data
                        initData.amountAwardedGross = 0
                        initData.amountAwardedNet = 0
                        initData["planPositions"].map(position => (
                            Object.assign(position,
                            {
                                vat: position.vat = findSelectFieldPosition(this.state.vats, position.vat),
                            }),
                            initData.amountAwardedNet += position.amountAwardedNet,
                            initData.amountAwardedGross += position.amountAwardedGross
                        ))
                        return {initData};
                    });
                break;
                // no default
            }
        this.props.onClosePosition();
        this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false)
        });
    }

    handleAcceptPositions = (values) =>{
        values.map(position => {
            const index = findIndexElement(position, this.state.initData.planPositions, "positionId");
            if(index !== null){
                position['amountAwardedNet'] = position['amountRequestedNet'];
                position['amountAwardedGross'] = position['amountRequestedGross'];
                position.positionStatus = "ZA";
                this.state.initData.planPositions.splice(index, 1, position);
            }
            return position;
        })
        this.handleSubmitPlanPositions();
    }

    handleCorrectPosition = (values) =>{
        const payload = [JSON.parse(JSON.stringify(values))];
        if(this.props.planType.code === 'FIN'){
            payload[0].vat = values.vat.code;
            payload[0].positionStatus = "SK";
        }
        PlansApi.correctPlanPositions(this.props.planType.code, this.props.initialValues.id, payload)
        .then(response =>{
            switch(this.props.planType.code){
                case ("FIN"):
                    console.log(response.data.data)
                    this.setState(prevState => {
                        let initData = {...prevState.initData};
                        const index = findIndexElement(values, initData.planPositions, "positionId");
                            console.log(index)
                        if(index !== null){
                            Object.assign(response.data.data[0],
                            {
                                vat: response.data.data[0].vat = findSelectFieldPosition(this.state.vats, response.data.data[0].vat)
                            });
                            this.state.initData.planPositions.splice(index, 1, response.data.data[0]);
                            initData.amountAwardedGross = 0
                            initData.amountAwardedNet = 0
                            initData["planPositions"].map(position => (
                                initData.amountAwardedNet += position.amountAwardedNet,
                                initData.amountAwardedGross += position.amountAwardedGross
                            ))
                        }
                        return {initData};
                    });
                break;
                // no default
            }
        this.props.onClosePosition();
        this.props.loading(false);
        })
        .catch(error =>{
            this.props.loading(false)
        });
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues.amountAwardedGross !== prevProps.initialValues.amountAwardedGross){
            this.handleGetPlanPositions();
        }
    }

    componentDidMount(){
        this.handleGetPlanPositions();
    }

    render(){
        const {planStatus} = this.props;
        const {initData} = this.state;

        return(
            <>
                <PlanPositionsFormContainer
                    initialValues={initData}
                    types={this.state.types}
                    statuses={this.state.statuses}
                    planStatus={planStatus}
                    onAcceptPlanPositions={this.handleAcceptPositions}
                    onCorrectPlanPosition={this.handleCorrectPosition}
                    onClosePlanDetails={this.props.onClosePosition}
                    onClose={this.props.onClose}
                />
            </>
        );
    };
};

PlanPositionsContainer.propTypes = {
    initialValues: PropTypes.object,
    handleClose: PropTypes.func,
    error: PropTypes.string,
    clearError: PropTypes.func,
    isLoading: PropTypes.bool,
};

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

export default connect(mapStateToProps, mapDispatchToProps)(PlanPositionsContainer);