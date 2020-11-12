'use strict';
var http = require('http');
var fs = require('fs');
var url = require("url");
//var datetime = require('./Business/datetime');

const hostname = '127.0.0.1';
var port = process.env.PORT || 9000;

http.createServer(function (req, res) {
    var q = url.parse(req.url, true)
    var filename = "." + q.pathname
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }  
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });

    //res.writeHead(200, { 'Content-Type': 'text/html' });
    //res.write("The date and time currently is: " + datetime.myDateTime());
    //res.write('Hello World\n')
    //res.end();
}).listen(port, hostname);
