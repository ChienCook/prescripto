import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import { AdminContext } from '@/context/AdminContext';
import { assets } from '@/assets/assets';
import { AppContext } from '@/context/AppContext';
import ConfirmPopup from '@/components/ConfirmPopup';

const Dashboard = () => {
    const { aToken, getDashData, dashData, backendUrl } = useContext(AdminContext);
    const { standardSlotDate } = useContext(AppContext);

    const [isOpen, setIsOpen] = useState(false);
    const [currentAppointmentId, setCurrentAppointmentId] = useState(false);
    const cancelAppointment = async (appointmentId) => {
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
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const cancelAppointmentDashboardHandler = async (appointmentId) => {
        await cancelAppointment(appointmentId);
        getDashData();
    };

    useEffect(() => {
        if (aToken) {
            getDashData();
        }
    }, [aToken]);

    return (
        dashData && (
            <div className="m-5">
                <div className="flex gap-3 flex-wrap">
                    <div className="flex gap-2 items-center bg-white p-4 min-w-52 border-gray-200 cursor-pointer hover:scale-105 transition-all">
                        <img src={assets.doctor_icon} alt="" className="w-14" />
                        <div>
                            <p className="text-xl font-medium text-gray-600">{dashData.doctors}</p>
                            <p className="text-gray-400">Doctors</p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center bg-white p-4 min-w-52 border-gray-200 cursor-pointer hover:scale-105 transition-all">
                        <img src={assets.appointments_icon} alt="" className="w-14" />
                        <div>
                            <p className="text-xl font-medium text-gray-600">{dashData.appointments}</p>
                            <p className="text-gray-400">Appointments</p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center bg-white p-4 min-w-52 border-gray-200 cursor-pointer hover:scale-105 transition-all">
                        <img src={assets.patients_icon} alt="" className="w-14" />
                        <div>
                            <p className="text-xl font-medium text-gray-600">{dashData.patients}</p>
                            <p className="text-gray-400">Patients</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white">
                    <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
                        <img src={assets.list_icon} alt="" />
                        <p className="font-semibold">Latest Appointments</p>
                    </div>
                    <div className="border border-t-0">
                        {dashData.latestAppointments.map((item) => (
                            <div key={item._id} className="flex px-6 py-3 gap-3 items-center hover:bg-gray-100">
                                <img src={item.userData.image} alt="" className="w-10 rounded-full" />
                                <div className="flex-1 text-sm">
                                    <p className="text-lg font-medium text-gray-800">{item.userData.name}</p>
                                    <p className="text-gray-600">Booking on {standardSlotDate(item.slotDate)}</p>
                                </div>
                                {item.status === 'canceled' && item.payment === 'unpaid' && (
                                    <p className="text-red-400 text-xs font-medium">Canceled by Patient</p>
                                )}
                                {item.status === 'pending' && item.payment === 'unpaid' && (
                                    <img
                                        src={assets.cancel_icon}
                                        alt=""
                                        className="w-10 cursor-pointer"
                                        onClick={() => {
                                            setIsOpen(true);
                                            setCurrentAppointmentId(item._id);
                                        }}
                                    />
                                )}
                                {item.status === 'pending' && item.payment === 'paid' && (
                                    <p className="text-green-400 text-xs font-medium">Paid</p>
                                )}
                                {item.status === 'completed' && item.payment === 'paid' && (
                                    <p className="text-green-500 text-xs font-medium">Completed</p>
                                )}
                                {item.status === 'canceledByDoctor' && (
                                    <p className="text-yellow-400 text-xs font-medium">Declined by Doctor</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <ConfirmPopup
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onConfirm={() => {
                        cancelAppointmentDashboardHandler(currentAppointmentId);
                        setIsOpen(false);
                    }}
                    type="appointment"
                ></ConfirmPopup>
            </div>
        )
    );
};

export default Dashboard;
