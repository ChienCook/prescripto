import React from 'react';

const ConfirmPopup = ({ isOpen, onClose, onConfirm, type = 'payment' }) => {
    // Nếu không mở thì không render gì cả
    if (!isOpen) return null;

    let infor = {
        title: '',
        subtitle: '',
        icon: '',
    };

    switch (type) {
        case 'payment':
            infor = {
                title: 'Confirm Payment',
                subtitle: 'Please review the details carefully before proceeding!',
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                        />
                    </svg>
                ),
            };
            break;
        case 'appointment':
            infor = {
                title: 'Do you want to cancel this appointment?',
                subtitle: 'Please review the details carefully before proceeding!',
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                        />
                    </svg>
                ),
            };
            break;
        case 'booking':
            infor = {
                title: 'Do you want to booking this appointment?',
                subtitle: 'Please review the details carefully before proceeding!',
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                ),
            };
            break;
        case 'profile':
            infor = {
                title: 'Do you want to update your profile?',
                subtitle: 'Please review the details carefully before proceeding!',
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                    </svg>
                ),
            };
            break;
        case 'add-doctor':
            infor = {
                title: 'Do you want to add this doctor?',
                subtitle: 'Please review the details carefully before proceeding!',
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                ),
            };
            break;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* 1. Backdrop (Lớp nền tối + mờ) */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose} // Bấm ra ngoài thì đóng
            ></div>

            {/* 2. Modal Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-fadeIn">
                {/* Nút tắt (X) ở góc phải */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Nội dung chính */}
                <div className="flex flex-col items-center text-center">
                    {/* Icon tròn màu chủ đạo */}
                    <div className="w-16 h-16 bg-[#5F6FFF]/10 rounded-full flex items-center justify-center mb-4 text-[#5F6FFF]">
                        {infor.icon}
                    </div>

                    {/* Tiêu đề & Mô tả */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{infor.title}</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">{infor.subtitle}</p>

                    {/* Khu vực nút bấm */}
                    <div className="flex gap-3 w-full">
                        {/* Nút Cancel (Màu xám nhạt) */}
                        <button
                            onClick={onClose}
                            className="flex-1 px-5 py-3 rounded-xl text-white font-medium bg-red-400 hover:bg-red-500 transition-colors"
                        >
                            Cancel
                        </button>

                        {/* Nút Action Chính (Màu #5F6FFF) */}
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-5 py-3 rounded-xl text-white font-medium bg-[#5F6FFF] hover:bg-[#4d5ce0] shadow-lg shadow-[#5F6FFF]/30 transition-all "
                        >
                            {type === 'payment' ? 'Pay Now' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPopup;
