import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

import { authRouter } from './auth/auth.js';
import { pasiRouter } from './pasi/pasi.js';
import { knowledgeRouter } from './knowledge/knowledge.js';
import { notifiRouter } from './notification/notification.js';

export const app = express();

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));
app.options('*', cors());

app.listen(3000, function () {
	console.log(`AppApi is listening on port 3000!`);
});

app.use('/auth', authRouter);
app.use('/pasi', pasiRouter);
app.use('/board', knowledgeRouter);
app.use('/notification', notifiRouter);
