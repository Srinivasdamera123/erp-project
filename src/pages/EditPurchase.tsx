import { Backdrop, Button, Chip, CircularProgress, Dialog, Fab, FormHelperText, Grid, IconButton, ListItem, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, debounce } from '@mui/material';
import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Timestamp } from 'firebase/firestore';
import { UploadResult, ref, uploadBytes } from 'firebase/storage';
import moment from 'moment';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import FormDateField from '../components/common/FormDateField';
import FormField from '../components/common/FormField';
import { materialConverter } from '../converters/material.converter';
import { projectConverter } from '../converters/project.converter';
import { vendorConverter } from '../converters/vendor.converter';
import { useCollection } from '../hooks/collection.hook';
import { erpStorage } from '../lib/firebase';
import { CREATE_MODE, getPurchase, saveEnitity, updateEnitity } from '../lib/util';
import { MATERIAL_COLLECTION, Material } from '../model/material.model';
import { PROJECT_COLLECTION, Project } from '../model/project.model';
import { Attachment, PURCHASE_COLLECTION, PurchaseDTO } from '../model/purchase.model';
import { UOMS } from '../model/uom.model';
import { VENDOR_COLLECTION, Vendor } from '../model/vendor.model';
import { purchaseSchema } from '../schema/purchase.schema';
import { EditMaterial } from './EditMaterial';
import { EditProject } from './EditProject';
import { EditVendor } from './EditVendor';
import { PURCHASE_LIST_ROUTE } from './PurchaseList';





export const EditPurchase = () => {
    const navigate = useNavigate();
    const [projects, refreshProjects] = useCollection<Project>(PROJECT_COLLECTION, projectConverter)
    const [vendors, refreshVendors] = useCollection<Vendor>(VENDOR_COLLECTION, vendorConverter);
    const [materials, refreshMaterials] = useCollection<Material>(MATERIAL_COLLECTION, materialConverter)
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<{ file: any, fileName: string, id: string, isDeletable: boolean }[]>([]);
    const { id } = useParams();
    const methods = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(purchaseSchema),
        defaultValues: { ...emptyPurchase }
    });
    const { getValues, setValue, watch } = methods

    const { fields, append, remove } = useFieldArray({
        name: 'items',
        control: methods.control,
    });

    useEffect(() => {
        const func = async () => {
            if (id !== 'new') {
                setLoading(true)
                const purchase = await getPurchase(id || '');
                methods.reset({
                    billingProject: purchase.billingProject.id,
                    deliveryProject: purchase.deliveryProject.id,
                    vendor: purchase.vendor.id,
                    date: moment(purchase.date.toDate()),
                    subTotalPrice: purchase.subTotalPrice,
                    tax: purchase.tax,
                    totalPrice: purchase.totalPrice,
                    invoiceNumber: purchase.invoiceNumber,
                    DCNumber: purchase.DCNumber,
                    invoiceDate: moment(purchase.invoiceDate?.toDate()),
                    invoiceAttachments: purchase.invoiceAttachments.map(_ => ({})) as never[],
                    items: purchase.items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price,
                        totalPrice: item.totalPrice,
                        type: item.material.types?.findIndex(type => type.name === item.type?.name).toString(),
                        uom: item.uom,
                        material: item.material.id,
                        types: item.material.types,
                        hasMoreTypes: item.material.hasMultipleTypes
                    }))
                })
                setFiles(purchase.invoiceAttachments.map(attachment => ({
                    file: null, fileName: attachment.fileName, id: attachment.path, isDeletable: false
                })))
                setLoading(false)

            } else {
                methods.reset({ ...emptyPurchase })
                setFiles([])
            }
        }
        func();
    }, [id, methods])

    const onItemChange = (index: number) => {
        setValue(`items.${index}.totalPrice`, getValues(`items.${index}.quantity`) * getValues(`items.${index}.price`))
        onPriceChange()
    }

    const onPriceChange = () => {
        const sum = getValues('items').reduce((sum, { totalPrice }) => sum + totalPrice, 0)
        setValue('subTotalPrice', sum)
        setValue('totalPrice', sum + +getValues('tax'))
    }

    const onItemDelete = (index: number) => {
        remove(index)
        onPriceChange()
    }

    const onMaterialSelect = (index: number) => {
        const materialName = getValues(`items.${index}.material`)
        const material = materials?.find(material => material.id === materialName)
        setValue(`items.${index}.description`, material?.name || '')
        setValue(`items.${index}.hasMoreTypes`, material?.hasMultipleTypes || false)
        const types = material?.types || []
        setValue(`items.${index}.types`, [...types])
        const price = material?.hasMultipleTypes ? 0 : material?.price || 0;
        setValue(`items.${index}.price`, price)
        const uom = material?.uom || ''
        setValue(`items.${index}.uom`, uom)
    }

    const onTypeSelect = (index: number) => {
        const type = getValues(`items.${index}.type`)
        const selectedType = getValues(`items.${index}.types`)[+type]
        setValue(`items.${index}.price`, selectedType?.price || 0)
        onItemChange(index)
    }

    const onSuccessfullCreation = (refresh?: () => void) => {
        refresh && refresh();
        setDialogInfo({
            open: false, dialog: ''
        })
    }

    const onFileAdd = (e: any) => {
        if (e.target.files[0]) {
            setFiles(curr => [...curr, {
                file: e.target.files[0],
                fileName: e.target.files[0].name,
                id: new Date().toISOString(),
                isDeletable: true
            }])
            setValue('invoiceAttachments', [...getValues('invoiceAttachments'), {}] as never[])
        }
    }

    const onFileDelete = (id: string) => {
        setFiles(curr => curr.filter(ele => ele.id !== id))
        const n = [...getValues('invoiceAttachments')]
        n.pop()
        setValue('invoiceAttachments', n as never[])
    }

    const [dialogInfo, setDialogInfo] = useState({ open: false, dialog: '' });
    async function createPurchase(data: any, invoiceAttachments: Attachment[]) {
        const purchase: Omit<PurchaseDTO, "id"> = {
            billingProject: data.billingProject,
            vendor: data.vendor,
            deliveryProject: data.deliveryProject,
            totalPrice: data.totalPrice,
            tax: data.tax,
            subTotalPrice: data.subTotalPrice,
            invoiceNumber: data.invoiceNumber,
            DCNumber: data.DCNumber,
            invoiceDate: Timestamp.fromDate(new Date(data.invoiceDate)),
            date: Timestamp.fromDate(new Date(data.date)),
            invoiceAttachments,
            items: data.items.map((item: any) => ({
                description: item.description,
                material: item.material,
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.totalPrice,
                remark: '',
                uom: item.uom,
                type: item.type
            }))
        };

        try {
            await saveEnitity(PURCHASE_COLLECTION, purchase);
        } catch (error) {
            console.error(error);
        }
    }
    async function updatePurchase(data: any, invoiceAttachments: Attachment[]) {
        const purchase: PurchaseDTO = {
            billingProject: data.billingProject,
            vendor: data.vendor,
            deliveryProject: data.deliveryProject,
            totalPrice: data.totalPrice,
            tax: data.tax,
            id: id || '',
            subTotalPrice: data.subTotalPrice,
            invoiceNumber: data.invoiceNumber,
            DCNumber: data.DCNumber,
            invoiceDate: Timestamp.fromDate(new Date(data.invoiceDate)),
            date: Timestamp.fromDate(new Date(data.date)),
            invoiceAttachments,
            items: data.items.map((item: any) => ({
                description: item.description,
                material: item.material,
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.totalPrice,
                remark: '',
                uom: item.uom,
                type: item.type
            }))
        };

        try {
            await updateEnitity(PURCHASE_COLLECTION, purchase, id || '');
        } catch (error) {
            console.error(error);
        }
    }
    const onSubmit = async (data: any) => {
        var result: UploadResult | undefined;
        const invoiceAttachments: Attachment[] = [];
        setLoading(true)
        let isFileUploadSuccessful = true;
        try {
            for (let file of files) {
                if (file.isDeletable) {
                    const fileForUpload = ref(erpStorage, `${new Date().toISOString()}-${file.fileName}`);
                    result = await uploadBytes(fileForUpload, file.file);
                    invoiceAttachments.push({
                        fileName: file.fileName,
                        path: result.metadata.fullPath
                    })
                } else {
                    invoiceAttachments.push({
                        fileName: file.fileName,
                        path: file.id
                    })
                }

            }
        } catch (e) {
            isFileUploadSuccessful = false
            console.error(e)
        }
        if (isFileUploadSuccessful) {
            id === 'new' ? await createPurchase(data, invoiceAttachments) : await updatePurchase(data, invoiceAttachments)
        }

        navigate(PURCHASE_LIST_ROUTE, { replace: true });

        setLoading(false)

    }
    const onError = (data: any) => console.error(data);


    return <>
        {loading && <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress />
        </Backdrop>}
        <Grid direction='row' container minHeight='100%'>
            <Grid p={2} xs={11} spacing={2} direction='column' alignItems='center' container item>
                <Grid item>
                    <Typography component="h2" variant="h5" align="center" gutterBottom>Edit Purchase</Typography>
                </Grid>
                <Grid onSubmit={methods.handleSubmit(onSubmit, onError)} component='form' container spacing={3} direction='row' item>
                    <FormProvider {...methods}>
                        <Grid xs={3} item>
                            <FormField select required fullWidth variant='outlined' label='Billing Project' name='billingProject'>
                                {projects?.map(project => <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>)}
                            </FormField>
                        </Grid>
                        <Grid xs={3} item>
                            <FormField select required fullWidth variant='outlined' label='Delivery Project' name='deliveryProject'>
                                {projects?.map(project => <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>)}
                            </FormField>
                        </Grid>
                        <Grid xs={3} item>
                            <FormField select required fullWidth variant='outlined' label='Vendor' name='vendor'>
                                {vendors?.map(vendor => <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>)}
                            </FormField>
                        </Grid>
                        <Grid xs={3} item>
                            <FormDateField required fullWidth variant='outlined' label='Date' name='date'></FormDateField>
                        </Grid>
                        <Grid xs={3} item>
                            <FormField fullWidth variant='outlined' label='Invoice Number' name='invoiceNumber'>
                            </FormField>
                        </Grid>
                        <Grid xs={3} item>
                            <FormField fullWidth variant='outlined' label='D.C Number' name='DCNumber'>
                            </FormField>
                        </Grid>
                        <Grid xs={3} item>
                            <FormDateField required fullWidth variant='outlined' label='Invoice Date' name='invoiceDate'></FormDateField>
                        </Grid>
                        <Grid spacing={2} direction='row' alignItems='center' container item xs={12}>
                            <Grid width='100%' xs={12} item>
                                <Typography component="h4" variant="h6" align="center" gutterBottom>Items</Typography>
                            </Grid>
                            <Grid xs={12} item>
                                <TableContainer component={Paper}>
                                    <Table >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Material</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>UOM</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Total Price</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fields.map((field, index) => <TableRow key={field.id}>
                                                <TableCell width='20%'>
                                                    <FormField required size='small' fullWidth variant='outlined' label='Description' name={`items.${index}.description`}></FormField>
                                                </TableCell>
                                                <TableCell width='15%'>
                                                    <FormField required onFieldChange={() => onMaterialSelect(index)} select size='small' fullWidth variant='outlined' label='Material' name={`items.${index}.material`}>
                                                        {materials?.map(material => <MenuItem key={material.id} value={material.id}>{material.name}</MenuItem>)}
                                                    </FormField>
                                                </TableCell>
                                                <TableCell width='15%'>
                                                    <FormField disabled={!watch(`items.${index}.hasMoreTypes`)} select size='small' fullWidth variant='outlined' onFieldChange={() => onTypeSelect(index)} label='Type' name={`items.${index}.type`}>
                                                        {watch(`items.${index}.types`)?.map((type, index) => <MenuItem key={type.name} value={index}>{type.name}</MenuItem>)}
                                                    </FormField>
                                                </TableCell>
                                                <TableCell width='15%'>
                                                    <FormField required select size='small' fullWidth variant='outlined' label='UOM' name={`items.${index}.uom`}>
                                                        {UOMS?.map(uom => <MenuItem key={uom} value={uom}>{uom}</MenuItem>)}
                                                    </FormField>
                                                </TableCell>
                                                <TableCell>
                                                    <FormField required onFieldChange={debounce(() => onItemChange(index), 1000)} size='small' fullWidth type='number' variant='outlined' label='Quantity' name={`items.${index}.quantity`}></FormField>
                                                </TableCell>
                                                <TableCell>
                                                    <FormField required onFieldChange={debounce(() => onItemChange(index), 1000)} size='small' fullWidth type='number' variant='outlined' label='Price' name={`items.${index}.price`}></FormField>
                                                </TableCell>
                                                <TableCell width='10%'>
                                                    {watch(`items.${index}.totalPrice`)}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => onItemDelete(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>)}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell rowSpan={3} colSpan={1}>
                                                    <Fab sx={{ alignSelf: 'flex-start', m: 1 }} onClick={() => append({ ...emptyItem })} size="small" color="secondary" aria-label="add">
                                                        <AddIcon />
                                                    </Fab>
                                                </TableCell>
                                                <TableCell align='center' rowSpan={3} colSpan={4}>
                                                    {methods.formState.errors?.items?.type === 'min' && <FormHelperText sx={{ textAlign: 'center' }} error >{methods.formState.errors?.items.message}</FormHelperText>}
                                                </TableCell>
                                                <TableCell variant='head' >Subtotal</TableCell>
                                                <TableCell variant='head' align="left">{watch(`subTotalPrice`)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell variant='head'>Tax</TableCell>
                                                <TableCell variant='head' align="left">
                                                    <FormField onFieldChange={debounce(() => onPriceChange(), 1000)} size='small' type='number' variant='outlined' label='Tax' name='tax'></FormField>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell variant='head' >Total</TableCell>
                                                <TableCell variant='head' align="left">{watch('totalPrice')}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                        <Grid spacing={2} justifyContent='center' direction='row' alignItems='center' item container xs={12}>
                            <Grid width='100%' xs={12} item>
                                <Typography component="h4" variant="h6" align="center" gutterBottom>Attachments</Typography>
                            </Grid>
                            <Grid direction='row' justifyContent='center' pr={2} pb={2} mt={2} component={Paper} alignSelf='center' xs={6} item container spacing={2}>
                                <Button variant='outlined' component="label" endIcon={<AddIcon />}>
                                    Add
                                    <input onChange={e => onFileAdd(e)} hidden accept="*" type="file" />
                                </Button>
                                {files.map((ele) => <ListItem sx={{ width: 'fit-content' }} key={ele.id}><Chip onDelete={ele.isDeletable ? () => onFileDelete(ele.id) : undefined} label={ele.fileName} icon={<UploadFileIcon />} ></Chip> </ListItem>)}
                            </Grid>
                            <Grid item>
                                {methods.formState.errors?.invoiceAttachments?.type === 'min' && <FormHelperText sx={{ textAlign: 'center' }} error >{methods.formState.errors?.invoiceAttachments?.message}</FormHelperText>}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} textAlign='center'>
                            <Button variant='contained' type='submit'>
                                Submit
                            </Button>
                        </Grid>
                    </FormProvider>
                </Grid>
            </Grid>
            <Grid xs={1} spacing={3} direction='column' alignItems='center' container item>
                <Grid item>
                    <Fab sx={{ pr: 2 }} onClick={() => setDialogInfo({ open: true, dialog: MATERIAL })} variant="extended" size="small" color="primary" aria-label="add">
                        <AddIcon sx={{ mr: 1 }} />
                        Material
                    </Fab>
                </Grid>
                <Grid item>
                    <Fab sx={{ pr: 2 }} onClick={() => setDialogInfo({ open: true, dialog: VENDOR })} variant="extended" size="small" color="primary" aria-label="add">
                        <AddIcon sx={{ mr: 1 }} />
                        Vendor
                    </Fab>
                </Grid>
                <Grid item>
                    <Fab sx={{ pr: 2 }} onClick={() => setDialogInfo({ open: true, dialog: PROJECT })} variant="extended" size="small" color="primary" aria-label="add">
                        <AddIcon sx={{ mr: 1 }} />
                        Project
                    </Fab>
                </Grid>
            </Grid>
        </Grid>
        <Dialog open={dialogInfo.open} onClose={() => setDialogInfo({ open: false, dialog: '' })}>
            {dialogInfo.dialog === MATERIAL && <EditMaterial mode={CREATE_MODE} onSuccessfullSave={() => onSuccessfullCreation(refreshMaterials)}></EditMaterial>}
            {dialogInfo.dialog === VENDOR && <EditVendor mode={CREATE_MODE} onSuccessfullSave={() => onSuccessfullCreation(refreshVendors)}></EditVendor>}
            {dialogInfo.dialog === PROJECT && <EditProject mode={CREATE_MODE} onSuccessfullSave={() => onSuccessfullCreation(refreshProjects)}></EditProject>}
        </Dialog>
    </>

}

export const EDIT_PURCHASE_ROUTE = '/editPurchase/:id'

const MATERIAL = 'material'
const VENDOR = 'vendor'
const PROJECT = 'project'


const emptyItem = {
    description: '',
    quantity: 0,
    price: 0,
    totalPrice: 0,
    type: '',
    uom: '',
    material: '',
    types: [],
    hasMoreTypes: false
}

const emptyPurchase = {
    billingProject: '',
    deliveryProject: '',
    vendor: '',
    date: moment(),
    quantity: 0,
    subTotalPrice: 0,
    tax: 0,
    totalPrice: 0,
    invoiceNumber: '',
    DCNumber: '',
    invoiceDate: moment(),
    invoiceAttachments: [],
    items: [{
        description: '',
        totalPrice: 0,
        quantity: 0,
        price: 0,
        material: '',
        uom: '',
        type: '',
        types: [{ name: '', price: 0 }],
        hasMoreTypes: false
    }]
}
