var exec   = require('child_process').exec,
    emiter = require('events').EventEmitter;



var ProcessMonitor = function(options) {

    this.o = options;

    this.columnMapping = [
        'user',
        'processId',
        'cpuUsage',
        'memoryUsage',
        'VSZ',
        'RSS',
        'TT',
        'STAT',
        'STARTED',
        'TIME',
        'command'
    ];

    var self = this;
    this.timer = setInterval(function() {
        self.fetchProcesses();
    }, this.o.refresh);
};



ProcessMonitor.prototype = new emiter();



ProcessMonitor.prototype.fetchProcesses = function() {
    var self = this;

    exec('ps aux',
        function (error, stdout, stderr) {
            self.emit('report', self.parseResult(stdout));
        }
    );
};



ProcessMonitor.prototype.parseResult = function(result) {
    var lines  = result.split("\n"),
        regex  = /^([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+(.*)$/,
        parsed = [],
        self   = this,
        procObject,
        matches;

    lines.forEach(function(line, i) {
        if (i && line.length) {
            matches = regex.exec(line);
            procObject = {};
            self.columnMapping.forEach(function(name, j) {
                procObject[name] = matches[j+1];
            });
            parsed.push(procObject);
        }
    });

    return parsed;
};



exports.create = function(config) {
    return new ProcessMonitor(config);
};