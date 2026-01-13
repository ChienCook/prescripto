import { AppContext } from '@/context/AppContext';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Doctors = () => {
    const { speciality } = useParams();
    const [filterDoc, setFilterDoc] = useState([]);
    const [showFilter, setShowFilter] = useState(false);

    const navigate = useNavigate();

    const { doctors } = useContext(AppContext);

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
        } else {
            setFilterDoc(doctors);
        }
    };

    useEffect(() => {
        applyFilter();
    }, [speciality, doctors]);

    return (
        <div>
            <p className="text-gray-600">Browse through the doctors specialist.</p>
            <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
                <button
                    className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
                        showFilter && 'bg-primary text-white'
                    }`}
                    onClick={() => setShowFilter((prev) => !prev)}
                >
                    Filters
                </button>
                <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    <p
                        onClick={() => {
                            speciality === 'General physician'
                                ? navigate('/doctors')
                                : navigate('/doctors/General physician');
                        }}
                        className={`w-[94vw] sm:w-auto py-1.5 pl-3 pr-16 border border-gray-300 rounded cursor-pointer transition-all 
                            ${speciality === 'General physician' && 'bg-indigo-100 text-black'}
                            `}
                    >
                        General physician
                    </p>
                    <p
                        onClick={() => {
                            speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist');
                        }}
                        className={`w-[94vw] sm:w-auto py-1.5 pl-3 pr-16 border border-gray-300 rounded cursor-pointer transition-all 
                            ${speciality === 'Gynecologist' && 'bg-indigo-100 text-black'}
                            `}
                    >
                        Gynecologist
                    </p>
                    <p
                        onClick={() => {
                            speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist');
                        }}
                        className={`w-[94vw] sm:w-auto py-1.5 pl-3 pr-16 border border-gray-300 rounded cursor-pointer transition-all 
                            ${speciality === 'Dermatologist' && 'bg-indigo-100 text-black'}
                            `}
                    >
                        Dermatologist
                    </p>
                    <p
                        onClick={() => {
                            speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians');
                        }}
                        className={`w-[94vw] sm:w-auto py-1.5 pl-3 pr-16 border border-gray-300 rounded cursor-pointer transition-all 
                            ${speciality === 'Pediatricians' && 'bg-indigo-100 text-black'}
                            `}
                    >
                        Pediatricians
                    </p>
                    <p
                        onClick={() => {
                            speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist');
                        }}
                        className={`w-[94vw] sm:w-auto py-1.5 pl-3 pr-16 border border-gray-300 rounded cursor-pointer transition-all 
                            ${speciality === 'Neurologist' && 'bg-indigo-100 text-black'}
                            `}
                    >
                        Neurologist
                    </p>
                    <p
                        onClick={() => {
                            speciality === 'Gastroenterologist'
                                ? navigate('/doctors')
                                : navigate('/doctors/Gastroenterologist');
                        }}
                        className={`w-[94vw] sm:w-auto py-1.5 pl-3 pr-16 border border-gray-300 rounded cursor-pointer transition-all 
                            ${speciality === 'Gastroenterologist' && 'bg-indigo-100 text-black'}
                            `}
                    >
                        Gastroenterologist
                    </p>
                </div>

                <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
                    {filterDoc.map((item, index) => {
                        return (
                            <div
                                onClick={() => navigate(`/appointment/${item._id}`)}
                                key={index}
                                className="border border-blue-200 overflow-hidden rounded-xl cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                            >
                                <img src={item.image} alt="" className="bg-blue-50" />
                                <div className="p-4">
                                    <div className="flex text-sm gap-2 items-centerX text-center">
                                        <p
                                            className={`w-2 h-2  rounded-full ${
                                                item.available ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}
                                        ></p>
                                        <p className={`${item.available ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {item.available ? 'Available' : 'Unavailable'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-lg text-gray-900 font-medium whitespace-nowrap">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-gray-600">{item.speciality}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
