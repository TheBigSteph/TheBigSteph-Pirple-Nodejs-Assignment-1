/*
* Index file for API
*/

var http = require('http');


var server = http.createServer(function(req, res) {
    res.end('Hello World!');
});

server.listen(3000, function() {
    console.log('Server listerning on port 3000');
});
