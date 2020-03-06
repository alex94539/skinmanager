import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';

import { connection } from '../db/mysql.js';

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
	async grabPasi({ patientID, startFrom, token }) {
		check(patientID, Number);
		console.log('grab');
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
	},
	async addPatient({ username, password, nickname, name, birthday, gender }) {
		check(username, String);
		check(password, String);
		check(nickname, String);
		check(name, String);
		check(birthday, String);
		check(gender, String);
		const chek = await checkAccountUsed(username);
		if (chek.truth) {
			return { used: true };
		}
		await addPatient(username, password, nickname, name, birthday, gender);
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
    if(await auth(token)){
      return await grabPatientList();
    }
    else{
      return null;
    }
  }
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

function addPatient(username, password, nickname, name, birthday, gender) {
	return new Promise((res, rej) => {
		connection.query(
			'INSERT INTO `user` (`username`, `password`, `patient_of`, `nickname`, `createdAt`, `status`, `name`, `birthday`, `gender`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				username,
				password,
				1,
				nickname,
				new Date().toISOString(),
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

function adminLog(name, token) {
	return new Promise((res, rej) => {
		connection.query(
			'INSERT INTO `admin_login_log` (`username`, `token`, `is_active`, `createdAt`) VALUES (?, ?, ?, ?)',
			[name, token, true, moment().format()],
			(err, result) => {}
		);
	});
}

function grabNotification() {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT * from `notification` WHERE `is_deleted`=?',
			[0],
			(err, result) => {
				res(result);
			}
		);
	});
}

function grabPatientList(){
  return new Promise((res, rej) => {
    connection.query(
      'SELECT `index`, `username`,`name`,`birthday`,`gender` from `user` WHERE `user`.`status` = 1', 
      [], 
      (err, result) => {
        res(result);
      });
  });
}