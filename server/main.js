import { Meteor } from 'meteor/meteor';

import '../methods/methods.js';
import '../picServer/picServer.js';

Meteor.startup(() => {
  // code to run on server at startup

  if(Meteor.isServer){
    console.log('Server stated at ' + new Date().toISOString())
  }
});
