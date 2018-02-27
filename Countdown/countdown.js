(function() {
	var Countdown = function(el,opts) {
		var defaults = {
			container_id:el,//容器id
			format: 'hh:mm:ss', //格式
			endtime: '', //结束时间
			interval: 1000, //多久倒计时一次 单位：ms
			countEach: function(time) { //每单位时间出发事件,传入一个对象，包含时间信息(month)和时间格式化输出(format)
				document.getElementById('countdown').innerHTML =  time['format'];
			},
			countEnd: function(time) {} //倒计时结束回调事件
		}
		opts = opts || {};
		for (var w in defaults) {
			if ("undefined" == typeof opts[w]) {
				opts[w] = defaults[w];
			}
		}
		this.params = opts;
		this.countdown_container = document.getElementById(this.params.container_id);

		this._hander = null;
		this._start = 0;
		this._end = 0;
		this.isTimestamp = null;
	};

	Countdown.prototype = {
		//开始
		start: function(time) {
			this.isTimestamp = isNaN(time); //是否为秒计数模式
			if (this.isTimestamp) {
				this._start = time ? this.getTimestamp(time) : (+new Date());
				this._end = this.getTimestamp(this.params.endtime);
			} else {
				this._start = time * 1e3;
				this._end = this.params.endtime * 1e3;
			}
			this.count();
		},
		stop: function() {
			clearInterval(this._hander);
		},
		count: function() {
			var self = this;
			this._hander = setInterval(function() {
				self._start -= self.params.interval;
				self.params.countEach(self.getTime(self._start));
				if (self._start <= self._end) {
					clearInterval(self._hander);
					self.params.countEnd();
				}
			}, self.params.interval);
		},
		//获取时间戳
		getTimestamp: function(str) {
			return +new Date(str) || +new Date('1970/1/1 ' + str);
		},
		timeFormat: function(fmt, timestamp) {
			var date = new Date(timestamp);
			var o = {
				"M+": date.getMonth() + 1, //月份
				"d+": date.getDate(), //日
				"h+": date.getHours(), //小时
				"m+": date.getMinutes(), //分
				"s+": date.getSeconds(), //秒
				"q+": Math.floor((date.getMonth() + 3) / 3), //季度
				"S": date.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return fmt;
		},
		getTime: function(timestamp) {
			var self = this;
			var date, format;
			if (this.isTimestamp) {
				date = new Date(timestamp);
				format = self.timeFormat(self.params.format, timestamp);
			} else {
				date = new Date();
				format = timestamp / 1e3;
			}
			return {
				'year': date.getFullYear(),
				'month': date.getMonth() + 1,
				'day': date.getDate(),
				'hour': date.getHours(),
				'minute': date.getMinutes(),
				'second': date.getSeconds(),
				'quarter': Math.floor((date.getMonth() + 3) / 3),
				'microsecond': date.getMilliseconds(),
				'format': format
			};
		}
	};

	window.Countdown = Countdown;
})();