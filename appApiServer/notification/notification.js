import { checkTokenAvailable } from '../Functions.js';
import { getNotification } from './notificationFunctions.js';

import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';

export let notifiRouter = express.Router();

notifiRouter.use(cors());

notifiRouter.get('/', async (req, res, next) => {
	let _tokenAvailability = await checkTokenAvailable(
		req.header('Authorization')
	);
	if (_tokenAvailability.tokenExist) {
		res.status(200);
		res.send({
			code: 200,
			data: await getNotification(_tokenAvailability.index),
		});
	} else {
		res.status(500);
		res.send({
			code: 50099,
			message: 'Token Expired',
		});
	}
});
