import { Route, Routes } from "react-router-dom";
import { WithAuth } from "./guard/auth.guard";
import { CONTRACTOR_LIST_ROUTE, ContractorList } from "./pages/ContractorList";
import { EDIT_EMPLOYEE_ROUTE, EditEmployee } from "./pages/EditEmployee";
import { EDIT_PURCHASE_ROUTE, EditPurchase } from "./pages/EditPurchase";
import { EMPLOYEE_LIST_ROUTE, EmployeeList } from "./pages/EmployeeList";
import { HOME_ROUTE, Home } from "./pages/Home";
import { LOGIN_ROUTE, LogIn } from "./pages/LogIn";
import { MATERIAL_LIST_ROUTE, MaterialList } from "./pages/MaterialList";
import { PROJECT_LIST_ROUTE, ProjectList } from "./pages/ProjectList";
import { PURCHASE_LIST_ROUTE, PurchaseList } from "./pages/PurchaseList";
import { VENDOR_LIST_ROUTE, VendorList } from "./pages/VendorList";


const AppRoutes = () => {
    return <Routes>
        <Route path={HOME_ROUTE} element={<Home />}></Route>
        <Route path={LOGIN_ROUTE} element={<LogIn />}></Route>
        <Route path={EDIT_PURCHASE_ROUTE} element={<WithAuth><EditPurchase /></WithAuth>} ></Route>
        <Route path={PURCHASE_LIST_ROUTE} element={<WithAuth><PurchaseList /></WithAuth>} ></Route>
        <Route path={MATERIAL_LIST_ROUTE} element={<WithAuth><MaterialList /></WithAuth>} ></Route>
        <Route path={CONTRACTOR_LIST_ROUTE} element={<WithAuth><ContractorList /></WithAuth>} ></Route>
        <Route path={VENDOR_LIST_ROUTE} element={<WithAuth><VendorList /></WithAuth>} ></Route>
        <Route path={PROJECT_LIST_ROUTE} element={<WithAuth><ProjectList /></WithAuth>} ></Route>
        <Route path={EMPLOYEE_LIST_ROUTE} element={<WithAuth><EmployeeList /></WithAuth>} ></Route>
        <Route path={EDIT_EMPLOYEE_ROUTE} element={<WithAuth><EditEmployee /></WithAuth>} ></Route>
    </Routes>
}


export default AppRoutes