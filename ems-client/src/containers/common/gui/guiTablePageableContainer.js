import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { setPage, setSort } from 'actions/';
import { TablePageable} from 'common/gui';

class TablePageableContainer extends Component{

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
		page: state.search.page,
    	rowsPerPage: state.search.rowsPerPage,
    	pageableTableProperties: state.ui.pageableTableProperties,
    	cond: state.search,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        onSetPage : bindActionCreators(setPage, dispatch),
        onSetSort : bindActionCreators(setSort, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TablePageableContainer);