import {
	login,
	isLoggedIn,
	addLoginLog,
	expireTokenByAccount,
	logOut,
	getUserProfileByID,
	updateProfile,
} from './authFunction.js';
import { checkTokenAvailable } from '../Functions.js';

import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const key = 'OumaeKumiko';

export let authRouter = express.Router();

authRouter.use(cors());

authRouter.options('/login', (req, res, next) => {
	res.set('Allow', 'POST, OPTIONS');
	res.send({ code: 200 });
});

authRouter.post('/login', async (req, res, next) => {
	res.set('Allow', 'POST, OPTIONS');
	if (!req.body.account) {
		res.send('Wrong pattern.');
	} else {
		let _checkDuplicate = await isLoggedIn(req.body.account);
		let _login = await login(req.body.account, req.body.pwd);
		if (_checkDuplicate.previousActiveTokenExist && _login.truth) {
			expireTokenByAccount(_login.index);
			res.send({
				code: 401,
				text: '先前未登出，請重新登入',
			});
		} else if (!_checkDuplicate.previousActiveTokenExist && _login.truth) {
			let _token = jwt.sign(
				{
					account: req.body.account,
					password: req.body.pwd,
					device: req.body.device,
				},
				key
			);
			addLoginLog(_token, req.body.account, req.body.device, _login.index);
			res.send({
				code: 200,
				token: _token,
			});
		} else if (!_login.truth) {
			res.status(500);
			res.send({
				code: 5001,
				message: '帳號或密碼錯誤',
			});
		}
	}
});

authRouter.get('/logout', async (req, res, next) => {
	let _tokenAvailability = await checkTokenAvailable(
		req.header('Authorization')
	);
	if (_tokenAvailability.tokenExist) {
		logOut(req.header('Authorization'));
		res.status(200);
		res.send({
			code: 200,
			logout: true,
		});
	} else {
		res.status(500);
		res.send({
			code: 50099,
			message: 'Token Expired',
		});
	}
});

authRouter.get('/profile', async (req, res, next) => {
	let _tokenAvailability = await checkTokenAvailable(
		req.header('Authorization')
	);
	if (_tokenAvailability.tokenExist) {
		res.status(200);
		res.send(await getUserProfileByID(_tokenAvailability.index));
	} else {
		res.status(500);
		res.send({
			code: 50099,
			message: 'Token Expired',
		});
	}
});

authRouter.patch('/profile', async (req, res, next) => {
	let _tokenAvailability = await checkTokenAvailable(
		req.header('Authorization')
	);
	if (_tokenAvailability.tokenExist) {
		let updateResult = updateProfile(req.body, _tokenAvailability.index);
		res.status(200);
		res.send(updateResult);
	} else {
		res.status(500);
		res.send({
			code: 50099,
			message: 'Token Expired',
		});
	}
});

authRouter.options('/profile', async (req, res, next) => {
	res.set('Allow', 'GET, PATCH, OPTIONS');
	res.status(200);
	res.send({ code: 200 });
});
