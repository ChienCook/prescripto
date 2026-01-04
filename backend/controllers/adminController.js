import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';

import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // checking for all data to add doctor
        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !about ||
            !fees ||
            !address ||
            !imageFile
        ) {
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

        // hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
        };
        // save doctor document's instance to doctor database
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: 'Doctor Added' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for admin login

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // creating token that we will be save in localStorage
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel the appointments
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const apppointmentData = await appointmentModel.findById(appointmentId);
        if (!apppointmentData) {
            return res.json({ success: false, message: 'Appointment does not exist' });
        }

        const doctorId = apppointmentData.docId;
        const doctorData = await doctorModel.findById(doctorId).select('-password');
        if (!doctorData) {
            return res.json({ success: false, message: 'Doctor does not exist' });
        }
        // remove the slotTime in slotDate
        const slot_booked = doctorData.slot_booked;
        slot_booked[apppointmentData.slotDate] = slot_booked[apppointmentData.slotDate].filter(
            (slotTime) => slotTime !== apppointmentData.slotTime,
        );

        await doctorModel.findByIdAndUpdate(doctorId, {
            slot_booked,
        });

        // cancel on appointment
        await appointmentModel.findByIdAndUpdate(appointmentId, { canceled: true });

        res.json({ success: true, message: 'Cancled appointment successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, cancelAppointment };
