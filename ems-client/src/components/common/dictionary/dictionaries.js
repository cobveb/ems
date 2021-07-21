import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { SearchField, Button, Table } from 'common/gui';
import { LibraryBooks } from '@material-ui/icons/';
import DictionaryContainer from 'containers/common/dictionary/dictionaryContainer';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    icon: {
        marginLeft: theme.spacing(1),
    },
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
})

class Dictionaries extends Component {
    state = {
        headCells: [
            {
                id: 'code',
                label: 'Kod',
                type: 'text',
            },
            {
                id: 'name',
                label: 'Nazwa',
                type: 'text',
            },
        ],
        selected: '',
        rows: this.props.initialValues,
        openDictionary: false,
    };

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) => {
        this.setState({
            selected: row,
            openDictionary: true,
        });
    }

    handleOpen = () => {
        this.setState({openDictionary: true})
    }

    handleClose = (dictionary) => {
        this.setState(state => ({
            openDictionary: !state.openDictionary,
            selected: '',
            rows: this.props.onClose(dictionary),
        }));
    }

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    filter = (event) => {
        let searchValue ='';
        let updateList = [];
        searchValue = event.target.value;
        let dictionaries = this.props.initialValues;

        updateList = dictionaries.filter((item) => {
            return item.name.toLowerCase().search(
                searchValue.toLowerCase()) !== -1 ||
                item.code.toLowerCase().search(
                searchValue.toLowerCase()) !== -1;
        });

        this.setState({
            rows: updateList,
            selected: null,
        });
    }

    componentDidUpdate(prevProps){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues,
            });
        }
    }

    render(){
        const { classes, isLoading, error} = this.props;
        const { rows, selected, headCells, openDictionary  } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                {openDictionary &&
                    <DictionaryContainer
                        initialValues={selected}
                        open={openDictionary}
                        onClose={this.handleClose}
                    />
                }
                <div className={classes.root}>
                    <Grid
                        container
                        direction="column"
                        spacing={0}
                    >
                        <Typography variant="h6">{constants.SUBMENU_CONFIGURATIONS_DICTIONARIES}</Typography>
                        <Divider />
                        <Grid item xs={12}>
                            <SearchField
                                label={constants.DICTIONARIES_SEARCH_CODE_NAME}
                                placeholder={constants.DICTIONARIES_SEARCH_CODE_NAME}
                                onChange={this.filter}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Table
                                rows={rows}
                                headCells={headCells}
                                onSelect={this.handleSelect}
                                clearSelect={!selected}
                                className={classes.tableWrapper}
                                onDoubleClick={this.handleDoubleClick}
                                rowKey="code"
                            />
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-end"
                        >
                            <Button
                                label={constants.BUTTON_POSITIONS}
                                icon=<LibraryBooks className={classes.icon}/>
                                iconAlign="right"
                                variant="cancel"
                                disabled={!selected}
                                onClick={this.handleOpen}
                            />
                        </Grid>
                    </Grid>
                </div>
            </>
        )
    }
}
Dictionaries.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dictionaries);