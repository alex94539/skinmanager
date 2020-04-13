import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';


import './editParagraph_knowledge_qanda.html';

Template.editParagraph_knowledge_qanda.onCreated(function(){
    console.log(Session.get('Q&A'));
    this.currentQA = new ReactiveVar();
});

Template.editParagraph_knowledge_qanda.onRendered(function() {

});

Template.editParagraph_knowledge_qanda.helpers({
    QandAElement: function(){
        return Session.get('Q&A');
    }
});

Template.editParagraph_knowledge_qanda.events({
    'click .editElement'(event, instance){
        event.preventDefault();
        let _this = this;
        Session.set('editPageSettings', {
            title: '常見問答集－編輯問答',
            type: 'modifyQA',
            contentObj: _this,
            backTo: 'knowledge_qanda'
        });
        FlowRouter.go('editor');
    },
    'click .deleteElement'(event, instance){
        event.preventDefault();
        let temp = confirm('確定刪除此筆QA?');
        if(temp){
            Meteor.call('deleteQandAByID', {ID: this.ID, token: Session.get('token')}, (err, result) => {
                if(err) throw err;
                Meteor.call('grabQandA', {token: Session.get('token')}, (err, result) => {
                    Session.set('Q&A', result);
                });
            });
        }
        else{
            return;
        }
    },
    'click #knowledge_qanda_addQandA'(event, instance){
        event.preventDefault();
        Session.set('editPageSettings', {
            title: '常見問答集－編輯問答',
            type: 'newQA',
            contentObj: null,
            backTo: 'knowledge_qanda'
        });
        FlowRouter.go('editor');
    },
    'click .eachPatient'(event, instance){
        event.preventDefault();
        instance.currentQA.set(this);
        instance.find('#editPatient_patientList').style.display = 'none';
        instance.find('#knowledge_qanda_QandAdetail').style.display = 'block';
        instance.find('#knowledge_qanda_QandAtitle').innerHTML = this.title;
        instance.find('#knowledge_general_content').innerHTML = this.content;
        instance.find('#knowledge_qanda_addQandA').style.display = 'none';
        instance.find('#knowledge_qanda_modifyQandA').style.display = 'block';
    },
    'click #knowledge_hide_but'(event, instance){
        event.preventDefault();
        instance.find('#editPatient_patientList').style.display = 'block';
        instance.find('#knowledge_qanda_QandAdetail').style.display = 'none';
        instance.find('#knowledge_qanda_addQandA').style.display = 'block';
        instance.find('#knowledge_qanda_modifyQandA').style.display = 'none';
    },
    'click #knowledge_qanda_modifyQandA'(event, instance){
        Session.set('editPageSettings', {
            title: '常見問答集－編輯問答',
            type: 'modifyQA',
            contentObj: instance.currentQA.get(),
            backTo: 'knowledge_qanda'
        });
        FlowRouter.go('editor');
    }
});