import { checkTokenAvailable } from '../Functions.js';
import { getBoardData, getQandA } from "./knowledgeFunctions.js";

import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';

export let knowledgeRouter = express.Router();

knowledgeRouter.use(cors());

knowledgeRouter.get('/', async (req, res, next) => {
    let _tokenAvailability = await checkTokenAvailable(req.header('Authorization'));
    if(_tokenAvailability.tokenExist){
        let boardData = await getBoardData();
        res.status(200);
        res.send({
            code: 200,
            data: boardData
        });
    }
    else{
        res.status(500);
        res.send({
        	code: 50099,
            message: "Token Expired"
        });
    }
});

knowledgeRouter.get('/QandA', (req, res, next) => {
    let _tokenAvailability = await checkTokenAvailable(req.header('Authorization'));
    if(_tokenAvailability.tokenExist){
        let QandAData = await getQandA();
        res.status(200);
        res.send(QandAData);
    }
    else{
        res.status(500);
        res.send({
        	code: 50099,
            message: "Token Expired"
        });
    }
});
