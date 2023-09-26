import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Backdrop, Box, CircularProgress, Collapse, Dialog, Fab, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from 'react';
import { materialConverter } from "../converters/material.converter";
import { useCollection } from "../hooks/collection.hook";
import { CREATE_MODE, EDIT_MODE, MODE } from '../lib/util';
import { MATERIAL_COLLECTION, Material } from "../model/material.model";
import { EditMaterial } from './EditMaterial';

export const MaterialList = () => {
    const [values, refresh, loading] = useCollection<Material>(MATERIAL_COLLECTION, materialConverter)
    const [open, setOpen] = useState<{ open: boolean, mode: MODE, id: string }>({ open: false, mode: CREATE_MODE, id: '' });
    const onSave = () => { setOpen(curr => ({ ...curr, open: false })); refresh(); }
    const onEdit = (id: string) => {
        setOpen({ open: true, mode: EDIT_MODE, id })
    }
    if (loading) {
        return <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress />
        </Backdrop>
    }
    return <Grid spacing={2} sx={{ minHeight: '100%' }} justifyContent='space-between' container direction='column'>
        <Grid item>
            <Typography component="h2" variant="h4" align="center" gutterBottom>
                Material List
            </Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>UOM</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map(material => <CollapsibleRow onEdit={() => onEdit(material.id)} key={material.id} material={material}></CollapsibleRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid item alignSelf='flex-end'>
            <Fab sx={{ pr: 2 }} onClick={() => setOpen({ open: true, mode: CREATE_MODE, id: '' })} variant="extended" size="small" color="primary" aria-label="add">
                <AddIcon sx={{ mr: 1 }} />
                Material
            </Fab>
        </Grid>
        <Dialog open={open.open} onClose={() => setOpen(curr => ({ ...curr, open: false }))}>
            <EditMaterial mode={open.mode} id={open.id} onSuccessfullSave={onSave}></EditMaterial>
        </Dialog>
    </Grid>
}

const CollapsibleRow = ({ material, onEdit }: { material: Material, onEdit: () => any }) => {
    const [open, setOpen] = useState(false)
    return <>
        <TableRow>
            <TableCell>
                {material.hasMultipleTypes && <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>}
            </TableCell>
            <TableCell>{material.name}</TableCell>
            <TableCell>{material.uom}</TableCell>
            <TableCell >{material.price}</TableCell>
            <IconButton onClick={onEdit}>
                <EditIcon />
            </IconButton>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Types
                        </Typography>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {material.types?.map(type => <TableRow key={type.name}>
                                    <TableCell>{type.name}</TableCell>
                                    <TableCell>{type.price}</TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}

export const MATERIAL_LIST_ROUTE = '/materialList'
