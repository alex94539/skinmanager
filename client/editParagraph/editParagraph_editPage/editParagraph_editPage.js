import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

import '../../../imports/editor/tinymce.js';

import './editParagraph_editPage.html';

Template.editParagraph_editPage.onCreated(function() {
    Session.set('editorExists', true);
    console.log(Meteor.settings.tinyMceApi);
});

Template.editParagraph_editPage.onRendered(function() {
    console.log(Session.get('editPageSettings'));
    if(!Session.get('editPageSettings') || Session.get('editPageSettings').type == 'newNoti' || Session.get('editPageSettings').type == 'newQA'){
        this.container = this.find('#editor');
        /*
        this.editor = new FroalaEditor(this.container, {
			imageUploadURL: 'http://140.113.68.220:3000/picServer',
			imageUploadMethod: 'post',
        });
        */
        this.editor = tinymce.init({
			selector: '#editor',
			plugins: 'image autolink lists media paste textpattern table help',
			toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
			menubar: 'file edit view insert format tools table help',
			toolbar_mode: 'floating',
			images_upload_url: 'http://140.113.68.220:3000/picServer',
			automatic_uploads: true,
            paste_data_images: true,
            height: window.screen.height * 0.7
		});
    }
    else if(Session.get('editPageSettings').type == 'modifyNoti'){
        this.find('#text_title').value = Session.get('editPageSettings').contentObj.title;
        this.container = this.find('#editor');
        this.container.innerHTML = Session.get('editPageSettings').contentObj.data;
        this.editor = tinymce.init({
			selector: '#editor',
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
    }
    
    else if(Session.get('editPageSettings').type == 'modifyQA'){
        this.find('#text_title').value = Session.get('editPageSettings').contentObj.title;
        this.container = this.find('#editor');
        this.container.innerHTML = Session.get('editPageSettings').contentObj.content;
        this.editor = tinymce.init({
			selector: '#editor',
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
    }
    
});

Template.editParagraph_editPage.helpers({
    title: function(){
        return Session.get('editPageSettings').title;
    }
});

Template.editParagraph_editPage.events({
	'click #finish'(event, instance) {
        event.preventDefault();

        console.log(tinymce.get('editor').getContent());
        
        if (!Session.get('editPageSettings') || Session.get('editPageSettings').type == 'newNoti'){
			Meteor.call('addNotification',{
				title: instance.find('#text_title').value,
				content: tinymce.get('editor').getContent(),
				token: Session.get('token')
				},(err, result) => {
                    console.log('notification added');
                    tinymce.get('editor').destroy();
                    FlowRouter.go(Session.get('editPageSettings').backTo);
            });
        }
        else if(Session.get('editPageSettings').type == 'modifyNoti'){
            Meteor.call('modifyNotification', {
                title: instance.find('#text_title').value,
                content: tinymce.get('editor').getContent(),
                ID: Session.get('editPageSettings').contentObj.ID,
				token: Session.get('token')
                }, (err, result) => {
                    console.log('notification modified');
                    tinymce.get('editor').destroy();
                    FlowRouter.go(Session.get('editPageSettings').backTo);
            });
        }
        
        else if(Session.get('editPageSettings').type == 'modifyQA'){
            console.log('modifyQA');
            Meteor.call('updateQandAByID', {
                ID: Session.get('editPageSettings').contentObj.ID,
                title: instance.find('#text_title').value,
                content: tinymce.get('editor').getContent(),
                token: Session.get('token')
                }, (err, result) => {
                    tinymce.get('editor').destroy();
                    FlowRouter.go(Session.get('editPageSettings').backTo);

            });
        }
        else if(Session.get('editPageSettings').type == 'newQA'){
            console.log('newQandA');
            Meteor.call('newQandA', {
                title: instance.find('#text_title').value,
                content: tinymce.get('editor').getContent(),
                token: Session.get('token')
                }, (err, result) => {
                    tinymce.get('editor').destroy();
                    FlowRouter.go(Session.get('editPageSettings').backTo);

            });
        }
        
        
    },
    'click #reset'(event, instance){
        event.preventDefault();

        console.log(instance);
        console.log(tinymce.get('editor').getContent());
    },
    'click #cancel'(event, instance){
        event.preventDefault();

        tinymce.get('editor').destroy();
        FlowRouter.go(Session.get('editPageSettings').backTo);
    }
});

/**
 * 
 * {
      title: '貼心小提醒－新增文章',
      type: 'modifyNoti',
      contentObj: _this
    }
 */