import { useContext, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

import { AppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';

const MyProfile = () => {
    const { userData, setUserData, backendUrl, token, loadUserProfileData } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const updateUserProfileData = async () => {
        try {
            setIsLoading(true);
            const userFormData = new FormData();
            userFormData.append('name', userData.name);
            userFormData.append('email', userData.email);
            userFormData.append('phone', userData.phone);
            userFormData.append('address', JSON.stringify(userData.address));
            userFormData.append('gender', userData.gender);
            userFormData.append('dob', userData.dob);

            image && userFormData.append('image', image);

            const res = await axios.post(backendUrl + '/api/user/update-profile', userFormData, { headers: { token } });
            const { data } = res;
            if (data.success) {
                loadUserProfileData();
                toast.success(data.message);
                setIsEdit(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        userData && (
            <div className="max-w-lg flex flex-col gap-2 text-sm">
                {isEdit ? (
                    <label htmlFor="image">
                        <div className="inline-block relative cursor-pointer">
                            <img
                                className="w-36 rounded opacity-75"
                                src={image ? URL.createObjectURL(image) : userData.image}
                                alt=""
                            />
                            <img
                                className="w-10 absolute bottom-12 right-12"
                                src={image ? null : assets.upload_icon}
                                alt=""
                            />
                        </div>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </label>
                ) : (
                    <img src={userData.image} alt="" className="w-36 rounded" />
                )}

                {isEdit ? (
                    <input
                        className="bg-gray-100 text-3xl font-medium max-w-60 mt-4"
                        type="text"
                        value={userData.name}
                        onChange={(e) => {
                            setUserData((prev) => ({ ...prev, name: e.target.value }));
                        }}
                    />
                ) : (
                    <p className="text-3xl text-3xl text-neutral-800 mt-4 font-medium">{userData.name}</p>
                )}
                <hr className="bg-zinc-400 h-[1px] border-none" />
                <div>
                    <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
                    <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                        <p className="font-medium">Email id: </p>
                        <p className="text-blue-500">{userData.email}</p>
                        <p className="font-medium">Phone:</p>
                        {isEdit ? (
                            <input
                                className="bg-gray-100 max-w-52"
                                type="text"
                                value={userData.phone}
                                onChange={(e) => {
                                    setUserData((prev) => ({ ...prev, phone: e.target.value }));
                                }}
                            />
                        ) : (
                            <p className="text-blue-400">{userData.phone}</p>
                        )}
                        <p className="font-medium">Address: </p>
                        {isEdit ? (
                            <>
                                <input
                                    className="bg-gray-100"
                                    type="text"
                                    value={userData.address.line1}
                                    onChange={(e) => {
                                        setUserData((prev) => ({
                                            ...prev,
                                            address: { ...prev.address, line1: e.target.value },
                                        }));
                                    }}
                                />
                                <br />
                                <input
                                    className="bg-gray-100"
                                    type="text"
                                    value={userData.address.line2}
                                    onChange={(e) => {
                                        setUserData((prev) => ({
                                            ...prev,
                                            address: { ...prev.address, line2: e.target.value },
                                        }));
                                    }}
                                />
                            </>
                        ) : (
                            <p className="text-gray-500">
                                {userData.address.line1}
                                <br />
                                {userData.address.line2}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-neutral-500 underline mt-5">BASIC INFORMATION</p>
                        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                            <p className="font-medium">Gender:</p>
                            {isEdit ? (
                                <select
                                    className="max-w-20 bg-gray-100"
                                    onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                                    value={userData.gender}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            ) : (
                                <p className="text-gray-400">{userData.gender}</p>
                            )}
                            <p className="font-medium">Birhday: </p>
                            {isEdit ? (
                                <input
                                    className="max-w-28 bg-gray-100"
                                    type="date"
                                    onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                                    value={userData.dob}
                                />
                            ) : (
                                <p className="text-gray-400">{userData.dob}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    {isEdit ? (
                        <button
                            className={`border border-primary py-2 px-8 rounded-full transition-all duration-300 
                ${
                    isLoading
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50' // Style when loading
                        : 'hover:bg-primary hover:text-white' // Normal style
                }`}
                            onClick={updateUserProfileData}
                        >
                            {isLoading ? 'Saving...' : 'Save information'}
                        </button>
                    ) : (
                        <button
                            className="border border-priamry py-2 px-8 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                            onClick={() => setIsEdit(true)}
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>
        )
    );
};

export default MyProfile;
