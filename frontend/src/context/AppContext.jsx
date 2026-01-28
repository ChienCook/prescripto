import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || false);
    const [userData, setUserData] = useState(false);

    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const adminUrl = import.meta.env.VITE_ADMIN_URL;

    const getDoctorsData = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/doctor/list');
            const { data } = res;
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const loadUserProfileData = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: {
                    token,
                },
            });
            const { data } = res;
            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(false);
        }
    }, [token]);

    const value = {
        doctors,
        getDoctorsData,
        currencySymbol,
        backendUrl,
        setToken,
        token,
        userData,
        setUserData,
        loadUserProfileData,
        adminUrl,
    };

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
