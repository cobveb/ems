import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { OutlinedInput, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Divider} from '@material-ui/core/';
import { SearchField, Button, Table } from 'common/gui';
import {Check, Close, Cancel, LibraryBooks} from '@material-ui/icons';
import * as constants from 'constants/uiNames';
import {escapeSpecialCharacters} from 'utils/';

const filter = (value, items) => {
    const searchValue = escapeSpecialCharacters(value)
    return items.filter((item) => {
        return item.name.toLowerCase().search(
            searchValue.toLowerCase()) !== -1 ||
            item.code.toLowerCase().search(
            searchValue.toLowerCase()) !== -1;
    });
}

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
    const [search, setSearch] = React.useState(searchValue);
    const [positions, setPositions] = React.useState(search ? filter(search, rows) : (rows));
    const headRows = [
        {
            id: 'code',
            numeric: false,
            label: 'Kod',
            boolean: false,
        },
        {
            id: 'name',
            numeric: false,
            label: 'Nazwa',
            boolean: false,
        },
    ];

    const onClose = () =>{
        setSearch(null);
        setOpen(false);
    }

    const onSelect = (row) =>{
        setSelected(row)
    }

    const onSearch = (event) => {
        setSearch(event.target.value)
        setPositions(filter(event.target.value, rows))
    }

    const onDouble = (row) => {
        onSelectValue(row)
    }

    return(
        <div>
            <Dialog
                open={open}
                onClose={() => onClose()}
                fullWidth={true}
                maxWidth="md"
                disableBackdropClick={true}
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
                                value={search}
                                autoFocus={true}
                                onChange={(event) => onSearch(event)}
                                valueType="all"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Table
                                className={classes.tableWrapper}
                                rows={positions}
                                headCells={headRows}
                                onSelect={onSelect}
                                onDoubleClick={onDouble}
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

export default function DictionaryField({classes, inputProps, labelWidth, disabled, dictionaryName, items,  ...input}){
    const [openDictionary, setOpenDictionary] = React.useState(false);
    const [value, setValue] = React.useState(input.value ? input.value : {code: '', name: ''});
    const [action, setAction] = React.useState(null);
    const [searchValue, setSearchValue] = React.useState(null);

    React.useEffect(() => {
        if (action === 'blur'){
            input.onBlur(value);
        }
    },  [value, input, action])


    const handleOpenDictionary = () =>{
        if(openDictionary === true){
            setSearchValue(null);
        } else {
            setSearchValue(value.name);
        }

        setOpenDictionary(!openDictionary);
    }

    function handleBlur(event){

        const positions = filter(event.target.value, items);

        if(positions.length === 0 && event.target.value.length > 0){
            setValue({code: 'err', name: event.target.value})
        } else if (positions.length === 0 && event.target.value.length === 0) {
            setValue({code: '', name: event.target.value})
        } else if (positions.length === 1){
            setValue(positions[0]);
        } else if (positions.length > 1 && event.target.value.length > 0) {
            setValue({code: 'err', name: event.target.value})
            setOpenDictionary(true)
            setSearchValue(event.target.value)
        } else if (event.target.value.length === 0) {
            setValue({code: '', name: event.target.value})
        }
        setAction('blur');
    }

    function handleChange(event){
        setValue({code: 'chg', name: event.target.value});
        setAction('change');
    }

    const onSelect = (value) =>{
        setOpenDictionary(!openDictionary)
        setValue(value);
        setAction('blur');
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
                    rows={items}
                />
            }
            <OutlinedInput
                fullWidth
                value={value.name}
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