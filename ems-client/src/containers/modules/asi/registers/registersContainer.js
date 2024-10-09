import React, { Component } from 'react';
import { connect } from "react-redux";
import Registers from 'components/modules/asi/registers/registers';
import { bindActionCreators } from 'redux';
import { loading, setError, resetSearchConditions, setPageableTableProperties, setConditions } from 'actions/';
import { generateExportLink } from 'utils';
import RegisterApi from 'api/modules/asi/register/registerApi';
import DictionaryRegisterApi from 'api/modules/asi/dictionary/register/registerApi';
import * as constants from 'constants/uiNames';

class RegistersContainer extends Component {
    state = {
        registersPositions: [],
        registers: [],
        entitlementSystems: [],
        register: null,
    }

    handleGetRegisters = () => {
        DictionaryRegisterApi.getActiveRegisters()
        .then(response => {
            this.setState({
                registers:
                [{
                    code: '',
                    name: constants.ASI_REGISTERS_REGISTER,
                }].concat(response.data.data),
            })
        })
        .catch(error => {});
    }

    handleGetEntitlementSystemsByRegister = () => {
        DictionaryRegisterApi.getRegisterEntitlementSystem(this.props.searchConditions.conditions[0].value)
        .then(response => {
            this.setState({
                entitlementSystems:
                    [{
                        code: '',
                        name: constants.ASI_REGISTERS_REGISTER_ENTITLEMENT_SYSTEM,
                    }].concat(response.data.data),
                    register: this.props.searchConditions.conditions[0].value,
            })
        })
        .catch(error => {});
    }

    handleGetRegisterPositions = () => {
        this.props.loading(true);
        RegisterApi.getRegistersPositions(this.props.searchConditions)
        .then(response => {
            this.props.setPageableTableProperties({
                totalElements: response.data.data.totalElements,
                lastPage: response.data.data.last,
                firstPage: response.data.data.first,
            })
            this.setState({
                registersPositions: response.data.data.content,
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        RegisterApi.exportRegistersToExcel(exportType, headRow, this.props.searchConditions)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidUpdate(prevProps){
        if(this.props.searchConditions !== prevProps.searchConditions){
            /* Get entitlement systems by register */
            if (this.props.searchConditions.conditions && this.props.searchConditions.conditions.length) {
                if(this.props.searchConditions.conditions[0].value.length > 0 && this.state.register !== this.props.searchConditions.conditions[0].value){
                    this.handleGetEntitlementSystemsByRegister();
                }
            }
            this.handleGetRegisterPositions();
        }
    }

    componentDidMount() {
        this.handleGetRegisters();
    }

    componentWillUnmount(){
        this.props.resetSearchConditions();
    }

    render(){
        const { isLoading, error, clearError } = this.props;
        const { registersPositions, registers, entitlementSystems } = this.state;
        return(
            <Registers
                initialValues={registersPositions}
                registers={registers}
                entitlementSystems={entitlementSystems}
                error={error}
                isLoading={isLoading}
                clearError={clearError}
                onSetSearchConditions={this.props.onSetSearchConditions}
                onExcelExport={this.handleExcelExport}
                onClose={this.handleGetRegisters}
            />
        )
    }
}

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
		error: state.ui.error,
		searchConditions: state.search,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
        resetSearchConditions : bindActionCreators(resetSearchConditions, dispatch),
        onSetSearchConditions : bindActionCreators(setConditions, dispatch),
        setPageableTableProperties : bindActionCreators(setPageableTableProperties, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistersContainer);