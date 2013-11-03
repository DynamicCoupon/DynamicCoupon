$(document).ready(function() {
	$('#button_active').click(function() {
		$('#inac25').html('Emailfields!');
		$('.space').show();
	});

	$('#email-form').submit(function(e) {
		e.preventDefault();
		console.log($('#user_email_input').val());
		// $.post('/test', {'user_email': $('#user_email_input').val()});
		$('#email_form_container')
		.html('We have sent you an email with a Coupon code to use and a link to send to your friend.');
		$('#hide_social').remove();
	});
});

