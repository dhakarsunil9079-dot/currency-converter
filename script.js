const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const form = document.querySelector("form");
const swapButton = document.querySelector(".swap-button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  const amount = document.querySelector(".amount input");
  const amtVal = Number(amount.value);
  if (!Number.isFinite(amtVal) || amtVal <= 0) {
    msg.innerText = "Enter an amount greater than zero.";
    amount.focus();
    return;
  }

  msg.innerText = "Getting exchange rate...";
  try {
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Exchange rate request failed (${response.status}).`);
    }

    const data = await response.json();
    const rate = data[fromCurr.value.toLowerCase()]?.[toCurr.value.toLowerCase()];
    if (typeof rate !== "number") {
      throw new Error("Exchange rate is unavailable for this currency pair.");
    }

    const finalAmount = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amtVal * rate);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Could not get exchange rate:", error);
    msg.innerText = "Could not get exchange rate. Please try again.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

swapButton.addEventListener("click", () => {
  const fromValue = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = fromValue;
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});