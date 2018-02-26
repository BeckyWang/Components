(function() {
	var Pagination = function(el,opts) {
		var self = this;
		var defaults = {
			container_id: el,
			size: 10,
	        curPage: 1,
	        targetPage: 1,
            totalData: 0,
            toJump: true,
            callback: function() {}
		};
		opts = opts || {};
		for (var w in defaults) {
			if ('undefined' == typeof opts[w]) {
				opts[w] = defaults[w];
			}
		}
        opts.total = Math.ceil(opts.totalData / opts.size);

		this.params = opts;
        this.pagination_container = document.getElementById(this.params.container_id);
	};

	Pagination.prototype = {
		init: function() {
			this.render();	
		},
		prevPage: function() {
			var params = this.params;
            if (params.curPage > 1) {
                params.curPage--;
                this.render();
            }
        },
        nextPage: function() {
			var params = this.params;
            if (params.curPage < params.total) {
                params.curPage++;
                this.render();      
            }
        },
        jumpToPage: function(targetPage) {
			var params = this.params;
            if (params.curPage != targetPage && targetPage > 0 && targetPage < params.total + 1) {
                params.curPage = targetPage;
                this.render();
            }
        },
		render: function() {
			var params = this.params;
			var i, len;
            var innerHtml = '<ul class="ul_container"><li class="item prev"><a class="prev_link"><i class="fa fa-chevron-left" aria-hidden="true"></i>上一页</a></li>';
            this.pagination_container.innerHTML = '';

            if (params.curPage < 6) {
                for (i = 1, len = params.curPage; i < len; i++) {
                    innerHtml += '<li class="item"><a class="page_link" page_num=' + i + '>' + i + '</a></li>';
                }
            } else {
                for (i = 1; i < 3; i++) {
                    innerHtml += '<li class="item"><a class="page_link" page_num=' + i + '>' + i + '</a></li>';
                }
                innerHtml += '<li class="dot">...</li>';
                for (i = 0; i < 2; i++) {
                    innerHtml += '<li class="item"><a class="page_link" page_num=' + (params.curPage - 2 + i) + '>' + (params.curPage - 2 + i) + '</a></li>';
                }
            }
            innerHtml += '<li class="item active"><a class="page_link" page_num=' + params.curPage + '>' + params.curPage + '</a></li>';
            if (params.total > params.curPage + 2) {
                for (i = 1; i < 3; i++) {
                    innerHtml += '<li class="item"><a class="page_link" page_num=' + (params.curPage + i) + '>' + (params.curPage + i) + '</a></li>';
                }
                innerHtml += '<li class="dot">...</li>';
            } else {
                for (i = 0, len = params.total - params.curPage; i < len; i++) {
                    innerHtml += '<li class="item"><a class="page_link" page_num=' + (params.curPage + i + 1) + '>' + (params.curPage + i + 1) + '</a></li>';
                }
            }
            innerHtml += '<li class="item next"><a class="next_link">下一页<i class="fa fa-chevron-right" aria-hidden="true"></i></a></li>';

            if(params.toJump) {
                innerHtml += '<li class="jump"><span class="text">跳到</span><input type="number" min="1" max="' + params.total + '" class="input"/><span class="text">/' + params.total + '页</span><button class="btn">确定</button></li>'    
            }

            this.pagination_container.innerHTML = innerHtml;
            this.eventBind();

            params.callback && params.callback(params.curPage);
		},
        eventBind: function() {
            var self = this;
            var prev = document.getElementsByClassName('prev_link');
            var next = document.getElementsByClassName('next_link');
            var pages = document.getElementsByClassName('page_link');

            prev[0].addEventListener('click', function() {
                self.prevPage();
            });

            next[0].addEventListener('click', function() {
                self.nextPage();
            });

            for(var i = 0, len = pages.length; i < len; i++) {
                pages[i].addEventListener('click', function(e) {                   
                    var page_num = +e.target.attributes['page_num'].nodeValue;
                    self.jumpToPage(page_num);
                });
            }
        }
	};

    window.Pagination = Pagination;
})();