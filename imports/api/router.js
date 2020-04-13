import { FlowRouter } from 'meteor/kadira:flow-router';
import { DocHead } from 'meteor/kadira:dochead';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';

import '../../client/login/login.js';

import '../../client/loading/loading.js';

import '../../client/addPatient/addPatient.js';
import '../../client/overview/overview.js';
import '../../client/errorPage/errorPage.js';
import '../../client/editParagraph/editParagraph.js';
import '../../client/editPatient/editPatient.js';
import '../ui/navbar/navbar.js';

FlowRouter.route('/', {
	name: 'login',
	action() {
		DocHead.setTitle('拒絕乾癬');
		BlazeLayout.render('login', {});
	}
});

FlowRouter.route('/loading', {
	name: 'loading',
	action() {
		DocHead.setTitle('Loading');
		BlazeLayout.render('loading', {});
	}
});
/*
FlowRouter.route('/overview', {
	name: 'overview',
	action() {
		BlazeLayout.render('overview', {
			navbar: 'navbar',
			patients: 'overview_patients',
			patientDetail: 'overview_patientDetail',
			pasiLists: 'overview_pasiLists',
			pasiTable: 'overview_pasiTable',
			pasiChart: 'overview_pasiChart'
		});
	}
});
*/
/*
 *  顯示錯誤頁面
 */
FlowRouter.route('/errorPage', {
	name: 'errorPage',
	action() {
		DocHead.setTitle('錯誤');
		BlazeLayout.render('errorPage');
	}
});

FlowRouter.route('/addPatient', {
	name: 'addPatient',
	action(params, queryParams) {
		console.log(queryParams);
		BlazeLayout.render('addPatient', {
			function: 'navbar',
			first: 'addPatient_patientForm'
		});
	}
});

const patient = FlowRouter.group({
    prefix: '/editPatient',
    name: 'editPatient'
});

patient.route('/overview', {
    name: 'overview',
    action(){
		DocHead.setTitle('使用者管理');
        BlazeLayout.render('editPatient_overview', {
            navbar: 'navbar'
        });
    }
})

const paragraph = FlowRouter.group({
	prefix: '/editParagraph',
	name: 'editParagraph'
});

paragraph.route('/notice', {
	name: 'notice',
	action() {
		DocHead.setTitle('貼心小提醒')
		BlazeLayout.render('editParagraph_notice', {
			navbar: 'navbar'
		});
	}
});

paragraph.route('/knowledge', {
	name: 'knowledge',
	action() {
		BlazeLayout.render('editParagraph_knowledge_general', {
			navbar: 'navbar'
		});
	}
});

paragraph.route('/QandA', {
	name: 'knowledge_qanda',
	action(){
		DocHead.setTitle('常見問答集');
		BlazeLayout.render('editParagraph_knowledge_qanda', {
			navbar: 'navbar'
		});
	}
});

paragraph.route('/editor', {
	name: 'editor',
	action() {
		BlazeLayout.render('editParagraph_editPage', {
			navbar: 'navbar'
		});
	}
});
