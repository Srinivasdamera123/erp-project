import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Backdrop, Box, Chip, CircularProgress, Collapse, Grid, IconButton, ListItem, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { orderBy } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { purchaseConverter } from '../converters/purchase.converter';
import { useCollection } from '../hooks/collection.hook';
import { erpStorage } from '../lib/firebase';
import { Attachment, PURCHASE_COLLECTION, Purchase } from '../model/purchase.model';
import { PurchaseItem } from '../model/purchaseitem.model';
import { EDIT_PURCHASE_ROUTE } from './EditPurchase';


export const PurchaseList = () => {
    const [values, _, loading] = useCollection<Purchase>(PURCHASE_COLLECTION, purchaseConverter, orderBy('date'))
    const navigate = useNavigate();
    if (loading) {
        return <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress />
        </Backdrop>
    }

    const onEdit = (id: string) => {
        navigate(EDIT_PURCHASE_ROUTE.replace(':id', id))
    }

    return <>
        <Box sx={{ minHeight: '100%' }}>
            <Typography component="h2" variant="h4" align="center" gutterBottom>
                Purchase List
            </Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Delivery Project</TableCell>
                            <TableCell >Billing project</TableCell>
                            <TableCell >Date</TableCell>
                            <TableCell >Total price</TableCell>
                            <TableCell ></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values?.map((purchase, index) => <CollapsibleRow onEdit={() => onEdit(purchase.id)} key={index} purchase={purchase}></CollapsibleRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>
}

const CollapsibleRow = ({ purchase, onEdit }: { purchase: Purchase, onEdit: () => any }) => {
    const [open, setOpen] = useState(false)
    const downloadInvoice = (invoice: Attachment) => {
        getDownloadURL(ref(erpStorage, invoice.path)).then(url => {
            window.open(url)
        })
    }
    return <>
        <TableRow>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell>{purchase.vendor.name}</TableCell>
            <TableCell>{purchase.billingProject.name}</TableCell>
            <TableCell>{purchase.deliveryProject.name}</TableCell>
            <TableCell>{purchase.date.toDate().toDateString()}</TableCell>
            <TableCell>{purchase.totalPrice}</TableCell>
            <TableCell> <IconButton onClick={onEdit}>
                <EditIcon />
            </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Items
                        </Typography>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Material</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>UOM</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Total Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchase.items.map((purchaseItem: PurchaseItem, index: number) => <TableRow key={index}>
                                    <TableCell>{purchaseItem.description}</TableCell>
                                    <TableCell >{purchaseItem.material.name}</TableCell>
                                    <TableCell >{purchaseItem.type?.name}</TableCell>
                                    <TableCell >{purchaseItem.uom}</TableCell>
                                    <TableCell >{purchaseItem.price}</TableCell>
                                    <TableCell>{purchaseItem.quantity}</TableCell>
                                    <TableCell >{purchaseItem.totalPrice}</TableCell>
                                </TableRow>)}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell rowSpan={3} colSpan={5}>
                                        <Grid container direction='row'>
                                            {purchase.invoiceAttachments.map(invoice => <ListItem sx={{ width: 'fit-content' }} key={invoice.fileName}><Chip onClick={() => downloadInvoice(invoice)} label={invoice.fileName}></Chip></ListItem>)}
                                        </Grid>
                                    </TableCell>
                                    <TableCell variant='head' >Subtotal</TableCell>
                                    <TableCell variant='head' align="left">{purchase.subTotalPrice}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant='head'>Tax</TableCell>
                                    <TableCell variant='head' align="left">{purchase.tax}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant='head' >Total</TableCell>
                                    <TableCell variant='head' align="left">{purchase.totalPrice}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}

export const PURCHASE_LIST_ROUTE = '/pruchaseList'
