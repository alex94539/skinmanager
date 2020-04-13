import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import { DocHead } from 'meteor/kadira:dochead';

import '../../../../imports/editor/tinymce.js';

import './editParagraph_knowledge_general.html';

Template.editParagraph_knowledge_general.onCreated(function() {
	let _this = this;
    this.current = new ReactiveVar();
    this.isEditing = new ReactiveVar(0);
	Tracker.autorun(function() {
		_this.current.set(Session.get('knowledgePage'));
		DocHead.setTitle(_this.current.get().title);
	});
	console.log(this.current.get());
});

Template.editParagraph_knowledge_general.onRendered(function() {
    let _this = this
    Tracker.autorun(function(){
        _this.find('#knowledge_general_content').innerHTML = Session.get('knowledgePage').result[0].Topic_detail;
    });
});

Template.editParagraph_knowledge_general.helpers({
	title: function() {
		return Template.instance().current.get().title;
	},
	content: function() {
		return Template.instance().current.get().result[0].Topic_detail;
    },
    isEditing: function(){
        return Template.instance().isEditing.get();
    }
});

Template.editParagraph_knowledge_general.events({
	'click #knowledge_general_cancelBut'(event, instance) {
		tinymce.init({
			selector: '#knowledge_general_content',
			plugins: 'image autolink lists media paste textpattern table help',
			toolbar:
				'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
			menubar: 'file edit view insert format tools table help',
			toolbar_mode: 'floating',
			images_upload_url: 'http://140.113.68.220:3000/picServer',
			automatic_uploads: true,
			paste_data_images: true,
			height: window.screen.height * 0.7
		});
        instance.isEditing.set(1);
    },
    'click #knowledge_general_finishBut'(event, instance){
        Meteor.call('updateTopicById', {
            ID: instance.current.get().result[0].Topic_ID,
            content: tinymce.get('knowledge_general_content').getContent(),
            token: Session.get('token')
        });
        tinymce.get('knowledge_general_content').destroy();
        instance.isEditing.set(0);
    }
});
