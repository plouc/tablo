var exec   = require('child_process').exec,
    mysql  = require('mysql'),
    emiter = require('events').EventEmitter;


var MysqlMonitor = function(options) {

    this.o = options;

    this.connection = mysql.createConnection({
        host     : this.o.connection.host,
        port     : this.o.connection.port,
        user     : this.o.connection.user,
        password : this.o.connection.password
    });
    this.connection.connect();

    var self = this;
    this.timer = setInterval(function() {
        self.fetchProcesses();
        self.fetchDatabases();
        self.fetchDiskUsage();
    }, this.o.refresh);
};


MysqlMonitor.prototype = new emiter();


MysqlMonitor.prototype.fetchDiskUsage = function() {
    var self = this;
    exec('du -sc ./*', { cwd: this.o.datadir },
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
    parsed.sort(function(a, b) { return b.size - a.size; });
    return parsed;
};


MysqlMonitor.prototype.fetchProcesses = function() {
    var self = this;
    this.connection.query('SHOW PROCESSLIST', function(err, rows) {
        if (err) throw err;
        self.emit('report.process', rows);
    });
};

MysqlMonitor.prototype.fetchDatabases = function() {
    var self = this;
    this.connection.query('SHOW DATABASES', function(err, rows) {
        if (err) throw err;
        self.emit('report.databases', rows);
    });
};

exports.create = function(config) {
    return new MysqlMonitor(config);
};