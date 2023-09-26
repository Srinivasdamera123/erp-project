import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from "@mui/icons-material/Lock";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { WithoutAuth } from '../guard/no-auth.guard';
import { erpFirebaseAuth } from "../lib/firebase";
import { HOME_ROUTE } from './Home';


export const LogIn = () => {

    const navigate = useNavigate()

    const login = async () => {
        await signInWithPopup(getAuth(), new GoogleAuthProvider())
        if (erpFirebaseAuth.currentUser) {
            navigate(HOME_ROUTE)
        }
    }

    return <WithoutAuth redirect>
        <Box component='form' pt={10} flexDirection='column' alignItems='center' display='flex' flexGrow={1} >
            <Stack width='30%' direction='column' spacing={3} alignItems='center'>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Button onClick={login} variant="contained" endIcon={<GoogleIcon />}>
                    Login with Google
                </Button>
            </Stack>
        </Box >
    </WithoutAuth>
}

export const LOGIN_ROUTE = '/logIn'

