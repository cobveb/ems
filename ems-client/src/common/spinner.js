import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, CircularProgress, Grid } from '@material-ui/core/';

const styles = theme => ({
	  progress: {
	    margin: theme.spacing(2),
	    
	  },
	  spinner: {
		position: 'absolute',
	    zIndex: 1000,
	    width: '100%',
	    height: '100%',
	    top: 0,
	    left: 0,
	  },
	  grid: {
		  height: '100%',
	  }
	});

class Spinner extends Component {
	constructor(props) {
        super(props);
	    this.state = {
		    completed: 0,
	    }
	};
	
	componentDidMount() {
		this.timer = setInterval(this.progress, 20);
	}
	
	componentWillUnmount() {
		clearInterval(this.timer);
	}
	
	progress = () => {
		const { completed } = this.state;
		this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
	};
	
	render() {
		const { classes } = this.props;
		return(
		    <>
			    <div className={classes.spinner}>
				    <Grid container direction="row" justifyContent="center" alignItems="center" className={classes.grid}>
					    <CircularProgress
						    className={classes.progress}
						    variant="determinate"
						    value={this.state.completed}
						    size={72}
					    />
				    </Grid>
			    </div>
			</>
		);
	}
}

Spinner.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Spinner);

