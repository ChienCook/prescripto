import doctorModel from '../models/doctorModel.js';

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

export { changeAvailbility };
