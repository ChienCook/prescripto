import { createContext, useState } from 'react';
import { toast } from 'react-toastify';

import axios from 'axios';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState();

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
            console.log(data.doctors);
            setDoctors(data.doctors);
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
    };

    return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;
