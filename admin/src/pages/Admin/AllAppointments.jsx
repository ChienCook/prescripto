import React, { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

import { AdminContext } from '@/context/AdminContext';
import { AppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';

export const AllAppointment = () => {
    const { appointments, getAllAppointments, aToken, backendUrl } = useContext(AdminContext);
    const { calculateAge, standardSlotDate, currency } = useContext(AppContext);

    const cancelAppointmentHandler = async (appointmentId) => {
        try {
            const res = await axios.post(
                backendUrl + '/api/admin/cancel-appointment',
                { appointmentId },
                { headers: { aToken } },
            );
            const { data } = res;
            if (!data.success) {
                return toast.error(data.message);
            }
            getAllAppointments();
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (aToken) {
            getAllAppointments();
        }
    }, [aToken]);

    return (
        <div className="w-full max-w-6xl m-5">
            <p className="mb-3 text-lg font-medium">All Appointments</p>
            <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
                <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor</p>
                    <p>Fees</p>
                    <p>Actions</p>
                </div>
                {appointments.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-wrap justify-between items-center text-gray-500 max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b hover:bg-gray-50"
                    >
                        <p className="max-sm:hidden">{index + 1}</p>
                        <div className="flex items-center gap-2">
                            <img src={item.userData.image} alt="" className="w-10 rounded-full" />
                            <p>{item.userData.name}</p>
                        </div>
                        <p>{calculateAge(item.userData.dob)}</p>
                        <p>
                            {standardSlotDate(item.slotDate)}, {item.slotTime}
                        </p>

                        <div className="flex items-center gap-2">
                            <img src={item.doctorData.image} alt="" className="w-8 rounded-full bg-gray-200" />{' '}
                            <p>{item.doctorData.name}</p>
                        </div>
                        <p>{currency + item.doctorData.fees}</p>
                        {item.canceled && !item.payment && <p className="text-red-400 text-xs font-medium">Canceled</p>}
                        {!item.canceled && !item.payment && (
                            <img
                                src={assets.cancel_icon}
                                alt=""
                                className="w-10 cursor-pointer"
                                onClick={() => cancelAppointmentHandler(item._id)}
                            />
                        )}
                        {!item.canceled && item.payment && <p className="text-green-400 text-xs font-medium">Paid</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};
