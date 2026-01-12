import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

const changeAvailbility = async (req, res) => {
    try {
        const { docId } = req.body;

        const doctorData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !doctorData.available });
        res.json({ success: true, message: 'Availability Changed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to Login for doctor
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;

        const doctorData = await doctorModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!doctorData) {
            return res.json({ success: false, message: 'Invalid Credentials!' });
        }

        const isMatch = await bcrypt.compare(password, doctorData.password);
        if (isMatch) {
            const token = jwt.sign({ id: doctorData._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid Credentials!' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get appointmens for doctor panel
const getAppointmentsDoctor = async (req, res) => {
    try {
        const { doctorId } = req.body;

        const appointments = await appointmentModel.find({ docId: doctorId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark appointments completed for doctor panel
const completeAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData && appointmentData.docId !== doctorId) {
            return res.json({ success: false, message: 'Mark failed!' });
        }

        // const doctorData = await doctorModel.findById(doctorId).select('-password');
        // let slot_booked = doctorData.slot_booked;
        // slot_booked[appointmentData.slotDate] = slot_booked[appointmentData.slotDate].filter(
        //     (time) => time !== appointmentData.slotTime,
        // );

        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
        res.json({ success: true, message: 'Appointment Complete!' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel appointments completed for doctor panel
const cancelAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData && appointmentData.docId !== doctorId) {
            return res.json({ success: false, message: 'Mark failed!' });
        }

        const doctorData = await doctorModel.findById(doctorId).select('-password');
        let slot_booked = doctorData.slot_booked;
        slot_booked[appointmentData.slotDate] = slot_booked[appointmentData.slotDate].filter(
            (time) => time !== appointmentData.slotTime,
        );

        await appointmentModel.findByIdAndUpdate(appointmentId, { canceled: true });
        await doctorModel.findByIdAndUpdate(doctorId, { slot_booked });
        res.json({ success: true, message: 'Appointment Canceled!' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor profile
const getProfile = async (req, res) => {
    try {
        const { doctorId } = req.body;
        const doctorData = await doctorModel.findById(doctorId).select('-password');
        if (!doctorData) {
            return res.json({ success: false, message: 'Doctor not found!' });
        }

        res.json({ success: true, doctorData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update doctor profile
const updateProfile = async (req, res) => {
    try {
        const { doctorId, fees, address, available } = req.body;
        const doctorData = await doctorModel.findByIdAndUpdate(doctorId, { fees, address, available });
        if (!doctorData) {
            return res.json({ success: false, message: 'Doctor not found!' });
        }
        res.json({ success: true, message: 'Profile updated!' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    changeAvailbility,
    doctorList,
    loginDoctor,
    getAppointmentsDoctor,
    completeAppointment,
    cancelAppointment,
    getProfile,
    updateProfile,
};
