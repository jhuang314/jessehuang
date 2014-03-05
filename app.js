var express = require('express');
var app = express();
var http = require('http');

app.get('/', function(req, res) {
    res.send("I'm Jesse Huang");
});
var port = Number(process.env.PORT || 5000);
app.listen(port, function () {
    console.log("listening on " + port);
});

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
