import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';


import './pasilists.html';

Template.pasilists.onCreated(function(){
    let _this = this;
    _this.lis = new ReactiveVar([]);
    _this.current = new ReactiveVar(0);
    Session.set('CurrentPatient', 0);
    
    
});

Template.pasilists.helpers({
    pasis: function() {
        console.log(Session.get('pasis'));
        return Session.get('pasis')[Session.get("CurrentPatient")];
    },
    
});

Template.pasilists.events({

});

Template.pasi.helpers({
    CurrentCount: function(){
        if(!Session.get('pasis')[Session.get("CurrentPatient")].length){
            console.log(Session.get('pasis')[Session.get("CurrentPatient")].length);
            return false;
        }
        else{
            return true;
        }
    }
});