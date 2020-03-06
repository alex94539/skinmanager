import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var'

import './overview_patients.html';

Template.overview_patients.onCreated(function() {
    let _this = this;
    _this.patients = new ReactiveVar(Session.get('patients'));
    _this.keyword = new ReactiveVar(null);
    
});

Template.overview_patients.helpers({
    patients: function (){
        if(!Template.instance().keyword.get()){
            
            
            return Template.instance().patients.get();
        }
        else{
            let temp = [];
            Template.instance().patients.get().forEach(element => {
                if(element.username.search(Template.instance().keyword.get()) != -1){
                    temp.push(element);
                }
            });
            
            return temp;
        }
    }
});

Template.overview_patients.events({
    'submit #searchPatient'(event, instance){
        event.preventDefault();
        const target = event.target;
        const keyword = target.keyword.value;
        Template.instance().keyword.set(keyword);

    },
    'click .patients'(event, instance){
        event.preventDefault();
        Session.set('currentPatient', this);
    }
});

//Template.instance().patients.get();