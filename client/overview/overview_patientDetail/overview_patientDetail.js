import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Tracker } from "meteor/tracker";
import { ReactiveVar } from 'meteor/reactive-var';

import './overview_patientDetail.html';

Template.overview_patientDetail.onCreated(function() {
    this.current = new ReactiveVar(null);

    
});

Template.overview_patientDetail.onRendered(function() {
    let _this = this;

    Tracker.autorun(() => {
      let temp = Session.get("currentPatient");
      console.log(temp);
      _this.current.set(temp);
    });
})

Template.overview_patientDetail.helpers({
    name: function(){
        return Template.instance().current.get().username;
    },
    gender: function(){
        return Template.instance().current.get().gender;
    },
    birthday: function(){
        return Template.instance().current.get().birthday;
    },
    photo: function(){
        return Template.instance().current.get().photo;
    }
});