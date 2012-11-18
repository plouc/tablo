var app              = require('http').createServer(handler),
    io               = require('socket.io').listen(app),
    fs               = require('fs'),
    spawn            = require('child_process').spawn,
    config           = require('config'),
    mysqlMonitor     = require('./lib/mysqlMonitor'),
    processMonitor   = require('./lib/processMonitor'),
    mongodbOpMonitor = require('./lib/mongodbOpMonitor');

io.set('log level', 1);

var webroot = './public',
    port    = 8347;

app.listen(port);

function virtualToPhysical(path) {
    path = path == '/' ? '/index.html' : path;
    return webroot + path;
}

function handler (req, res) {
  fs.readFile(virtualToPhysical(req.url), function (error, data) {

     console.log(error);

     if (error) {
       res.writeHead(500);
       return res.end('Error loading ');
     }

     res.writeHead(200);
     res.end(data);
  });
}



var mysqlMon = mysqlMonitor.create(config.mysqlMonitor)
    .on('report.process', function(report) {
        io.sockets.emit('mysql.process', report);
    })
    .on('report.du', function(report) {
        io.sockets.emit('mysql.du', report);
    });

var procMon = processMonitor.create(config.processMonitor)
    .on('report', function(report) {
        io.sockets.emit('process.status', report);
    }
);



io.sockets.on('connection', function (socket) {
    socket.on('command', function (data) {
    });
});