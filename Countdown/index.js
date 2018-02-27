(function() {
	var start_btn = document.getElementById('start-btn');
	var stop_btn = document.getElementById('stop-btn');

	var countdown = new Countdown('countdown-container', {
		countEnd: function() {
			alert('end!');
		}
	});

	start_btn.addEventListener('click', function() {
		var starttime = document.getElementById('time').value;
		if(starttime) {
        	countdown.start(starttime);
		}
    });

    stop_btn.addEventListener('click', function() {
        countdown.stop();
    });
})();