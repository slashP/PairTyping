(function () {
    var typing = new TypingVM();
    ko.applyBindings(typing, document.getElementById("typing-area"));

    window.addEventListener("keypress", keyPressed);
    window.addEventListener("keydown", specialCharacterPressed);

    function keyPressed(e) {
        if (typing.game().isGameFinished()) {
            return;
        }
        invokeKeyPressed(typing, e.which);
        if (e.which == 32) { // stop scrolling when pressing space
            e.preventDefault();
        }
    }

    function specialCharacterPressed(e) {
        if (typing.game().isGameFinished()) {
            return;
        }
        invokeKeyDown(typing, e.which);
        if (e.which == 8) {
            e.preventDefault();
        }
    }
})();