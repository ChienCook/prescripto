import PayOS from '@payos/node';
import appointmentModel from '../models/appointmentModel';

// API for create the payment link
const createPayment = async (req, res) => {
    try {
        const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);

        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        // creating the order code (payos just only accept the order code that it is Integer type)
        const orderCode = Number(String(Date.now()).slice(-6));

        const domain = process.env.FRONTEND_URL;

        const body = {
            orderCode: orderCode,
            amount: appointmentData.ammount * 100,
            description: `BOOK APPOINTMENT ${appointmentId.slice(-6)}`,

            // the link will redirect when user pay successfully
            returnUrl: `${domain}/my-appointments?success=true&appointmentId=${appointmentId}&orderCode=${orderCode}`,

            // the link will redirect when user cancel
            cancelUrl: `${domain}/my-appointments?cancel=true`,
        };

        const paymentLinkData = await payos.createPaymentLink(body);
        res.json({ success: true, checkoutUrl: paymentLinkData.checkoutUrl });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createPayment };
