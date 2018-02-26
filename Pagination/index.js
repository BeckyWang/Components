(function() {
	var sources = function() {
		var result = [];
		for (var i = 1; i < 50; i++) {
			result.push(i);
		}
		return result;
	}();

	function getCurPage(index) {
		console.log(index)
	}

	var pagination = new Pagination('pagination-container', {
		totalData: sources.length,
		callback: getCurPage
	});

	pagination.init();
})();