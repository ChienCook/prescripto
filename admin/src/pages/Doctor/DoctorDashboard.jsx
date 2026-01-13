import { toast } from 'sonner';
import { useEffect, useContext, useMemo, useState } from 'react';

import { DoctorContext } from '@/context/DoctorContext';
import { assets } from '@/assets/assets';
import { AppContext } from '@/context/AppContext';
import ConfirmPopup from '@/components/ConfirmPopup';

function DoctorDashboard() {
    const { dToken, setDToken, getAppointments, appointments, cancelAppointment } = useContext(DoctorContext);
    const { currency, standardSlotDate } = useContext(AppContext);

    const [isOpen, setIsOpen] = useState(false);
    const [currentAppointmentId, setCurrentAppointmentId] = useState(false);

    useEffect(() => {
        if (dToken) {
            getAppointments();
        } else {
            setDToken(false);
        }
    }, [dToken]);

    const getDashData = useMemo(() => {
        try {
            let patiens = [];
            let earning = 0;
            if (!appointments) return;
            appointments.forEach((item) => {
                if (!patiens.includes(item.userData.name)) {
                    patiens.push(item.userData.name);
                }
                if (item.status === 'completed') {
                    earning += item.amount;
                }
            });
            return {
                patiens: patiens.length,
                earning,
                appointments: appointments.slice(0, 5),
            };
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }, [appointments]);

    const cancelAppointmentDashboardHandler = async (appointmentId) => {
        await cancelAppointment(appointmentId);
        getAppointments();
    };

    return (
        appointments && (
            <div className="m-5 ">
                <div className="flex flex-wrap gap-3">
                    <div className="bg-white flex items-center justify-center gap-2 min-w-52 p-4 border rounded-md border-gray-200  text-gray-400 cursor-pointer hover:scale-105 transition-all">
                        <img src={assets.earning_icon} alt="" className="w-14" />
                        <div>
                            <p className="text-xl font-medium text-gray-600">{currency + getDashData.earning}</p>
                            <p>Earning</p>
                        </div>
                    </div>
                    <div className="bg-white flex items-center justify-center gap-2 min-w-52 p-4 border rounded-md border-gray-200  text-gray-400 cursor-pointer hover:scale-105 transition-all">
                        <img src={assets.appointments_icon} alt="" className="w-14" />
                        <div>
                            <p className="text-xl font-medium text-gray-600">{getDashData.appointments.length}</p>
                            <p>Appointments</p>
                        </div>
                    </div>
                    <div className="bg-white flex items-center justify-center gap-2 min-w-52 p-4 border rounded-md border-gray-200  text-gray-400 cursor-pointer hover:scale-105 transition-all">
                        <img src={assets.patients_icon} alt="" className="w-14" />
                        <div>
                            <p className="text-xl font-medium text-gray-600">{getDashData.patiens}</p>
                            <p>Patients</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white">
                    <div className="flex gap-2.5 items-center p-4 mt-10 rounded-t border">
                        <img src={assets.list_icon} alt="" />
                        <p className="font-semibold">Latest Appointments</p>
                    </div>
                    <div className="border  border-t-0">
                        {getDashData.appointments.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 py-3 px-6 hover:bg-gray-100">
                                <img src={item.userData.image} alt="" className="w-10 rounded-full" />
                                <div className="flex-1 text-sm">
                                    <p className="text-lg font-medium text-gray-800">{item.userData.name}</p>
                                    <p className="text-gray-600">
                                        Booking on {item.slotTime + ', ' + standardSlotDate(item.slotDate)}
                                    </p>
                                </div>
                                {item.status === 'pending' && (
                                    <img
                                        onClick={() => {
                                            setIsOpen(true);
                                            setCurrentAppointmentId(item._id);
                                        }}
                                        src={assets.cancel_icon}
                                        alt=""
                                        className="w-10 cursor-pointer"
                                    />
                                )}
                                {item.status === 'canceled' && item && item.payment === 'unpaid' && (
                                    <p className="text-red-400 font-medium text-xs">Canceled by Patient</p>
                                )}
                                {item.status === 'completed' && (
                                    <p className="text-green-500 font-medium text-xs">Completed</p>
                                )}
                                {item.status === 'canceledByDoctor' && (
                                    <p className="text-yellow-400 font-medium text-xs">Declined by Doctor</p>
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
}

export default DoctorDashboard;
