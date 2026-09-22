import {Routes , Route} from 'react-router-dom';
import HomePage from "../Pages/Auth/HomePage/HomePage.jsx"
import LoginPage from '../Pages/Auth/LoginPage/LoginPage.jsx';
import RegisterPage from '../Pages/Auth/RegisterPage/RegisterPage.jsx'
import UserDashboard from '../Pages/User/userDashBoard/userDashBoard.jsx';
import TaskPage from '../Pages/User/TaskPage/TaskPage.jsx';
import ProfilePage from '../Pages/ProfilePage/ProfilePage.jsx';
import AdminPage from '../Pages/Admin/AdminPage/AdminPage.jsx';
import AdminManageUser from "../Pages/Admin/AdminManageUser/AdminManageUser.jsx"
import AdminTasksPage from '../Pages/Admin/AdminTasksPage/AdminTasksPAge.jsx';

const AppRoutes = ()=> {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />

            <Route path="/dashboard" element={<UserDashboard/>} />
            <Route path="/tasks" element={<TaskPage/>} />
            <Route path="/profile" element={<ProfilePage/>} />

            <Route path="/admin" element={<AdminPage/>} />
            <Route path="/admin/users" element={<AdminManageUser/>} />
            <Route path="/admin/tasks" element={<AdminTasksPage/>} />
        </Routes>
    )
}

export default AppRoutes;