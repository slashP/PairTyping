(function () {
    var typing = new TypingVM();
    ko.applyBindings(typing);
    var allowedKeyCodes = [124, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 43, 113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 229, 97, 115, 100, 102, 103, 104, 106, 107, 108, 248, 122, 60, 120, 99, 118, 98, 110, 109, 44, 46, 45, 33, 34, 35, 164, 37, 38, 47, 40, 41, 61, 63, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 197, 65, 83, 68, 70, 71, 72, 74, 75, 76, 216, 198, 90, 62, 88, 67, 86, 66, 78, 77, 59, 58, 95, 32, 123, 55, 2123, 91, 3123, 55, 2123, 91, 93, 125, 32, 64, 136, 36];
    window.addEventListener("keypress", keyPressed);
    window.addEventListener("keydown", specialCharacterPressed);

    function keyPressed(e) {
        if (typing.game().isGameFinished() || allowedKeyCodes.indexOf(e.which) === -1) {
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
        } else if (e.which == 27) {
            typing.showHighScore(!typing.showHighScore());
        }
    }
})();