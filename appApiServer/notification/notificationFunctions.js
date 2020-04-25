import { connection } from '../../db/mysql.js';

export function getNotification() {
	return new Promise((resolve, reject) => {
		connection.query(
			'SELECT * FROM `notification` WHERE `is_deleted` = 0 ORDER BY `ID` DESC',
			(err, result) => {
				if (err) throw err;
				result.forEach((data) => {
					delete data['is_deleted'];
				});
				resolve(result);
			}
		);
	});
}
