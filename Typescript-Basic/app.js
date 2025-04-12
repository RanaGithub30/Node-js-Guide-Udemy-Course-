(function () {
    var num1 = document.getElementById('num1');
    var num2 = document.getElementById('num2');
    var res = document.getElementById('res');
    var buttonElement = document.querySelector('button');
    function add(num1, num2) {
        return num1 + num2;
    }
    buttonElement === null || buttonElement === void 0 ? void 0 : buttonElement.addEventListener('click', function () {
        var value1 = +num1.value;
        var value2 = +num2.value;
        var result = add(value1, value2);
        if (res) {
            console.log(result);
            res.innerHTML = result.toString();
        }
    });
})();