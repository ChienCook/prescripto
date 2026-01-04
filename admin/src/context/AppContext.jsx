import { createContext } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currency = '$';
    const calculateAge = (dob) => {
        // dob: 2002-01-01
        const currentYear = Number(new Date().getFullYear().toString());
        const result = currentYear - Number(dob.split('-')[0]);
        if (isNaN(result)) {
            return 'unknow';
        }
        return result;
    };

    const standardSlotDate = (slotDate) => {
        // slotDate: 2_1_2026
        const splitedSlotDate = slotDate.split('_');
        let date = splitedSlotDate[0];
        switch (date) {
            case '1':
                date += 'st';
                break;
            case '2':
                date += 'nd';
                break;
            case '3':
                date += 'rd';
                break;
            default:
                date += 'th';
        }
        const stringMonth = monthsOfYear[Number(splitedSlotDate[1]) - 1];
        const result = `${date} ${stringMonth}, ${splitedSlotDate[2]}`;
        return result;
    };

    const value = {
        calculateAge,
        standardSlotDate,
        currency,
    };
    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
