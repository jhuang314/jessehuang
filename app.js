// Modules
var express = require('express')
, http = require('http')
, app = express()
, path = require('path')
, Poet = require('poet')
;


// get Poet up and running
var poet = Poet(app, {
    posts: './_posts/',
    postsPerPage: 5,
    metaFormat: 'json',
    routes: {
	'/post/:post' : 'post'
    }
});

// Configuration
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(app.router);

var env = process.env.NODE_ENV || 'development';

// development only
if ('development' == env) {
    app.locals.pretty=true;
}

poet.init().then(function () {
    
});

// Routes
app.get('/', function(req, res) {
    res.render('index', {
	title: "Jesse Huang",
	pageTitle: "Jesse Huang"    
    });
    res.on('connection', function(socket) {
	socket.setTimeout(10000);
    });
});



var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});




// Content unrelated stuff goes here:
// var NA = require("nodealytics");
// NA.initialize('UA-48713710-1', 'jessehuang.com', function () {
//     NA.trackPage('utmdt=Jesse%20Huang', 'pageName', function (err, resp) {
// 	if (!err, resp.statusCode === 200) {
// 	    console.log('Analytics Worked!');
// 	}
//     });
// });


function startKeepAlive() {
    setInterval(function() {
	var options = {
	    host: 'jessehuang.herokuapp.com',
	    port: 80,
	    path: '/'
	};
	http.get(options, function(res) {
	    res.on('data', function(chunk) {
		try {
		    // optional logging... disable after it's working
		    console.log("HEROKU RESPONSE: " + chunk);
		} catch (err) {
		    console.log(err.message);
		}
	    });
	}).on('error', function(err) {
	    console.log("Error: " + err.message);
	});
    }, 20 * 60 * 1000); // load every 20 minutes
}

startKeepAlive();

