import { connection } from '../../db/mysql.js';
import moment from 'moment';

//login management

export function isLoggedIn(account) {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT * from `login_log` WHERE `username` = ? AND `valid` = ?',
			[account, 1],
			(err, result) => {
				if (!result || !result.length) {
					res({
						previousActiveTokenExist: false,
					});
				} else {
					res({
						previousActiveTokenExist: true,
					});
				}
			}
		);
	});
}

export function login(account, pwd) {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT * from `user` WHERE `username` = ? AND `password` = ?',
			[account, pwd],
			(err, result) => {
				if (!result || !result.length) {
					res({
						truth: false,
					});
				} else {
					res({
						truth: true,
						index: result[0].index,
					});
				}
			}
		);
	});
}

export function expireTokenByAccount(account) {
	connection.query(
		'UPDATE `login_log` SET `valid` = 0 WHERE `login_log`.`userindex` = ?',
		[account]
	);
}

export function addLoginLog(token, account, device, index) {
	connection.query(
		'INSERT INTO `login_log` (`TID`, `Token`, `userID`, `Ctime`, `Utime`, `device_ID`, `valid`, `userindex`) VALUES (NULL, ?, ?, ?, ?, ?, 1, ?)',
		[
			token,
			account,
			moment().format('YYYY-MM-DD hh:mm:ss'),
			moment().format('YYYY-MM-DD hh:mm:ss'),
			device,
			index,
		]
	);
}

//logout management

export function logOut(token) {
	connection.query(
		'UPDATE `login_log` SET `valid` = 0 WHERE `login_log`.`Token` = ?',
		[token],
		(err, result) => {}
	);
}

//profile management

export function getUserProfileByID(ID) {
	return new Promise((resolve, reject) => {
		connection.query(
			'SELECT * FROM `user` WHERE `index` = ?',
			[ID],
			(err, result) => {
				if (err) throw err;
				resolve({
					code: 200,
					name: result[0].name,
					gender: result[0].gender,
					birthday: result[0].birthday,
					photo: result[0].photo,
				});
			}
		);
	});
}

export function updateProfile(obj, ID) {
	return new Promise(async (resolve, reject) => {
		let count = 0;
		if (obj.name) {
			count += 1;
			connection.query(
				'UPDATE `user` SET `name` = ? WHERE `user`.`index` = ?',
				[obj.name, ID],
				(err, result) => {
					if (err) throw err;
				}
			);
		}
		if (obj.password) {
			count += 1;
			connection.query(
				'UPDATE `user` SET password = ? WHERE `user`.`index` = ?',
				[obj.password, ID],
				(err, result) => {
					if (err) throw err;
				}
			);
		}
		if (obj.gender) {
			count += 1;
			connection.query(
				'UPDATE `user` SET `gender` = ? WHERE `user`.`index` = ?',
				[obj.gender, ID],
				(err, result) => {
					if (err) throw err;
				}
			);
		}
		if (obj.birthday) {
			count += 1;
			connection.query(
				'UPDATE `user` SET `birthday` = ? WHERE `user`.`index` = ?',
				[obj.birthday, ID],
				(err, result) => {
					if (err) throw err;
				}
			);
		}
		if (obj.photo) {
			count += 1;
			connection.query(
				'UPDATE `user` SET `photo` = ? WHERE `user`.`index` = ?',
				[obj.photo, ID],
				(err, result) => {
					if (err) throw err;
				}
			);
		}
		resolve({
			code: 200,
			update_success_count: count,
		});
	});
}
