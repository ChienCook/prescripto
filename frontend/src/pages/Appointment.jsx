import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { assets } from '@/assets/assets';
import RelatedDoctors from '@/components/RelatedDoctors';
import { AppContext } from '@/context/AppContext';
import ConfirmPopup from '@/components/ConfirmPopup';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
    const [docInfo, setDocInfo] = useState(null);

    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const fetchDocInfo = () => {
        const docInfo = doctors.find((doc) => doc._id === docId);
        setDocInfo(docInfo);
    };

    const getAvailableSlots = async () => {
        // getting current date
        const today = new Date();
        let docSlotsTemp = [];

        for (let i = 0; i < 7; i++) {
            // getting date with index
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // getting end time of the date with index
            const endTime = new Date(today);
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            // setting hours
            if (today.getDate() === currentDate.getDate()) {
                // hour
                currentDate.setHours(today.getHours() > 10 ? today.getHours() + 1 : 10);
                // minute
                currentDate.setMinutes(today.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];
            while (currentDate < endTime) {
                let formatedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // check available slot
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                const slotDate = day + '_' + month + '_' + year;

                if (docInfo.slot_booked[slotDate]) {
                    if (docInfo.slot_booked[slotDate].includes(formatedTime)) {
                        currentDate.setMinutes(currentDate.getMinutes() + 30);
                        continue;
                    }
                }

                // add slot to array
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formatedTime,
                });

                // increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            docSlotsTemp.push(timeSlots);
        }
        setDocSlots(docSlotsTemp);
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Please login to book appointment');
            return navigate('/login');
        }
        try {
            if (!docSlots[slotIndex][0]) {
                return toast.error('Please select the date');
            }

            const date = docSlots[slotIndex][0].datetime;
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const slotDate = day + '_' + month + '_' + year;
            const res = await axios.post(
                backendUrl + '/api/user/book-appointment',
                {
                    slotDate: slotDate,
                    slotTime,
                    docId,
                },
                {
                    headers: { token },
                },
            );

            const { data } = res;
            if (data.success) {
                getDoctorsData();
                toast.success(data.message);
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchDocInfo();
    }, [docId, doctors]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    return (
        docInfo && (
            <div>
                {/* ------------ Doctor Details ----------------- */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                        <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
                    </div>
                    <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
                        {/* ------------ Doctor Info: name, degree, exprerience ----------------- */}
                        <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                            {docInfo.name}
                            <img className="w-5" src={assets.verified_icon} alt="" />
                        </p>
                        <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                            <p>
                                {docInfo.degree} - {docInfo.speciality}
                            </p>
                            <button className="border border-gray-300 rounded-full px-2 py-0.5 text-sx">
                                {docInfo.experience}
                            </button>
                        </div>
                        <div>
                            <p className="flex items-center gap-1 text-sm font-medium test-gray-900 mt-3">
                                About <img src={assets.info_icon} alt="" />
                            </p>
                            <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
                        </div>
                        <p className="text-gray-500 font-medium mt-4">
                            Appointment fee:{' '}
                            <span className="text-gray-900">
                                {currencySymbol}
                                {docInfo.fees}
                            </span>
                        </p>
                    </div>
                </div>

                {/* ------------ Booking slots ----------------- */}
                <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
                    <p>Booking slots</p>
                    {/* when component render first time, the docSlots is empty */}
                    <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                        {docSlots.length &&
                            docSlots.map((item, index) => (
                                <div
                                    onClick={() => setSlotIndex(index)}
                                    key={index}
                                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all duration-300 select-none ${
                                        slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'
                                    }`}
                                >
                                    {/* if we check Appointment page when time greater than 21, then item[0] is empty but remain element isn't */}
                                    <p>{item[0] ? daysOfWeek[item[0].datetime.getDay()] : 'Closed'}</p>
                                    <p>{item[0] && item[0].datetime.getDate()}</p>
                                </div>
                            ))}
                    </div>
                    <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4 pb-4 restore-scrollbar">
                        {docSlots.length &&
                            docSlots[slotIndex].map((item, index) => (
                                <p
                                    onClick={() => setSlotTime(item.time)}
                                    key={index}
                                    className={`select-none flex-shrink-0 text-sm font-light px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${
                                        item.time === slotTime
                                            ? 'bg-primary text-white'
                                            : 'text-gray-400 border border-gray-300'
                                    }`}
                                >
                                    {item.time.toLowerCase()}
                                </p>
                            ))}
                    </div>
                    <button
                        onClick={() => {
                            setIsOpen(true);
                        }}
                        className="bg-primary text-white text-sm font-light px-14 py-3 rounded-3xl mt-5 hover:scale-105 transition-all duration-500"
                    >
                        Book an appointment
                    </button>
                </div>

                <RelatedDoctors docId={docId} speciality={docInfo.speciality}></RelatedDoctors>
                <ConfirmPopup
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onConfirm={bookAppointment}
                    type="booking"
                ></ConfirmPopup>
            </div>
        )
    );
};

export default Appointment;
