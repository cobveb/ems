import React, { Component } from 'react';
import { connect } from "react-redux";
import Registers from 'components/modules/asi/dictionary/registers/registers';
import { bindActionCreators } from 'redux';
import { loading, setError, resetSearchConditions, setPageableTableProperties, setConditions } from 'actions/';
import { updateOnCloseDetails, findIndexElement, generateExportLink } from 'utils';
import RegisterApi from 'api/modules/asi/dictionary/register/registerApi';

class RegistersContainer extends Component {
    state = {
        registers: [],
    }

    handleGetRegisters = () => {
        this.props.loading(true);
        RegisterApi.getRegisters(this.props.searchConditions)
        .then(response => {
            this.props.setPageableTableProperties({
                totalElements: response.data.data.totalElements,
                lastPage: response.data.data.last,
                firstPage: response.data.data.first,
            })
            this.setState({
                registers: response.data.data.content,
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleDelete = (register) => {
        this.props.loading(true);
        RegisterApi.deleteRegister(register.id)
        .then(response => {
            this.handleGetRegisters()
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
            this.handleGetRegisters();
        }
    }

    componentWillUnmount(){
        this.props.resetSearchConditions();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {registers} = this.state;
        return(
            <Registers
                initialValues = {registers}
                isLoading = {isLoading}
                error = {error}
                clearError={clearError}
                onDelete={this.handleDelete}
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