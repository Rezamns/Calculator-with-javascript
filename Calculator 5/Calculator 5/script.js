(function () {

    var calculator, log, display;
    calculator = window.calculator;
    display = calculator.querySelector('#LED-display');
    log = window.log;

    var cal = {
        displayValue: "0",
        result: false,
        resultPersent: null,
        numberOfDecimal: 5,
        getLastCharacter: function () {
            return this.displayValue[this.displayValue.length - 1];
        },
        splitWithOperator: function () {
            // filter(Boolean) remove falsy items in arr
            var arr = this.displayValue.split(/[-+*/%\(\)]/).filter(Boolean);
            return arr;
        },
        whichOperator: function () {
            if (/[+]/.test(this.displayValue)) return '+';
            if (/[-]/.test(this.displayValue)) return '-';
            if (/[/]/.test(this.displayValue)) return '/';
            if (/[*]/.test(this.displayValue)) return '*';
            return false;
        },
        lastEntry: function () {
            return this.splitWithOperator()[this.splitWithOperator().length - 1];
        },
    }


    function update() {
        display.textContent = cal.displayValue;
    }
    function showResult() {
        if (cal.splitWithOperator().length >= 2 && /[-+*/%]/.test(cal.getLastCharacter()) == false) {
            // Calculates value
            cal.result = eval(cal.displayValue);
            // show log
            log.textContent = cal.displayValue + '=';
            // reset cal.displayValue
            cal.displayValue = cal.result.toString();
            //show cal.result
            // the addition sign before the variable name, is deleted extra zeros in decimal number
            // Ex: 12/5 before adding a plus sign is equal to 2.40000 BUT after adding a plus sign is equal 2.4
            display.textContent = +cal.result.toFixed(cal.numberOfDecimal);
        }
    }


    function btn_number(e) {
        var event = e.target;

        if (event.classList.contains('numbers')) {

            // When the number buttons is clicked, the default value change. (Zero number is deleted)
            if (cal.displayValue == "0") cal.displayValue = '';

            // When the number buttons is clicked, In the display is shown
            cal.displayValue += event.textContent;
            update();

        } // if number


        if (event.classList.contains('operator')) {
            // If you click on the operator buttons again, it will replace the last operator in cal.displayValue
            // Ex: if you've written 3+ and then click on minus or division button, the cal.displayValue is chacge to 3- (NOT 3+-)
            if (/[-+*/%]/.test(cal.getLastCharacter())) {
                cal.displayValue = cal.displayValue.slice(0, cal.displayValue.length - 1);
            }

            if (event.id == 'percentage' && cal.splitWithOperator().length >= 2) {

                cal.displayValue += event.textContent;
                update();

                if (cal.whichOperator() == '/' || cal.whichOperator() == '*') {
                    cal.resultPersent = Number(cal.splitWithOperator()[1]) / 100;
                } else {
                    cal.resultPersent = (Number(cal.splitWithOperator()[1]) / 100) * Number(cal.splitWithOperator()[0]);
                }

                // show log
                log.textContent = cal.displayValue + '=' + +cal.resultPersent.toFixed(cal.numberOfDecimal);

                if (cal.whichOperator() == '/') cal.result = Number(cal.splitWithOperator()[0]) / Number(cal.resultPersent);
                if (cal.whichOperator() == '*') cal.result = Number(cal.splitWithOperator()[0]) * Number(cal.resultPersent);
                if (cal.whichOperator() == '+') cal.result = Number(cal.splitWithOperator()[0]) + Number(cal.resultPersent);
                if (cal.whichOperator() == '-') cal.result = Number(cal.splitWithOperator()[0]) - Number(cal.resultPersent);


                // reset cal.displayValue
                cal.displayValue = cal.result.toString();
                //show cal.result
                // the addition sign before the variable name, is deleted extra zeros in decimal number
                // Ex: 12/5 before adding a plus sign is equal to 2.40000 BUT after adding a plus sign is equal 2.4
                display.textContent = +cal.result.toFixed(cal.numberOfDecimal);

            }

            if (event.id != 'percentage') {
                // if cal.splitWithOperator.length greater than or equal 2, then calculates that value and show it.
                // Ex: if you've written 3+2 and then click on other operator buttons, it will show 5.
                if (cal.splitWithOperator().length >= 2) {
                    showResult();
                }
                // update cal.displayValue
                cal.displayValue += event.textContent;
                update();
            }

        } // if operator


        if (event.classList.contains('Parentheses')) {
            alert('Not done yet');
        } // if Parentheses

        if (event.id == 'square') {
            var square = eval(cal.displayValue);
            log.innerHTML = '&#xe901;(' + square + ')=';
            square = Math.sqrt(square);
            if (square.toString().indexOf('e') != -1) {
                cal.displayValue = +square.toFixed(cal.numberOfDecimal);
            } else {
                cal.displayValue = square.toString();
            }
            update();
        }

        if (event.id == 'x2') {
            var x2 = eval(cal.displayValue);
            log.textContent = x2 + '^' + x2 + '=';
            x2 = x2 * x2;
            if (x2.toString().indexOf('e') != -1) {
                cal.displayValue = +x2.toFixed(cal.numberOfDecimal);
            } else {
                cal.displayValue = x2.toString();
            }
            update();
        }

        if (event.id == 'dot') {
            for (var i = 0; i < cal.splitWithOperator().length; i++) {
                if (cal.splitWithOperator()[i].indexOf('.') == -1) {
                    cal.displayValue = cal.displayValue + '.';
                    update();
                }
            }
        }

        if (event.id == 'plus-minus') {
            var plus_minus;
            if (cal.displayValue == "0") cal.displayValue = '-';
            if (cal.splitWithOperator().length == 1) {
                plus_minus = (Number(cal.displayValue) * -1).toString();
                cal.displayValue = plus_minus;
            } else {
                plus_minus = '(' + (Number(cal.lastEntry()) * -1).toString() + ')';
                cal.displayValue = cal.displayValue.replace(cal.lastEntry(), plus_minus);
            }
            update();
        }

        if (event.id == 'c') {
            cal.displayValue = '0';
            log.textContent = '0';
            update();
        }
        console.log(cal.splitWithOperator());
        if (event.id == 'ce') {
            if (cal.splitWithOperator().length == 1) {
                cal.displayValue = '0';
            } else {
                cal.displayValue = cal.displayValue.replace(cal.lastEntry(), '');
            }
            update();
        }

        if (event.id == 'equal') {
            showResult();
        } // if equal


    } // function btn_number


    calculator.addEventListener('click', function (e) {
        if (e.target.classList.contains('calculator-btn')) {
            btn_number(e);
        }
    }, false);

}());