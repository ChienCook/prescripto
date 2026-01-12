import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DoctorContext } from '@/context/DoctorContext';
import { AppContext } from '@/context/AppContext';
import axios from 'axios';

const DoctorProfile = () => {
    const { profile, setProfile, getProfile, dToken, backendUrl } = useContext(DoctorContext);
    const { currency } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (dToken) {
            getProfile();
        }
    }, [dToken]);

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profile.address,
                fees: profile.fees,
                available: profile.available,
            };

            const res = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, {
                headers: { dToken },
            });

            const { data } = res;
            if (data.success) {
                getProfile();
                setIsEdit(false);
                toast.success(data.message);
            } else {
                data.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        profile && (
            <div>
                <div className="flex flex-col gap-4 m-5">
                    <div>
                        <img src={profile.image} alt="" className="bg-primary/80 w-full sm:max-w-64 rounded-lg" />
                    </div>

                    {/* -------- Doc info: name, degree, experience --------*/}
                    <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
                        <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">{profile.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-gray-600">
                            <p>
                                {profile.degree} - {profile.speciality}
                            </p>
                            <button className="py-0.5 px-2 border text-xs rounded-full">{profile.experience}</button>
                        </div>

                        {/* doc about */}
                        <div>
                            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">About: </p>
                            <p className="text-sm text-gray-600 max-w-[700px] mt-1">{profile.about}</p>
                        </div>

                        <p className="text-gray-600 font-medium mt-4">
                            Appointment fee:{' '}
                            <span className="text-gray-800">
                                {currency}{' '}
                                {isEdit ? (
                                    <input
                                        className="bg-gray-100"
                                        type="number"
                                        onChange={(e) => setProfile((prev) => ({ ...prev, fees: e.target.value }))}
                                        value={profile.fees}
                                    />
                                ) : (
                                    profile.fees
                                )}
                            </span>
                        </p>

                        <div className="flex gap-2 py-2">
                            <p>Address: </p>
                            <p className="text-sm">
                                {isEdit ? (
                                    <input
                                        className="bg-gray-100"
                                        type="text"
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                address: {
                                                    ...prev.address,
                                                    line1: e.target.value,
                                                },
                                            }))
                                        }
                                        value={profile.address.line1}
                                    />
                                ) : (
                                    profile.address.line1
                                )}
                                <br />
                                {isEdit ? (
                                    <input
                                        className="bg-gray-100"
                                        type="text"
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                address: {
                                                    ...prev.address,
                                                    line2: e.target.value,
                                                },
                                            }))
                                        }
                                        value={profile.address.line2}
                                    />
                                ) : (
                                    profile.address.line2
                                )}
                            </p>
                        </div>

                        <div className="flex gap-1 pt-2">
                            <input
                                onChange={() =>
                                    isEdit && setProfile((prev) => ({ ...prev, available: !prev.available }))
                                }
                                checked={profile.available}
                                type="checkbox"
                                name=""
                                id=""
                            />
                            <label htmlFor="" className={isEdit ? 'bg-gray-100' : undefined}>
                                Available
                            </label>
                        </div>

                        {isEdit ? (
                            <button
                                onClick={() => updateProfile()}
                                className="py-1 px-4 border border-primary text-sm rounded-full mt-5 hover:text-white hover:bg-primary transition-all"
                            >
                                Save information
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEdit(true)}
                                className="py-1 px-4 border border-primary text-sm rounded-full mt-5 hover:text-white hover:bg-primary transition-all"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default DoctorProfile;
