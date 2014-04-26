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
                lineActual: "Console.WriteLine(@\"Hello NDC!\");"
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

        this.restartGame = function () {
            self.stopwatch.stop();
            self.stopwatch.reset();
            self.name("");
            self.phone("");
            this.lines.forEach(function(line) {
                line.line("");
                line.lineWrong("");
                self.currentLine(0);
            });
        }

        this.isGameFinished = ko.computed(function () {
            return self.lines.every(function (line) {
                return line.line() === line.lineActual;
            });
        });

        self.isGameFinished.subscribe(function() {
            if (self.isGameFinished()) {
                self.stopwatch.stop();
            }
        });
        this.name = ko.observable("");
        this.phone = ko.observable("");

        this.highscores = ko.observableArray([]);
        this.postScore = function () {
            $.post("api/highscore",
                { name: self.name(), playTime: self.stopwatch.getTime() / 1000, phone: self.phone() },
                function(result) {
                    if (result.Message && result.Message.indexOf("Authorization") > -1) {
                        self.name("Not this time bro. You must log in");
                    } else {
                        setHighscores(result);
                        self.restartGame();
                    }
                });
        }

        function setHighscores(result) {
            self.highscores(result.map(function (highscore) {
                return { name: highscore.Name, time: highscore.PlayTime };
            }));
        }

        // get initial highscores
        $.get("/api/highscore", function (result) {
            setHighscores(result);
        });
    }
    var typing = new TypingVM();
    ko.applyBindings(typing, document.getElementById("typing-area"));

    window.addEventListener("keypress", keyPressed);
    window.addEventListener("keydown", specialCharacterPressed);

    function keyPressed(e) {
        if (e.keyCode === 13 || typing.isGameFinished()) {
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
        if (e.keyCode == 32) { // stop scrolling when pressing space
            e.preventDefault();
        }
    }

    function specialCharacterPressed(e) {
        if (typing.isGameFinished()) {
            return false;
        }
        var line = typing.lines[typing.currentLine()];
        if (e.keyCode == 8) {
            if (line.lineWrong().length === 0 && line.line().length === 0) {
                typing.currentLine(Math.max(0, typing.currentLine() - 1));
            } else {
                line.lineWrong(line.lineWrong().slice(0, -1));
            }
            e.preventDefault();
        }
        else if (e.keyCode == 13 && line.line().length == line.lineActual.length) {
            typing.currentLine(typing.currentLine() + 1);
        }
        return false;
    }
})();