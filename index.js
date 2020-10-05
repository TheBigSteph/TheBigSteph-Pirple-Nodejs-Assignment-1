/*
* Index file for API
*/

var http = require('http');
const { StringDecoder } = require('string_decoder');
var url = require('url');
const { callbackify } = require('util');
var stringDecoder = require('string_decoder').StringDecoder;


var server = http.createServer(function(req, res) {
    // Get and parse URL
    var parseUrl = url.parse(req.url, true);

    // Get request path
    var path = parseUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parseUrl.query;

    // Get HTTP method
    var method = req.method.toLowerCase();

    // Get headers
    var headers = req.headers;

    // Get payload
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end', function() {
        buffer += decoder.end();
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        
        var data = {
            trimmedPath: trimmedPath,
            queryStringObject: queryStringObject,
            method: method,
            headers: headers,
            payload: buffer
        };

        chosenHandler(data, function(statusCode, payload) {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Returning this response: ', statusCode, payloadString);
        })
    });

});

server.listen(3000, function() {
    console.log('Server listerning on port 3000');
});

var handlers = {};
// hello handler
handlers.hello = function(data, callback) {
    callback(401, {message: 'Greeting from a Node js lover'});
}

// not found handler
handlers.notFound = function(data, callback) {
    callback(404);
}

var router = {
    hello: handlers.hello
}
