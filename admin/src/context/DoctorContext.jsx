import axios from 'axios';
import { createContext, useState } from 'react';
import { toast } from 'sonner';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [appointments, setAppointments] = useState([]);
    const [profile, setProfile] = useState(false);

    const getAppointments = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } });
            const { data } = res;
            if (!data.success) {
                return toast.error(data.message + ' here');
            }
            setAppointments(data.appointments.reverse());
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            const res = await axios.post(
                backendUrl + '/api/doctor/complete-appointment',
                { appointmentId },
                { headers: { dToken } },
            );
            const { data } = res;
            if (!data.success) {
                toast.error(data.message);
            }
            getAppointments();
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const res = await axios.post(
                backendUrl + '/api/doctor/cancel-appointment',
                { appointmentId },
                { headers: { dToken } },
            );
            const { data } = res;
            if (!data.success) {
                toast.error(data.message);
            }
            getAppointments();
            toast.error(data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getProfile = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } });
            const { data } = res;
            if (!data.success) {
                return toast.error(data.message);
            }
            setProfile(data.doctorData);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const value = {
        dToken,
        setDToken,
        getAppointments,
        setAppointments,
        appointments,
        backendUrl,
        cancelAppointment,
        completeAppointment,
        getProfile,
        setProfile,
        profile,
    };
    return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;
