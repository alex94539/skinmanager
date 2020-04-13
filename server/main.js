import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import '../methods/methods.js';
import '../picServer/picServer.js';
import '../appApiServer/appApi.js';

Meteor.startup(() => {
  // code to run on server at startup

    if(Meteor.isServer){
        console.log('Server started at ' + moment().format('YYYY-MM-DD hh:mm:ss'));
    }
});
