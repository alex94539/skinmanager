import { getPasiByID, addNewPasi, checkIsPasiOwner, setPasiDeleted, updatePasi } from './pasiFunction.js';
import { checkTokenAvailable } from "../Functions.js";

import express from 'express';
import jwt from 'jsonwebtoken';

export let pasiRouter = express.Router();

pasiRouter.get('/', async (req, res, next) => {
    let _tokenAvailability = await checkTokenAvailable(req.header('Authorization'));
    if(_tokenAvailability.tokenExist){
        let pasis = await getPasiByID(_tokenAvailability.index);
        res.status(200);
        res.send(pasis);
    }
    else{
        res.status(500);
        res.send({
            code: 50099,
            message: "Token Expired"
        });
    }
});

pasiRouter.post('/', async (req, res, next) => {
    let _tokenAvailability = await checkTokenAvailable(req.header('Authorization'));
    if(_tokenAvailability.tokenExist){
        let postResult = await addNewPasi(req.body, _tokenAvailability.index);
        res.status(200);
        res.send(postResult);
    }
    else{
        res.status(500);
        res.send({
            code: 50099,
            message: "Token Expired"
        });
    }
});

pasiRouter.delete('/:pasiIndex', async (req, res, next) => {
    let _tokenAvailability = await checkTokenAvailable(req.header('Authorization'));
    if(_tokenAvailability.tokenExist){
        let _isOwner = checkIsPasiOwner(req.params.pasiIndex, _tokenAvailability.index);
        if(_isOwner.isOwner){
            setPasiDeleted(req.params.pasiIndex);
            res.status(200);
            res.send({
                code: 200,
                update_success_count: 1
            });
        }
        else{
            res.status(403);
            res.send({
                code: 50098,
                message: "Not the pasi owner"
            });
        }
    }
    else{
        res.status(500);
        res.send({
            code: 50099,
            message: "Token Expired"
        });
    }
});

pasiRouter.put('/:pasiIndex', async (req, res, next) => {
    let _tokenAvailability = await checkTokenAvailable(req.header('Authorization'));
    if(_tokenAvailability.tokenExist){
        let _isOwner = checkIsPasiOwner(req.params.pasiIndex, _tokenAvailability.index);
        if(_isOwner.isOwner){
            let putResult = await updatePasi(req.params.pasiIndex, _tokenAvailability.index, req.body);
            res.status(200);
            res.send(putResult);
        }
        else{
            res.status(403);
            res.send({
                code: 50098,
                message: "Not the pasi owner"
            });
        }
    }
    else{
        res.status(500);
        res.send({
            code: 50099,
            message: "Token Expired"
        });
    }
});

