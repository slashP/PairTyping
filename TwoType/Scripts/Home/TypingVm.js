function Line(expected, indent) {
    this.expected = expected;
    this.indent = indent;
    this.correct = ko.observable("");
    this.wrong = ko.observable("");
    this.remaining = ko.computed(this._remaining, this);
    this.isComplete = ko.computed(this._isComplete, this);
}

Line.prototype._remaining = function () {
    return this.expected.substr(this.correct().length);
};

Line.prototype._isComplete = function () {
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


    this.isAtLeastOneCharacterCorrect = ko.computed(function () {
        return self.lines[0].correct().length > 0;
    });

    this.isGameFinished = ko.computed(function () {
        return self.lines.every(function (line) {
            return line.isComplete();
        });
    });
}



function TypingVM() {
    var self = this;

    var program = "public static void main(String[] args) {\n" +
        "\tSystem.out.println(\"Hello NTNU!\");\n" +
        "}";

    this.stopwatch = new Stopwatch(document.getElementById("stopwatch"), { delay: 123 });

    this.game = ko.observable(new Game(program));

    this.showHighScore = ko.observable(false);

    this.hasStarted = ko.computed(function () {
        return self.game().isAtLeastOneCharacterCorrect();
    });

    this.isGameFinished = ko.computed(function () {
       return self.game().isGameFinished();
    });

    this.showCurrentPlace = ko.observable(true);

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

    this.restartGame = function () {
        self.game(new Game(program));
        self.name("");
        self.name2("");
        self.phone("");
        self.phone2("");
        self.recording = [];
    };

    this.name = ko.observable("");
    this.name2 = ko.observable("");
    this.phone = ko.observable("");
    this.phone2 = ko.observable("");
    this.canSave = ko.computed(function() {
        return self.name() != '' && self.phone() != '' && self.name2() != '' && self.phone2() != '';
    });

    this.highscores = ko.observableArray([]);
    this.postScore = function () {
        $.post("/api/highscore",
            { name: self.name(), name2: self.name2(), playTime: self.stopwatch.getTime() / 1000, phone: self.phone(), phone2: self.phone2() },
            function (result) {
                if (result.Message && result.Message.indexOf("Authorization") > -1) {
                    self.name("Not this time bro. You must log in");
                } else {
                    setHighscores(result.HighscoreEntries);
                    uploadRecording(result.CurrentEntry);
                    self.restartGame();
                }
            });
    }

    function setHighscores(result) {
        self.highscores(result.map(function (highscore) {
            return {
                highscoreDisplayName: highscore.Name + " & " + highscore.Name2,
                highscoreDisplayPhone: highscore.Phone + " & " + highscore.Phone2,
                time: highscore.PlayTime,
                id: highscore.Id
            };
        }));
    }

    function uploadRecording(currentEntry) {
        $.post("api/highscore/recording", {
            id: currentEntry.Id,
            name: currentEntry.Name,
            playTime: currentEntry.PlayTime,
            recordings: JSON.stringify(self.recording)
        });
    }

    // get initial highscores
    $.get("/api/highscore", function (result) {
        setHighscores(result);
    });

    this.recording = [];

    this.addRecording = function (action, which) {
        self.recording.push({ action: action, which: which, time: self.stopwatch.getTime() / 1000 });
    }

    this.currentPlace = ko.computed(function (parameters) {
        var time = self.stopwatch.getTime();
      
        var place = 1;
        self.highscores().forEach(function(score) {
            if (score.time < time/1000) {
                place++;
            }
        });
        return place;
    });

}


function invokeKeyPressed(typing, which) {
    if (which === 13 || typing.isGameFinished()) {
        return null;
    }
    var line = typing.game().currentLine();
    var wrongCharCount = line.wrong().length;
    var currentPosition = line.correct().length;
    var newChar = String.fromCharCode(which);
    if (newChar.length == 0) return;
    if (newChar == line.expected.charAt(currentPosition) && wrongCharCount === 0) {
        line.correct(line.correct() + newChar);
        typing.addRecording("keyPress", which);
    } else {
        line.wrong(line.wrong() + newChar);
        typing.addRecording("keyPress", which);
    }
}

function invokeKeyDown(typing, which) {
    if (typing.isGameFinished()) {
        return false;
    }
    var line = typing.game().currentLine();
    if (which == 8) {
        if (line.wrong().length !== 0) {
            line.wrong(line.wrong().slice(0, -1));
            typing.addRecording("keyDown", which);
        }
    }
    else if (which == 13 && line.isComplete()) {
        typing.game().currentLineNumber(typing.game().currentLineNumber() + 1);
        typing.addRecording("keyDown", which);
    }
    return false;
}
