/**
 *
 * @constructor
 */
var ProcessRenderer = function() {

    this.$rowContainer = $('#process tbody');

    this.cpuChart = new BarChart('#process-cpu .graph', {
        property: 'cpuUsage',
        layout:   'V'
    });

    this.memoryChart = new BarChart('#process-mem .graph', {
        property: 'memoryUsage',
        layout:   'H'
    });

    var self = this;

    $('#process-cpu .h-layout').click(function(e) {
        e.preventDefault();
        self.cpuChart.switchLayout('H');
    });
    $('#process-cpu .v-layout').click(function(e) {
        e.preventDefault();
        self.cpuChart.switchLayout('V');
    });

    $('#process-mem .h-layout').click(function(e) {
        e.preventDefault();
        self.memoryChart.switchLayout('H');
    });
    $('#process-mem .v-layout').click(function(e) {
        e.preventDefault();
        self.memoryChart.switchLayout('V');
    });

    this.term = null;
};

/**
 *
 * @param term
 * @return {*}
 */
ProcessRenderer.prototype.filter = function(term) {

    if (_.isString(term) && term.length) {
        this.term = term;
    }

    return this;
};

/**
 *
 * @param data
 * @return {*}
 */
ProcessRenderer.prototype.update = function(data) {

    // convert cpu/memory usage to float
    data.forEach(function(row) {
        row.cpuUsage    = parseFloat(row.cpuUsage.replace(',', '.'));
        row.memoryUsage = parseFloat(row.memoryUsage.replace(',', '.'));
    });

    var content = '';

    data.forEach(function(row) {
        content += '<tr>';
        _.each(row, function(value) {
            content += '<td>' + value + '</td>';
        });
        content += '</tr>';
    });

    this.$rowContainer.html(content);

    // update graphs
    this.memoryChart.update(data);
    this.cpuChart.update(data);

    return this;
};