import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid  } from '@material-ui/core/';
import ModuleContainer from 'containers/modules/modules/moduleContainer';
import * as constants from 'constants/uiNames'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    content : {
        height: '100%',
        overflow: 'auto',
        padding: theme.spacing(2),
    }
});

class ModuleList extends Component {

    componentDidMount(){
        this.props.updateHeader(constants.MODULES_TITLE);
    }

	render(){
        const { classes, modules } = this.props;
		return(
		    <>
		        <Grid container className={classes.content} direction="row" justifyContent="center" alignItems="flex-start">
                    {modules.map((module, i) =>
                        <ModuleContainer module={module} key={i}/>
                    )}
                </Grid>
			</>
		)
	}
	
}

ModuleList.propTypes = {
		classes: PropTypes.object.isRequired,
		modules: PropTypes.array.isRequired,
};

export default withStyles(styles)(ModuleList);