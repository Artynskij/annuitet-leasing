const resultBlock = document.querySelector(".result-ctn");
const table = resultBlock.querySelector("table");
const buttonCalcResult = document.querySelector(".calc-result");

buttonCalcResult.addEventListener("click", (e) => {
  e.preventDefault();
  const dataLeasingMock = {
    sum: 120000,
    firstPayment: 20000,
    percent: 25,
    term: 30,
    redemptionPercent: 1,
    nds: 20,
  };
  const dataLeasing = getDataInput(dataLeasingMock);
  console.log(dataLeasing);
  
  const schedule = leasingSchedule({ ...dataLeasing });
 
  table.innerHTML = ''
  table.appendChild(createHeadTable());
  schedule.forEach((scheduleItem) => {
    table.appendChild(
      createRow({
        month: scheduleItem.month,
        monthlyPaymentWithNds: scheduleItem.monthlyPayment.withNds,
        principalPaymentValue: scheduleItem.principalPayment.value,
        principalPaymentNds: scheduleItem.principalPayment.nds,
        interestPaymentValue: scheduleItem.interestPayment.value,
        interestPaymentNds: scheduleItem.interestPayment.nds,
        monthlyPaymentValue: scheduleItem.monthlyPayment.value,
        monthlyPaymentNds: scheduleItem.monthlyPayment.nds,
        balance: scheduleItem.balance,
      })
    );
  });

  //   console.log(getDataInput());
});

function getDataInput(dataLeasing) {
  const sumInput = +document.querySelector("#sum-input").value;
  const firstPayInput = +document.querySelector("#firstPay-input").value;
  const percentInput = +document.querySelector("#percent-input").value;
  const termInput = +document.querySelector("#term-input").value;
  const redemptionPercentInput = +document.querySelector(
    "#redemptionPercent-input"
  ).value;
  const ndsInput = +document.querySelector("#nds-input").value;
  const returnedData = {
    sum: sumInput ? sumInput : dataLeasing.sum,
    firstPayment: firstPayInput ? firstPayInput : dataLeasing.firstPayment,
    percent: percentInput ? percentInput : dataLeasing.percent,
    term: termInput ? termInput : dataLeasing.term,
    redemptionPercent: redemptionPercentInput
      ? redemptionPercentInput
      : dataLeasing.redemptionPercent,
    nds: ndsInput ? ndsInput : dataLeasing.nds,
  };
  return returnedData;
}
function createRow({
  month: month,
  monthlyPaymentWithNds: monthlyPaymentWithNds,
  principalPaymentValue: principalPaymentValue,
  principalPaymentNds: principalPaymentNds,
  interestPaymentValue: interestPaymentValue,
  interestPaymentNds: interestPaymentNds,
  monthlyPaymentValue: monthlyPaymentValue,
  monthlyPaymentNds: monthlyPaymentNds,
  balance: balance,
}) {
  const tr = document.createElement("tr");
  const row = `
        <td>${month}</td>
        <td>${(+monthlyPaymentWithNds).toFixed(2)}</td>
        <td>${(+principalPaymentValue).toFixed(2)}</td>
        <td>${(+principalPaymentNds).toFixed(2)}</td>
        <td>${(+interestPaymentValue).toFixed(2)}</td>
        <td>${(+interestPaymentNds).toFixed(2)}</td>
        <td>${(+monthlyPaymentValue).toFixed(2)}</td>
        <td>${(+monthlyPaymentNds).toFixed(2)}</td>
        <td>${(+balance).toFixed(2)}</td>
    `;
  tr.innerHTML = row;
  return tr;
}
function createHeadTable() {
  const html = document.createElement("tr");
  html.innerHTML = `
                <th>месяц</th>
                <th>Лизинговый платеж с НДС</th>
                <th>Гашение основного долга без НДС</th>
                <th>Гашение основного долга - НДС </th>
                <th>Вознаграждение лизингодателя без ндс</th>
                <th>Вознаграждение лизингодателя - НДС </th>
                <th>Величина платежа без НДС</th>
                <th>Величина платежа - НДС</th>
                <th>Остаток стоиомсти предмета</th>
            `;
  return html;
}
// function createElement(elementProp, text) {
//   const element = document.createElement(elementProp);
//   element.innerHTML = text;
//   return element;
// }
