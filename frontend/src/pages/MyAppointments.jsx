import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

import { AppContext } from '@/context/AppContext';

const MyAppointments = () => {
    const { token, backendUrl } = useContext(AppContext);
    const [appointmentsData, setAppointmentsData] = useState([]);
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const getUserAppointments = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/user/get-appointments', { headers: { token } });
            const { data } = res;
            if (!data.success) {
                return toast.error(data.message);
            }
            setAppointmentsData(
                data.appointments.map((item) => {
                    return {
                        doctorData: item.doctorData,
                        date: item.slotDate.split('_')[0],
                        month: monthsOfYear[Number.parseInt(item.slotDate.split('_')[1]) - 1],
                        year: item.slotDate.split('_')[2],
                        time: item.slotTime,
                    };
                }),
            );
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    return (
        appointmentsData && (
            <div>
                <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
                <div>
                    {appointmentsData.map((item, index) => (
                        <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b">
                            <div>
                                <img className="w-32 bg-indigo-50" src={item.doctorData.image} alt="" />
                            </div>
                            <div className="flex-1 text-sm text-zinc-600">
                                <p className="text-neutral-800 font-semibold">{item.doctorData.name}</p>
                                <p>{item.doctorData.speciality}</p>
                                <p className="text-zinc-700 font-medium mt-1">Address: </p>
                                <p className="text-xs">{item.doctorData.address.line1}</p>
                                <p className="text-xs mt-1">{item.doctorData.address.line2}</p>
                                <p className="text-xs mt-1">
                                    <span className="text-sm text-neutral-700 font-medium">Date & Time: </span>
                                    {item.date}, {item.month}, {item.year} | {item.time}
                                </p>
                            </div>
                            {/* this below div is added to make component reponsive */}
                            <div></div>
                            <div className="flex flex-col gap-2 justify-end">
                                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                                    Pay Online
                                </button>
                                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">
                                    Cancle appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    );
};

export default MyAppointments;
