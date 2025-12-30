import { PayOS } from '@payos/node';
import appointmentModel from '../models/appointmentModel.js';

const payOS = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);

// API for create the payment link
const createPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        const domain = process.env.FRONTEND_URL;
        // creating the order code (payos just only accept the order code that it is Integer type)
        const orderCode = Number(String(Date.now()).slice(-6));

        await appointmentModel.findByIdAndUpdate(appointmentId, { orderCode: orderCode });

        const body = {
            orderCode: orderCode,
            amount: appointmentData.amount * 100,
            description: `book appointment ${appointmentId.slice(-6)}`,
            // the link will redirect when user pay successfully
            returnUrl: domain + `/my-appointments?success=true`,
            // the link will redirect when user cancel
            cancelUrl: domain + `/my-appointments?cancel=true`,
        };

        const paymentLink = await payOS.paymentRequests.create(body);

        res.json({ success: true, checkoutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const receiveWebhook = async (req, res) => {
    try {
        const webhookData = await payOS.webhooks.verify(req.body);

        console.log(webhookData);

        const orderCode = webhookData.orderCode;
        if (!orderCode) {
            return res.json({ success: false, message: 'Data invalid' });
        }
        await appointmentModel.findOneAndUpdate({ orderCode: orderCode }, { payment: true });
        res.json({ success: true, message: 'Pay successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createPayment, receiveWebhook };
