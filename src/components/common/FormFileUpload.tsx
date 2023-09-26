import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, Chip, Grid, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
    onFieldChange: (e: any) => any
    name: string;
    label: string;
}

const FormFileUpload: FC<Props> = ({ name, label, onFieldChange }) => {
    const {
        control,
        formState: { errors },
        getValues
    } = useFormContext();

    const [error, setError] = useState<any>();
    const [file, setFile] = useState<{
        fileName: string,
        fileExists: boolean
    }>({ fileExists: false, fileName: '' });

    useEffect(() => {
        const value = getValues(name)
        if (value !== null && value !== '') {
            setFile({
                fileName: value,
                fileExists: true
            })
        }
    }, [])

    useEffect(() => {
        var error: any;
        if (name.indexOf('.') !== -1) {
            const keys = name.split('.');
            error = errors;
            for (var key of keys) {

                if (!error) break;

                var validatedKey: string | number = key;
                if (!Number.isNaN(parseInt(key))) {
                    validatedKey = + key;
                }
                error = error[validatedKey]
            }
        } else {
            error = errors[name];
        }
        setError(error)
    }, [errors])


    const onChange = (e: any) => {
        if (e.target.files[0]) {
            setFile({
                fileName: e.target.files[0].name,
                fileExists: true
            })
        }
        onFieldChange(e)
    }

    return (
        <Grid direction='row' alignItems='center' container xs={12}>
            <Grid xs item>
                <Typography component='label' variant='subtitle1' align="center" gutterBottom>{label}</Typography>
            </Grid>
            <Grid xs={file.fileExists ? true : 3} item>
                {file.fileExists ? <Chip onDelete={() => setFile({ fileExists: false, fileName: '' })} label={file.fileName} icon={<UploadFileIcon />} ></Chip> :
                    <Controller control={control} name={name} render={({ field }) => (
                        <Button size='small' variant='outlined' component="label" endIcon={<FileUploadIcon />}>
                            Add
                            <TextField {...field} onChange={e => {
                                field.onChange(e);
                                onChange(e);
                                onFieldChange(e);
                            }} size='small' style={{ visibility: 'hidden' }} error={!!error} helperText={error?.message?.toString()} hidden type="file" value={undefined} />
                        </Button>
                    )
                    }
                    />}

            </Grid>
        </Grid>
    );
};

export default FormFileUpload;
