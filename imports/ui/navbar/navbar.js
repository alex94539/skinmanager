import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './navbar.html';

Template.navbar.onCreated(function() {
	//this.editUser = new ReactiveVar();
  //this.editParagraph = new ReactiveVar();
  console.log(window.screen.height);
});

Template.navbar.onRendered(function() {
	this.editUser = this.find('#div_editUser');
	this.editParagraph = this.find('#div_editParagraph');
	this.editParagraph_ul = this.find('#editParagraph_ul');
	this.knowledge = this.find('#navbar_knowledge');
	this.knowledge_ul = this.find('#knowledge_ul');
	this.div_editUser = this.find('#div_editUser');
});

Template.navbar.helpers({});

Template.navbar.events({
	'click #overview'() {
		FlowRouter.go('overview');
	},
	'click #managePatient'() {},
	'click #addPatient'() {
		FlowRouter.go('addPatient');
	},
	'click #navbar_editUser'(event, instance) {
		event.preventDefault();

		FlowRouter.go('overview');
	},
	'click #navbar_editParagraph'(event, instance) {
		event.preventDefault();

		instance.editParagraph.classList.toggle('active');
		//instance.div_editParagraph.classList.toggle('active');
		if (instance.editParagraph_ul.style.display == 'block') {
			instance.editParagraph_ul.style.display = 'none';
		} else {
			instance.editParagraph_ul.style.display = 'block';
		}
	},
	'click #navbar_knowledge'(event, instance) {
		event.preventDefault();

		instance.knowledge.classList.toggle('active');
		if (instance.knowledge_ul.style.display == 'block') {
			instance.knowledge_ul.style.display = 'none';
		} else {
			instance.knowledge_ul.style.display = 'block';
		}
	},
	'click #navbar_notice'(event, instance) {
		FlowRouter.go('notice');
	},
	'click #navbar_knowledgeUl_know'(event, instance) {
		Meteor.call(
			'grabTopicById',
			{ ID: 1, token: Session.get('token') },
			(err, result) => {
        console.log(result);
				Session.set('knowledgePage', {
					title: '認識乾癬',
					result: result
				});
				FlowRouter.go('knowledge');
			}
		);
  },
  'click #navbar_knowledgeUl_reason'(event, instance){
    Meteor.call(
			'grabTopicById',
			{ ID: 2, token: Session.get('token') },
			(err, result) => {
				console.log(result);
				Session.set('knowledgePage', {
					title: '乾癬生成原因',
					result: result
				});
				FlowRouter.go('knowledge');
			}
		);
  },
  'click #navbar_knowledgeUl_treatment'(event, instance){
    Meteor.call(
			'grabTopicById',
			{ ID: 3, token: Session.get('token') },
			(err, result) => {
				console.log(result);
				Session.set('knowledgePage', {
					title: '乾癬治療方式',
					result: result
				});
				FlowRouter.go('knowledge');
			}
		);
  },
  'click #navbar_knowledgeUl_takeCare'(event, instance){
    Meteor.call(
			'grabTopicById',
			{ ID: 4, token: Session.get('token') },
			(err, result) => {
				console.log(result);
				Session.set('knowledgePage', {
					title: '日常生活照顧',
					result: result
				});
				FlowRouter.go('knowledge');
			} 
		);
  },
  'click #navbar_knowledgeUl_QandA'(event, instance){
    Meteor.call('grabQandA', {token: Session.get('token')}, (err, result) => {
      Session.set('Q&A', result);
      console.log(result);
      FlowRouter.go('knowledge_qanda');
    });
  }
  
});
