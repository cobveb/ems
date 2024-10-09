import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { OutlinedInput, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Divider} from '@material-ui/core/';
import { SearchField, Button, } from 'common/gui';
import { Spinner } from 'common/';
import { DictionaryTablePageable } from 'containers/common/gui';
import {Check, Close, Cancel, LibraryBooks} from '@material-ui/icons';
import * as constants from 'constants/uiNames';

const useDictionaryViewStyles = makeStyles(theme => ({
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
}));

function DictionaryView(props){
    const classes = useDictionaryViewStyles();
    const {open, setOpen, dictionaryName, onSelectValue, searchValue, rows} = props;
    const [selected, setSelected] = React.useState(null);
    const [value, setValue] = React.useState(searchValue !== null && searchValue.itemName !== "" ? searchValue.itemName : "");
    const [search, setSearch] = React.useState(value);

    const headRows = [
        {
            id: 'code',
            numeric: false,
            label: constants.TABLE_HEAD_ROW_CODE,
            boolean: false,
        },
        {
            id: 'itemName',
            numeric: false,
            label: constants.TABLE_HEAD_ROW_NAME,
            boolean: false,
        },
    ];

    const onClose = (event, reason) =>{
        event.persist()
        if(reason && ["backdropClick", "escapeKeyDown"].includes(reason)) return;
        setSearch(null);
        setOpen(false);
    }

    const onSelect = (row) =>{
        setSelected(row)
    }

    const onSearch = (event) => {
        setValue(event.target.value)
    }

    const handleBlur = (event) => {
        if(value !== search){
            props.onChangeDictionarySearchConditions([{name: 'searchValue', value: value, type: 'text'}]);
            setSearch(value);
        }
    }

    const handleKeyDown = (event) => {
        event.persist()
        if (event.key === "Enter") {
            if(value !== search){
                props.onChangeDictionarySearchConditions([{name: 'searchValue', value: value, type: 'text'}])
                setSearch(value);
            }
        }
    }

    const onDouble = (row) => {
        onSelectValue(row)
    }

    return(
        <div>
            <Dialog
                open={open}
                onClose={(event, reason) => onClose(event, reason)}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle
                    id={dictionaryName}
                    disableTypography={true}
                    classes={{
                        root: classes.dialogTitle,
                    }}
                >
                    <Typography variant='h6'>
                        {`${constants.DICTIONARY_TITLE} ${dictionaryName}`}
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
                                value={value}
                                autoFocus={true}
                                onChange={(event) => onSearch(event)}
                                onBlur={(event) => handleBlur(event)}
                                onKeyDown={(event) => handleKeyDown(event)}
                                valueType="all"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {props.isLoading && <Spinner />}
                            <DictionaryTablePageable
                                className={classes.tableWrapper}
                                rows={rows}
                                headCells={headRows}
                                onSelect={onSelect}
                                onDoubleClick={onDouble}
                                resetPageableProperties={false}
                                rowKey='code'
                                orderBy={headRows[1]}
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
                        <Button
                            className={classes.dialogActionButton}
                            label={constants.BUTTON_SELECT}
                            icon=<Check/>
                            iconAlign="right"
                            variant="add"
                            disabled={!selected}
                            onClick={() => onSelectValue(selected)}
                            data-action="add"
                        />
                        <Button
                            className={classes.dialogActionButton}
                            label={constants.BUTTON_CLOSE}
                            icon=<Cancel/>
                            iconAlign="right"
                            variant="cancel"
                            onClick = {onClose}
                        />
                    </Grid>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default function DictionaryField({classes, inputProps, labelWidth, disabled, dictionaryName, isRequired, items, onChangeDictionarySearchConditions, onSetDictionaryName, isLoading, ...input}){
    const [openDictionary, setOpenDictionary] = React.useState(false);
    const [value, setValue] = React.useState(isRequired ?
        input.value.itemName !== undefined ? input.value : {code: 'err', itemName: ''} :
            input.value.itemName !== undefined ? input.value : {code: '', itemName: ''});
    const [action, setAction] = React.useState(null);
    const [searchValue, setSearchValue] = React.useState(input.value.itemName !== undefined ? input.value.itemName : {code: '', itemName: ''});
    const [positions, setPositions] = React.useState(items);

    React.useEffect(() => {


        if(positions !== items){
            setPositions(items);
            if(action !== null && action !=='select' && !openDictionary){
                if(items.length === 0 && searchValue.itemName.length > 0){
                    setValue({code: 'err', itemName: searchValue.itemName})
                } else if (items.length === 0 && searchValue.itemName.length === 0) {
                    setValue({code: '', itemName: searchValue.itemName})
                } else if (items.length === 1){
                    if(!openDictionary){
                        setValue(items[0]);
                    }
                } else if (items.length > 1 && searchValue.itemName.length > 0) {
                    setValue({code: 'err', itemName: searchValue.itemName})
                    setOpenDictionary(true)
                    setSearchValue({code: 'err', itemName: searchValue.itemName})
                } else if (searchValue.itemName.length === 0) {
                    setValue({code: '', itemName: searchValue.itemName})
                }
            }
        };

        if (action === 'blur'){
            if(value !== null && value.code.length > 0){
                input.onBlur(value);
            } else  {
                if (isRequired === true){
                    setValue({code: 'err', itemName: ''})
                } else {
                    input.onBlur(null)
                }
            }
        } else if (action !== 'change'){
            if(value !== input.value && input.value.itemName !== undefined && input.value.itemName.length> 0){
                setValue(input.value);
                setSearchValue(value);
            } else {
                setValue(value)
                setSearchValue(value);
                if (isRequired !== true && value.code !== undefined && value.code.length === 0){
                    input.onBlur(null)
                }
            }
        }
    },  [searchValue, value, input, action, isRequired, items, openDictionary, positions])


    const handleOpenDictionary = () =>{
        if(openDictionary){
            setSearchValue('');
        } else {
            if(value !== null){
                setSearchValue(value);
                onSetDictionaryName(dictionaryName);
                if(value.code !== 'err'){
                    onChangeDictionarySearchConditions([{name: 'searchValue', value: value.itemName, type: 'text'}])
                }
            } else {
                onSetDictionaryName(dictionaryName);
                onChangeDictionarySearchConditions([{name: 'searchValue', value: '', type: 'text'}])
            }
        }
        setOpenDictionary(!openDictionary);
    }

    function handleBlur(event){
        if(action !== 'blur'){
            if (value !== null){
                if(searchValue === null || value.itemName !== searchValue.itemName){
                    setSearchValue(value)
                    onSetDictionaryName(dictionaryName);
                    onChangeDictionarySearchConditions([{name: 'searchValue', value: value.itemName, type: 'text'}])
                }
            }
            setAction('blur');
        }
    }

    function handleChange(event){
        setAction('change');
        if(event.target.value.length === 0 ){
            setValue(null);
            setSearchValue(null);
        } else {
            setValue({code: 'err', itemName: event.target.value});
        }
    }

    const onSelect = (value) =>{
        setOpenDictionary(!openDictionary)
        setValue(value);
        setSearchValue({code: '', itemName: ''});
        input.onBlur(value)
        setAction('select');
    }

    return(
        <>
            { openDictionary &&
                <DictionaryView
                    open={openDictionary}
                    setOpen={setOpenDictionary}
                    onSelectValue={onSelect}
                    searchValue={searchValue}
                    dictionaryName={dictionaryName}
                    onChangeDictionarySearchConditions={onChangeDictionarySearchConditions}
                    isLoading={isLoading}
                    rows={positions}
                />
            }
            <OutlinedInput
                fullWidth
                value={value !== null ? value.itemName : ''}
                className={classes}
                classes={inputProps}
                labelWidth={labelWidth}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            size="small"
                            edge="end"
                            aria-label="toggle dictionary visibility"
                            onClick={handleOpenDictionary}
                            disabled={disabled}
                            disableFocusRipple={true}
                        >
                            {<LibraryBooks />}
                        </IconButton>
                    </InputAdornment>
                }
                onChange={(event) => {handleChange(event)}}
                onBlur={(event) => {handleBlur(event)}}
            />
        </>
    );
}