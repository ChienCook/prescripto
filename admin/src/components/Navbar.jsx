import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';

import { assets } from '@/assets/assets';
import { AdminContext } from '@/context/AdminContext';

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext);

    const navigate = useNavigate();

    const Logout = () => {
        if (aToken) {
            navigate('/');
            localStorage.removeItem('aToken');
            setAToken(false);
        }
    };
    return (
        <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
            <div className="flex items-center gap-2 text-xs">
                <img onClick={() => navigate('/')} className="w-36 cursor-pointer" src={assets.admin_logo} alt="" />
                <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
                    {aToken ? 'Admin' : 'Doctor'}
                </p>
            </div>
            <button onClick={Logout} className="bg-primary text-white text-sm px-10 py-2 rounded-full">
                Logout
            </button>
        </div>
    );
};

export default Navbar;
