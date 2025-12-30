import express from 'express';
import authUser from '../middlewares/authUser.js';
import { createPayment, receiveWebhook } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-payment', authUser, createPayment);
paymentRouter.post('/payos-webhook', receiveWebhook);

export default paymentRouter;
