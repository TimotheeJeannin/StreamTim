var createCallback = function (successMessage, errorMessage) {
    return function (error) {
        if (error) {
            console.error(errorMessage);
            console.error(error);
        } else {
            console.log(successMessage);
        }
    }
};

var getSystem = function () {
    if (process.platform === 'linux') {
        return new Linux();
    } else if (process.platform === 'win32') {
        return new Windows();
    }
};

var initialisePage = function (gui) {
    $('#close').click(function () {
        window.close();
    });

    $('#vlcWebsite').click(function () {
        gui.Shell.openExternal('http://www.videolan.org/vlc/');
    });

    $('#waitMagnet').hide();
    $('#noVlcFound').hide();
    $('#prepareStream').hide();
    $('#streamView').hide();
};

var updateChart = function (speeds) {

    $('svg').empty();

    var margin = {top: 20, right: 0, bottom: 20, left: 70},
        width = 600 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    var data = speeds.map(function (value, index) {
        return {
            index: index,
            speed: value
        }
    });

    var downloadSpeedScale = d3.scale.linear()
        .domain([ d3.max(data, function (d) {
            return d.speed;
        }), 0])
        .range([2 * margin.bottom, height - margin.top]);

    var indexScale = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
            return d.index;
        }))
        .range([margin.left, width - margin.right]);

    var xAxis = d3.svg.axis()
        .scale(indexScale)
        .ticks(0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .ticks(3)
        .scale(downloadSpeedScale)
        .orient("left");

    var lineFunction = d3.svg.line()
        .x(function (d) {
            return indexScale(d.index);
        })
        .y(function (d) {
            return downloadSpeedScale(d.speed);
        });

    var areaFunction = d3.svg.area()
        .x(function (d) {
            return indexScale(d.index);
        })
        .y0(height)
        .y1(function (d) {
            return downloadSpeedScale(d.speed);
        });

    var svg = d3.select("svg")
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
