import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';

import './userlist.html';

Template.userlist.onCreated(function() {
    console.log(`detail created`);

});

Template.userlist.helpers({

});

Template.userlist.events({
    'click .users': function(event, instance){
        Session.set('CurrentPatient', instance.data.count);
        console.log(Session.get('CurrentPatient'));
        
    }
})