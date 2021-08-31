import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, IconButton } from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { Close } from '@material-ui/icons/';
import DictionaryItemFormContainer from 'containers/common/dictionary/dictionaryItemFormContainer';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    dialogTitle: {
        paddingTop: theme.spacing(1.2),
        paddingBottom: 0,
    },
    dialogAction: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})

class Dictionary extends Component {
    state = {
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleSubmit = (values) =>{
        this.props.onSubmitItem(values)
    }

    componentDidMount(){
        this.setState({
            filter: this.state.rows,
        });
    }

    filter = (event) => {
        let searchValue ='';
        let updateList = [];
        searchValue = event.target.value;
        let dictionaries = this.state.rows;

        updateList = dictionaries.filter((item) => {
            return item.name.toLowerCase().search(
                searchValue.toLowerCase()) !== -1 ||
                item.code.toLowerCase().search(
                searchValue.toLowerCase()) !== -1;
        });

        this.setState({
            filter: updateList,
        });
    }

    render(){
        const {classes, isLoading, error, itemDetails, open, dictionaryType, onClose, action} = this.props;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} variant="error"/>}
                <Dialog
                    open={open}
                    onClose={onClose}
                    fullWidth={true}
                    maxWidth="sm"
                    disableBackdropClick={true}
                >
                    <DialogTitle
                        id={itemDetails.code}
                        disableTypography={true}
                        classes={{
                            root: classes.dialogTitle,
                        }}
                    >
                        <Typography variant='h6'>
                            {action === 'add' ? constants.DICTIONARY_ITEM_DETAILS_ADD_TITLE : `${constants.DICTIONARY_ITEM_DETAILS_EDIT_TITLE} ${itemDetails.name}`}
                        </Typography>
                        <IconButton aria-label="Close"
                            className={classes.closeButton}
                            onClick={onClose}
                        >
                            <Close fontSize='small'/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                            <Grid
                                container
                                direction="column"
                                spacing={0}
                            >
                                <Divider />
                                <DictionaryItemFormContainer
                                    initialValues={itemDetails}
                                    dictionaryType={dictionaryType}
                                    action={action}
                                    positions={this.props.positions}
                                    onSubmit={this.handleSubmit}
                                    onClose={onClose}
                                />
                            </Grid>
                    </DialogContent>
                </Dialog>
            </>
        )
    }
};

Dictionary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dictionary);