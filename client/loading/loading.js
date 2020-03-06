import { FlowRouter } from "meteor/kadira:flow-router";

import "./loading.html";

Template.loading.onCreated(async function() {
  const patientData = await Meteor.callPromise("showAllPatient", {
    doctor: Session.get("doctorID"),
    token: Session.get("token")
  });
  Session.set("patients", patientData);
  Session.set("currentPatient", patientData[0]);
  FlowRouter.go('overview');
  
});
