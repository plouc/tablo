
/**
 * @param containerId
 * @param options
 * @constructor
 */
var BarChart = function(containerId, o) {

    if (!o.hasOwnProperty('property')) {
        throw new Error('No property defined!')
    }

    o.limit              = o.limit              || 10;
    o.barWidth           = o.barWidth           || 22;
    o.boundOffset        = o.boundOffset        || 12;
    o.spacing            = o.spacing            || 4;
    o.textOffset         = o.textOffset         || 10;
    o.maxWidth           = o.maxWidth           || 300;
    o.transitionDuration = o.transitionDuration || 1000;
    o.layout             = o.layout             || 'H';
    this.o = o;

    this.range = d3.scale.linear()
        .domain([0, 100])
        .range([0, this.o.maxWidth]);

    var colors = [
        '#B1C6A9',
        '#EF9E7A',
        '#BAB254',
        '#ECCA53',
        '#664B45',
        '#D35530',
        '#6E874D',
        '#D84C4F',
        '#B58644',
        '#7CA49E',
        '#32302B',
        '#AF866D',
        '#807E4A',
        '#B28B3D',
        '#E49C52',
        '#9D7D50'
    ];

    this.colorRange = d3.scale.ordinal()
        .domain([0, 99999])
        .range(colors);

    this.svg = d3.select(containerId)
        .append('svg')
        .attr('width', '100%')
        .attr('height', Math.max(
            this.o.boundOffset * 2 + this.o.limit * (this.o.barWidth + this.o.spacing) - this.o.spacing,
            this.o.boundOffset * 2 + this.o.maxWidth
        ))
        .append('g')
        .attr('transform', 'translate(' + this.o.boundOffset + ',' + this.o.boundOffset + ')');

    this.layoutTransition = false;

    var self = this;

    var ghostRects = this.svg.selectAll('rect.ghost')
        .data(d3.range(0, this.o.limit))
        .enter().append('rect')
        .attr('class', 'ghost');

    if (this.o.layout == 'H') {
        ghostRects
            .attr('y', function(d, i) {
                return i * (self.o.barWidth + self.o.spacing);
            })
            .attr('width', this.o.maxWidth)
            .attr('height', this.o.barWidth);
    } else if (this.o.layout == 'V') {
        ghostRects
            .attr('x', function(d, i) {
                return i * (self.o.barWidth + self.o.spacing);
            })
            .attr('width', this.o.barWidth)
            .attr('height', this.o.maxWidth);
    }
};


/**
 *
 * @param layout
 * @return {*}
 */
BarChart.prototype.switchLayout = function(layout) {
    if (layout != this.o.layout && !this.layoutTransition) {

        clearTimeout(this.transitionTimeout);

        this.o.layout = layout;
        this.layoutTransition = true;

        var self       = this,
            ghostRects = this.svg.selectAll('rect.ghost'),
            barRects   = this.svg.selectAll('rect.bar'),
            labels     = this.svg.selectAll('text');


        if (this.o.layout == 'H') {
            ghostRects.transition()
                .duration(this.o.transitionDuration / 4)
                .attr('x', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .attr('y', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .attr('width', this.o.barWidth)
                .attr('height', this.o.barWidth)
                .transition()
                .duration(this.o.transitionDuration / 4)
                .delay(this.o.transitionDuration / 4)
                .attr('x', 0)
                .attr('width', this.o.maxWidth)
                .attr('height', this.o.barWidth);

            barRects.transition()
                .duration(this.o.transitionDuration / 4)
                .attr('x', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .attr('y', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .attr('width', this.o.barWidth)
                .attr('height', this.o.barWidth)
                .transition()
                .duration(this.o.transitionDuration / 4)
                .delay(this.o.transitionDuration / 4)
                .attr('x', 0)
                .attr('y', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .attr('width', function(d) {
                    return self.range(d[self.o.property]);
                })
                .attr('height', this.o.barWidth);

            labels.transition()
                .duration(this.o.transitionDuration / 2)
                .attr('transform', 'rotate(0,0,0)')
                .attr('x', function(d) {
                    return self.range(d[self.o.property]) + self.o.textOffset;
                });

        } else if (this.o.layout == 'V') {
            ghostRects.transition()
                .duration(this.o.transitionDuration / 4)
                .attr('x', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .attr('y', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .attr('width', this.o.barWidth)
                .attr('height', this.o.barWidth)
                .transition()
                .duration(this.o.transitionDuration / 4)
                .delay(this.o.transitionDuration / 4)
                .attr('y', 0)
                .attr('width', this.o.barWidth)
                .attr('height', this.o.maxWidth);

            barRects.transition()
                .duration(this.o.transitionDuration / 4)
                .attr('x', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .attr('y', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .attr('width', this.o.barWidth)
                .attr('height', this.o.barWidth)
                .transition()
                .duration(this.o.transitionDuration / 4)
                .delay(this.o.transitionDuration / 4)
                .attr('y', function(d) {
                    return self.o.maxWidth - self.range(d[self.o.property]);
                })
                .attr('height', function(d) {
                    return self.range(d[self.o.property]);
                });

            labels.transition()
                .duration(this.o.transitionDuration / 2)
                .attr('transform', 'rotate(-90,0,0)')
                .attr('x', function(d) {
                    return -self.o.maxWidth + self.range(d[self.o.property]) + self.o.textOffset;
                });
        }

        this.transitionTimeout = setTimeout(function() {
            self.layoutTransition = false;
        }, this.o.transitionDuration / 2 + 20);
    }

    return this;
};


/**
 * @param data
 * @return {*}
 */
BarChart.prototype.update = function(data) {
    if (!this.layoutTransition) {

        var self = this;

        data = data.slice(0);

        // sort data
        data.sort(function(a, b) {
            return b[self.o.property] - a[self.o.property];
        });

        //  data
        data = data.slice(0, this.o.limit);

        var rects = this.svg.selectAll('rect.bar')
            .data(data, function(d) { return d.processId; });

        var newRects = rects.enter().append('rect')
            .attr('class', 'bar');

        var labels = this.svg.selectAll('text')
            .data(data, function(d) { return d.processId; });

        var newLabels = labels.enter().append('text')
            .text(function(d) { return d.processId; })
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'middle');

        rects.attr('fill', function(d) {
            return self.colorRange(d.processId);
        });

        if (this.o.layout == 'H') {
            newRects
                .attr('x', 0)
                .attr('height', this.o.barWidth);
            rects
                .attr('y', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .transition().duration(this.o.transitionDuration)
                .attr('width', function(d) {
                    return self.range(d[self.o.property]);
                });

            newLabels
                .attr('x', this.o.textOffset);
            labels
                .attr('y', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing) + self.o.barWidth / 2;
                })
                .transition().duration(this.o.transitionDuration)
                .attr('x', function(d) {
                    return self.range(d[self.o.property]) + self.o.textOffset;
                });


        } else if (this.o.layout == 'V') {
            newRects
                .attr('x', 0)
                .attr('y', this.o.maxWidth)
                .attr('width', this.o.barWidth);
            rects
                .attr('x', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing);
                })
                .transition().duration(this.o.transitionDuration)
                .attr('y', function(d) {
                    return self.o.maxWidth - self.range(d[self.o.property]);
                })
                .attr('height', function(d) {
                    return self.range(d[self.o.property]);
                });

            newLabels
                .attr('transform', 'rotate(-90,0,0)')
                .attr('x', -this.o.maxWidth + this.o.textOffset);
            labels
                .attr('y', function(d, i) {
                    return i * (self.o.barWidth + self.o.spacing) + self.o.barWidth / 2;
                })
                .transition().duration(this.o.transitionDuration)
                .attr('x', function(d) {
                    return -self.o.maxWidth + self.range(d[self.o.property]) + self.o.textOffset;
                });
        }

        rects.exit().remove();
        labels.exit().remove();
    }

    return this;
};