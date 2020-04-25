import { connection } from '../../db/mysql.js';
import moment from 'moment';

export function getBoardData() {
	return new Promise((res, rej) => {
		connection.query('SELECT * from `topic`', [], (err, result) => {
			res(result);
		});
	});
}

export function getQandA() {
	return new Promise((res, rej) => {
		connection.query('SELECT * from `q&a`', [], (err, result) => {
			res(result);
		});
	});
}
