import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Backdrop, CircularProgress, Dialog, Fab, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from 'react';
import { vendorConverter } from '../converters/vendor.converter';
import { useCollection } from "../hooks/collection.hook";
import { CREATE_MODE, EDIT_MODE, MODE } from '../lib/util';
import { VENDOR_COLLECTION, Vendor } from '../model/vendor.model';
import { EditVendor } from './EditVendor';

export const VendorList = () => {
    const [values, refresh, loading] = useCollection<Vendor>(VENDOR_COLLECTION, vendorConverter)
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
                Vendor List
            </Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Short Name</TableCell>
                            <TableCell>Contact Person</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Vendor GST</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map(vendor => <TableRow>
                            <TableCell>{vendor.name}</TableCell>
                            <TableCell>{vendor.shortName}</TableCell>
                            <TableCell>{vendor.contactPerson}</TableCell>
                            <TableCell>{vendor.contactPersonPhone}</TableCell>
                            <TableCell>{vendor.vendorGST}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(vendor.id)}>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid item alignSelf='flex-end'>
            <Fab sx={{ pr: 2 }} onClick={() => setOpen({ open: true, mode: CREATE_MODE, id: '' })} variant="extended" size="small" color="primary" aria-label="add">
                <AddIcon sx={{ mr: 1 }} />
                Vendor
            </Fab>
        </Grid>
        <Dialog open={open.open} onClose={() => setOpen(curr => ({ ...curr, open: false }))}>
            <EditVendor mode={open.mode} id={open.id} onSuccessfullSave={onSave}></EditVendor>
        </Dialog>
    </Grid>
}

export const VENDOR_LIST_ROUTE = '/vendorList'
