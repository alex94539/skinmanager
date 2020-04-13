import { Meteor } from 'meteor/meteor';

import mysql from 'mysql';

//export const testConnection = mysql.createConnection(Meteor.settings.db_config);


export const connection = mysql.createPool(Meteor.settings.db_config);



//console.log(liveDB.select('SELECT * FROM `pasi` WHERE ID = 1', [{table: 'pasi'}]))


//'UPDATE `user` SET `birthday` = ? WHERE `user`.`index` = ?', [birthday, ID]