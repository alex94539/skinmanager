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
    });
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
    "click #notice_pasi_edit"(event, instance) {
        let _this = this;
        Session.set('editPageSettings',{
            title: '貼心小提醒－編輯文章',
            type: 'modifyNoti',
            contentObj: _this,
            backTo: 'notice'
        });
        console.log(this);
        FlowRouter.go("editor");
    },
    "click #notice_button_newNoti"(event, instance) {
        event.preventDefault();
        Session.set('editPageSettings', {
			title: '貼心小提醒－新增文章',
			type: 'newNoti',
            contentObj: null,
            backTo: 'notice'
		});
        FlowRouter.go("editor");
    },
    'click #notice_pasi_delete'(event, instance){
        event.preventDefault();
        let _this = this;
        let r = confirm(`是否刪除此筆提醒：「${_this.title}」？`);
        if(r){
            Meteor.call('deleteNotification', {
                ID: _this.ID,
                token: Session.get('token')
            },(err, result) => {
                alert('已成功刪除');
                Meteor.call("grabNotification",　
                    { token: Session.get("token") },
                    (err, result) => {
                        Session.set("notice_data", result);
                });
            });
        }
        else{
            return;
        }
    }
});