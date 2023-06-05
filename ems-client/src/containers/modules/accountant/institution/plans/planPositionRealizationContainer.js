import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PlanPositionRealization from  'components/modules/coordinator/plans/planPositionRealization';
import InvoiceApi from 'api/modules/coordinator/realization/invoicesApi';
import { generateExportLink } from 'utils/';


class PlanPositionRealizationContainer extends Component {
    state = {
        invoicesPositions: [],
    }

    handleGetInvoicesPositions = () => {
        this.props.loading(true);
        InvoiceApi.getInvoicesPositionsByInstitutionPlanPosition(this.props.initialValues.id)
        .then(response =>{
            this.setState({
                invoicesPositions: response.data.data,
            })
            this.props.loading(false);
        })
        .catch(error => {})
    }

    handleExcelExport = (exportType, headRow) => {
        this.props.loading(true);
        InvoiceApi.exportPlanPositionInvoicesPositionToExcel(exportType, this.props.initialValues.id, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount() {
        this.handleGetInvoicesPositions();
    }

    render(){
        const { isLoading, error, clearError } = this.props;
        const { invoicesPositions } = this.state;
        return (
            <PlanPositionRealization
                initialValues={invoicesPositions}
                planPosition={this.props.initialValues}
                planType='FIN'
                isInstitutionPlan={true}
                open={this.props.open}
                isLoading={isLoading}
                error={error}
                clearError={clearError}
                onClose={this.props.onClose}
                onExcelExport={this.handleExcelExport}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlanPositionRealizationContainer);