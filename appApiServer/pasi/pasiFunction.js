import { connection } from '../../db/mysql.js';
import moment from 'moment';

export function getPasiByID(ID) {
	return new Promise((res, rej) => {
		console.log(ID);
		connection.query(
			'SELECT * from `pasi` WHERE `pasi`.`ID` = ? AND `is_deleted` = 0',
			[ID],
			(err, result) => {
				if (err) throw err;
				//console.log(result);
				result.forEach((temp) => {
					temp.head = JSON.parse(temp.head);
					temp.upper = JSON.parse(temp.upper);
					temp.lower = JSON.parse(temp.lower);
					temp.body = JSON.parse(temp.body);
					delete temp['is_deleted'];
				});
				//console.log(result);

				res(result);
			}
		);
	});
}

export function addNewPasi(obj, ID) {
	return new Promise((res, rej) => {
		console.log(obj.head, obj.upper, obj.lower, obj.body);
		if (
			obj.head == undefined ||
			obj.upper == undefined ||
			obj.lower == undefined ||
			obj.body == undefined
		) {
			res({
				code: 200,
				update_success_count: 0,
				message: 'empty field',
			});
		} else {
			connection.query(
				'INSERT INTO `pasi` (`index`, `createdAt`, `head`, `upper`, `lower`, `body`, `ID`) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
				[
					new Date().toISOString(),
					JSON.stringify(obj.head),
					JSON.stringify(obj.upper),
					JSON.stringify(obj.lower),
					JSON.stringify(obj.body),
					ID,
				],
				(err, result) => {
					if (err) throw err;
					console.log(`pasi added`);
					res({
						code: 200,
						update_success_count: 1,
					});
				}
			);
		}
	});
}

export function checkIsPasiOwner(pasiIndex, ID) {
	return new Promise((res, rej) => {
		connection.query(
			'SELECT * from `pasi` WHERE `index` = ? AND `ID` = ?',
			[pasiIndex, ID],
			(err, result) => {
				console.log(pasiIndex, ID);
				//console.log(result);
				if (!result.length) {
					res({
						isOwner: false,
					});
				} else if (result[0].is_deleted) {
					res({
						isOwner: 'deleted',
					});
				} else {
					console.log(`isOwner`);
					res({
						isOwner: true,
					});
				}
			}
		);
	});
}

export function setPasiDeleted(pasiIndex) {
	connection.query(
		'UPDATE `pasi` SET `is_deleted` = 1 WHERE `index` = ?',
		[pasiIndex],
		(err, reuslt) => {}
	);
}

export function updatePasi(index, obj) {
	return new Promise((res, rej) => {
		console.log(obj.head, obj.upper, obj.lower, obj.body);
		if (
			obj.head == undefined ||
			obj.upper == undefined ||
			obj.lower == undefined ||
			obj.body == undefined
		) {
			res({
				code: 200,
				update_success_count: 0,
				message: 'empty field',
			});
		} else {
			connection.query(
				'UPDATE `pasi` SET `head` = ?, `upper` = ?, `lower` = ?, `body` = ? WHERE `pasi`.`index` = ?',
				[
					JSON.stringify(obj.head),
					JSON.stringify(obj.upper),
					JSON.stringify(obj.lower),
					JSON.stringify(obj.body),
					index,
				],
				(err, result) => {
					if (err) throw err;
					res({
						code: 200,
						update_success_count: 5,
					});
				}
			);
		}
	});
}
