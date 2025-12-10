import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '@/context/AppContext';

const RelatedDoctors = ({ docId, speciality }) => {
    const { doctors } = useContext(AppContext);

    const [relDoc, setRelDoc] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (speciality && doctors.length > 0) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId);
            setRelDoc(doctorsData);
        }
    }, [doctors, speciality, docId]);

    return (
        <div className="my-16 flex flex-col gap-4 items-center text-gray-900">
            <h1 className="text-3xl font-medium">Related Doctors</h1>
            <p className="sm:w-1/3 text-sm text-center">Simply browse through our extensive list of trusted doctors.</p>
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 sm:px-10">
                {relDoc.slice(0, 5).map((doc, index) => (
                    <div
                        onClick={() => {
                            navigate(`/appointment/${doc._id}`);
                            scrollTo(0, 0);
                        }}
                        key={index}
                        className="overflow-hidden rounded rounded-xl border border-blue-200 cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                    >
                        <img src={doc.image} alt="" className="bg-blue-50" />
                        <div className="p-4">
                            <div className="flex items-center gap-2 text-sm text-center text-green-500">
                                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                                <p>Available</p>
                            </div>
                            <p className="text-lg font-medium text-gray-900">{doc.name}</p>
                            <p className="text-gray-600 text-sm">{doc.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedDoctors;
