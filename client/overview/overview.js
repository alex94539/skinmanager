import { Meteor } from 'meteor/meteor';
import { FlowRouter } from "meteor/kadira:flow-router";
import { Session } from 'meteor/session';

import './overview_patients/overview_patients.js';
import './overview_patientDetail/overview_patientDetail.js';
import './overview_pasiLists/overview_pasiLists.js';
import './overview_pasiTable/overview_pasiTable.js';
import './overview_pasiChart/overview_pasiChart.js';

import './overview.html';

Template.overview.onCreated(async function(){

    if(!Session.get('token') || await Meteor.callPromise('auth', {})){
        FlowRouter.go('errorPage');
    }

    Meteor.call(
      "showAllPatient",
      { doctor: Session.get("doctorID"), token: Session.get("token") },
      (err, result) => {
        console.log(result);
        Session.set('patients',result);
        Session.set("currentPatient", result[0]);
      }
    );
});

Template.overview.helpers({
    user: function (){
        return Session.get('doctorName');
    }
});