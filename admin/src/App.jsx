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
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';

function App() {
    const { aToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);

    return aToken || dToken ? (
        <div className="bg-[#F8F9FD]">
            <Navbar></Navbar>
            <div className="flex items-start">
                <Sidebar></Sidebar>
                <Routes>
                    {/* Admin Route */}
                    <Route path="/" element={<></>}></Route>
                    <Route path="/admin-dashboard" element={<Dashboard></Dashboard>}></Route>
                    <Route path="/add-doctor" element={<AddDoctor></AddDoctor>}></Route>
                    <Route path="/all-appointments" element={<AllAppointment></AllAppointment>}></Route>
                    <Route path="/doctor-list" element={<DoctorList></DoctorList>}></Route>

                    {/* Doctor Route */}
                    <Route path="/doctor-dashboard" element={<DoctorDashboard></DoctorDashboard>}></Route>
                    <Route path="/doctor-appointments" element={<DoctorAppointments></DoctorAppointments>}></Route>
                    <Route path="/doctor-profile" element={<DoctorProfile></DoctorProfile>}></Route>
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
