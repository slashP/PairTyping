(function () {

    function Line(expected, indent) {
        this.expected = expected;
        this.indent = indent;
        this.correct = ko.observable("");
        this.wrong = ko.observable("");
        this.remaining = ko.computed(this._remaining, this);
        this.isComplete = ko.computed(this._isComplete, this);
    }

    Line.prototype._remaining = function() {
        return this.expected.substr(this.correct().length);
    };

    Line.prototype._isComplete = function() {
        return this.correct() === this.expected && this.wrong().length === 0;
    };



    function Game(program) {
        var self = this;

        this.lines = program.split("\n").map(function (line) {
            return new Line(line.trim(), line.indexOf("\t") === 0);
        });

        this.currentLineNumber = ko.observable(0);

        this.currentLine = ko.computed(function () {
            return self.lines[self.currentLineNumber()];
        });


        this.isAtLeastOneCharacterCorrect = ko.computed(function() {
            return self.lines[0].correct().length > 0;
        });

        this.isGameFinished = ko.computed(function () {
            return self.lines.every(function (line) {
                return line.isComplete();
            });
        });
    }



    var TypingVM = function () {
        var self = this;

        var program = "public static void Main(string[] args)\n" +
            "{\n" +
            "\tConsole.WriteLine(@\"Hello NDC!\");\n" +
            "}";

        this.stopwatch = new Stopwatch(document.getElementById("stopwatch"), { delay: 123 });

        this.game = ko.observable(new Game(program));

        this.hasStarted = ko.computed(function() {
            return self.game().isAtLeastOneCharacterCorrect();
        });

        this.isGameFinished = ko.computed(function() {
            return self.game().isGameFinished();
        });

        this.hasStarted.subscribe(function (value) {
            if (value) {
                self.stopwatch.start();
            } else {
                self.stopwatch.stop();
                self.stopwatch.reset();
            }
        });
        
        this.isGameFinished.subscribe(function (value) {
            if (value) {
                self.stopwatch.stop();
            }
        });

        this.restartGame = function() {
            self.game(new Game(program));
            self.name("");
            self.phone("");
        };

        this.name = ko.observable("");
        this.phone = ko.observable("");

        this.highscores = ko.observableArray([]);
        this.postScore = function () {
            $.post("/api/highscore",
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
                return { name: highscore.Name, time: highscore.PlayTime, phone: highscore.Phone };
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
        if (e.which === 13 || typing.isGameFinished()) {
            return;
        }
        var line = typing.game().currentLine();
        var wrongCharCount = line.wrong().length;
        var currentPosition = line.correct().length;
        var newChar = String.fromCharCode(e.which);
        if (newChar.length == 0) return;
        if (newChar == line.expected.charAt(currentPosition) && wrongCharCount === 0) {
            line.correct(line.correct() + newChar);
        } else {
            line.wrong(line.wrong() + newChar);
        }
        if (e.which == 32) { // stop scrolling when pressing space
            e.preventDefault();
        }
    }

    function specialCharacterPressed(e) {
        if (typing.isGameFinished()) {
            return false;
        }
        var line = typing.game().currentLine();
        if (e.which == 8) {
            if (line.wrong().length !== 0) {
                line.wrong(line.wrong().slice(0, -1));
            }
            e.preventDefault();
        }
        else if (e.which == 13 && line.isComplete()) {
            typing.game().currentLineNumber(typing.game().currentLineNumber() + 1);
        }
        return false;
    }
})();