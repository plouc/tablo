var exec   = require('child_process').exec,
    emiter = require('events').EventEmitter;



var MysqlMonitor = function(options) {

    this.o = options;

    var self = this;
    this.timer = setInterval(function() {
        self.fetchProcesses();
        self.fetchDiskUsage();
    }, this.o.refresh);
};



MysqlMonitor.prototype = new emiter();


MysqlMonitor.prototype.fetchDiskUsage = function() {
    var self = this;

    exec('du -sc ./*', {
            cwd: this.o.datadir
        },
        function (error, stdout, stderr) {
            self.emit('report.du', self.parseDuResult(stdout));
        }
    );
};


MysqlMonitor.prototype.parseDuResult = function(result) {
    var lines  = result.split("\n"),
        parsed = [];

    lines.forEach(function(line) {
        if (line.length) {
            line = line.split("\t");
            parsed.push({
                size: line[0],
                name: line[1].substr(0,1) == '.' ? line[1].substr(2) : line[1]
            })
        }
    });

    parsed.sort(function(a, b) {
        return b.size - a.size;
    });

    return parsed;
};


MysqlMonitor.prototype.fetchProcesses = function() {
    var self = this;

    exec('echo "SHOW PROCESSLIST" | mysql -u' + this.o.connection.user + ' -p' + this.o.connection.password,
        function (error, stdout, stderr) {
            self.emit('report.process', self.parseProcessResult(stdout));
        }
    );
};


MysqlMonitor.prototype.parseProcessResult = function(result) {
    var lines = result.split("\n"),
        parsed = [];

    lines.forEach(function(line, i) {
        if (i && line.length) {
            parsed.push(line.split("\t"));
        }
    });

    return parsed;
};


exports.create = function(config) {
    return new MysqlMonitor(config);
};