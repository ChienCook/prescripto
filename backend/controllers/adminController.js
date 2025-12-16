import doctorModel from '../models/doctorModel.js';

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const image = req.file;

        //
    } catch (error) {
        console.error('Error at addDoctor method', error);
    }
};

export { addDoctor };
