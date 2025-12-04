import React from 'react';
import { NavLink } from 'react-router-dom';

import { assets } from '@/assets/assets';

const Navbar = () => {
    return (
        <div className="flex items-center justify-between py-4 mb-5 border-b border-gray-400">
            <img src={assets.logo} alt="Prescripto" className="w-44 cursor-pointer" />
            <ul className="hidden md:flex gap-5 font-medium items-start">
                <NavLink to="/">
                    <li className="py-1">HOME</li>
                    <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-primary hidden" />
                </NavLink>
                <NavLink to="/doctors">
                    <li className="py-1">All DOCTORS</li>
                    <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-primary hidden" />
                </NavLink>
                <NavLink to="/about">
                    <li className="py-1">ABOUT</li>
                    <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-primary hidden" />
                </NavLink>
                <NavLink to="/contact">
                    <li className="py-1">CONTACT</li>
                    <hr className="border-none outline-none h-0.5 w-3/5 m-auto bg-primary hidden" />
                </NavLink>
            </ul>
            <div>
                <button>Create account</button>
            </div>
        </div>
    );
};

export default Navbar;
