var gVars = {};

ko.bindingHandlers['clock'] = {
    init: function (element, valueAccessor) {
        var colors = ['orange', 'blue', 'green'];
		
        var tmp;

        colors.forEach(function(color) {
            // Creating a new element and setting the color as a class name:

            tmp = $('<div>').attr('class', color + ' clock').html(
                '<div class="display"></div>' +
                '<div class="front left"></div>' +
                '<div class="rotate left">' +
                '<div class="bg left"></div>' +
                '</div>' +
                '<div class="rotate right">' +
                '<div class="bg right"></div>' +
                '</div>'
            );

            // Appending to the container:
            $(element).append(tmp);

            // Assigning some of the elements as variables for speed:
            tmp.rotateLeft = tmp.find('.rotate.left');
            tmp.rotateRight = tmp.find('.rotate.right');
            tmp.display = tmp.find('.display');
            gVars[color] = tmp;
        });
            
        //var value = valueAccessor();

        //// Next, whether or not the supplied model property is observable, get its current value
        //var valueUnwrapped = ko.unwrap(value);

        //var currentTime = new Date(valueUnwrapped);
        //var minutter = currentTime.getMinutes();
        //var sekunder = currentTime.getSeconds();
        //var hundredeler = parseInt("" + (currentTime.getMilliseconds() / 10));


        //animation(gVars.orange, minutter, 60);
        //animation(gVars.blue, sekunder, 60);
        //animation(gVars.green, hundredeler, 100);

    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor(), allBindings = allBindingsAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);

        var currentTime = new Date(valueUnwrapped);
        var minutter = currentTime.getMinutes();
        var sekunder = currentTime.getSeconds();
        var hundredeler = parseInt("" + (currentTime.getMilliseconds() / 100));


        animation(gVars.orange, minutter, 60);
        animation(gVars.blue, sekunder, 60);
        animation(gVars.green, hundredeler, 10);
    }
};

function animation(clock, current, total) {
    // Calculating the current angle:
    var angle = (360 / total) * (current + 1);

    var element;

    if (current == 0) {
        // Hiding the right half of the background:
        clock.rotateRight.hide();

        // Resetting the rotation of the left part:
        rotateElement(clock.rotateLeft, 0);
    }

    if (angle <= 180) {
        // The left part is rotated, and the right is currently hidden:
        element = clock.rotateLeft;
    }
    else {
        // The first part of the rotation has completed, so we start rotating the right part:
        clock.rotateRight.show();
        clock.rotateLeft.show();

        rotateElement(clock.rotateLeft, 180);

        element = clock.rotateRight;
        angle = angle - 180;
    }

    rotateElement(element, angle);

    // Setting the text inside of the display element, inserting a leading zero if needed:
    clock.display.html(current < 10 && total > 10 ? '0' + current : current);
};

function rotateElement(element, angle) {
    // Rotating the element, depending on the browser:
    var rotate = 'rotate(' + angle + 'deg)';

    if (element.css('MozTransform') != undefined)
        element.css('MozTransform', rotate);

    else if (element.css('WebkitTransform') != undefined)
        element.css('WebkitTransform', rotate);

        // A version for internet explorer using filters, works but is a bit buggy (no surprise here):
    else if (element.css("filter") != undefined) {
        var cos = Math.cos(Math.PI * 2 / 360 * angle);
        var sin = Math.sin(Math.PI * 2 / 360 * angle);

        element.css("filter", "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=-" + sin + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand',FilterType='nearest neighbor')");

        element.css("left", -Math.floor((element.width() - 200) / 2));
        element.css("top", -Math.floor((element.height() - 200) / 2));
    }

};