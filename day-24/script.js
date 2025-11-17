const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let currentInput = "";
let operator = null;
let previousValue = null;
let expression = "";

buttons.addEventListener('click', (e) => {
    if (e.target.tagName !== "BUTTON") return;

    const type = e.target.dataset.type;
    const value = e.target.textContent;

    if (type === "number") {
        currentInput += value;
        expression += value;
        display.textContent = expression;
    }

    if (type === "operator") {
        if (currentInput === "" && previousValue === null) return;
        if (previousValue === null) {
            previousValue = parseFloat(currentInput);
        } else if (currentInput !== "") {
            previousValue = calculate(previousValue, parseFloat(currentInput), operator);
        }
        operator = value;
        currentInput = "";
        expression = previousValue.toString() + " " + value + " ";
        display.textContent = expression;
    }

    if (type === "equals") {
        if (operator && currentInput !== "") {
            previousValue = calculate(previousValue, parseFloat(currentInput), operator);
            expression += " = " + previousValue;
            display.textContent = expression;
            currentInput = "";
            operator = null;
            expression = previousValue.toString();
        }
    }

    if (type === "clear") {
        currentInput = "";
        operator = null;
        previousValue = null;
        expression = "";
        display.textContent = "0";
    }
});

const calculate = (a, b, op) => {
    if (isNaN(a) || isNaN(b)) {
        return "Error";
    }

    if (op === "+") {
        return a + b;
    } else if (op === "-") {
        return a - b;
    } else if (op === "*") {
        return a * b;
    } else if (op === "/") {
        if (b !== 0) {
            return a / b;
        } else {
            return "Error";
        }
    } else {
        return b;
    }
}