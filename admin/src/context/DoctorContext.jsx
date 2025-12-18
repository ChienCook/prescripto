import { createContext } from 'react';

import { assets } from '@/assets/assets';

export const doctorContext = createContext();

const DoctorContextProvider = (props) => {
    const value = {};
    return <doctorContext.Provider value={value}>{props.children}</doctorContext.Provider>;
};

export default DoctorContextProvider;
