import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserData } from "../hooks/user.hook";
import { HOME_ROUTE } from "../pages/Home";



type Props = {
    children: ReactNode,
    redirect?: boolean
}
export const WithoutAuth = ({ children, redirect }: Props) => {
    const user = useUserData();
    if (user && redirect) {
        return <Navigate to={HOME_ROUTE}></Navigate>
    }
    return <>
        {(!user) ? children : <></>}
    </>
}