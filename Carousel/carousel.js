(function() {
	var Carousel = function(el, opts) {
		var defaults = {
			container_id: el, //容器id
			width: 300, //宽度
			height: 300, //高度
			circle: true, //是否生成底部圆圈按钮
			speeds: 20, //设置缓冲运动速度
			switchBtn: true, //是否生成左右切换按钮
			autoPlay: true, //是否自动轮播
			times: 3000, //设置自动轮播间隔时间
			isLeft: true //默认向左滑动
		}
		opts = opts || {};
		for (var w in defaults) {
			if ("undefined" == typeof opts[w]) {
				opts[w] = defaults[w];
			}
		}
		this.params = opts;
		this.carousel_container = document.getElementById(this.params.container_id);
		this.carousel_container.style.width = this.params.width + 'px';
		this.carousel_container.style.height = this.params.height + 'px';

		this.ul_container = document.getElementById('carousel-wrapper');
		this.len = this.ul_container.children.length;
		this.flag = true;
		this.num = 1;
		this.timer = null;
		this.timers = null;
	};

	Carousel.prototype = {
		//初始化
		init: function() {
			var self = this;
			this.supplementEle();
			if (this.params.switchBtn) {
				this.switchBtn();
			}
			if (this.params.circle) {
				this.circle();
			}
			if (this.params.autoPlay) {
				this.start();
				this.boxmove();
			}
		},
		//当鼠标悬浮在ul容器上，停止轮播
		boxmove: function() {
			var self = this;
			this.ul_container.addEventListener('mouseout', function(e) {
				self.start();
			}, false);
			this.ul_container.addEventListener('mouseover', function(e) {
				self.stops();
			}, false);
		},
		//开始轮播
		start: function() {
			var self = this;
			this.timers = setInterval(function() {
				if (self.params.isLeft) {
					self.go(-self.params.width);
				} else {
					self.go(self.params.width);
				}
			}, self.params.times);
		},
		//停止轮播
		stops: function() {
			clearInterval(this.timers)
		},
		//补充元素，为了让轮播更流畅
		supplementEle: function() {
			var fir = this.ul_container.children[0].cloneNode(true),
				last = this.ul_container.children[this.len - 1].cloneNode(true);
			this.ul_container.appendChild(fir);
			this.ul_container.insertBefore(last, this.ul_container.children[0]);
			this.len = this.ul_container.children.length;
			this.ul_container.style.left = -this.params.width + 'px';
		},
		//添加向前、向后按钮
		switchBtn: function() {
			var self = this;
			var prev_btn = document.createElement("div");
			var next_btn = document.createElement("div");
			prev_btn.className = "carousel-button carousel-button-prev";
			prev_btn.innerHTML = '<span class="carousel-button-text"> << </span>';
			next_btn.className = "carousel-button carousel-button-next";
			next_btn.innerHTML = '<span class="carousel-button-text"> >> </span>';

			this.carousel_container.insertBefore(prev_btn, this.carousel_container.children[0]);
			this.carousel_container.appendChild(next_btn);

			prev_btn.addEventListener('click', function(e) {
				self.events(e)
			}, false);

			next_btn.addEventListener('click', function(e) {
				self.events(e)
			}, false);
		},
		//向前、向后按钮点击事件绑定
		events: function(e) {
			var self = this;
			var oSrc = e.srcElement || e.target;

			if (oSrc.tagName.toLowerCase() == 'div' && oSrc.className.indexOf('carousel-button-prev') > -1) {
				if (!this.flag) {
					return;
				}
				self.go(this.params.width);
				if (self.params.circle) {
					self.showCircleButton();
				}
				return;
			}

			if (oSrc.tagName.toLowerCase() == 'div' && oSrc.className.indexOf('carousel-button-next') > -1) {
				if (!this.flag) {
					return;
				}
				self.go(-this.params.width);
				if (self.params.circle) {
					self.showCircleButton();
				}
			}
		},
		//显示底下的分页圆圈
		circle: function() {
			var self = this;
			var pagination = document.createElement("div");

			pagination.className = "carousel-pagination";
			for (var i = 0; i < self.len - 2; i++) {
				var btnspan = document.createElement("span");
				btnspan.className = "carousel-pagination-bullet";
				pagination.appendChild(btnspan);
			}

			this.carousel_container.appendChild(pagination);

			this.bullet = document.getElementsByClassName("carousel-pagination-bullet");
			this.bullet[0].classList.add("carousel-pagination-bullet-active");

			for (var i = 0; i < this.bullet.length; i++) {
				! function(i) {
					self.bullet[i].addEventListener('click', function(e) {
						if (!self.flag) {
							return;
						}
						if (this.className.indexOf('carousel-pagination-bullet-active') > -1) {
							return;
						}
						var myIndex = i - (self.num - 1);
						var offset = -self.params.width * myIndex;
						self.go(offset);
						self.num = i + 1;
						self.showCircleButton();
					}, false);
				}(i);
			}
		},
		//图片轮播时，底下的分页标志颜色变化
		showCircleButton: function() {
			var self = this;
			var num = this.num - 1;
			for (var i = 0; i < this.bullet.length; i++) {
				this.bullet[i].classList.remove("carousel-pagination-bullet-active");
			}
			this.bullet[num].classList.add("carousel-pagination-bullet-active");
		},
		//显示指定slide
		go: function(offset) {
			var self = this;
			if (self.flag) {
				self.flag = false;

				if (offset < 0) {
					self.num++;
					if (self.num > self.len - 2) {
						self.num = 1;
					}
				}

				if (offset > 0) {
					self.num--;
					if (self.num <= 0) {
						self.num = self.len - 2
					}
				}

				var srty = parseInt(self.ul_container.style.left) + offset;
				//图片缓冲
				if (parseInt(self.ul_container.style.left) < srty || parseInt(self.ul_container.style.left) > srty) {
					self.timer = setInterval(function() {
						var mernum = parseInt(self.ul_container.style.left);
						var speed = (srty - mernum) / 10;
						speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
						self.ul_container.style.left = parseInt(self.ul_container.style.left) + speed + 'px';

						if (parseInt(self.ul_container.style.left) == srty) {
							clearInterval(self.timer);
							self.ul_container.style.left = srty + 'px';
							if (srty > -self.params.width) {
								self.ul_container.style.left = -self.params.width * (self.len - 2) + 'px';
							}
							if (srty < -self.params.width * (self.len - 2)) {
								self.ul_container.style.left = -self.params.width + 'px';
							}
							self.flag = true;
						}
					}, self.params.speeds)
				}

				self.showCircleButton();
			}
		}
	};

	window.Carousel = Carousel;
})();