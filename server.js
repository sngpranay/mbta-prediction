var express = require("express");
var app = express();
var request = require('request');
var http = require('http').Server(app);

app.use(express.static(__dirname));

app.get("/results", function (req, res) {
	
	// Regex for processing stop 1, stop 2, ...
	// var m = /stop\s(\d)/;
		
	// var startMatch = m.exec( req.query.startStop );

	// var startVal = 0;
	// if (startMatch && startMatch.length > 1) {
	// 	startVal = parseInt(startMatch[1]);
	// }

	// var endVal = 0;
	// var endMatch = m.exec( req.query.endStop );
	// if (endMatch && endMatch.length > 1) {
	// 	endVal = parseInt(endMatch[1]);
	// }
	


	// Server side error validation to make sure the line and start stop is not empty
	if (typeof req.query.line === undefined || typeof req.query.startStop === undefined ||
		typeof req.query.line === "undefined" || typeof req.query.startStop === "undefined" ||
		req.query.line === "" || req.query.startStop === "") {

		res.json({
			Error: "Must pick MBTA line color and starting stop!"
		});
	} else if (req.query.subline == 'N/A') {
		// console.log(req.query.line);
		// console.log(req.query.startStop);
		var alertHeader = 'http://messenger-env.us-west-2.elasticbeanstalk.com/webapi/alertHeader/' + req.query.line + '/' + req.query.startStop;
		var alertDetail = 'http://messenger-env.us-west-2.elasticbeanstalk.com/webapi/alertDetail/' + req.query.line + '/' + req.query.startStop;
		var prediction = 'http://messenger-env.us-west-2.elasticbeanstalk.com/webapi/prediction/' + req.query.line + '/' + req.query.startStop;
	} else {
		var alertHeader = 'http://messenger-env.us-west-2.elasticbeanstalk.com/webapi/alertHeader/' + req.query.line + req.query.subline + '/' + req.query.startStop;
		var alertDetail = 'http://messenger-env.us-west-2.elasticbeanstalk.com/webapi/alertDetail/' + req.query.line + req.query.subline + '/' + req.query.startStop;
		var prediction = 'http://messenger-env.us-west-2.elasticbeanstalk.com/webapi/prediction/' + req.query.line + req.query.subline + '/' + req.query.startStop;
	};


	console.log("Alert Header API: " + alertHeader); 
	console.log("Alert Detail API: " + alertDetail);
	console.log("Prediction API:   " + prediction);


	request(alertHeader, function (error, response, alertHeader) { //might need to type cast query as string as requst is expecting a string

		if (!error && response.statusCode == 200) {

			console.log(alertHeader);

			request(alertDetail, function (error, response, alertDetail) { //might need to type cast query as string as requst is expecting a string

				if (!error && response.statusCode == 200) {
				
					console.log(alertDetail);

					request(prediction, function (error, response, prediction) { //might need to type cast query as string as requst is expecting a string
					
					    if (!error && response.statusCode == 200) {
					        
					        console.log(prediction);

							res.json({
								Color: req.query.line, 
								Line: req.query.subline,
								Direction: req.query.direction,
								StartStop: req.query.startStop, 
								EndStop: req.query.endStop,
								AlertHeader: alertHeader,
								AlertDetail: alertDetail,
								Prediction: prediction
							});

					    } else {

					    	console.log(error);

					    	res.json({
								Color: req.query.line, 
								Line: req.query.subline,
								Direction: req.query.direction,
								StartStop: req.query.startStop, 
								EndStop: req.query.endStop,
								Error: error
							});

					    }
					});

				} else {

			    	console.log(error);

			    	res.json({
						Color: req.query.line, 
						Line: req.query.subline,
						Direction: req.query.direction,
						StartStop: req.query.startStop, 
						EndStop: req.query.endStop,
						Error: error
					});
		    	}
		    });
		    	
		} else {

	    	console.log(error);

	    	res.json({
				Color: req.query.line, 
				Line: req.query.subline,
				Direction: req.query.direction,
				StartStop: req.query.startStop, 
				EndStop: req.query.endStop,
				Error: error
			});
	    }
	});

});


// Asynchronous API calls example
// app.get("/blah", function (req, res) {

//     var alert = 'api call for alert' 
//     var alert2 = 'api call for alert 2'

//     async.parallel([
//         function(callback) {
//             request(alert, function (error, response, alert) {
//                 if(error) {
//                     callback(error);
//                 } else {
//                     callback(null, alert);
//                 }
//             });
//         },

//         function(callback) {
//             request(alert2, function (error, response, alert2) {
//                 if(error) {
//                     callback(error);
//                 } else {
//                     callback(null, alert2);
//                 }
//             });
//         }
//     ], function(err, results) {
//         res.json({
//             Alert: results[0],
//             Alert2: results[1]
//         });
//     });
// });


http.listen(3000, function () {
	console.log("Listening on port 3000");
});


