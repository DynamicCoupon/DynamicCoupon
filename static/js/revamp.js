$(document).ready(function() {
	function countAction(action) {
		jQuery.getJSON("http://www.pfalke.com/revamp?callback=?", {
            'action': action,
            url: location.href,
        }).done(function(resp) {
			console.log(resp);
		});
	}

	countAction('pageview');

	$('#button_small').click(function() {
		location.href = 'http://lokokai.com/redeem1.html';
		countAction('click_redeem');
	});

	$('#button_active').click(function() {
		$('#coupon-container').hide();
		$('#form_and_social').show();
		countAction('click_shareunlock');
	});

	$('#email-form').submit(function(e) {
		e.preventDefault();
		console.log($('#user_email_input').val());
		$.post('/coupon', {'email': $('#user_email_input').val(),'myShareLink':my_url});
		countAction('submit_email');
	});

	// SOCIALS
	// $('#share-form')
	// .html('<b>Great! Share with 2 friends to get your 25% off!<b><div style=\"height: 5px; \"></div>');
	// $('#hide_social').remove();
	$('#share_container').append('<div class="social_button">Link: ' + my_url + '</div>');
	$('#FB-button').click(function(e) {
		window.open(
			'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(my_url),
			'facebook-share-dialog',
			'width=626,height=436');
		countAction('share_fb');
	});
	$('#twitter-button').click(function(e) {
		window.open(
			'https://twitter.com/intent/tweet?url='+encodeURIComponent(my_url)+'&text='+encodeURIComponent("I've found a coupon for up to 25% off Amazon!"),
			'_blank', 'width=626,height=436');
		countAction('share_twitter');
	});
	$('#Gp-button').click(function(e) {
		window.open('https://plus.google.com/share?url='+encodeURIComponent(my_url),
'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
		countAction('share_gp');
	});
	$('#tumblr-button').click(function(e) {
		window.open(
			'http://www.tumblr.com/share?v=3&u='+encodeURIComponent(my_url),
			'_blank', 'width=626,height=436');
		countAction('share_tumblr');
	});
	$('#email-button').click(function(e) {
		window.open(
			'mailto:?subject=I have found a coupon for up to 25% off Amazon!&amp;body=Check it out: http://www.website.com.")');
		countAction('share_email');
	});






});

