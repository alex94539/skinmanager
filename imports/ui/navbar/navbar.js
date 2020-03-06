import { FlowRouter } from "meteor/kadira:flow-router";
import { ReactiveVar } from "meteor/reactive-var";

import './navbar.html';


Template.navbar.onCreated(function() {
  //this.editUser = new ReactiveVar();
  //this.editParagraph = new ReactiveVar();
});

Template.navbar.onRendered(function() {
  this.editUser = this.find('#editUser');
  this.editParagraph = this.find('#editParagraph');
  this.editParagraph_ul = this.find("#editParagraph_ul");
  this.knowledge = this.find('#knowledge');
  this.knowledge_ul = this.find("#knowledge_ul");
  this.div_editUser = this.find("#div_editUser");
  this.div_editParagraph = this.find("#div_editParagraph");
});

Template.navbar.helpers({
    
});



Template.navbar.events({
  "click #overview"() {
    FlowRouter.go('overview');
  },
  "click #managePatient"() {

  },
  "click #addPatient"() {
    FlowRouter.go('addPatient');
  },
  "click #editUser"(event, instance){
    event.preventDefault();

    FlowRouter.go('overview');

  },
  "click #editParagraph"(event, instance){
    event.preventDefault();

    instance.editParagraph.classList.toggle('active');
    instance.div_editParagraph.classList.toggle('active');
    if(instance.editParagraph_ul.style.display == 'block'){
      instance.editParagraph_ul.style.display = "none";
    }
    else{
      instance.editParagraph_ul.style.display = "block";
    }
  },
  'click #knowledge'(event, instance) {
    event.preventDefault();

    instance.knowledge.classList.toggle('active');
    if (instance.knowledge_ul.style.display == "block") {
      instance.knowledge_ul.style.display = "none";
    } else {
      instance.knowledge_ul.style.display = "block";
    }
  },
  'click #notice'(event, instance){
    FlowRouter.go("notice");
  }
});