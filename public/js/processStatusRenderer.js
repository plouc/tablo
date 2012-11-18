var ProcessStatusRenderer = function() {


};



ProcessStatusRenderer.prototype.update = function(data) {
    this.cpuChart.redraw(data);
    this.memChart.redraw(data);
};

