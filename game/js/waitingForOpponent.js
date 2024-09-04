// update text
let increment = 0;

setInterval(() => {
	$('.waiting-for-opponent:not(.opponent-found)').text('Waiting for opponent' + '.'.repeat(increment));
	increment = (increment + 1) % 4;
}, 400);
