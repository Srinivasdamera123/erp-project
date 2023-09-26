import { yupResolver } from "@hookform/resolvers/yup";
import { Backdrop, Button, CircularProgress, Grid, MenuItem, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { UploadResult, ref, uploadBytes } from "firebase/storage";
import moment from "moment";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import FormDateField from "../components/common/FormDateField";
import FormField from "../components/common/FormField";
import FormFileUpload from "../components/common/FormFileUpload";
import { erpStorage } from "../lib/firebase";
import { getEmployee, patchEnitity, saveEnitity, updateEnitity } from "../lib/util";
import { BloodGroups, EMPLOYEE_COLLECTION, Employee, RecruitTypes } from "../model/employee.model";
import { Genders } from "../model/vendor.model";
import { employeeSchema } from "../schema/employee.schema";
import { EMPLOYEE_LIST_ROUTE } from "./EmployeeList";

export const EditEmployee = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [fileMap] = useState(new Map<string, {
        file: any,
        isNew: boolean,
        fileName: string,
        path: string
    }>());
    const methods = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(employeeSchema),
        defaultValues: { ...emptyEmployee }
    });
    const { fields } = useFieldArray({
        name: 'references',
        control: methods.control,
    });
    const { id } = useParams();
    const onFileChange = (id: string) => {
        return (e: any) => {
            fileMap.set(id, {
                file: e.target.files[0],
                fileName: e.target.files[0].name,
                isNew: true,
                path: e.target.files[0].name
            })
        }
    }
    useEffect(() => {
        const func = async () => {
            if (id !== 'new') {
                setLoading(true)
                const employee = await getEmployee(id || '');
                methods.reset({
                    fullName: employee.fullName,
                    gender: employee.gender,
                    idProofNumber: employee.idProofNumber,
                    phone: employee.phone,
                    email: employee.email,
                    qualification: employee.qualification,
                    dateOfBirth: moment(employee.dateOfBirth?.toDate()),
                    experience: employee.experience,
                    references: employee.references,
                    bloodGroup: employee.bloodGroup,
                    employeePhoto: employee.employeePhoto.fileName,
                    resume: employee.resume.fileName,
                    idProofPhoto: employee.idProofPhoto.fileName,
                    recruitType: employee.recruitType
                })
                fileMap.set('employeePhoto', { isNew: false, fileName: employee.employeePhoto.fileName, file: {}, path: employee.employeePhoto.path })
                fileMap.set('resume', { isNew: false, fileName: employee.resume.fileName, file: {}, path: employee.resume.path })
                fileMap.set('idProofPhoto', { isNew: false, fileName: employee.idProofPhoto.fileName, file: {}, path: employee.idProofPhoto.path })
                setLoading(false)
            } else {
                methods.reset({ ...emptyEmployee })
            }
        }
        func();
    }, [id, methods])

    async function createEmployee(data: any) {
        const employee: Omit<Employee, "id"> = {
            fullName: data.fullName,
            gender: data.gender,
            idProofNumber: data.idProofNumber,
            phone: data.phone,
            email: data.email,
            qualification: data.qualification,
            dateOfBirth: Timestamp.fromDate(new Date(data.dateOfBirth)),
            recruitType: data.recruitType,
            experience: data.experience,
            references: data.references,
            bloodGroup: data.bloodGroup,
            employeePhoto: {
                fileName: '',
                path: ''
            },
            resume: {
                fileName: '',
                path: ''
            },
            idProofPhoto: {
                fileName: '',
                path: ''
            },
        };

        try {
            return await saveEnitity(EMPLOYEE_COLLECTION, employee);
        } catch (error) {
            console.error(error);
        }
    }
    async function updateEmployee(data: any) {
        const employee: Employee = {
            id: id || '',
            fullName: data.fullName,
            gender: data.gender,
            idProofNumber: data.idProofNumber,
            phone: data.phone,
            email: data.email,
            qualification: data.qualification,
            dateOfBirth: Timestamp.fromDate(new Date(data.dateOfBirth)),
            recruitType: data.recruitType,
            experience: data.experience,
            references: data.references,
            bloodGroup: data.bloodGroup,
            employeePhoto: {
                fileName: fileMap.get('employeePhoto')?.fileName || '',
                path: fileMap.get('employeePhoto')?.path || ''
            },
            resume: {
                fileName: fileMap.get('resume')?.fileName || '',
                path: fileMap.get('resume')?.path || ''
            },
            idProofPhoto: {
                fileName: fileMap.get('idProofPhoto')?.fileName || '',
                path: fileMap.get('idProofPhoto')?.path || ''
            },
        };

        try {
            return await updateEnitity(EMPLOYEE_COLLECTION, employee, id || '');
        } catch (error) {
            console.error(error);
        }
    }

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            const newId = id === 'new' ? await createEmployee(data) : await updateEmployee(data)
            var result: UploadResult | undefined;

            for (var [k, v] of fileMap) {
                if (v.isNew) {
                    const fileForUpload = ref(erpStorage, `employee/${newId}/${k}/${v.fileName}`);
                    result = await uploadBytes(fileForUpload, v.file);
                    await patchEnitity<Employee>(EMPLOYEE_COLLECTION, {
                        [k]: {
                            fileName: v.fileName,
                            path: result.metadata.fullPath
                        }
                    }, newId || '')
                }
            }

        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
        navigate(EMPLOYEE_LIST_ROUTE, { replace: true });

    }


    if (loading) {
        return <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress />
        </Backdrop>
    }
    return <Grid direction='row' container minHeight='100%'>
        <Grid p={2} xs={11} spacing={2} direction='column' alignItems='center' container item>
            <Grid item>
                <Typography component="h2" variant="h5" align="center" gutterBottom>Edit Employee</Typography>
            </Grid>
            <Grid onSubmit={methods.handleSubmit(onSubmit, (a) => { console.error(a) })} component='form' container spacing={3} direction='row' item>
                <FormProvider {...methods}>
                    <Grid item xs={6}><FormField required select fullWidth variant='outlined' label='Recruit Type' name='recruitType'>
                        {RecruitTypes.map(recruitType => <MenuItem key={recruitType} value={recruitType}>{recruitType}</MenuItem>)}
                    </FormField>
                    </Grid>
                    <Grid xs={6} item>
                        <FormDateField required fullWidth variant='outlined' label='Date of Birth' name='dateOfBirth'></FormDateField>
                    </Grid>
                    <Grid xs={6} item>
                        <FormField fullWidth required variant='outlined' label='Full Name' name='fullName'>
                        </FormField>
                    </Grid>
                    <Grid item xs={6}><FormField required select fullWidth variant='outlined' label='Gender' name='gender'>
                        {Genders.map(gender => <MenuItem key={gender} value={gender}>{gender}</MenuItem>)}
                    </FormField></Grid>
                    <Grid item xs={6}><FormField required select fullWidth variant='outlined' label='Blood Group' name='bloodGroup'>
                        {BloodGroups.map(group => <MenuItem key={group} value={group}>{group}</MenuItem>)}
                    </FormField></Grid>
                    <Grid xs={6} item>
                        <FormField required fullWidth variant='outlined' label='ID Proof Number' name='idProofNumber'>
                        </FormField>
                    </Grid>
                    <Grid xs={6} item>
                        <FormField required fullWidth variant='outlined' label='Phone Number' name='phone'>
                        </FormField>
                    </Grid>
                    <Grid xs={6} item>
                        <FormField required fullWidth variant='outlined' type='email' label='Email' name='email'>
                        </FormField>
                    </Grid>
                    <Grid xs={6} item>
                        <FormField fullWidth variant='outlined' label='Qualification' name='qualification'>
                        </FormField>
                    </Grid>
                    <Grid xs={6} item>
                        <FormField fullWidth variant='outlined' type='number' label='Experience' name='experience'>
                        </FormField>
                    </Grid>
                    <Grid xs={6} item>
                        <FormFileUpload onFieldChange={onFileChange("resume")} label='Resume' name='resume'></FormFileUpload>
                    </Grid>
                    <Grid xs={6} item>
                        <FormFileUpload onFieldChange={onFileChange("employeePhoto")} label='Employee Photo' name='employeePhoto'></FormFileUpload>
                    </Grid>
                    <Grid xs={6} item>
                        <FormFileUpload onFieldChange={onFileChange("idProofPhoto")} label='Photo ID proof' name='idProofPhoto'></FormFileUpload>
                    </Grid>
                    {fields.map((_field, index) => <>
                        <Grid xs={12} item>
                            <Typography component="h6" variant="h6" align="center" gutterBottom>{`Reference ${index + 1}`}</Typography>
                        </Grid>
                        <Grid xs={6} item>
                            <FormField fullWidth variant='outlined' label='Name' name={`references.${index}.name`}>
                            </FormField>
                        </Grid>
                        <Grid xs={6} item>
                            <FormField fullWidth variant='outlined' label='Phone' name={`references.${index}.phone`}>
                            </FormField>
                        </Grid>
                        <Grid xs={6} item>
                            <FormField fullWidth variant='outlined' label='Relation' name={`references.${index}.relation`}>
                            </FormField>
                        </Grid>
                        <Grid xs={6} item>
                        </Grid></>)}
                    <Grid item xs={12} textAlign='center'>
                        <Button variant='contained' type='submit'>
                            Submit
                        </Button>
                    </Grid>
                </FormProvider>
            </Grid>
        </Grid >
    </Grid >
}

export const EDIT_EMPLOYEE_ROUTE = '/editEmployee/:id'



const emptyEmployee = {
    fullName: '',
    gender: '',
    idProofNumber: '',
    phone: '',
    email: '',
    qualification: '',
    dateOfBirth: moment(),
    experience: 0,
    references: Array(2).fill({
        name: '',
        phone: '',
        relation: ''
    }),
    bloodGroup: '',
    employeePhoto: '',
    resume: '',
    idProofPhoto: '',
    recruitType: ''
}