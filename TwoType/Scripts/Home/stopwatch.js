var Stopwatch = function (elem, options) {
    var self = this;
    self.clock = ko.observable();
    var offset,
        interval;

    // default options
    options = options || {};
    options.delay = options.delay || 1;

    // append elements     
    reset();


    function start() {
        if (!interval) {
            offset = Date.now();
            interval = setInterval(update, options.delay);
        }
    }

    function stop() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    function reset() {
        self.clock(0);
    }

    function update() {
        self.clock(self.clock() + delta());
    }


    function delta() {
        var now = Date.now(),
            d = now - offset;

        offset = now;
        return d;
    }

    function getTime() {
        return self.clock();
    }

    // public API
    this.start = start;
    this.stop = stop;
    this.reset = reset;
    this.getTime = getTime;
};