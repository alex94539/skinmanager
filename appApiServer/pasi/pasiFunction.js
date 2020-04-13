import { connection } from '../../db/mysql.js';
import moment from 'moment';

export function getPasiByID(ID){
    return new Promise((res, rej) => {
        connection.query(
            'SELECT * from `pasi` WHERE `pasi`.`ID` = ?',
            [ID],
            (err, result) => {
                if(err) throw err;
                result.forEach((temp) => {
                    temp.head = JSON.parse(temp.head);
                    temp.upper = JSON.parse(temp.upper);
                    temp.lower = JSON.parse(temp.lower);
                    temp.body = JSON.parse(temp.body);
                });
                res(result);
            });
    });
}

export function addNewPasi(obj, ID){
    return new Promise((res, rej) => {
		connection.query(
			'INSERT INTO `pasi` (`index`, `createdAt`, `head`, `upper`, `lower`, `body`, `ID`) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
			[   
                moment().format('YYYY-MM-DD hh:mm:ss'),
				JSON.stringify(obj.head),
				JSON.stringify(obj.upper),
				JSON.stringify(obj.lower),
				JSON.stringify(obj.body),
                ID
            ],
			(err, result) => {
				if (err) throw err;
				console.log(`pasi added`);
				resolve({
					code: 200,
					update_success_count: 1,
				});
			});
	});
}

export function checkIsPasiOwner(pasiIndex, ID){
    return new Promise((res, rej) => {
        connection.query(
            'SELECT * from `pasi` WHERE `ID` = ? AND `index` = ?',
            [ID, pasiIndex],
            (err, result) => {
                if(!result.length){
                    res({
                        isOwner: false
                    });
                }
                else{
                    res({
                        isOwner: true
                    });
                }
            });
    });
}

export function setPasiDeleted(pasiIndex){
    connection.query(
        'UPDATE `pasi` SET `is_deleted` = 1 WHERE `index` = ?',
        [pasiIndex],
        (err, reuslt) => {

        });
}

export function updatePasi(index, obj){
    return new Promise((resolve, reject) => {
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
				resolve({
					code: 200,
					update_success_count: 5,
				});
			}
		);
		});
}