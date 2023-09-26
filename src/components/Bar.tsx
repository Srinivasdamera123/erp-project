import {
    AppBar,
    Button,
    Toolbar,
    Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/user.hook";
import { LOGIN_ROUTE } from "../pages/LogIn";
import { ProfileAvatar } from "./ProfileAvatar";



export const Bar = () => {
    const navigate = useNavigate();
    const user = useUserData();
    return (
        <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} position="sticky">
            <Toolbar sx={{
                gap: "1%", xs: {
                    gap: '2%'
                }
            }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Pioneer Constructions
                </Typography>
                {user ? <ProfileAvatar showMenu /> : <Button variant="text" color="inherit" onClick={() => navigate(LOGIN_ROUTE)}>Login</Button>}
            </Toolbar>
        </AppBar>
    );
};
