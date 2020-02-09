import { FlowRouter } from 'meteor/kadira:flow-router';
import { DocHead } from 'meteor/kadira:dochead';

FlowRouter.route('/', {
    name: 'home',
    action() {
        DocHead.setTitle('mumi');

    }
});


FlowRouter.route('/allpasi/:_id', {
    name: 'patientpasi.show',
    action(params, queryParams) {
        console.log(params._id);
        if (queryParams) {
            console.log(queryParams.token);
        }
    }
});