import { check } from "meteor/check";
import "./addPatient_patientForm.html";

Template.addPatient_patientForm.onCreated(function() {

});

Template.addPatient_patientForm.onRendered(function() {
    this.username = this.find("#username");
    this.password = this.find("#password");
    this.password_confirm = this.find("#password_confirm");
    this.name = this.find("#name");
    this.nickname = this.find("#nickname");
    this.birthday = this.find("#birthday");
    this.gender = this.find("#gender");
});

Template.addPatient_patientForm.helpers({

});

Template.addPatient_patientForm.events({
  async "click #submit"(event, instance) {
    event.preventDefault();
    let _this = Template.instance();
    if (!_this.username.value) {
        alert("請輸入帳號");
        return;
    }
    if (!_this.password.value) {
        alert("請輸入密碼");
        return;
    }
    if (!_this.password_confirm.value) {
        alert("請再次輸入密碼");
        return;
    }
    if (!_this.name.value) {
        alert("請輸入姓名");
        return;
    }
    if (!_this.nickname.value) {
        alert("請輸入暱稱");
        return;
    }
    if (!_this.birthday.value) {
        alert("請輸入出生年月日");
        return;
    }
    if (!_this.gender.value || _this.gender.value == "--請選擇--") {
        alert("請選擇性別");
        return;
    }
    if (_this.password.value !== _this.password_confirm.value) {
        console.log(_this.password.value);
        alert("輸入的密碼不一致");
        return;
    }

    const res = await Meteor.callPromise('addPatient', {
        username: _this.username.value,
        password: _this.password.value,
        nickname: _this.nickname.value,
        name: _this.name.value,
        birthday: _this.birthday.value,
        gender: _this.gender.value
    });
    if(res.used){
        alert('此帳號已被使用');
    }
  }
});
