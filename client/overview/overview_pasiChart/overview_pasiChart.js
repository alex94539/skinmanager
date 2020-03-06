import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { ReactiveVar } from "meteor/reactive-var";
import { Tracker } from "meteor/tracker";

import "./overview_pasiChart.html";

Template.overview_pasiChart.onCreated(function() {
  let _this = this;
  this.pasidata = new ReactiveVar();
  Tracker.autorun(() => {
    Meteor.call(
      "grabPasi",{
        patientID: Session.get("currentPatient").index,
        startFrom: 0,
        token: Session.get("token")
      },
      (err, result) => {
        Session.set('pasiChart', dealData(result.data));
      }
    );
  });
});

Template.overview_pasiChart.onRendered(function() {
  console.log('line27', Template.instance());
  Session.set("overview_currentPart", "頭部");

  const data = Session.get('pasiChart');
  console.log('line31', data)
  this.container = this.find("#chart");
  this.chart = anychart.line();
  this.series1 = this.chart.line([
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [7, 1],
    [8, 1],
    [9, 1]
  ]);
  this.series1.name("size");
  this.series2 = this.chart.line([
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [5, 3],
    [6, 3],
    [7, 3],
    [8, 3],
    [9, 3]
  ]);
  this.series2.name("erythema");
  this.series3 = this.chart.line([
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [6, 5],
    [7, 5],
    [8, 5],
    [9, 5]
  ]);
  this.series3.name("thickness");
  this.series4 = this.chart.line([
    [0, 7],
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
    [6, 7],
    [7, 7],
    [8, 7],
    [9, 7]
  ]);
  this.series4.name("scale");
  this.chart.container(this.container);
  this.chart.draw();
});

Template.overview_pasiChart.helpers({
  part: function() {
    return Session.get("overview_currentPart");
  }
});

Template.overview_pasiChart.events({
  "click #head"(event, instance) {
    Session.set("overview_currentPart", "頭部");

    let _this = Template.instance();
    let pasiChart = Session.get("pasiChart");
    
    _this.container.innerHTML = "";
    _this.chart = anychart.line();
    _this.series1 = _this.chart.line(pasiChart.head.size);
    _this.series1.name("size");
    _this.series2 = _this.chart.line(pasiChart.head.erythema);
    _this.series2.name("erythema");
    _this.series3 = _this.chart.line(pasiChart.head.thickness);
    _this.series3.name("thickness");
    _this.series4 = _this.chart.line(pasiChart.head.scale);
    _this.series4.name("scale");
    _this.chart.container(_this.container);
    _this.chart.draw();
  },
  "click #body"(event, instance) {
    event.preventDefault();
    Session.set("overview_currentPart", "身體");

    let _this = Template.instance();
    let pasiChart = Session.get("pasiChart");
    console.log(_this);

    _this.container.innerHTML = "";
    _this.chart = anychart.line();
    _this.series1 = _this.chart.line(pasiChart.body.size);
    _this.series1.name("size");
    _this.series2 = _this.chart.line(pasiChart.body.erythema);
    _this.series2.name("erythema");
    _this.series3 = _this.chart.line(pasiChart.body.thickness);
    _this.series3.name("thickness");
    _this.series4 = _this.chart.line(pasiChart.body.scale);
    _this.series4.name("scale");
    _this.chart.container(_this.container);
    _this.chart.draw();
  },
  "click #upper"(event, instance) {
    event.preventDefault();
    Session.set("overview_currentPart", "上肢");

    let _this = Template.instance();
    let pasiChart = Session.get("pasiChart");

    _this.container.innerHTML = "";
    _this.chart = anychart.line();
    _this.series1 = _this.chart.line(pasiChart.upper.size);
    _this.series1.name("size");
    _this.series2 = _this.chart.line(pasiChart.upper.erythema);
    _this.series2.name("erythema");
    _this.series3 = _this.chart.line(pasiChart.upper.thickness);
    _this.series3.name("thickness");
    _this.series4 = _this.chart.line(pasiChart.upper.scale);
    _this.series4.name("scale");
    _this.chart.container(_this.container);
    _this.chart.draw();
  },
  "click #lower"(event, instance) {
    event.preventDefault();
    Session.set("overview_currentPart", "下肢");

    let _this = Template.instance();
    let pasiChart = Session.get("pasiChart");

    _this.container.innerHTML = "";
    _this.chart = anychart.line();
    _this.series1 = _this.chart.line(pasiChart.lower.size);
    _this.series1.name("size");
    _this.series2 = _this.chart.line(pasiChart.lower.erythema);
    _this.series2.name("erythema");
    _this.series3 = _this.chart.line(pasiChart.lower.thickness);
    _this.series3.name("thickness");
    _this.series4 = _this.chart.line(pasiChart.lower.scale);
    _this.series4.name("scale");
    _this.chart.container(_this.container);
    _this.chart.draw();
  }
});

function dealData(pasis) {
  let counter = 0;
  pasis.forEach(element => {
    element.head = JSON.parse(element.head);
    element.body = JSON.parse(element.body);
    element.upper = JSON.parse(element.upper);
    element.lower = JSON.parse(element.lower);
    element.count = counter++;
  });

  console.log('line139', pasis);

  let data = {
    head: {
      size: [],
      erythema: [],
      thickness: [],
      scale: []
    },
    body: {
      size: [],
      erythema: [],
      thickness: [],
      scale: []
    },
    upper: {
      size: [],
      erythema: [],
      thickness: [],
      scale: []
    },
    lower: {
      size: [],
      erythema: [],
      thickness: [],
      scale: []
    }
  };
  for (let h = 0; h < pasis.length; h++) {
    let element = pasis[h];

    data.head.size.push([element.count + 1, element.head.size]);
    data.head.erythema.push([element.count + 1, element.head.score.erythema]);
    data.head.thickness.push([element.count + 1, element.head.score.thickness]);
    data.head.scale.push([element.count + 1, element.head.score.scale]);
    data.body.size.push([element.count + 1, element.body.size]);
    data.body.erythema.push([element.count + 1, element.body.score.erythema]);
    data.body.thickness.push([element.count + 1, element.body.score.thickness]);
    data.body.scale.push([element.count + 1, element.body.score.scale]);
    data.upper.size.push([element.count + 1, element.upper.size]);
    data.upper.erythema.push([element.count + 1, element.upper.score.erythema]);
    data.upper.thickness.push([
      element.count + 1,
      element.upper.score.thickness
    ]);
    data.upper.scale.push([element.count + 1, element.upper.score.scale]);
    data.lower.size.push([element.count + 1, element.lower.size]);
    data.lower.erythema.push([element.count + 1, element.lower.score.erythema]);
    data.lower.thickness.push([
      element.count + 1,
      element.lower.score.thickness
    ]);
    data.lower.scale.push([element.count + 1, element.lower.score.scale]);
  }
  console.log('line191',data);
  return data;
}
