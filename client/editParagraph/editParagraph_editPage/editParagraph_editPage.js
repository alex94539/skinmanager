import imgur from 'imgur';

import "./editParagraph_editPage.html";

Template.editParagraph_editPage.onCreated(function() {});

/*
 *  @mumi
 *
 * 
 * 
 */

Template.editParagraph_editPage.onRendered(function() {
  this.container = this.find("#editor");
  this.editor = new FroalaEditor(this.container, {
    imageUploadURL: "http://140.113.68.220:3000/picServer",
    imageUploadMethod: "post",
    events: {
      "image.beforeUpload": function(images) {
        imgur.setClientId(Meteor.settings.imgurClientID);
        /*
                imgur.uploadFile(images).then((result) => {
                    console.log(typeof(result));
                });
                */
        console.log(this);
        console.log(images);
      }
    }
  });
});     

Template.editParagraph_editPage.events({
  "click #finish"(event, instance) {
    event.preventDefault();

    console.log(instance.editor.html.get());
  }
});