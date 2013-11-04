var mongoose = require ('mongoose')
,	database_url = require('./database_url'); //include database address

mongoose.connect(database_url.url);

var userScheme = mongoose.Schema({
	email: String,
	shareLink: String,
	numberOfShares: Number
});


var usermodel = mongoose.model('user',userScheme);


function findUniqueUser(couponID){
	usermodel.find().distinct('email', function(error, ids) {
    // ids is an array of all ObjectIds
    console.log(ids)
    for (var i=0;i<ids.length;i++)
	{ 
		console.log(i);
	}

	});
};

function domapreduce(){
	var o = {};
	var foo_out="";
	// var query = usermodel.find();
	o.map = function () { emit(this.email, this.numberOfShares) }
	o.reduce = function (k, vals) { return Array.sum(vals); }
	// usermodel.mapReduce(o, function (err, results) {
	//   console.log(results)
	// })
	usermodel.mapReduce(o, function (err, results) {
  	console.log(results)
})

	
}

domapreduce();
// findUniqueUser();


// usermodel.find({}, function(err,docs){

// 		if (err){
// 			console.log("db error");
// 		}
// 		else{
// 			for (var i=0;i<docs.length;i++){
// 				// console.log(docs[i].get('email'));	
// 				docs[i].update({couponOriginID:"232342"},{},function(err,res){
// 					console.log(docs[i]);
// 				});

// 				docs[i].delete
// 			}
			
			

// 		}

// 	});


