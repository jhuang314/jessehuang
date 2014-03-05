var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send("I'm Jesse Huang");
});
var port = Number(process.env.PORT || 5000);
app.listen(port, function () {
    console.log("listening on " + port);
});
