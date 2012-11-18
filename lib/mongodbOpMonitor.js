var Mongolian = require('mongolian'),
    emiter   = require('events').EventEmitter;



var MongodbOpMonitor = function(options) {

    options.interval = options.interval || 1000;
    options.host     = options.host     || '127.0.0.1';
    options.port     = options.port     || 27017;
    this.options = options;

    this.server = new Mongolian();

    var self = this;
    this.timer = setInterval(function() {
        self.fetchOps();
    },options.interval);
};



MongodbOpMonitor.prototype = new emiter();



MongodbOpMonitor.prototype.fetchOps = function() {
    var self = this;

    console.log(this.server);
};



exports.create = function(config) {
    return new MongodbOpMonitor(config);
};