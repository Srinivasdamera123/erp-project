import { Avatar, Menu, MenuItem } from "@mui/material"
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state"
import { useUserData } from "../hooks/user.hook"
import { erpFirebaseAuth } from "../lib/firebase"


type Props = {
    showMenu?: boolean
}

export const ProfileAvatar = ({ showMenu }: Props) => {
    const logout = async () => {
        await erpFirebaseAuth.signOut()
    }
    const user = useUserData()
    return <PopupState variant="popover" popupId="profile-avatar">
        {(state) => <>
            <Avatar src={user?.photoUrl || ''} {...bindTrigger(state)} ></Avatar>
            {showMenu && <Menu {...bindMenu(state)}>
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>}
        </>}
    </PopupState>
}