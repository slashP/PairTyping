(function () {
    var TypingVM = function () {
        var self = this;
        this.lines = [
            {
                line: ko.observable(""),
                lineWrong: ko.observableArray(""),
                lineActual: "public static void Main(string[] args)"
            },
            {
                line: ko.observable(""),
                lineWrong: ko.observableArray(""),
                lineActual: "{"
            },
            {
                line: ko.observable(""),
                lineWrong: ko.observableArray(""),
                lineActual: "Console.WriteLine(\"Hello NDC!\");"
            },
            {
                line: ko.observable(""),
                lineWrong: ko.observableArray(""),
                lineActual: "}"
            }
        ];
        this.currentLine = ko.observable(0);

        this.stopwatch = new Stopwatch(document.getElementById("stopwatch"), { delay: 123 });
        this.lines[0].line.subscribe(function(newValue) {
            if (newValue) {
                self.stopwatch.start();
            }
        });
        var lastLineIndex = self.lines.length - 1;

        this.lines[lastLineIndex].line.subscribe(function(newValue) {
            if (self.lines[lastLineIndex].lineActual == newValue) {
                self.gameFinished();
            }
        });

        self.gameFinished = function() {
            self.stopwatch.stop();
        }

        this.restartGame = function () {
            self.stopwatch.stop();
            self.stopwatch.reset();
            this.lines.forEach(function(line) {
                line.line("");
                line.lineWrong("");
                self.currentLine(0);
            });
        }
    }
    var typing = new TypingVM();
    ko.applyBindings(typing, document.getElementById("typing-area"));

    window.addEventListener("keypress", keyPressed);
    window.addEventListener("keydown", specialCharacterPressed);

    function keyPressed(e) {
        if (e.keyCode === 13) {
            return;
        }
        var line = typing.lines[typing.currentLine()];
        var wrongCharCount = line.lineWrong().length;
        var currentPosition = line.line().length + wrongCharCount;
        var newChar = String.fromCharCode(e.keyCode);
        if (newChar == line.lineActual.charAt(currentPosition) && wrongCharCount === 0) {
            line.line(line.line() + newChar);
        } else {
            line.lineWrong(line.lineWrong() + newChar);
        }
    }

    function specialCharacterPressed(e) {
        var line = typing.lines[typing.currentLine()];
        if (e.keyCode == 8) {
            if (line.lineWrong().length === 0 && line.line().length === 0) {
                typing.currentLine(Math.max(0, typing.currentLine() - 1));
            } else {
                line.lineWrong(line.lineWrong().slice(0, -1));
            }
            return false;
        }
        else if (e.keyCode == 13 && line.line().length == line.lineActual.length) {
            typing.currentLine(typing.currentLine() + 1);
        }
    }
})();