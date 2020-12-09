import React, { Component } from 'react';
import { connect } from "react-redux";
import CostsTypes from 'components/modules/accountant/dictionary/costsTypes';
import DictionaryApi from 'api/common/dictionaryApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import {updateOnCloseDetails} from 'utils';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';


class CostsTypesContainer extends Component {
    state = {
        costsTypes: [
            {
                id: 1,
                number: '402-1-25-004',
                name: 'Pozostałe usługi niemedyczne KUP',
                active: true,
            },
            {
                id: 2,
                number: '402-2-04-001',
                name: 'Zakup usług TK ',
                active: true,
            }
        ],
        coordinators: [],
    }

    handleGetCostsTypes(){
        this.props.loading(true);
        DictionaryApi.getDictionaries()
        .then(response => {
            this.setState({
                initData: response.data.data,
            })
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleGetCoordinators(){
        return OrganizationUnitsApi.getCoordinators()
        .then(response => {
            this.setState(prevState => {
                let coordinators = [...prevState.coordinators];
                coordinators =  coordinators.concat(response.data.data);
                return {coordinators};
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleUpdateOnClose = (cost) => {
        let costs = this.state.costsTypes;
        return updateOnCloseDetails(costs, cost);
    }

    componentDidMount() {
        //TODO : Odkomentować w momencie udostepnienia API getCostTypes
        //this.handleGetCostsTypes();
        this.handleGetCoordinators();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {costsTypes, coordinators} = this.state;
        return(
            <CostsTypes
                initialValues = {costsTypes}
                coordinators = {coordinators}
                isLoading = {isLoading}
                error = {error}
                clearError={clearError}
                onClose={this.handleUpdateOnClose}

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

export default connect(mapStateToProps, mapDispatchToProps)(CostsTypesContainer);