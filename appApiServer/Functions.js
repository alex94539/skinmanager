import { connection } from '../db/mysql.js';


export function checkTokenAvailable(token){
    return new Promise((res, rej) => {
        connection.query('SELECT * from `login_log` WHERE `Token` = ? AND `valid` = 1',
        [token],
        (err, result) => {
            if(!result.length){
                res({
					tokenExist: false,
				});
            }
            else{
                res({
                    tokenExist: true,
                    index: result[0].userindex
				});
            }
        });
    });
}