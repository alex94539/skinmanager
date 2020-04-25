import {
	getPasiByID,
	addNewPasi,
	checkIsPasiOwner,
	setPasiDeleted,
	updatePasi,
} from './pasiFunction.js';
import { checkTokenAvailable } from '../Functions.js';

import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { connection } from '../../db/mysql.js';

export let pasiRouter = express.Router();

pasiRouter.use(cors());

pasiRouter.get('/', async (req, res, next) => {
	let _tokenAvailability = await checkTokenAvailable(
		req.header('Authorization')
	);
	if (_tokenAvailability.tokenExist) {
		let pasis = await getPasiByID(_tokenAvailability.index);
		//console.log(pasis);
		res.status(200);
		res.send({
			code: 200,
			data: pasis,
		});
	} else {
		res.status(500);
		res.send({
			code: 50099,
			message: 'Token Expired',
		});
	}
});

pasiRouter.post('/', async (req, res, next) => {
	let _tokenAvailability = await checkTokenAvailable(
		req.header('Authorization')
	);
	if (_tokenAvailability.tokenExist) {
		let postResult = await addNewPasi(req.body, _tokenAvailability.index);
		res.status(200);
		res.send(postResult);
	} else {
		res.status(500);
		res.send({
			code: 50099,
			message: 'Token Expired',
		});
	}
});

pasiRouter.delete('/:pasiIndex', async (req, res, next) => {
	let _tokenAvailability = await checkTokenAvailable(
		req.header('Authorization')
	);
	if (_tokenAvailability.tokenExist) {
		let _isOwner = await checkIsPasiOwner(
			req.params.pasiIndex,
			_tokenAvailability.index
		);
		console.log(`delete`, _isOwner);
		if (_isOwner.isOwner == true) {
			setPasiDeleted(req.params.pasiIndex);
			res.status(200);
			res.send({
				code: 200,
				update_success_count: 1,
			});
		} else if (_isOwner.isOwner == 'deleted') {
			res.status(200);
			res.send({
				code: 200,
				update_success_count: 0,
			});
			console.log('request to delete deleted pasi.');
		} else {
			res.status(403);
			res.send({
				code: 50098,
				message: 'Not the pasi owner',
			});
		}
	} else {
		res.status(500);
		res.send({
			code: 50099,
			message: 'Token Expired',
		});
	}
});

pasiRouter.put('/:pasiIndex', async (req, res, next) => {
	let _tokenAvailability = await checkTokenAvailable(
		req.header('Authorization')
	);
	//console.log(req.params.pasiIndex);
	if (_tokenAvailability.tokenExist) {
		let _isOwner = await checkIsPasiOwner(
			req.params.pasiIndex,
			_tokenAvailability.index
		);
		console.log(`put`, _isOwner);
		if (_isOwner.isOwner == true) {
			let putResult = await updatePasi(
				req.params.pasiIndex,
				req.body
			);
			res.status(200);
			res.send(putResult);
		} else if (_isOwner.isOwner == 'deleted') {
			res.status(200);
			res.send({
				code: 200,
				update_success_count: 0,
			});
			console.log('request to put deleted pasi.');
		} else {
			res.status(403);
			res.send({
				code: 50098,
				message: 'Not the pasi owner',
			});
		}
	} else {
		res.status(500);
		res.send({
			code: 50099,
			message: 'Token Expired',
		});
	}
});
