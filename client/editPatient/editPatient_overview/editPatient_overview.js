import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import './editPatient_overview.html';

Template.editPatient_overview.onCreated(function() {
	if (!Session.get('token')) {
		FlowRouter.go('errorPage');
    }
    

	Meteor.call(
		'grabPatientList',
		{ token: Session.get('token') },
		(err, result) => {
			if (err) throw err;
			Session.set('editPatient_patientList', result);
			console.log(result);
		}
	);
});

Template.editPatient_overview.helpers({
	patientElement: function() {
		return Session.get('editPatient_patientList');
	}
});

Template.editPatient_overview.events({
    'click .editElement'(event, instance){
        console.log(event, instance, this);
    },
    'click .eachPatient'(event, instance){
        console.log(event, instance, this);
    }
});
