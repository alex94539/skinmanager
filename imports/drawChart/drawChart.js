import moment from 'moment';

export class createChart {
	pasi;
	container;
	dataChart;
	chartSelectedYear = Number(moment().format('YYYY'));
	chartSelectedMethod = 'month';

	constructor(container, pasidata) {
		this.pasi = pasidata;
        this.container = container;
	}

	overviewWillEnter() {
		this.createChartData(this.pasi);
	}

	createChart(_data) {
		let _labels = [];
		let _min = -1;
		let _max = -1;
		for (const item of _data) {
			if (item.data !== null) {
				// 找最小
				if (_min === -1 || item.data < _min) {
					_min = item.data;
				}
				// 找最大
				if (_max === -1 || item.data > _max) {
					_max = item.data;
				}
			}
			_labels.push(item.label);
        }
		// 計算報表min與max
		_min = _min === -1 ? 0 : Math.floor(_min / 10) * 10;
        _max = _max === -1 ? 0 : Math.ceil(_max / 10) * 10;
        /*
		this.dataChart = new Chart(this.container, {
			type: 'line',
			data: {
				labels: _labels,
				datasets: [
					{
						data: _data.map(e => e.data),
						fill: false,
						borderColor: '#ef8c4b',
						lineTension: 0.1,
						spanGaps: true
					}
				]
			},
			options: {
				legend: {
					display: false
				},
				scales: {
					yAxes: [
						{
							display: true,
							ticks: {
								max: _max,
								min: _min,
								stepSize: 10
							}
						}
					]
				}
			}
        });
        */
        this.dataChart = anychart.line();
        this.series = this.dataChart.line(_data.map(e => [e.label, e.data]));
        this.series.name('Pasi數值');
        this.dataChart.container(this.container);
        //this.dataChart.xScale().mode('continuous');

        this.dataChart.draw();
	}
	/*
	 *  @待修改
	 */
	segmentChanged(event) {
		if (event === 'week' || event === 'month') {
			this.chartSelectedMethod = event;
		}
		this.createChartData();
	}

	onChangeChartDate(e) {
		switch (e) {
			case 'l':
				this.chartSelectedYear = this.chartSelectedYear - 1;
				break;
			case 'r':
				this.chartSelectedYear = this.chartSelectedYear + 1;
				break;
		}
		this.createChartData();
	}

	createChartData() {
		let _chartData = [];
		switch (this.chartSelectedMethod) {
			case 'month':
				for (let i = 1; i < 13; i++) {
					const _s_i = i < 10 ? `0${i}` : `${i}`;
					const _date = `${this.chartSelectedYear}-${_s_i}`;
					_chartData.push(
						this.findPasiData(
							moment(_date, 'YYYY-MM')
								.startOf('months')
								.unix(),
							moment(_date, 'YYYY-MM')
								.endOf('months')
								.unix()
						)
					);
                }
                console.log(_chartData);
				break;
			case 'week':
				let _begin = moment(
					`${this.chartSelectedYear}-01-01`,
					'YYYY-MM-DD'
				).startOf('weeks');
				let _begin_unix = 0,
					_end_unix = 0;
				if (_begin.format('YYYY') === this.chartSelectedYear.toString()) {
					_begin_unix = _begin.unix();
					_end_unix = _begin.endOf('weeks').unix();
				} else {
					_begin = moment(`${this.chartSelectedYear}-01-01`, 'YYYY-MM-DD');
					_begin_unix = _begin.unix();
					_end_unix = _begin.endOf('weeks').unix();
				}
				_chartData.push(this.findPasiData(_begin_unix, _end_unix));
				_begin.add(1, 'weeks');
				while (Number(_begin.format('YYYY')) === this.chartSelectedYear) {
					_chartData.push(
						this.findPasiData(
							_begin.startOf('weeks').unix(),
							_begin.endOf('weeks').unix()
						)
					);
					_begin.add(1, 'weeks');
				}
				if (
					Number(_begin.startOf('weeks').format('YYYY')) ===
					this.chartSelectedYear
				) {
					_chartData.push(
						this.findPasiData(
							_begin.startOf('weeks').unix(),
							_begin.endOf('month').unix()
						)
					);
				}
				break;
        }
        console.log(_chartData);
		this.createChart(_chartData);
	}

	findPasiData(_begin_unix, _end_unix){
		const _arr_pasi = this.pasi.filter(e => {
			const _now = moment(e.createdAt).unix();
			return _begin_unix <= _now && _now <= _end_unix;
        });
		return _arr_pasi.length > 0
			? {
					label: `${moment(_arr_pasi[_arr_pasi.length - 1].createdAt).format(
						'MM/DD'
					)}`,
					data: _arr_pasi[_arr_pasi.length - 1].pasiScore
			  }
			: {
					label: moment.unix(_begin_unix).format('MM/DD'),
					data: 0
			  };
	}

	test(params) {
		console.log(test);
	}
}
