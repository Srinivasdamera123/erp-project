import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid, MenuItem } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormField from "../components/common/FormField";
import { CREATE_MODE, EDIT_MODE, MODE, getVendor, saveEnitity, updateEnitity } from "../lib/util";
import { Genders, VENDOR_COLLECTION, Vendor } from "../model/vendor.model";
import { vendorSchema } from "../schema/vendor.schema";


type EditVendorProps = {
    onSuccessfullSave: () => any;
    mode: MODE,
    id?: string;
}

export const EditVendor = ({ onSuccessfullSave, mode, id }: EditVendorProps) => {
    const methods = useForm({
        resolver: yupResolver(vendorSchema),
        defaultValues: {
            name: '',
            shortName: '',
            address: '',
            contactPerson: '',
            contactPersonPhone: '',
            contactPersonEmail: '',
            contactPersonGender: '',
            vendorGST: '',
        }
    })
    useEffect(() => {
        const func = async () => {
            if (mode === EDIT_MODE) {
                const vendor = await getVendor(id || '');
                methods.reset({
                    ...vendor
                })
            }
        }
        func();
    }, [id, methods, mode])


    const createVendor = async (data: any) => {
        const vendor: Omit<Vendor, "id"> = {
            name: data.name,
            shortName: data.shortName,
            address: data.address,
            contactPerson: data.contactPerson,
            contactPersonPhone: data.contactPersonPhone,
            contactPersonEmail: data.contactPersonEmail,
            contactPersonGender: data.contactPersonGender,
            vendorGST: data.vendorGST,
        }

        try {
            await saveEnitity(VENDOR_COLLECTION, vendor)
            onSuccessfullSave()

        } catch (error) {
            console.error(error)
        }
    }
    const updateVendor = async (data: any) => {
        const vendor: Vendor = {
            name: data.name,
            shortName: data.shortName,
            address: data.address,
            contactPerson: data.contactPerson,
            contactPersonPhone: data.contactPersonPhone,
            contactPersonEmail: data.contactPersonEmail,
            contactPersonGender: data.contactPersonGender,
            vendorGST: data.vendorGST,
            id: id || ''
        }

        try {
            await updateEnitity(VENDOR_COLLECTION, vendor, vendor.id)
            onSuccessfullSave()

        } catch (error) {
            console.error(error)
        }
    }


    const onSubmit = async (data: any) => {
        mode === CREATE_MODE ? createVendor(data) : updateVendor(data)
    }

    const onError = (data: any) => console.error(data);
    return <FormProvider {...methods}>
        <Box component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <DialogTitle>New Vendor</DialogTitle>
            <DialogContent>
                <Grid spacing={2} mt={1} container>
                    <Grid item xs={6}><FormField required fullWidth variant='outlined' label='Name' name='name'></FormField></Grid>
                    <Grid item xs={6}><FormField fullWidth variant='outlined' label='Short name' name='shortName'></FormField></Grid>
                    <Grid item xs={6}><FormField fullWidth variant='outlined' label='Contact person' name='contactPerson'></FormField></Grid>
                    <Grid item xs={6}><FormField fullWidth variant='outlined' label='Phone' name='contactPersonPhone'></FormField></Grid>
                    <Grid item xs={6}><FormField type='email' fullWidth variant='outlined' label='Email' name='contactPersonEmail'></FormField></Grid>
                    <Grid item xs={6}><FormField select fullWidth variant='outlined' label='Gender' name='contactPersonGender'>
                        {Genders.map(gender => <MenuItem key={gender} value={gender}>{gender}</MenuItem>)}
                    </FormField></Grid>
                    <Grid item xs={6}><FormField multiline rows={4} fullWidth variant='outlined' label='Address' name='address'></FormField></Grid>
                    <Grid item xs={6}><FormField fullWidth variant='outlined' label='GST' name='vendorGST'></FormField></Grid>
                </Grid>
            </DialogContent>
            <DialogActions><Button type='submit'>Submit</Button></DialogActions>
        </Box>
    </FormProvider>
}