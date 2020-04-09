import React, { Component } from 'react';
import { connect } from "react-redux";
import Dictionaries from 'components/modules/administrator/dictionaries';
import DictionaryApi from 'api/common/dictionaryApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';

class DictionariesContainer extends Component {
    state = {
        initData: [],
    }

    handleAll(){
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

    componentDidMount() {
        this.handleAll();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {initData} = this.state;
        return(
            <Dictionaries
                initialValues = {initData}
                isLoading = {isLoading}
                error = {error}
                clearError={clearError}
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

export default connect(mapStateToProps, mapDispatchToProps)(DictionariesContainer);