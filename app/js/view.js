function View(numeral) {

    let self = this;
    this.speeds = [];

    this.show = function (divId) {
        console.log('Showing ' + divId);
        self.hideAll();
        $('#' + divId).show();
    };

    this.showInvalidLinkError = function () {
        $('#invalidLink').show();
        $('#moreInformation').hide();
    };

    this.hideAll = function () {
        $('#waitMagnet').hide();
        $('#noVlcFound').hide();
        $('#prepareStream').hide();
        $('#streamView').hide();
        $('#invalidLink').hide();
    };

    this.initialise = function (onVlcPathCallback, onTorrentLinkCallback) {
        $('#close').click(function () {
            window.close();
        });

        $('#fileDialog').on('change', function () {
            onVlcPathCallback($('#fileDialog').val());
        });

        $('#torrentInputButton').click(function () {
            onTorrentLinkCallback($('#torrentInput').val());
        });

        $('#fileButton').click(function () {
            $('#fileDialog').click();
        });

        $('#vlcWebsite').click(function () {
            gui.Shell.openExternal('http://www.videolan.org/vlc/');
        });

        self.hideAll();
    };

    this.updateStreamView = function (engine) {

        $('#numberOfPeers').html(engine.swarm.wires.length);
        $('#downloadedAmount').html(numeral(engine.swarm.downloaded).format('0.0 b'));

        this.speeds.push(engine.swarm.downloadSpeed() / 1000);

        if (this.speeds.length > 20) this.speeds.shift();
        if (this.speeds.length > 1) self.updateChart();
    };

    this.resetStreamView = function () {

        $('#numberOfPeers').html('');
        $('#downloadedAmount').html('');

        this.speeds = [];

        $('svg').empty();
    };

    this.updateChart = function () {

        $('svg').empty();

        let margin = {top: 20, right: 0, bottom: 20, left: 70},
            width = 600 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        let data = this.speeds.map(function (value, index) {
            return {
                index: index,
                speed: value
            }
        });

        let d3 = require('d3');

        let downloadSpeedScale = d3.scale.linear()
            .domain([d3.max(data, function (d) {
                return d.speed;
            }), 0])
            .range([2 * margin.bottom, height - margin.top]);

        let indexScale = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d.index;
            }))
            .range([margin.left, width - margin.right]);

        let xAxis = d3.svg.axis()
            .scale(indexScale)
            .ticks(0)
            .orient("bottom");

        let yAxis = d3.svg.axis()
            .ticks(3)
            .scale(downloadSpeedScale)
            .orient("left");

        let lineFunction = d3.svg.line()
            .x(function (d) {
                return indexScale(d.index);
            })
            .y(function (d) {
                return downloadSpeedScale(d.speed);
            });

        let areaFunction = d3.svg.area()
            .x(function (d) {
                return indexScale(d.index);
            })
            .y0(height)
            .y1(function (d) {
                return downloadSpeedScale(d.speed);
            });

        let svg = d3.select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        svg.append("path")
            .attr("class", "line")
            .attr("d", lineFunction(data));

        svg.append("path")
            .attr("class", "area")
            .attr("d", areaFunction(data));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(yAxis)
            .append("text")
            .attr("dx", "-15")
            .text("Kb/s");
    };
}