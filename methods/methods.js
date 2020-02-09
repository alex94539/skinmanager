import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';

import jsonwebtoken from 'jsonwebtoken';

import { connection } from '../db/mysql.js';


Meteor.methods({
    async 'admin-login'({user, pass}) {
        check(user, String);
        check(pass, String);
        //console.log(user, pass, "passed check");
        const res = await login(user, pass);

        return res;
    },
    async 'showallpatient'({doctor}){
        check(doctor, Number);

        const res = await findpatient(doctor);
        return res;
    },
    async 'grabpasi'({patientID}){
        check(patientID, Number);

        const res = await findPasi(patientID);

        return res;
    }
});

function login(user, pass){
    return new Promise((res, rej) => {
        connection.query('SELECT * FROM `adminuser` WHERE user = ?', [user], async (err, result) => {
            if(!result) res({ truth: false });
            if(result[0].pwd_bycrypt == pass){
                const token = jsonwebtoken.sign({ username: user, password: pass }, Meteor.settings.jwtSecret);
                const patients = await findpatient(result[0].userindex);
                res({ 
                    truth: true,
                    token: token,
                    docID: result[0].userindex,
                    patients: patients,
                    pasis: await Promise.all(LimitedPasi(patients))
                });
            }
            else{
                res({ truth: false });
            }
        });
    });
}

function findpatient(doctor){
    return new Promise((res, rej) => {
        connection.query('SELECT * FROM `user` WHERE patient_of = ?', [doctor], (err, result) => {
            let counter = 0;
            for(let h=0;h<result.length;h++){
                result[h].count = counter;
                counter++;
            }
            res(result);
        });
    });
}

function findPasi(patientID){
    return new Promise((res, rej) => {
        connection.query('SELECT * FROM `pasi` WHERE ID = ?', [patientID], (err, result) => {
            res(result);
        })
    });
}

function LimitedPasi(obj){
    let promisearr = [];
    let counter = 0;
    obj.forEach((eachdata) => {
        promisearr.push(new Promise((res, rej) => {
            connection.query('SELECT * FROM `pasi` WHERE ID = ? LIMIT 0,4', [eachdata.index], (err, result) => {
                if(err) throw err;
                
                res(result);
            });
        }));
    });
    return promisearr;
}