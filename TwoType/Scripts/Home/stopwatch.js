var Stopwatch = function (elem, options) {

    var timer = createTimer(),
        offset,
        clock,
        interval;

    // default options
    options = options || {};
    options.delay = options.delay || 1;

    // append elements     
    elem.appendChild(timer);
    reset();

    // private functions
    function createTimer() {
        return document.createElement("span");
    }

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
        clock = 0;
        render(0);
    }

    function update() {
        clock += delta();
        render();
    }

    function render() {
        timer.innerHTML = clock / 1000;
    }

    function delta() {
        var now = Date.now(),
            d = now - offset;

        offset = now;
        return d;
    }

    function getTime() {
        return clock;
    }

    // public API
    this.start = start;
    this.stop = stop;
    this.reset = reset;
    this.getTime = getTime;
};