const syncPair = (rangeEl, numberEl, callback) => {
    rangeEl.addEventListener("input", () => {
        numberEl.value = rangeEl.value;
        callback();
    });
    numberEl.addEventListener("input", () => {
        rangeEl.value = numberEl.value;
        callback();
    });
};

const calculate = (billInput, tipInput, peopleInput, updateFn, currency, rate) => {
    const bill = parseFloat(billInput.value);
    const tipPercent = parseFloat(tipInput.value);
    const people = parseInt(peopleInput.value);

    const isValid = !isNaN(bill) && !isNaN(tipPercent) && !isNaN(people) && bill > 0 && people > 0;

    if (!isValid) {
        updateFn(0, 0, 0, currency);
        return;
    }

    const tip = bill * (tipPercent / 100);
    const total = bill + tip;
    const perPerson = total / people;
    const tipSplit = tip / people;

    const factor = currency === "EUR" ? 1 / rate : 1;

    updateFn(tip * factor, tipSplit * factor, perPerson * factor, currency);
};

const formatCurrency = (value, currency) => {
    const formatter = new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === "EUR" ? 2 : 0,
        maximumFractionDigits: currency === "EUR" ? 2 : 0,
    });
    return formatter.format(value);
};

const updateResults = (tipAmountEl, tipPerPersonEl, totalPerPersonEl, tip, tipPer, totalPer, currency) => {
    tipAmountEl.textContent = formatCurrency(tip, currency);
    tipPerPersonEl.textContent = formatCurrency(tipPer, currency);
    totalPerPersonEl.textContent = formatCurrency(totalPer, currency);
};

const toggleTheme = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
};

const loadTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        document.body.classList.add("dark");
    }
};

window.addEventListener("load", () => {
    const billRange = document.getElementById("bill-range");
    const billInput = document.getElementById("bill");

    const tipRange = document.getElementById("tip-range");
    const tipInput = document.getElementById("tip");

    const peopleRange = document.getElementById("people-range");
    const peopleInput = document.getElementById("people");

    const tipAmount = document.getElementById("tip-amount");
    const tipPerPerson = document.getElementById("tip-per-person");
    const totalPerPerson = document.getElementById("total-per-person");

    const currencySelect = document.getElementById("currency");

    const update = (tip, tipPer, totalPer) => {
        const currency = currencySelect.value;
        updateResults(tipAmount, tipPerPerson, totalPerPerson, tip, tipPer, totalPer, currency);
    };

    const runCalc = () => {
        const currency = currencySelect.value;
        const rate = 392;
        calculate(billInput, tipInput, peopleInput, update, currency, rate);
    };

    syncPair(billRange, billInput, runCalc);
    syncPair(tipRange, tipInput, runCalc);
    syncPair(peopleRange, peopleInput, runCalc);

    currencySelect.addEventListener("change", runCalc);

    document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
    loadTheme();
    runCalc();
});