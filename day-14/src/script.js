const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from-currency");
const toSelect = document.getElementById("to-currency");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");
const swapBtn = document.getElementById("swap-button");

const apiKey = import.meta.env.VITE_API_KEY;

const currencies = ["USD", "EUR", "GBP", "HUF", "JPY", "AUD", "PLN"];

currencies.forEach((code) => {
    const optionForm = new Option(code, code);
    const optionTo = new Option(code, code);
    fromSelect.appendChild(optionForm);
    toSelect.appendChild(optionTo);
});

fromSelect.value = "USD";
toSelect.value = "EUR";

const convertCurrency = async () => {
    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (!amount || amount <= 0) {
        showError("Please enter a valid amount.");
        return;
    }

    if (from === to) {
        showError("Source and target currencies must differ.");
        return;
    }

    try {
        const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${from}&currencies=${to}`);
        const data = await response.json();
        const rate = data.data[to];
        console.log(data);
        console.log(rate);
        const converted = (amount * rate).toFixed(2);
        resultEl.textContent = `${amount} ${from} = ${converted} ${to}`;
        errorEl.classList.add("hidden");
    } catch (error) {
        showError("Failed to fetch exchange rate.");
    }
};

const showError = (msg) => {
    errorEl.textContent = msg;
    errorEl.classList.remove("hidden");
};

amountInput.addEventListener("input", convertCurrency);
fromSelect.addEventListener("change", convertCurrency);
toSelect.addEventListener("change", convertCurrency);

swapBtn.addEventListener("click", () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    swapBtn.classList.toggle("flipped");

    convertCurrency();
});