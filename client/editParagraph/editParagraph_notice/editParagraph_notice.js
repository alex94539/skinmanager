import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { FlowRouter } from "meteor/kadira:flow-router";

import "./editParagraph_notice.html";

Template.editParagraph_notice.onCreated(function() {
  if (!Session.get("token")) {
    FlowRouter.go("errorPage");
  }

  Meteor.call(
    "grabNotification",
    { token: Session.get("token") },
    (err, result) => {
      Session.set("notice_data", result);
    }
  );
});

Template.editParagraph_notice.onRendered(function() {
  this.template_list = this.find("#template_list");
});

Template.editParagraph_notice.helpers({
  notice_pasis: function() {
    console.log(Session.get("notice_data"));
    return Session.get("notice_data");
  }
});

Template.editParagraph_notice.events({
  "click #notice_button"(event, instance) {
    event.preventDefault();

    instance.template_list;
  },
  "click #notice_pasi_edit"(event, instance) {},
  "click #notice_button_newNoti"(event, instance) {
    event.preventDefault();
    FlowRouter.go("editor");
  }
});