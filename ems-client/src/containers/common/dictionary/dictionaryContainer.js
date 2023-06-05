import React, { Component } from 'react';
import { connect } from "react-redux";
import { loading, setError } from 'actions/';
import Dictionary from 'components/common/dictionary/dictionary';
import DictionaryApi from 'api/common/dictionaryApi';
import {findIndexElement} from 'utils';

class DictionaryContainer extends Component{
    state = {
        initData: {
            items:[],
        },
    }

    handleSubmitItem = (value, action) => {
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(value));
        DictionaryApi.saveDictionaryItem(this.props.initialValues.code, payload)
        .then(response => {
            this.setState(prevState => {
                const initData = {...prevState.initData};
                if(action === "add"){
                    initData.items.push(response.data.data);
                } else {
                    const idx = findIndexElement(response.data.data, initData.items);
                    if(idx !== null){
                        initData.items.splice(idx, 1, response.data.data);
                    }
                }
                return {initData}
            })
            this.props.loading(false)
        })
        .catch(error => {
            this.props.loading(false)
        });
    }

    handleDeleteItem = (value) => {
        this.props.loading(true);
        DictionaryApi.deleteDictionaryItem(value.id)
        .then(response =>{
            this.setState(prevState => {
                const initData = {...prevState.initData};
                const idx = findIndexElement(value, this.state.initData.items);
                if(idx !== null){
                    initData.items.splice(idx, 1);
                }
                return {initData};
            });
            this.props.loading(false)
        })
        .catch(error => {
            this.props.loading(false)
        });
    }

    componentDidMount(){
        this.setState(prevState => {
            let initData = {...prevState.initData};
            Object.assign(initData, this.props.initialValues)
            return {initData};
        });
    }

    render(){
        const {open, onClose, isLoading} = this.props;
        const {initData} = this.state;
        return(
            <Dictionary
                initialValues={initData}
                open={open}
                isLoading={isLoading}
                onSubmitItem={this.handleSubmitItem}
                onDelete={this.handleDeleteItem}
                onClose={onClose}
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
        loading : loading,
        clearError : setError,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DictionaryContainer);
