function WinnerVM() {
    var self = this;

    this.highscores = ko.observableArray([]);

    this.pickingTime = ko.observable(10);

    var interval;

    this.pickRandomWinner = function () {
        self.finished('false');
        interval = setInterval(highlightRandom, 400);
        setInterval(stop, self.pickingTime()*1000);

    }

    this.winners = ko.observable();

    var removeDuplicates = function (arr) {
        var phoneNumbers = [];

        arr.forEach(function(entry) {
            phoneNumbers.push(entry.Phone +""+ entry.Phone2);
        });
        var uniquephoneNumbers = [];
        $.each(phoneNumbers, function (i, el) {
            if ($.inArray(el, uniquephoneNumbers) === -1) uniquephoneNumbers.push(el);
        });
        var legal = [];
        arr.forEach(function(entry) {
            if (uniquephoneNumbers.indexOf(entry.Phone + "" + entry.Phone2) >= 0) {
                legal.push(entry);
                uniquephoneNumbers[uniquephoneNumbers.indexOf(entry.Phone + "" + entry.Phone2)] = null;
            } 
        });

        return legal;
    }
    function setHighscores(result) {
        result = removeDuplicates(result);
        console.log(result);
        self.highscores(result.map(function (highscore) {
            return {
                highscoreDisplayName: highscore.Name + " & " + highscore.Name2,
                highscoreDisplayPhone: highscore.Phone + " & " + highscore.Phone2,
                time: highscore.PlayTime,
                id: highscore.Id,
                winner: ko.observable('false')
        };
        }));
    }

    $.get("/api/highscore", function (result) {
        console.log(result);
        setHighscores(result);
    });

    this.finished = ko.observable('false');

   

    var highlightRandom = function () {
        var highscores = self.highscores();
        var randomnumber = Math.floor(Math.random() * highscores.length);
        highscores.forEach(function (entry) {
            entry.winner('false');
        });
        highscores[randomnumber].winner('true');
        if (self.highscores().length > 3) {
        self.highscores.remove(self.winners());
            
        }
        self.winners(highscores[randomnumber]);
    }

    function stop() {
        if (interval) {
            clearInterval(interval);
            interval = null;
            self.finished('true');
        }
    }

}

ko.applyBindings(new WinnerVM());