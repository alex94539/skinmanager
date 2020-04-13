import { Meteor } from 'meteor/meteor';

import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

import { upload } from './imageUpload.js';

const app = express();

app.use(express.static(__dirname + "/"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());



app.get('/test', function(req, res){
    res.send('mumi');
})

// Create folder for uploading files.
let temp = path.resolve('.');
temp = temp.split(path.sep + '.meteor')[0];
const root = temp.split('skinmanager')[0];
const filesDir = path.join(root, "picSave");


if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir);
}

// Init server.
app.listen(4000, function () {
    console.log("PicServer is listening on port 4000!");
});

app.get('/picSave/:pic', function(req, res){
    console.log('param', req.params.pic);
    let pic = path.join(filesDir, req.params.pic);
    res.sendFile(pic);
});

app.post('/picServer', function(req, res) {
	console.log('picServer');
	upload(req, root, function(err, data) {
		if (err) {
		    return res.status(404).end(JSON.stringify(err));
		}

		res.send(data);
	});
});