import { Backdrop, CircularProgress } from "@mui/material";
import { ReactNode } from "react";
import { UserContext } from "../context/user.context";
import { useAuth } from "../hooks/auth.hook";


type Props = {
    children: ReactNode
}

export const UserContextProvider = ({ children }: Props) => {
    const [loading, user] = useAuth();
    return (
        <UserContext.Provider value={user}>
            <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress />
            </Backdrop>
            {(!loading) && children}
        </UserContext.Provider>
    )
}