import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

import userModel from '../models/userModel.js';
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }
        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: 'Please enter a strong password' });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        };

        const newUser = new userModel(userData);

        // save user into Database
        const user = await newUser.save();
        // create user token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            res.json({ success: false, message: 'Email exists, please enter other email' });
        } else {
            res.json({ success: false, message: error.message });
        }
    }
};

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get user profile  data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            res.json({ success: false, message: 'User does not exist' });
        } else {
            res.json({ success: true, user });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update user profile data
const updateProfile = async (req, res) => {
    try {
        const { email, phone, address, gender, dob, name, userId } = req.body;
        const imageFile = req.file;

        if (!email || !phone || !name || !dob || !gender) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }
        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        let imageUrl = '';
        if (imageFile) {
            // Upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });

            imageUrl = imageUpload.secure_url;

            if (user.image) {
                const isCloudinaryImage = user.image.includes('cloudinary') && !user.image.startsWith('data:image');
                if (isCloudinaryImage) {
                    const oldImageUrl = user.image; // "https://res.cloudinary.com/dyhyw0y7l/image/upload/v1766156504/i6i3qosoh4zt7gkgjhqw.png";

                    const imagename = oldImageUrl.split('/').pop(); // "i6i3qosoh4zt7gkgjhqw.png"

                    const publicId = imagename.split('.')[0]; // "i6i3qosoh4zt7gkgjhqw"

                    // remove old user image on cloudinary
                    await cloudinary.uploader.destroy(publicId);
                }
            }
        }
        await userModel.findByIdAndUpdate(userId, {
            email,
            name,
            phone,
            dob,
            gender,
            image: imageUrl || user.image,
            address: address
                ? JSON.parse(address)
                : {
                      line1: '',
                      line2: '',
                  },
        });

        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const bookingAppointment = async (req, res) => {
    try {
        const { userId, docId, slotTime, slotDate } = req.body;
        if (!slotTime || !slotDate) {
            return res.json({ success: false, message: 'Please select all fields' });
        }

        const doctorData = await doctorModel.findById(docId).select('-password');
        if (!doctorData) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        if (!doctorData.available) {
            return res.json({ success: false, message: 'Doctor not available' });
        }

        const userData = await userModel.findById(userId).select('-password');
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        //  slot_booked is same like:
        // {
        //   "20_12_2025": ["10:00", "11:30", "15:00"],
        //   "21_12_2025": ["09:00", "14:00"],
        //   "25_12_2025": []
        // }

        // checking for slot availablity
        let slot_booked = doctorData.slot_booked;

        if (slot_booked[slotDate]) {
            if (slot_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' });
            } else {
                slot_booked[slotDate].push(slotTime);
            }
        } else {
            slot_booked = { ...slot_booked, [slotDate]: [slotTime] };
        }

        // delete slot_booked property to save the capacity and do not want to save unnecessary things
        // because of the slot_booked includes all appointments in the history.
        const doctorDataPlain = doctorData.toObject(); // avoid to delete directly doctorData.slot_booked, because it is mongoose instance
        delete doctorDataPlain.slot_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            doctorData: doctorDataPlain, // save the object without slot_booked property
            amount: doctorData.fees,
            slotDate,
            slotTime,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // save new slots data in doctorData
        await doctorModel.findByIdAndUpdate(docId, { slot_booked });

        res.json({ success: true, message: 'Appointment Booked' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for get user's appointments

const getAppointments = async (req, res) => {
    try {
        const { userId } = req.body;

        const appointments = await appointmentModel.find({ userId: userId });
        if (!appointments) {
            return res.json({ success: false, message: 'Not have any Appointment' });
        }
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, messsage: error.message });
    }
};

// API for cancel the appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId, userId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        // checking for userId match with userId in appointmentData (verify appointment user)
        if (userId !== appointmentData.userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        const { slotDate, slotTime, docId } = appointmentData;

        const doctorData = await doctorModel.findById(docId).select('-password');
        if (!doctorData) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        // remove slotTime which user is canceling from slotDate
        let slot_booked = doctorData.slot_booked;
        slot_booked[slotDate] = slot_booked[slotDate].filter((time) => time !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, {
            slot_booked,
        });

        // soft delete
        await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'canceled' });
        res.json({ success: true, message: 'Appointment Canceled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, getProfile, updateProfile, bookingAppointment, getAppointments, cancelAppointment };
