import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton } from "@mui/material";
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { erpStorage } from '../../lib/firebase';

type DownloadIconProps = {
    path: string;
}

export const DownloadIcon = ({ path }: DownloadIconProps) => {

    const [downloadUrl, setDownloadUrl] = useState<string>('');

    useEffect(() => {
        getDownloadURL(ref(erpStorage, path)).then(setDownloadUrl)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <IconButton target="_blank" href={downloadUrl || ''} download={path}>
        <FileDownloadIcon></FileDownloadIcon>
    </IconButton>
}