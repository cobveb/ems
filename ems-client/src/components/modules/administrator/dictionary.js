import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { SearchField, Button, Table } from 'common/gui';
import { Add, Close, Delete, Edit } from '@material-ui/icons/';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(52)}px)`,
        height: `calc(100vh - ${theme.spacing(52)}px)`,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    icon: {
        marginLeft: theme.spacing(1),
    },
})

        class Dictionary extends Component {
    state = {
        headRows: [
            {
                id: 'code',
                numeric: false,
                disablePadding: false,
                label: 'Kod'
            },
            {
                id: 'name',
                numeric: false,
                disablePadding: false,
                label: 'Nazwa'
            },
        ],
        rows: [
            {
                code: "czeKomp",
                name: "Części komputerowe",
            },
            {
                code: "czeSiec",
                name: "Części siciowe",
            },
            {
                code: "serwDrukUps",
                name: "Serwis drukarek i upsów",
            },
            {
                code: "dzierDruk",
                name: "Dzierżawa drukarek",
            },
            {
                code: "serwAmms",
                name: "Serwis InfoMedica/AMMS",
            }
        ],
        selected: '',
        filter:[],
    }

    handleSelect = (id) => {
        this.setState({selected: id});
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
        const {classes, isLoading, error, dictionary, open, onClose} = this.props;
        const {headRows, filter, selected} = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} variant="error"/>}
                <Dialog
                    open={open}
                    onClose={onClose}
                    fullWidth={true}
                    maxWidth="md"
                    disableBackdropClick={true}
                >
                    <DialogTitle id="dialog-title" disableTypography={true}>
                        <Typography variant='h6'>
                            {dictionary.name}
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
                                <Grid item xs={12}>
                                    <SearchField
                                        onChange={this.filter}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Table
                                        rows={filter}
                                        headCells={headRows}
                                        onSelect={this.handleSelect}
                                        className={classes.tableWrapper}
                                    />
                                </Grid>
                            </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-end"
                        >
                            <Button
                                label={constants.BUTTON_ADD}
                                icon=<Add className={classes.icon}/>
                                iconAlign="right"
                                variant="add"
                            />
                            <Button
                                label={constants.BUTTON_EDIT}
                                icon=<Edit className={classes.icon}/>
                                iconAlign="right"
                                variant="edit"
                                disabled={!selected}
                            />
                            <Button
                                label={constants.BUTTON_DELETE}
                                icon=<Delete className={classes.icon}/>
                                iconAlign="right"
                                variant="delete"
                                disabled={!selected}
                            />
                        </Grid>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
};

Dictionary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dictionary);