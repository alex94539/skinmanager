import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';

import { connection } from '../db/mysql.js';
import { futimesSync } from 'fs';

Meteor.methods({
	async 'admin-login'({ user, pass }) {
		check(user, String);
		check(pass, String);
		//console.log(user, pass, "passed check");
		//console.log(this.connection.clientAddress);
		const token = jsonwebtoken.sign(
			{ username: user, userIP: this.connection.clientAddress },
			Meteor.settings.jwtSecret
		);

		const res = await login(user, pass, token);

		return res;
	},
	async showAllPatient({ doctor, token }) {
		check(doctor, Number);

		if (await auth(token)) {
			return await findPatient(doctor);
		} else {
			return null;
		}
	},
	async grabPasi({ patientID, token }) {
		check(patientID, Number);
		console.log('grab');
		/*
		if (await auth(token)) {
			if (startFrom > (await count(patientID))) {
				return {
					notAtEnd: false
				};
			} else {
				return {
					data: await grabPasi(patientID, startFrom),
					notAtEnd: true
				};
			}
		} else {
			return null;
		}
		*/
		if(await auth(token)){
			return await grabPasi(patientID);
		}
		else{
			return null;
		}
	},
	async deletePasiByID({ID, token}){
		if(await auth(token)){
			await deletePasiByID(ID);
		}
	},
	async addPatient({ username, password, name, birthday, gender, token }) {
		if (!(await auth(token))) {
			return;
		}
		check(username, String);
		check(password, String);
		check(name, String);
		check(birthday, String);
		check(gender, String);
		const chek = await checkAccountUsed(username);
		if (chek.truth) {
			return { used: true };
		}
		await addPatient(username, password, name, birthday, gender);
		return { used: false };
	},
	async editPatient({ name, gender, birthday, token, ID }) {
		if (await auth(token)) {
			await editPatient(name, gender, birthday, ID);
			return true;
		} else {
			return false;
		}
	},
	async editPatient_password({ password, name, gender, birthday, token, ID }) {
		if (await auth(token)) {
			await editPatient_password(password, name, gender, birthday, ID);
			return true;
		} else {
			return false;
		}
	},
	async deletePatient({ ID, token }) {
		if (await auth(token)) {
			await deletePatient(ID);
		} else {
			return false;
		}
	},
	async grabNotification({ token }) {
		if (await auth(token)) {
			return await grabNotification();
		} else {
			return null;
		}
	},
	async auth({ token }) {
		return auth(token);
	},
	async grabPatientList({ token }) {
		if (await auth(token)) {
			return await grabPatientList();
		} else {
			return null;
		}
	},

	/** 新增/編輯文章區域 */
	async addNotification({title, content, token}) {
		if (await auth(token)) {
			return await addNotification(title, content);
		}	
		else{
			return new Meteor.Error('notAuthorized');
		}
	},
	async modifyNotification({title, content, ID, token}){
		if(await auth(token)){
			return await modifyNotification(title, content, ID);
		}
		else{
			return null;
		}
	},
	async deleteNotification({ID, token}){
		if(await auth(token)){
			return await deleteNotification(ID);
		}
		else{
			return null;
		}
	},
	async grabTopicById({ID, token}){
		if(await auth(token)){
			return await grabTopicById(ID);
		}	
		else{	
			return null;
		}
	},
	async updateTopicById({ID, content, token}){
		if(await auth(token)){
			await updateTopicById(ID, content);
		}
		
	},
	async grabQandA({token}){
		if(await auth(token)){
			return await grabQandA();
		}
	},
	
	async newQandA({title, content, token}){
		if(await auth(token)){
			return await newQandA(content, title);
		}
	},
	
	async updateQandAByID({ID, content, title, token}){
		if(await auth(token)){
			await updateQandAByID(ID, content, title)
		}
		else{

		}
	},
	async deleteQandAByID({ID, token}){
		if(await auth(token)){
			await deleteQandAByID(ID);
		}
	},
	
});

async function login(user, pass, token) {
	await updateLoginLog(user);
	return await checkLoginData(user, pass, token);
}

function checkLoginData(user, pass, token) {
	return new Promise(async (res, rej) => {
		connection.query(
			'SELECT * FROM `adminuser` WHERE user = ?',
			[user],
			async (err, result) => {
				if (!result.length || result[0].pwd_bycrypt != pass) {
					res({ truth: false });
				} else {
					adminLog(user, token);
					res({
						truth: true,
						token: token,
						user: result[0].user,
						id: result[0].userindex
					});
				}
			}
		);
	});
}

function updateLoginLog(user) {
	return new Promise((res, rej) => {
		connection.query(
			'UPDATE `admin_login_log` SET `is_active` = ? WHERE `admin_login_log`.`username` = ? AND `admin_login_log`.`is_active` = ?',
			[false, user, true],
			(err, result) => {
				if (err) throw err;
				res();
			}
		);
	});
}
function auth(token) {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT * FROM `admin_login_log` WHERE `token` = ? and `is_active` = ?',
			[token, true],
			(err, result) => {
				if (err) throw err;
				if (!result.length) {
					res(false);
				} else {
					res(true);
				}
			}
		);
	});
}

function findPatient(doctor) {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT * FROM `user` WHERE patient_of = ?',
			[doctor],
			(err, result) => {
				let counter = 0;
				for (let h = 0; h < result.length; h++) {
					result[h].count = counter;
					counter++;
				}
				res(result);
			}
		);
	});
}

function grabPasi(patientID){
	return new Promise((res, rej) => {
		connection.query('SELECT * FROM `pasi` WHERE `ID` = ? AND `is_deleted` = 0',
		[patientID],
		(err, result) => {
			let temp = [];
			result.forEach(element => {
				
				element.head = JSON.parse(element.head);
				element.upper = JSON.parse(element.upper);
				element.lower = JSON.parse(element.lower);
				element.body = JSON.parse(element.body);

				element.head.size = dealScoreOnEachPart(element.head.size);
				element.upper.size = dealScoreOnEachPart(element.upper.size);
				element.lower.size = dealScoreOnEachPart(element.lower.size);
				element.body.size = dealScoreOnEachPart(element.body.size);
				element.headscore = (0.1 * dealScoreOnEachPart(element.head.size / 9) * (element.head.score.erythema + element.head.score.thickness + element.head.score.scale)).toFixed(1);
				element.upperscore = (0.2 * dealScoreOnEachPart(element.upper.size / 18) * (element.upper.score.erythema + element.upper.score.thickness + element.upper.score.scale)).toFixed(1);
				element.lowerscore = (0.4 * dealScoreOnEachPart(element.lower.size / 36) * (element.lower.score.erythema + element.lower.score.thickness + element.lower.score.scale)).toFixed(1);
				element.bodyscore = (0.3 * dealScoreOnEachPart(element.body.size / 37) * (element.body.score.erythema + element.body.score.thickness + element.body.score.scale)).toFixed(1);
				element.pasiScore = (Number(element.headscore) + Number(element.upperscore) + Number(element.lowerscore) + Number(element.bodyscore)).toFixed(1);
				//console.log(element.pasiScore);
				temp.push(element);
			});
			res(temp);
		});
	});	
}

function dealScoreOnEachPart(score){
	if(!score){
		return 0;
	}
	else if(score < 0.1){
		return 1;
	}
	else if(0.1 <= score && score < 0.29){
		return 2;
	}
	else if(0.3 <= score && score < 0.49){
		return 3;
	}
	else if(0.5 <= score && score < 0.69){
		return 4;
	}
	else if(0.7 <= score && score < 0.89){
		return 5;
	}
	else if(0.9 <= score && score <= 1){
		return 6;
	}
}

function deletePasiByID(ID){
	return new Promise((res, rej) => {
		connection.query('UPDATE `pasi` SET `is_deleted` = 1 WHERE `pasi`.`index` = ?',
		[ID],
		(err, result) => {
			res();
		});
	});
}

/*
function grabPasi(patientID, startFrom) {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT * FROM `pasi` WHERE `ID` = ? ORDER BY `index` DESC LIMIT ?, 10',
			[patientID, startFrom],
			(err, result) => {
				res(result);
			}
		);
	});
}
*/

function count(ID) {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT COUNT(*) FROM `pasi` WHERE `ID` = ?',
			[ID],
			(err, result) => {
				res(result[0]['COUNT(*)']);
			}
		);
	});
}

function LimitedPasi(obj) {
	let promisearr = [];
	let counter = 0;
	obj.forEach(eachdata => {
		promisearr.push(
			new Promise((res, rej) => {
				connection.query(
					'SELECT * FROM `pasi` WHERE ID = ? LIMIT 0,4',
					[eachdata.index],
					(err, result) => {
						if (err) throw err;

						res(result);
					}
				);
			})
		);
	});
	return promisearr;
}

function checkAccountUsed(username) {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT * from `user` WHERE username=?',
			[username],
			(err, result) => {
				console.log(result.length);
				if (result.length) {
					res({
						truth: true
					});
				} else {
					res({
						truth: false
					});
				}
			}
		);
	});
}

function addPatient(username, password, name, birthday, gender) {
	return new Promise((res, rej) => {
		connection.query(
			'INSERT INTO `user` (`username`, `password`, `patient_of`, `createdAt`, `status`, `name`, `birthday`, `gender`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			[
				username,
				password,
				1,
				moment().format('YYYY-MM-DD hh:mm:ss'),
				1,
				name,
				birthday,
				gender
			],
			(err, result) => {
				if (err) throw err;
				res(result);
			}
		);
	});
}

function editPatient(name, gender, birthday, ID) {
	return new Promise((res, rej) => {
		connection.query(
			'UPDATE `user` SET `name` = ?, `gender` = ?, `birthday` = ? WHERE `user`.`index` = ?',
			[name, gender, birthday, ID],
			(err, result) => {
				res();
			}
		);
	});
}

function editPatient_password(password, name, gender, birthday, ID) {
	return new Promise((res, rej) => {
		connection.query(
			'UPDATE `user` SET `password` = ?, `name` = ?, `gender` = ?, `birthday` = ? WHERE `user`.`index` = ?',
			[password, name, gender, birthday, ID],
			(err, result) => {
				res();
			}
		);
	});
}

function adminLog(name, token) {
	return new Promise((res, rej) => {
		connection.query(
			'INSERT INTO `admin_login_log` (`username`, `token`, `is_active`, `createdAt`) VALUES (?, ?, ?, ?)',
			[name, token, true, moment().format('YYYY-MM-DD hh:mm:ss')],
			(err, result) => {}
		);
	});
}

function grabNotification() {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT * from `notification` WHERE `is_deleted`=? ORDER BY ID DESC',
			[0],
			(err, result) => {
				res(result);
			}
		);
	});
}

function grabPatientList() {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT `index`, `username`,`name`,`birthday`,`gender` from `user` WHERE `user`.`status` = 1',
			[],
			(err, result) => {
				res(result);
			}
		);
	});
}

function deletePatient(ID) {
	return new Promise((res, rej) => {
		connection.query(
			'UPDATE `user` SET `status` = 0 WHERE `user`.`index` = ?',
			[ID],
			(err, result) => {
				res();
			}
		);
	});
}

function addNotification(title, content){
	return new Promise((res, rej) => {
		connection.query('INSERT INTO `notification` (`title`, `data`, `createdAt`, `is_deleted`) VALUES (?, ?, ?, ?)',
		[title, content, moment().format('YYYY-MM-DD hh:mm:ss'), 0],
		(err, result) => {
			res();
		});
	})
}

function modifyNotification(title, data, ID){
	return new Promise((res, rej) => {
		connection.query('UPDATE `notification` SET `title` = ?, `data` = ? WHERE `notification`.`ID` = ?',
		[title, data, ID],
		(err, result) => {
			res();
		});
	});
}

function deleteNotification(ID){
	return new Promise((res, rej) =>{
		connection.query('UPDATE `notification` SET `is_deleted` = ? WHERE `notification`.`ID` = ?',
		[1, ID],
		(err, result) => {
			res();
		});
	});
}

function grabTopicById(ID){
	return new Promise((res, rej) => {
		connection.query('SELECT * FROM `topic` WHERE `Topic_ID`=?', [ID], (err, result) => {
			console.log(result);
			res(result);
		});
	});
}

function updateTopicById(ID, content){
	return new Promise((res, rej) => {
		connection.query('UPDATE `topic` SET `Topic_detail` = ? WHERE `topic`.`Topic_ID` = ?',
		[content, ID],
		(err, result) => {
			res();
		});
	});
}

function grabQandA(){
	return new Promise((res, rej) => {
		connection.query('SELECT * from `q&a` WHERE `is_deleted` = ?',
		[0],
		(err, result) => {
			res(result);
		});
	});
}

function newQandA(content, title){
	return new Promise((res, rej) => {
		connection.query('INSERT into `q&a` (`title`, `content`, `createdAt`, `is_deleted`) VALUES (?, ?, ?, ?)',
		[title, content, moment().format('YYYY-MM-DD hh:mm:ss'), 0],
		(err, result) => {
			res()
		});
	});
}

function updateQandAByID(ID, content, title){
	return new Promise((res, rej) => {
		connection.query('UPDATE `q&a` SET `content`=?, `title`=? WHERE `q&a`.`ID` = ?',
		[content, title, ID],
		(err, result) => {
			console.log('updated');
			res();
		})
	});
}

function deleteQandAByID(ID){
	return new Promise((res, rej) => {
		connection.query('UPDATE `q&a` SET `is_deleted` = 1 WHERE `q&a`.`ID` = ?',
		[ID],
		(err, result) => {
			res();
		});
	})
}