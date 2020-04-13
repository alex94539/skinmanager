import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

import { authRouter } from './auth/auth.js';
import { pasiRouter } from './pasi/pasi.js';
import { knowledgeRouter } from './knowledge/knowledge.js';

export const app = express();


app.use(express.static(__dirname + "/"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.listen(3000, function() {
    console.log(`AppApi is listening on port 3000!`);
});


app.use('/auth', authRouter);
app.use('/pasi', pasiRouter);
app.use('/knowledge', knowledgeRouter);