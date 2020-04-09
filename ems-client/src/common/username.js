import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Typography } from '@material-ui/core/';


class Username extends Component {
    render(){
        const{ userDetails } = this.props
        return(
            <>
                <Typography color="inherit" variant="subtitle2" gutterBottom>
                    {userDetails.name} {userDetails.surname}
                </Typography>
            </>
        )
    }
}

Username.propTypes = {
	userDetails: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => {
	return {
		userDetails: state.auth.user,
	}
};

export default connect(mapStateToProps)(Username);