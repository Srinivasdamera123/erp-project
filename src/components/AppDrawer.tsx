import AddIcon from '@mui/icons-material/Add';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupsIcon from '@mui/icons-material/Groups';
import ListIcon from '@mui/icons-material/List';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import WorkIcon from '@mui/icons-material/Work';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { CONTRACTOR_LIST_ROUTE } from '../pages/ContractorList';
import { EDIT_EMPLOYEE_ROUTE } from '../pages/EditEmployee';
import { EDIT_PURCHASE_ROUTE } from '../pages/EditPurchase';
import { EMPLOYEE_LIST_ROUTE } from '../pages/EmployeeList';
import { MATERIAL_LIST_ROUTE } from '../pages/MaterialList';
import { PROJECT_LIST_ROUTE } from '../pages/ProjectList';
import { PURCHASE_LIST_ROUTE } from '../pages/PurchaseList';
import { VENDOR_LIST_ROUTE } from '../pages/VendorList';
export const AppDrawer = () => {
    const navigate = useNavigate();
    return <Drawer
        variant="permanent"
        anchor="left"
        sx={{
            width: '15%',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: '15%',
                boxSizing: 'border-box',
            },
        }}
    >
        <Toolbar />
        <Divider />
        <List >
            <ListItem key='Purchase' disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <StoreIcon />
                    </ListItemIcon>
                    <ListItemText primary='Purchase' />
                </ListItemButton>
            </ListItem>
            <Divider />
            <List sx={{ pl: 3 }} >
                <ListItem onClick={() => navigate(PURCHASE_LIST_ROUTE)} key='Purchases' disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ListIcon />
                        </ListItemIcon>
                        <ListItemText primary='Purchase List' />
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={() => navigate(EDIT_PURCHASE_ROUTE.replace(':id', 'new'))} key='New Purchase' disablePadding>
                    <ListItemButton>
                        <ListItemIcon >
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary='New Purchase' />
                    </ListItemButton>
                </ListItem>
            </List>
            <ListItem key='Employee' disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <BadgeIcon />
                    </ListItemIcon>
                    <ListItemText primary='Employee' />
                </ListItemButton>
            </ListItem>
            <Divider />
            <List sx={{ pl: 3 }} >
                <ListItem onClick={() => navigate(EMPLOYEE_LIST_ROUTE)} key='Employees' disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ListIcon />
                        </ListItemIcon>
                        <ListItemText primary='Employee List' />
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={() => navigate(EDIT_EMPLOYEE_ROUTE.replace(':id', 'new'))} key='New Purchase' disablePadding>
                    <ListItemButton>
                        <ListItemIcon >
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary='New Employee' />
                    </ListItemButton>
                </ListItem>
            </List>
            <ListItem key='List' disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary='List' />
                </ListItemButton>
            </ListItem>
            <Divider />
            <List sx={{ pl: 3 }} >
                <ListItem onClick={() => navigate(MATERIAL_LIST_ROUTE)} key='Materials' disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <LocalMallIcon />
                        </ListItemIcon>
                        <ListItemText primary='Material' />
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={() => navigate(CONTRACTOR_LIST_ROUTE)} key='Contractor' disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary='Contractor' />
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={() => navigate(VENDOR_LIST_ROUTE)} key='Vendor' disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <GroupsIcon />
                        </ListItemIcon>
                        <ListItemText primary='Vendor' />
                    </ListItemButton>
                </ListItem>
                <ListItem onClick={() => navigate(PROJECT_LIST_ROUTE)} key='Project' disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <WorkIcon />
                        </ListItemIcon>
                        <ListItemText primary='Project' />
                    </ListItemButton>
                </ListItem>
            </List>
        </List>
    </Drawer>
}