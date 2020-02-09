import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

import '../imports/api/router.js';


import '../imports/ui/pasilists/pasilists.js';
import '../imports/ui/userlist/userlist.js';
import '../imports/ui/userdetail/userdetail.js';

Template.home.onCreated(function homeOnCreated() {
    this.token = new ReactiveVar(null);
    this.docID = new ReactiveVar(null);
    this.patients = new ReactiveVar(null);
    this.pasis = new ReactiveVar(null);
});

Template.home.helpers({
    isloggedin: function(){
        return !Template.instance().token.get();
    },
    patients: function(){
        return Template.instance().patients.get();
    },
    doctor: function(){
        Session.set('CurrentPatient', Template.instance().patients.get()[0]);
        return Template.instance().docID.get();
    }
});

Template.home.events({
  'submit .login-form': async (event, instance) => {
      event.preventDefault();

      const target = event.target;
      const text_user = target.username.value;
      const text_pass = target.password.value;

      const result = await Meteor.callPromise('admin-login', {
        user: text_user,
        pass: text_pass
      });

      if(!result.truth){
        alert('Either username or password is wrong.');
        throw new Meteor.Error('Either username or password is wrong.');
      }
      else{
        console.log(result.patients);
        instance.token.set(result.token);
        instance.docID.set(result.docID);
        instance.patients.set(result.patients);
        Session.set('pasis', result.pasis);
        Session.set('patients', result.patients);
        console.log(result.pasis);
      }

      return false;
      
  }
});


/*

*/

/** 
 *  async function(){
      const res = await Meteor.callPromise('showallpatient', {doctor: Template.instance().docID.get()});
      console.log(res);
      return res;
    }
 * 
*/