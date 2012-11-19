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

    this.data = [];

    this.term = false;
    var $filter = $('#process-filter');
    $filter.on('keyup', function() {
        self.filter($filter.val());
    });
};

/**
 *
 * @param term
 * @return {*}
 */
ProcessRenderer.prototype.filter = function(term) {

    if (_.isString(term) && term.length) {
        this.term = new RegExp(term, 'gim');
        var self = this;
        var match;
        this.data.forEach(function(row) {
            match = false;
            _.each(row, function(value) {
                if (!match && self.term) {
                    match = self.term.test(value);
                }
            });
            if (match) {
                row.$display.removeClass('hidden');
            } else {
                row.$display.addClass('hidden');
            }
        });
    } else {
        this.term = false;
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

    this.$rowContainer.html('');

    var self = this,
        cssClass, match, rowContent;

    data.forEach(function(row) {
        rowContent = '<tr%css-class%>';
        match = self.term ? '' : true;
        _.each(row, function(value) {
            if (!match && self.term) {
                match = self.term.test(value);
            }
            rowContent += '<td>' + value + '</td>';
        });
        cssClass = match ? '' : ' class="hidden"';
        rowContent = rowContent.replace('%css-class%', cssClass);
        rowContent += '</tr>';

        row.$display = $(rowContent);

        self.$rowContainer.append(row.$display);
    });

    this.data = data;

    // update graphs
    this.memoryChart.update(data);
    this.cpuChart.update(data);

    return this;
};