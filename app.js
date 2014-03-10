// Modules
var express = require('express')
, http = require('http')
, app = express()
, path = require('path')
, Poet = require('poet')
;


// get Poet up and running
var poet = Poet(app, {
    posts: './_posts/'
//    postsPerPage: 5,
//    metaFormat: 'json'
});

poet.watch(function () {
    // watcher reloaded
}).init().then(function () {
    poet.clearCache();
    Object.keys(poet.posts).map(function (title) {
	var post = poet.posts[title];
    });
});


// Configuration
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(app.router);

var env = process.env.NODE_ENV || 'development';

// development only
if ('development' == env || true) {
    app.locals.pretty=true;
}




// Routes
app.get('/', function(req, res) {
    res.render('index.jade', {
	title: "Jesse Huang",
	pageTitle: "Jesse Huang"    
    });
    res.on('connection', function(socket) {
	socket.setTimeout(10000);
    });
});

app.get('/blog', function(req, res) {
    res.render('blog');
});

poet.addRoute('/blog/mypost/:post', function (req, res) {
    var post = poet.helpers.getPost(req.params.post);
    if (post) {
	res.render('post', { post: post }); 
    } else {
	res.send(404);
    }
});

poet.addRoute('/blog/mytags/:tag', function (req, res) {
    var taggedPosts = poet.helpers.postsWithTag(req.params.tag);
    if (taggedPosts.length) {
	res.render('tag', {
	    posts: taggedPosts,
	    tag: req.params.tag
	});
    }
});

poet.addRoute('/blog/mycategories/:category', function (req, res) {
    var categorizedPosts = poet.helpers.postsWithCategory(req.params.category);
    if (categorizedPosts.length) {
	res.render('category', {
	    posts: categorizedPosts,
	    category: req.params.category
	});
    }
});

poet.addRoute('/blog/mypages/:page', function (req, res) {
    var page = req.params.page,
    lastPost = page * 3;
    res.render('page', {
	posts: poet.helpers.getPosts(lastPost - 3, lastPost),
	page: page
    });
});


app.get('/sitemap.xml', function (req, res) {
  // Only get the latest posts
  var postCount = poet.helpers.getPostCount();
  var posts = poet.helpers.getPosts(0, postCount);
  res.setHeader('Content-Type', 'application/xml');
  res.render('sitemap', { posts: posts });
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

