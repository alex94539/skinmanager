import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import { check } from 'meteor/check';

import moment from 'moment';

import { createChart } from '../../../imports/drawChart/drawChart.js';

import './editPatient_overview.html';

Template.editPatient_overview.onCreated(function() {
	if (!Session.get('token')) {
		FlowRouter.go('errorPage');
    }
    

	Meteor.call(
		'grabPatientList',
		{ token: Session.get('token') },
		(err, result) => {
			if (err) throw err;
			Session.set('editPatient_patientList', result);
			console.log(result);
		}
    );
    this.type = new ReactiveVar(1);
    this.currentPosition = new ReactiveVar(1);
    this.currentModifyingID = new ReactiveVar();
    this.keyWord = new ReactiveVar();
    this.specify = new ReactiveVar(null);
    this.currentPasiList = new ReactiveVar();
    this.currentPasiElement = new ReactiveVar();
    this.dataChart;
    this.selectedYear = new ReactiveVar(Number(moment().format('YYYY')));
});

Template.editPatient_overview.onRendered(function(){
    this.overLay = this.find('#editPatient_overLay');
    this.account = this.find('#editPatient_overLay_inputForm_account');
    this.password = this.find('#editPatient_overLay_inputForm_password');
    this.passwordConfirm = this.find('#editPatient_overLay_inputForm_passwordConfirm');
    this.name = this.find('#editPatient_overLay_inputForm_name');
    this.gender = this.find('#editPatient_overLay_inputForm_gender');
    this.birthYear = this.find('#editPatient_overLay_inputForm_year');
    this.birthMonth = this.find('#editPatient_overLay_inputForm_month');
    this.birthDay = this.find('#editPatient_overLay_inputForm_day');
    this.position = this.find('#editPatient_overLay_inputForm_position');
});

Template.editPatient_overview.helpers({
	patientElement: function() {
        let temp = [];
        
        if(Template.instance().specify.get()){
            return [Template.instance().specify.get()];
        }
        else if (!Template.instance().keyWord.get()){
			return Session.get('editPatient_patientList');
        }
        else{
            Session.get('editPatient_patientList').forEach(element => {
                if(element.name.search(Template.instance().keyWord.get()) != -1){
                    temp.push(element);
                }
            });
            return temp;
        }
    },
    type: function(){
        console.log(Template.instance())
        if (Template.instance().type.get()){
            return '新增'; 
        }
        else{
            return '編輯';
        }
    },
    newPatient: function(){
        return Template.instance().type.get();
    },
    pasiList: function(){
        return Template.instance().currentPasiList.get();
    },
    pasiElement: function(){
        return Template.instance().currentPasiElement.get();
    },
    selectedYear: function() {
        return Template.instance().selectedYear.get();
    }
});

Template.editPatient_overview.events({
	'click .editElement'(event, instance) {
		if (instance.specify.get()) {
			alert('請先回到總攬再刪除/編輯');
			return;
		}
		console.log(this);
		instance.type.set(0);
		instance.overLay.style.display = 'block';
		instance.account.value = this.username;
		instance.account.disabled = true;
		instance.password.value = '';
		instance.passwordConfirm.value = '';
		instance.name.value = this.name;
		instance.gender.value = this.gender;
		instance.birthYear.value = this.birthday.split('-')[0];
		instance.birthMonth.value = this.birthday.split('-')[1];
		instance.birthDay.value = this.birthday.split('-')[2];
		instance.position.value =
			instance.currentPosition.get() == 1 ? '病患' : '管理員';
		instance.currentModifyingID.set(this.index);
	},
	'click .deleteElement'(event, instance) {
		if (instance.specify.get()) {
			alert('請先回到總攬再刪除/編輯');
			return;
		}
		const r = confirm(`確定刪除使用者 ${this.name} ？`);
		if (!r) {
			return;
		} else {
			Meteor.call(
				'deletePatient',
				{ ID: this.index, token: Session.get('token') },
				(err, result) => {
					Meteor.call(
						'grabPatientList',
						{ token: Session.get('token') },
						(err, result) => {
							if (err) throw err;
							Session.set('editPatient_patientList', result);
							console.log(result);
						}
					);
					alert('成功刪除使用者');
				}
			);
		}
	},
	'click .eachPatient'(event, instance) {
		console.log('specify');
		let _this = this;
		instance.specify.set(this);
		instance.find('#editPatient_patientChartFunc').style.display = 'block';
		instance.find('#editPatient_patientChart').style.display = 'block';
		instance.find('#editPatient_patientDetail').style.display = 'block';
		instance.find('#editPatient_topRegion').style.display = 'none';
		instance.find('#editPatient_switch').style.display = 'none';
        instance.find('#editPatient_eachPasi').style.display = 'none';
        instance.selectedYear.set(Number(moment().format('YYYY')));
		Meteor.call(
			'grabPasi',
			{
				patientID: _this.index,
				token: Session.get('token')
			},
			(err, result) => {
				instance.currentPasiList.set(result);
				instance.find('#editPatient_patientChart_chart').innerHTML = '';
				instance.dataChart = new createChart(
					instance.find('#editPatient_patientChart_chart'),
					result
				);
				instance.dataChart.overviewWillEnter();
				console.log(instance.currentPasiList.get());
			}
		);
	},
	'click #editPatient_addPatient'(event, instance) {
		instance.type.set(1);
		instance.account.disabled = false;
		instance.overLay.style.display = 'block';
		instance.account.value = '';
		instance.password.value = '';
		instance.passwordConfirm.value = '';
		instance.name.value = '';
		instance.gender.value = '--請選擇--';
		instance.birthYear.value = '';
		instance.birthMonth.value = '';
		instance.birthDay.value = '';
	},
	'click #editPatient_overLay_inputForm_cancel'(event, instance) {
		instance.overLay.style.display = 'none';
		instance.account.value = '';
		instance.password.value = '';
		instance.passwordConfirm.value = '';
		instance.name.value = '';
		instance.gender.value = '--請選擇--';
		instance.birthYear.value = '';
		instance.birthMonth.value = '';
		instance.birthDay.value = '';
		instance.position.value = '--請選擇--';
	},
	'click #editPatient_overLay_inputForm_confirm'(event, instance) {
		event.preventDefault();
		instance.position = instance.find(
			'#editPatient_overLay_inputForm_position'
		);

		console.log(instance);
		if (instance.type.get()) {
			addPatient(instance);
		} else {
			console.log(this);
			editPatient(instance);
		}
	},
	'submit #editPatient_keyWord'(event, instance) {
		event.preventDefault();
		instance.keyWord.set(instance.find('#editPatient_text').value);
	},
	'click .editPatient_deletePasi'(event, instance) {
		event.preventDefault();
		if (!confirm('確定刪除此筆pasi紀錄？')) {
			return;
		}
		let _this = this;
		Meteor.call(
			'deletePasiByID',
			{
				ID: _this.index,
				token: Session.get('token')
			},
			(err, reuslt) => {
				let temp = instance.currentPasiList.get();
				let temp2 = temp.filter((value, index, arr) => {
					return value.index != _this.index;
				});
				instance.currentPasiList.set(temp2);
			}
		);
	},
	'click .eachPasi'(event, instance) {
		event.preventDefault();
		instance.currentPasiElement.set(this);
		instance.find('#editPatient_eachPasiDetail').style.display = 'block';
		instance.find('#editPatient_eachPasi').style.display = 'none';
	},
	'click #editPatient_backToUserList'(event, instance) {
		event.preventDefault();
		instance.specify.set(null);
		instance.find('#editPatient_patientChartFunc').style.display = 'none';
		instance.find('#editPatient_patientChart').style.display = 'none';
		instance.find('#editPatient_patientDetail').style.display = 'none';
		instance.find('#editPatient_topRegion').style.display = 'block';
		instance.find('#editPatient_switch').style.display = 'block';
	},
	'click #editPatient_eachPasiDetail_backToAllPasi'(event, instance) {
		event.preventDefault();
		instance.find('#editPatient_eachPasiDetail').style.display = 'none';
		instance.find('#editPatient_eachPasi').style.display = 'block';
	},
	'click #editPatient_patientChart_toChart'(event, instance) {
		event.preventDefault();
		instance.find('#editPatient_patientChart').style.display = 'block';
		instance.find('#editPatient_eachPasi').style.display = 'none';
		instance.find('#editPatient_eachPasiDetail').style.display = 'none';
	},
	'click #editPatient_patientChart_toRecord'(event, instance) {
		event.preventDefault();
		instance.find('#editPatient_patientChart').style.display = 'none';
		instance.find('#editPatient_eachPasi').style.display = 'block';
		instance.find('#editPatient_eachPasiDetail').style.display = 'none';
	},
	'click #editPatient_patientChart_week'(event, instance) {
		event.preventDefault();
		instance.find('#editPatient_patientChart_chart').innerHTML = '';
		instance.dataChart.segmentChanged('week');
	},
	'click #editPatient_patientChart_month'(event, instance) {
		event.preventDefault();
		instance.find('#editPatient_patientChart_chart').innerHTML = '';
		instance.dataChart.segmentChanged('month');
	},
	'click #editPatient_patientChart_minus'(event, instance) {
		event.preventDefault();
		instance.selectedYear.set(instance.selectedYear.get() - 1);
		instance.find('#editPatient_patientChart_chart').innerHTML = '';
		instance.dataChart.onChangeChartDate('l');
	},
	'click #editPatient_patientChart_add'(event, instance) {
		event.preventDefault();
		instance.selectedYear.set(instance.selectedYear.get() + 1);
		instance.find('#editPatient_patientChart_chart').innerHTML = '';
		instance.dataChart.onChangeChartDate('r');
	}
});

function addPatient(instance){

    check(instance.account.value, String);
    check(instance.password.value, String);
    check(instance.name.value, String);
    check(instance.gender.value, String);
    check(instance.birthYear.value, String);
    check(instance.birthMonth.value, String);
    check(instance.birthDay.value, String);

    if (!checkNoEmptyField(instance)){
        return;
    }

    Meteor.call('addPatient',{
		username: instance.account.value,
		password: instance.password.value,
        name: instance.name.value,
        gender: instance.gender.value,
        birthday: `${instance.birthYear.value}-${instance.birthMonth.value}-${instance.birthDay.value}`,
        token: Session.get('token')
	},
	(err, result) => {
        if(result.used){
            alert('此帳號已被使用！');
        }
        else{
            instance.overLay.style.display = 'none';
            Meteor.call(
				'grabPatientList',
				{ token: Session.get('token') },
				(err, result) => {
				        if (err) throw err;
						Session.set('editPatient_patientList', result);
						console.log(result);
					}
			);
            alert('新增成功！');
        }
    });

}

function editPatient(instance){
    console.log(instance);
	check(instance.password.value, String);
	check(instance.name.value, String);
	check(instance.gender.value, String);
	check(instance.birthYear.value, String);
	check(instance.birthMonth.value, String);
    check(instance.birthDay.value, String);

    if(!checkEditNoEmptyField(instance)){
        return;
    }

    if(instance.password.value == instance.passwordConfirm.value && instance.password.value != ''){
        Meteor.call('editPatient_password',{
		    password: instance.password.value,
			name: instance.name.value,
			gender: instance.gender.value,
			birthday: `${instance.birthYear.value}-${instance.birthMonth.value}-${instance.birthDay.value}`,
			token: Session.get('token'),
			ID: instance.currentModifyingID.get()
		},(err, result) => {
            instance.overLay.style.display = 'none';
            Meteor.call('grabPatientList',{ token: Session.get('token') },
				(err, result) => {
					if (err) throw err;
					Session.set('editPatient_patientList', result);
					console.log(result);
            });
            alert('更新成功')
        });
    }
    else{
        Meteor.call('editPatient',{
			name: instance.name.value,
			gender: instance.gender.value,
			birthday: `${instance.birthYear.value}-${instance.birthMonth.value}-${instance.birthDay.value}`,
			token: Session.get('token'),
			ID: instance.currentModifyingID.get()
        },(err, result) => {
            instance.overLay.style.display = 'none';
            Meteor.call('grabPatientList',{ token: Session.get('token') },
				(err, result) => {
				if (err) throw err;
				Session.set('editPatient_patientList', result);
				console.log(result);
            });
            alert('更新成功');
        });
    }
}

function checkNoEmptyField(instance){
    Date.prototype.isValid = function(){return this.getTime() === this.getTime() };
    if(!instance.account.value){
        alert('請輸入帳號！');
        return false;
    }
    if(!instance.password.value && instance.type.get()){
        alert('請輸入密碼');
        return false;
    }
    if(!instance.passwordConfirm.value && instance.type.get()){
        alert('請再次輸入密碼');
        return false;
    }
    if(instance.passwordConfirm.value != instance.password.value){
        alert('輸入的密碼不一致');
        return false;
    }
    if(!instance.name.value){
        alert('請輸入姓名');
        return false;
    }
    if(instance.gender.value == '--請選擇--'){
        console.log(instance.gender.value);
        alert('請選擇生理性別');
        return false;
    }
    if(!instance.birthYear.value || !instance.birthMonth.value || !instance.birthDay.value){
        alert('請輸入出生年月日');
        return false;
    }
    if (!(new Date(`${instance.birthYear.value}-${instance.birthMonth.value}-${instance.birthDay.value}`)).isValid()){
        alert('請輸入正確的出生年月日');
        return false;
    }
	if (instance.position.value == '--請選擇--' && instance.type.get()) {
		alert('請選擇職位');
        return false;
	}

    return true;
}

function checkEditNoEmptyField(instance){
    Date.prototype.isValid = function() { return this.getTime() === this.getTime();};
    
    if(instance.password.value != instance.passwordConfirm.value){
        alert('輸入的密碼不一致！');
        return false;
    }
	if (!instance.name.value) {
		alert('請輸入姓名');
		return false;
	}
	if (instance.gender.value == '--請選擇--') {
		console.log(instance.gender.value);
		alert('請選擇生理性別');
		return false;
    }
	if (!instance.birthYear.value ||!instance.birthMonth.value ||!instance.birthDay.value) {
		alert('請輸入出生年月日');
	    return false;
	}
	if (!new Date(`${instance.birthYear.value}-${instance.birthMonth.value}-${instance.birthDay.value}`).isValid()) {
		alert('請輸入正確的出生年月日');
		return false;
	}

	return true;
}

Template.editPatient_eachPasiElement.events({
    
})