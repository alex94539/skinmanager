import { Meteor } from "meteor/meteor";
import { ReactiveVar } from "meteor/reactive-var";
import { Tracker } from "meteor/tracker";
import { Session } from "meteor/session";
import {  } from "meteor/templating";

import "./overview_pasiLists.html";

Template.overview_pasiLists.onCreated(function() {
    this.patient = new ReactiveVar();
    this.error = new ReactiveVar(false);
    this.localSave = new ReactiveVar({});
    this.startFrom = new ReactiveVar(0);
    this.notAtEnd = new ReactiveVar(true);
    let _this = this
    Tracker.autorun(() => {
        _this.notAtEnd.set(true);
        Meteor.call(
          "grabPasi",
          {
            patientID: Session.get("currentPatient").index,
            startFrom: 0,
            token: Session.get("token")
          },
          (err, result) => {
            if (!result) {
              _this.error.set(true);
            }
            _this.patient.set(result.data);
            _this.startFrom.set(10);
            console.log(result);
            Session.set('currentPasiList', result.data);
            Session.set('currentPasi', result.data[0]);
            if(!result.notAtEnd){
                _this.notAtEnd.set(false);
            }
            //dealLocalSave(_this, result);
          }
        );
    });
    
});

Template.overview_pasiLists.helpers({
    pasiLists: function(){
        return Template.instance().patient.get();
    },
    notAtEnd: function(){
        return Template.instance().notAtEnd.get();
    }
    
});
//Template.instance().notAtEnd.get()[Session.get('currentPatient')];
Template.overview_pasiLists.events({
    'click .pasi'(event, instance){
        event.preventDefault();
        instance.startFrom.set(0);
        Session.set('currentPasi', this);
        console.log(this);
    },
    'click #loadMorePasi'(event, instance){
        event.preventDefault();
        if(!instance.notAtEnd.get()) return ;
        console.log(instance);
        Meteor.call("grabPasi", {
          patientID: Session.get("currentPatient").index,
          startFrom: Template.instance().startFrom.get(),
          token: Session.get("token")
        },(err, result) => {
            console.log('result', result);
            ////////處理pasi是否已經查詢完成
            ////////處理startFrom新值
            
            //let temp_notAtEnd = instance.notAtEnd.get();

            let temp_pasiData = instance.patient.get();

            if(result.notAtEnd){
                //temp_notAtEnd[Session.get("currentPatient")] = true;
                temp_pasiData = temp_pasiData.concat(result.data);
                instance.startFrom.set(instance.startFrom.get() + 10);
                instance.patient.set(temp_pasiData);
                Session.set('currentPasiList', temp_pasiData);

            }
            else{
                //temp_notAtEnd[Session.get("currentPatient")] = false;
                instance.notAtEnd.set(false);

            }
            
            ////////處理取得的資料 concat 到現有資料上


        });
    }
});

function dealLocalSave(_this, result){
    let temp = _this.localSave.get(); //取得當前localSave的資料

    if(result.notAtEnd)
    temp[Session.get("currentPatient").index] = [].concat(result);
    _this.localSave.set(temp);
    console.log(_this.localSave.get());
}