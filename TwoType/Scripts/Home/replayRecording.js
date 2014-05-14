var typing = new TypingVM();
var ViewModel = function () {
    var self = this;
    this.recordingTime = ko.observable();
    ko.utils.extend(self, typing);
    self.isGameFinished.subscribe(function(val) {
        if (val) {
            self.stopwatch.clock(self.recordingTime() * 1000);
        }
    });
    self.restartGame = function() {
        window.location = "/";
    };
}
var viewModel = new ViewModel(); 
ko.applyBindings(viewModel);
var id = location.href.split("/").reverse()[0];
$.get("/api/highscore/recording?id=" + id, function(result) {
    var recordings = JSON.parse(result.Recordings);
    viewModel.recordingTime(result.PlayTime);
    var elementsTaken = 0;
    var timeout = 20;
    var timeStarted = performance.now();
    var intVal = setInterval(tick, timeout);
    function tick() {
        if (elementsTaken >= recordings.length) {
            clearInterval(intVal);
            setTimeout(function() {
                elementsTaken = 0;
                timeStarted = performance.now();
                typing.restartGame();
                intVal = setInterval(tick, timeout);
            }, 3000);
            return;
        }
        var now = performance.now();
        var timeElapsed = (now - timeStarted) / 1000;
        recordings.slice(elementsTaken).filter(function(recording) {
            return recording.time <= timeElapsed;
        }).forEach(function(recording) {
            if (recording.action == "keyPress") {
                invokeKeyPressed(typing, recording.which);
            } else if (recording.action == "keyDown") {
                invokeKeyDown(typing, recording.which);
            }
            elementsTaken++;
        });
    }
});