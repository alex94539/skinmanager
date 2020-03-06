import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from "meteor/kadira:flow-router";


import './login.html';

Template.login.events({
  "submit .login-form": async (event, instance) => {
    event.preventDefault();

    const target = event.target;
    const text_user = target.username.value;
    const text_pass = target.password.value;

    const result = await Meteor.callPromise("admin-login", {
      user: text_user,
      pass: text_pass
    });

    if (!result.truth) {
      alert("Either username or password is wrong.");
      throw new Meteor.Error("Either username or password is wrong.");
    } else {
      console.log(result);
      Session.set('token', result.token);
      Session.set('doctorID', result.id);
      Session.set('doctorName', text_user);
      FlowRouter.go('loading');
    }

    return false;
  }
});