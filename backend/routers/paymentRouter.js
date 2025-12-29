import express from 'express';
import authUser from '../middlewares/authUser.js';
import { createPayment } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-payment', authUser, createPayment);

export default paymentRouter;
