import { useContext } from 'react';

import { AdminContext } from './context/AdminContext';
import Login from '@/pages/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AddDoctor from './pages/Admin/AddDoctor';
import { AllAppointment } from './pages/Admin/AllAppointments';
import DoctorList from './pages/Admin/DoctorList';

function App() {
    const { aToken } = useContext(AdminContext);

    return aToken ? (
        <div className="bg-[#F8F9FD]">
            <Navbar></Navbar>
            <div className="flex items-start">
                <Sidebar></Sidebar>
                <Routes>
                    <Route path="/" element={<></>}></Route>
                    <Route path="/admin-dashboard" element={<Dashboard></Dashboard>}></Route>
                    <Route path="/add-doctor" element={<AddDoctor></AddDoctor>}></Route>
                    <Route path="/all-appointments" element={<AllAppointment></AllAppointment>}></Route>
                    <Route path="/doctor-list" element={<DoctorList></DoctorList>}></Route>
                </Routes>
            </div>
        </div>
    ) : (
        <div>
            <Login></Login>
        </div>
    );
}

export default App;
