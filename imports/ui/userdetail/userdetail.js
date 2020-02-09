import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'

import './userdetail.html';

Template.userdetail.onCreated(function(){
    console.log('userdetail created');
});

Template.userdetail.events({

});

Template.userdetail.helpers({
    name: function(){
        return Session.get('patients')[Session.get('CurrentPatient')].username;
    },
    photo: function(){
        return Session.get('patients')[Session.get('CurrentPatient')].photo;
    },
    gender: function(){
        return Session.get('patients')[Session.get('CurrentPatient')].gender;
    },
    birthday: function(){
        return Session.get('patients')[Session.get('CurrentPatient')].birthday;
    }
});