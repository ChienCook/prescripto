import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

import { usePayOS } from '@payos/payos-checkout';
import { AppContext } from '@/context/AppContext';
import ConfirmPopup from '@/components/ConfirmPopup';

const MyAppointments = () => {
    const { token, backendUrl, getDoctorsData } = useContext(AppContext);
    const [appointmentsData, setAppointmentsData] = useState([]);
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const [isOpen, setIsOpen] = useState(false);
    const [currentAppointmentId, setCurrentAppointmentId] = useState(false);
    const [popupType, setPopupType] = useState('');

    const getUserAppointments = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/user/get-appointments', { headers: { token } });
            const { data } = res;
            if (!data.success) {
                return toast.error(data.message);
            }
            setAppointmentsData(
                data.appointments
                    .map((item) => {
                        return {
                            ...item,
                            doctorData: item.doctorData,
                            date: item.slotDate.split('_')[0],
                            month: monthsOfYear[Number.parseInt(item.slotDate.split('_')[1]) - 1],
                            year: item.slotDate.split('_')[2],
                            time: item.slotTime,
                        };
                    })
                    .reverse(),
            );
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    const cancelAppointmentHandle = async (appointmentId) => {
        try {
            const res = await axios.post(
                backendUrl + '/api/user/cancel-appointment',
                { appointmentId },
                { headers: { token } },
            );
            const { data } = res;
            if (!data.success) {
                return toast.error(data.message);
            }
            getUserAppointments();
            getDoctorsData();
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const [payOSConfig, setPayOSConfig] = useState({
        RETURN_URL: window.location.origin,
        ELEMENT_ID: 'payos-checkout-iframe',
        CHECKOUT_URL: null,
        onSuccess: (event) => {
            setPayOSConfig((oldConfig) => ({ ...oldConfig, CHECKOUT_URL: null }));
            getUserAppointments();
            toast.success('Payment successfully');
        },
        onCancel: (event) => {
            toast.warning('Payment canceled');
            setPayOSConfig((oldConfig) => ({ ...oldConfig, CHECKOUT_URL: null }));
        },
        onExit: (event) => {
            toast.warning('Payment exited');
        },
    });
    const { open } = usePayOS(payOSConfig);

    const createPayment = async (appointmentId) => {
        try {
            const res = await axios.post(
                backendUrl + '/api/payment/create-payment',
                { appointmentId },
                { headers: { token } },
            );

            const { data } = res;
            if (!data.success) {
                return toast.error(data.message);
            }
            setPayOSConfig((oldConfig) => ({ ...oldConfig, CHECKOUT_URL: data.checkoutUrl }));
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            getUserAppointments();
        } else {
            setAppointmentsData(false);
        }
    }, [token]);

    useEffect(() => {
        if (token && payOSConfig.CHECKOUT_URL) {
            open();
        }
    }, [token, payOSConfig.CHECKOUT_URL]);

    return (
        appointmentsData && (
            <div>
                <div id="payos-checkout-iframe"></div>
                <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
                <div>
                    {appointmentsData
                        .slice()
                        .sort((item1) => {
                            if (item1.status === 'pending') {
                                return -1;
                            } else return 1;
                        })
                        .map((item, index) => (
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
                                    {item.status === 'pending' && item.payment === 'unpaid' && (
                                        <button
                                            onClick={() => {
                                                setIsOpen(true);
                                                setPopupType('payment');
                                                setCurrentAppointmentId(item._id);
                                            }}
                                            className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                                        >
                                            Pay Online
                                        </button>
                                    )}
                                    {item.status === 'pending' && item.payment === 'paid' && (
                                        <button className="text-sm text-center sm:min-w-48 py-2 border rounded bg-primary text-white transition-all duration-300">
                                            Paid
                                        </button>
                                    )}
                                    {item.status === 'pending' && item.payment === 'unpaid' && (
                                        <button
                                            onClick={() => {
                                                setIsOpen(true);
                                                setPopupType('appointment');
                                                setCurrentAppointmentId(item._id);
                                            }}
                                            className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                                        >
                                            Cancle appointment
                                        </button>
                                    )}
                                    {item.status === 'canceled' && (
                                        <div className="sm:m-auto sm:min-w-48 py-2 px-3 bg-red-50 text-red-600 rounded-full text-sm font-medium text-center shadow-sm border border-red-100">
                                            Appointment Canceled
                                        </div>
                                    )}
                                    {item.status === 'completed' && (
                                        <div className="sm:m-auto sm:min-w-48 py-2 px-3 bg-green-50 text-green-600 rounded-full text-sm font-medium text-center shadow-sm border border-green-100">
                                            Appointment Completed
                                        </div>
                                    )}
                                    {item.status === 'canceledByDoctor' && (
                                        <div className="sm:m-auto sm:min-w-48 py-2 px-3 bg-yellow-50 text-yellow-400 rounded-full text-sm font-medium text-center shadow-sm border border-yellow-100">
                                            Declined By Doctor
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
                <ConfirmPopup
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onConfirm={() => {
                        if (popupType === 'appointment') {
                            cancelAppointmentHandle(currentAppointmentId);
                            setIsOpen(false);
                        } else {
                            createPayment(currentAppointmentId);
                            setIsOpen(false);
                        }
                    }}
                    type={popupType}
                ></ConfirmPopup>
            </div>
        )
    );
};

export default MyAppointments;
