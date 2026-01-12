import express from 'express';
import {
    cancelAppointment,
    completeAppointment,
    doctorList,
    getAppointmentsDoctor,
    getProfile,
    loginDoctor,
    updateProfile,
} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/appointments', authDoctor, getAppointmentsDoctor);
doctorRouter.post('/complete-appointment', authDoctor, completeAppointment);
doctorRouter.post('/cancel-appointment', authDoctor, cancelAppointment);
doctorRouter.post('/update-profile', authDoctor, updateProfile);
doctorRouter.get('/profile', authDoctor, getProfile);

export default doctorRouter;
