import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

import { upload } from './imageUpload.js';

console.log( cors() );
const app = express();

app.use(express.static(__dirname + "/"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/picServer', function(req, res) {
    console.log('picServer');
    upload(req, function(err, data) {
      if (err) {
        return res.status(404).end(JSON.stringify(err));
      }

      res.send(data);
    });
});

app.get('/test', function(req, res){
    res.send('mumi');
})
/*
// Create folder for uploading files.
var filesDir = path.join(path.dirname(require.main.filename), "uploads");

if (!fs.existsSync(filesDir)){
  fs.mkdirSync(filesDir);
}
*/
// Init server.
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});