import React, { Component } from 'react';
import { connect } from "react-redux";
import RegisterFormContainer from 'containers/modules/asi/dictionary/registers/forms/registerFormContainer';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import DictionaryApi from 'api/common/dictionaryApi';
import RegisterApi from 'api/modules/asi/dictionary/register/registerApi';
import EntitlementSystemApi from 'api/modules/asi/dictionary/employee/entitlementSystemApi';
import { findIndexElement, findSelectFieldPosition } from 'utils';

class RegisterContainer extends Component {

    state ={
        initData: {
            systems: [],
        },
        baseTypes: [],
        systems: [],
        action: this.props.action,
        isRegMod: false,
    }

    handleClose = () => {
        this.props.onClose(this.state.isRegMod);
    }

    handleGetRegisterBaseTypes = () =>{
        return DictionaryApi.getDictionaryActiveItems('slAsRegPod')
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                let baseTypes = [...prevState.baseTypes];
                baseTypes = response.data.data;
                Object.assign(initData,this.props.initialValues);

                if(this.props.action !== "add"){
                    initData.baseType = findSelectFieldPosition(baseTypes, initData.baseType.code);
                }
                return {initData, baseTypes}
            });
        })
        .catch(error => {});
    }

    handleGetActiveEntitlementSystems = () =>{
        this.props.loading(true);
        EntitlementSystemApi.getActiveUnassignedEntitlementSystems()
        .then(response => {
            this.setState(prevState => {
                let systems = [...prevState.systems]
                systems = response.data.data;

                return {systems};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleSubmitRegister = (values) => {
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(values));
        RegisterApi.saveRegister(payload)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                let action = prevState.action;
                let isRegMod = prevState.isRegMod;
                Object.assign(initData,response.data.data);
                initData.baseType = findSelectFieldPosition(this.state.baseTypes, initData.baseType.code);
                action = "edit";
                isRegMod = true;
                return {initData, action, isRegMod}
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleGetRegisterEntitlementSystems(){
        this.props.loading(true);
        RegisterApi.getRegisterEntitlementSystem(this.props.initialValues.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData}
                initData.systems = response.data.data;
                return {initData};
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }


    handleSubmitRegisterEntitlementSystems = (values) =>{
        this.props.loading(true);
        RegisterApi.addRegisterEntitlementSystems(this.state.initData.id, values.concat(this.state.initData.systems))
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                initData.systems =  response.data.data;
                return {initData}
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleRemoveRegisterEntitlementSystem = (system) => {
        this.props.loading(true);
        RegisterApi.removeRegisterEntitlementSystem(this.state.initData.id,  system.id)
        .then(response => {
            this.setState(prevState => {
                const initData = {...prevState.initData};
                const idx = findIndexElement(system, initData.systems);
                if(idx !== null){
                    initData.systems.splice(idx, 1);
                }
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidUpdate(prevProps){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                initData: Object.assign(this.state.initData,this.props.initialValues),
            });
        }
    }

    componentDidMount(){
        this.handleGetRegisterBaseTypes();
        if(this.props.action === "edit"){
            this.handleGetRegisterEntitlementSystems();
        }
    }

    render(){
        return(
            <RegisterFormContainer
                initialValues={this.state.initData}
                baseTypes={this.state.baseTypes}
                systems={this.state.systems}
                action = {this.state.action}
                isLoading={this.props.isLoading}
                error={this.props.error}
                clearError={this.props.clearError}
                onGetUnassignedSystem={this.handleGetActiveEntitlementSystems}
                onSubmit={this.handleSubmitRegister}
                onSubmitPermissionSystems={this.handleSubmitRegisterEntitlementSystems}
                onDeletePermissionSystem={this.handleRemoveRegisterEntitlementSystem}
                onSetSearchConditions={this.props.onSetSearchConditions}
                onClose={this.handleClose}
            />
        )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);