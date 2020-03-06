import { Session } from 'meteor/session';

import "./overview_pasiTable.html";

Template.overview_pasiTable.onCreated(function() {});

Template.overview_pasiTable.helpers({
  pasi: function() {
    let temp = Session.get("currentPasi");
    temp.head = JSON.parse(temp.head);
    temp.body = JSON.parse(temp.body);
    temp.upper = JSON.parse(temp.upper);
    temp.lower = JSON.parse(temp.lower);
    return temp;
  }
});

Template.overview_pasiTable.events({});