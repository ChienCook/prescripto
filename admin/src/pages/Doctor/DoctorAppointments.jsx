import { useContext, useEffect } from 'react';

import { DoctorContext } from '@/context/DoctorContext';
import { AppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';
const DoctorAppointments = () => {
    const { appointments, cancelAppointment, completeAppointment, dToken, getAppointments } = useContext(DoctorContext);
    const { calculateAge, standardSlotDate, currency } = useContext(AppContext);

    useEffect(() => {
        if (dToken) {
            getAppointments();
        }
    }, [dToken]);

    return (
        appointments && (
            <div className="m-5 w-full max-w-6xl">
                <p className="mb-3 text-lg font-medium">All Appointment ({appointments.length})</p>
                <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
                    <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
                        <p>#</p>
                        <p>Paitent</p>
                        <p>Payment</p>
                        <p>Age</p>
                        <p>Date & Time</p>
                        <p>Fees</p>
                        <p>Action</p>
                    </div>

                    {appointments.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 px-6 py-3 border-b hover:bg-gray-50"
                        >
                            <p className="max-sm:hidden">{index + 1}</p>
                            <div className="flex items-center gap-2">
                                <img src={item.userData.image} alt="" className="w-10 rounded-full" />
                                <p>{item.userData.name}</p>
                            </div>
                            <div>
                                {item.payment === 'unpaid' ? (
                                    <p className="text-xs inline border border-primary px-2 rounded-full text-yellow-500">
                                        Unpaid
                                    </p>
                                ) : item.payment === 'paid' ? (
                                    <p className="text-xs inline border border-primary px-2 rounded-full text-green-500">
                                        Online Paid
                                    </p>
                                ) : (
                                    <p className="text-xs inline border border-primary px-2 rounded-full text-red-400">
                                        Refunded
                                    </p>
                                )}
                            </div>
                            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
                            <p>
                                {standardSlotDate(item.slotDate)}, {item.slotTime}
                            </p>
                            <p>{currency + item.doctorData.fees}</p>
                            <div className="flex gap-1">
                                {item.status === 'pending' && (
                                    <>
                                        <img
                                            onClick={() => cancelAppointment(item._id)}
                                            src={assets.cancel_icon}
                                            alt=""
                                            className="w-10 cursor-pointer"
                                        />
                                        <img
                                            onClick={() => completeAppointment(item._id)}
                                            src={assets.tick_icon}
                                            alt=""
                                            className="w-10 cursor-pointer"
                                        />
                                    </>
                                )}
                                {item.status === 'canceled' && item.payment === 'unpaid' && (
                                    <p className="text-red-400 text-xs font-medium">Canceled by Patient</p>
                                )}
                                {item.status === 'completed' && (
                                    <p className="text-green-500 text-xs font-medium">Completed</p>
                                )}
                                {item.status === 'canceledByDoctor' && (
                                    <p className="text-yellow-400 text-xs font-medium">Declined by Doctor</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    );
};

export default DoctorAppointments;
