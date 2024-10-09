import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { setDictionaryPage, setDictionarySort, resetDictionarySearchConditions } from 'actions/';
import { TablePageable} from 'common/gui';

class DictionaryTablePageableContainer extends Component{

    componentWillUnmount(){
        this.props.resetDictionarySearchConditions();
    }

    render() {
        return (
            <TablePageable
                {...this.props}
            />
        )
    }
}

const mapStateToProps = (state) => {
	return {
		page: state.dictionarySearch.page,
    	rowsPerPage: state.dictionarySearch.rowsPerPage,
    	pageableTableProperties: state.ui.dictionaryPageableTableProperties,
    	cond: state.dictionarySearch,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        onSetPage : bindActionCreators(setDictionaryPage, dispatch),
        onSetSort : bindActionCreators(setDictionarySort, dispatch),
        resetDictionarySearchConditions : bindActionCreators(resetDictionarySearchConditions, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DictionaryTablePageableContainer);