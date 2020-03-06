import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

import './addPatient.html';

import './addPatient_patientForm/addPatient_patientForm.js';

Template.addPatient.onCreated(async function() {
    if(!Session.get('token') || await Meteor.callPromise('auth', {})){
        FlowRouter.go('errorPage');
    }
});