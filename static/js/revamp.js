$(document).ready(function() {
	$('#button_active').click(function() {
		$('#coupon-container').hide();
		$('#form_and_social').show();
	});

	$('#email-form').submit(function(e) {
		e.preventDefault();
		console.log($('#user_email_input').val());
		// $.post('/test', {'user_email': $('#user_email_input').val()});
		$('#share-form')
		.html('Great!  We sent you an email with a coupon code to use and a link to send to your friend.  <br><b>Share now to activate your coupon!<b><div style=\"height: 5px; \"></div>');
		$('#hide_social').remove();
		$('#share_container').css('opacity', 1);
		$('#FB-button').click(function(e) {
			window.open(
		      'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('http://google.com/?a=test'), 
		      'facebook-share-dialog', 
		      'width=626,height=436');			
		});
		$('#twitter-button').click(function(e) {
			window.open(
				'https://twitter.com/intent/tweet?url='+encodeURIComponent("<%= myShareLink %>")+'&text='+encodeURIComponent('<%= myShareLink %>'),
				'_blank', 'width=626,height=436')
		});
		$('#Gp-button').click(function(e) {
			window.open('https://plus.google.com/share?url='+encodeURIComponent('http://google.com/?a=test'),
  '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
		});
		$('#tumblr-button').click(function(e) {
			window.open(
				'http://www.tumblr.com/share?v=3&u='+encodeURIComponent('http://google.com/?a=test'),
				'_blank', 'width=626,height=436')
		});
	});
});

