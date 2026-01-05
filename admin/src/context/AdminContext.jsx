import { createContext, useState } from 'react';
import { toast } from 'sonner';

import axios from 'axios';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState();
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    const getAllDoctors = async () => {
        try {
            const res = await axios.post(
                backendUrl + '/api/admin/all-doctors',
                {},
                {
                    headers: {
                        aToken,
                    },
                },
            );
            const { data } = res;
            setDoctors(data.doctors);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const changeAvailability = async (docId) => {
        try {
            const res = await axios.post(
                backendUrl + '/api/admin/change-availability',
                { docId },
                {
                    headers: {
                        aToken,
                    },
                },
            );
            const { data } = res;
            if (data.success) {
                getAllDoctors();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAllAppointments = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/admin/appointments', {
                headers: {
                    aToken,
                },
            });
            const { data } = res;
            if (!data.success) {
                return toast.error(data.message);
            }
            setAppointments(data.appointments.reverse());
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getDashData = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } });
            const { data } = res;
            if (!data.success) {
                toast.error(data.message);
            }
            setDashData(data.dashData);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const value = {
        aToken,
        setAToken,
        backendUrl,
        getAllDoctors,
        doctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        dashData,
        getDashData,
    };

    return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;
