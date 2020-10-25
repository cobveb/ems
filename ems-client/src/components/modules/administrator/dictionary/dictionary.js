import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import { SearchField, Button, Table } from 'common/gui';
import { Add, Close, Delete, Edit, Visibility } from '@material-ui/icons/';
import DictionaryItemDetails from 'components/modules/administrator/dictionary/dictionaryItemDetails';


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
    dialogActionButton: {
        marginTop: 0,
        marginBottom: theme.spacing(0.8),
        marginRight: theme.spacing(0.5),
        marginLeft: theme.spacing(0.5),
    },
    tableWrapper: {
        height: `calc(100vh - ${theme.spacing(52)}px)`,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(0.5),
        color: theme.palette.grey[500],
    },
    icon: {
        marginLeft: theme.spacing(1),
    },
})

class Dictionary extends Component {
    state = {
        rows: this.props.initialValues.items,
        headRows: [
            {
                id: 'code',
                disablePadding: false,
                label: constants.DICTIONARY_TABLE_HEAD_ROW_CODE,
                type: 'text',
            },
            {
                id: 'name',
                disablePadding: false,
                label: constants.DICTIONARY_TABLE_HEAD_ROW_NAME,
                type: 'text',
            },
            {
                id: 'isActive',
                label: constants.DICTIONARY_TABLE_HEAD_ROW_ACTIVE,
                type: 'boolean',
            },
        ],
        selected: null,
        itemDetails: false,
        action: null,
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }


    filter = (event) => {
        let searchValue ='';
        let updateList = [];
        searchValue = event.target.value;
        let positions = this.props.initialValues.items;

        updateList = positions.filter((item) => {
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

    handleOpen = (event, action) => {
        this.setState(state => ({
            itemDetails: !this.state.itemDetails,
            action: action,
        }));
    }

    handleDelete = (event, action) => {
        this.setState(state => ({
            action: action
        }));
    }

    handleConfirmDelete = () => {
        this.props.onDelete(this.state.selected.id);
        this.setState({
            action: null,
            selected: null,
        });
    }

    handleCancelDelete = () => {
        this.setState({ action: null });
    }

    handleClose = (item) => {
        this.setState(state => ({
            itemDetails: !this.state.itemDetails,
            selected: null,
            rows: this.props.initialValues.items,
        }));
    }

    render(){
        const {classes, isLoading, error, initialValues, open, onClose} = this.props;
        const {headRows, rows, selected, itemDetails, action} = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} variant="error"/>}
                {action ==='delete' &&
                    <ModalDialog
                        message={constants.DICTIONARY_CONFIRM_DELETE_MESSAGE}
                        variant="warning"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCancelDeleter}
                    />
                }
                {itemDetails &&
                    <DictionaryItemDetails
                        itemDetails={action === 'add' ? {} : selected}
                        action={action}
                        dictionaryType={initialValues.type}
                        open={itemDetails}
                        onClose={this.handleClose}
                    />
                }
                <Dialog
                    open={open}
                    onClose={() => onClose(initialValues)}
                    fullWidth={true}
                    maxWidth="md"
                    disableBackdropClick={true}
                >
                    <DialogTitle
                        id={initialValues.code}
                        disableTypography={true}
                        classes={{
                            root: classes.dialogTitle,
                        }}
                    >
                        <Typography variant='h6'>
                            {`${constants.DICTIONARY_TITLE} ${initialValues.name}`}
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
                                    className={classes.tableWrapper}
                                    rows={rows}
                                    headCells={headRows}
                                    onSelect={this.handleSelect}
                                    clearSelect={!selected}
                                    rowKey='code'
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions
                        classes={{
                            root: classes.dialogAction,
                        }}
                    >
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-end"
                        >
                            { initialValues.type !== 'P' &&
                                <Button
                                    className={classes.dialogActionButton}
                                    label={constants.BUTTON_ADD}
                                    icon=<Add/>
                                    iconAlign="right"
                                    variant="add"
                                    onClick={ (event) => this.handleOpen(event, 'add', )}
                                    data-action="add"
                                />
                            }
                            <Button
                                className={classes.dialogActionButton}
                                label={initialValues.type !== 'P' ? constants.BUTTON_EDIT : constants.BUTTON_PREVIEW}
                                icon={initialValues.type !== 'P' ? <Edit/> : <Visibility/>}
                                iconAlign="right"
                                variant={initialValues.type !== 'P' ?  "edit" : "cancel"}
                                disabled={!selected}
                                onClick={ (event) => this.handleOpen(event, 'edit', )}
                                data-action="edit"
                            />
                            { initialValues.type !== 'P' &&
                                <Button
                                    className={classes.dialogActionButton}
                                    label={constants.BUTTON_DELETE}
                                    icon=<Delete/>
                                    iconAlign="right"
                                    variant="delete"
                                    disabled={!selected}
                                    onClick = {(event) => this.handleDelete(event, 'delete', )}
                                />
                            }
                        </Grid>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
};

Dictionary.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  initialValues: PropTypes.object.isRequired,
  error: PropTypes.string
};

export default withStyles(styles)(Dictionary);