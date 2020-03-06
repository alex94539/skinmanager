import { FlowRouter } from "meteor/kadira:flow-router";

import './errorPage.html';

Template.errorPage.events({
  "click #toLoginPage": function(event, instance) {
    console.log("click");
    event.preventDefault();
    FlowRouter.go("login");
  }
});