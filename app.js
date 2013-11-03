
/**
 * Module dependencies.
 */

var express = require('express')
, 	routes = require('./routes')
,	user = require('./routes/user')
,	http = require('http')
,	path = require('path')
,	mongoose = require ('mongoose')
,	emailCredentials = require('./emailCredentials')
, 	email = require('emailjs/email')
,	database_url = require('./database_url'); //include database address

var app = express();

mongoose.connect(database_url.url);

var threshold_1 = 1;

var onlyMerchant = {
	rewardUrl : "google.png",
	highRewardUrl : "twitter.png",
	merchant_reward: 10
};

var userScheme = mongoose.Schema({
	email: String,
	shareLink: String,
	numberOfShares: Number
});

//create model
var usermodel = mongoose.model('user',userScheme);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
// app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));
// app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


function sendHTMLEmail(subjectField, textField, toField, htmlToSent, couponImageToSent)
{
	var server  = email.server.connect({
   	user:    emailCredentials.user, 
   	password:emailCredentials.pass,
   	host:    emailCredentials.server,
   	ssl:     true
});

var message = email.message.create(
{
   	subject: subjectField,
	from:    "Dynamic Coupon <coupon@dynamiccoupon.co>", 
	to:      toField,
   	text:    textField
});

message.attach({path:htmlToSent, alternative:true});
message.attach({path:couponImageToSent, type:"image/png", name:"my-coupon.png", headers:{"Content-ID":"my-coupon"}});

// send the message and get a callback with an error or details of the message that was sent
server.send(message, function(err, message) { console.log(err || message); });

// you can continue to send more messages with successive calls to 'server.send', 
// they will be queued on the same smtp connection

// or you can create a new server connection with 'email.server.connect' 
// to asynchronously send individual emails instead of a queue
}

// function sendEmail(subjectField, textField, toField)
// {
// 	var server  = email.server.connect({
//    	user:    emailCredentials.user, 
//    	password:emailCredentials.pass,
//    	host:    emailCredentials.server,
//    	ssl:     true

// });

// // send the message and get a callback with an error or details of the message that was sent
// server.send({
//    	text:    textField, 
//    	from:    "Dynamic Coupon <coupon@dynamiccoupon.co>", 
//    	to:      toField,
//    	subject: subjectField
// 	}, function(err, message) { console.log(err || message); });
// };

app.get('/', routes.index);


app.get('/temp', function(req,res){
    res.render( 'images.html', {myShareLink : "http://lol.com"});

});

// app.get('/revamp.js', function(req, res) {
//   res.set('Content-Type', 'application/javascript');
//   res.render('revamp', { myVar : ... });
// });



app.get('/users', user.list);
function addUser(email,myShareLink){
	var newitem = new usermodel({
			email:email,
			shareLink:myShareLink,
			numberOfShares:0,
		});

	newitem.save(function(err,newitem) {
	if (err)
		console.log("database save error");
	else
		console.log("data saved");
  	// mongoose.connection.close();
});

};

app.get('/coupon', function(req, res){
	var myShareLink = "";
	console.log(myShareLink);
	myShareLink =  generateRandomNumber();
	myCoupon = onlyMerchant.rewardUrl;
    res.render( 'images.html', {myShareLink : "http://dynamiccoupon.co/coupon/"+myShareLink, myCouponImage: myCoupon});
});


app.post('/coupon', function(req, res) {
    var email = req.body.email;
    var myShareLink = req.body.myShareLink;
    var temp=myShareLink.split("/");
    myShareLink=temp[temp.length-1];

    console.log('asdfsd');
    console.log(myShareLink);
    console.log(email);
	addUser(email,myShareLink);
	baseUrl = "http://dynamiccoupon.co/coupon/";
	myShareLink = baseUrl+myShareLink;
	
	sendHTMLEmail("Thank You for Using Dynamic Coupon", "textfiled", email, "couponEmail.html", "static/"+onlyMerchant.rewardUrl);

	// sendEmail("Thank You for Using Dynamic Coupon", "Link to share to friends: "+myShareLink+"\n", email);

	//sendEmail("Thank You for Using Dynamic Coupon", "Link to share to friends: "+myShareLink+"\n", email);
    // res.redirect('/success');
    res.send("");
});


app.get('/success', function (req,res){
	res.send("success");
});

function generateRandomNumber()
{
	buf = require('crypto').randomBytes(8);
	return buf.toString('hex');
}

function findUser(couponID){

};

app.get('/coupon/:couponID?', function(req,res){
	couponID = req.params.couponID;
	console.log(couponID);

	usermodel.findOne({shareLink: couponID}, function(err,obj){
		if (err){
			console.log("db error");
		}
		else{
			if (obj != null){
				obj.update({$inc: {numberOfShares:1}}, { w: 1 }, function(err,doc){
					// Checking rewards
					if(obj.numberOfShares == onlyMerchant.merchant_reward) {
						// Send reminder for the new reward
						var subject = "Congratulation: Reached new coupon reward: ??%!";
						var baseUrl = "http://dynamiccoupon.co/coupon/";
						var myShareLink = baseUrl+obj.shareLink;
						var emailText = "You won a new coupon! "+obj.numberOfShares+ " of your friends views your coupon. \n \n Share you coupon with more friends: "+myShareLink+"\n";
						// sendEmail(subject, emailText, obj.email);
						sendHTMLEmail(subject, emailText , obj.email , "couponEmail.html", "static/"+onlyMerchant.highRewardUrl);

						console.log("Sent eamil:"+emailText);
					}
					res.redirect('/coupon');
					console.log(obj.numberOfShares);
				});
			}
			else
			{
					console.log("normal user");
					res.redirect('/coupon');
			}
		}
	});

});




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
