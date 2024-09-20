const body = document.querySelector("body");
const resultBlock = document.querySelector(".result-ctn");
const table = resultBlock.querySelector("table");
const buttonCalcResult = document.querySelector(".calc-result");

buttonCalcResult.addEventListener("click", (e) => {
  e.preventDefault();
  const dataLeasingStart = {
    sum: 0,
    firstPayment: 20000,
    percent: 0,
    term: 0,
    redemptionPercent: 1,
    nds: 20,
    condition: [],
  };
  const dataLeasing = getDataInput(dataLeasingStart);

  if (dataLeasing === "error") {
    alert("нету важных данных");
    return;
  }
  const schedule = leasingSchedule({ ...dataLeasing });

  table.innerHTML = "";
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
  const redemptionPercentInput = document.querySelector(
    "#redemptionPercent-input"
  ).value;
  const ndsInput = document.querySelector("#nds-input").value;
  // if (!sumInput || !percentInput || !termInput) {
  //   return "error";
  // }
  const condition = [];
  document.querySelectorAll(".condition-result__item").forEach((item) => {
    const data = JSON.parse(item.getAttribute("data"));
    const actualCondition = condition.find(
      (item) => item.term === data.data.term
    );
    if (actualCondition) {
      condition.forEach((item, index) => {
        if (item.term === data.data.term) {
          condition[index].conditionData = [data, ...item.conditionData];
        }
      });
    } else {
      condition.push({ term: data.data.term, conditionData: [data] });
    }
    
  });
  const returnedData = {
    sum: sumInput ? sumInput : dataLeasing.sum,
    firstPayment: firstPayInput ? firstPayInput : dataLeasing.firstPayment,
    percent: percentInput ? percentInput : dataLeasing.percent,
    term: termInput ? termInput : dataLeasing.term,
    redemptionPercent: redemptionPercentInput
      ? +redemptionPercentInput
      : dataLeasing.redemptionPercent,
    nds: ndsInput ? +ndsInput : dataLeasing.nds,
    condition: condition,
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

  tr.classList.add("table-row");
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

function logicModal() {
  // modals -------------------------------------------------------------
  const btns = document.querySelectorAll(".open-modal");
  const modalOverlay = document.querySelector(".modal-overlay ");
  const modals = document.querySelectorAll(".modal");
  const btnsClose = document.querySelectorAll(".modal-close");

  btns.forEach((el) => {
    el.addEventListener("click", (e) => {
      let path = e.currentTarget.getAttribute("data-path");

      modals.forEach((el) => {
        el.classList.remove("modal--visible");
      });

      body.style.overflow = "hidden";
      body.style.paddingRight = "10px";

      document
        .querySelector(`[data-target="${path}"]`)
        .classList.add("modal--visible");
      modalOverlay.classList.add("modal-overlay--visible");
    });
  });
  btnsClose.forEach((el) => {
    el.addEventListener("click", () => {
      modalOverlay.classList.remove("modal-overlay--visible");
      modals.forEach((el) => {
        body.style.overflow = "auto";
        body.style.paddingRight = "0";
        el.classList.remove("modal--visible");
      });
    });
  });
  modalOverlay.addEventListener("click", (e) => {
    if (e.target == modalOverlay) {
      body.style.overflow = "auto";
      body.style.paddingRight = "0";
      modalOverlay.classList.remove("modal-overlay--visible");
      modals.forEach((el) => {
        el.classList.remove("modal--visible");
      });
    }
  });
}
function createConditionsBlock() {
  const buttonPercent = document.querySelector(".condition-percent-btn");
  const buttonTerm = document.querySelector(".condition-term-btn");
  const buttonPayment = document.querySelector(".condition-payment-btn");

  buttonPercent.addEventListener("click", () => {
    const inputDateStart = document.querySelector(
      "#condition-percent__dateStart"
    ).value;

    const inputNewPercent = document.querySelector(
      "#condition-percent__percent"
    ).value;
    const div = document.createElement("div");
    div.innerText = `С платежа номер: ${inputDateStart}  рассчитать по ${inputNewPercent}% годовых`;
    const dataCondition = {
      action: constantsConditionActions.percent,
      data: {
        term: inputDateStart,
        percent: inputNewPercent,
      },
    };
    createRowConditionResult("Другой процент", div, dataCondition);
    inputDateStart.value = "";
    inputNewPercent.value = "";
  });
  buttonTerm.addEventListener("click", () => {
    const inputDateStart = document.querySelector(
      "#condition-term__dateStart"
    ).value;
    const inputDateEnd = document.querySelector(
      "#condition-term__dateEnd"
    ).value;
    const div = document.createElement("div");
    div.innerText = `С  платежа номер: ${inputDateStart} увеличен до  ${inputDateEnd} месяцев`;
    const dataCondition = {
      action: constantsConditionActions.term,
      data: {
        term: inputDateStart,
        end: inputDateEnd,
      },
    };
    createRowConditionResult("Другой срок", div, dataCondition);
    inputDateStart.value = "";
    inputDateEnd.value = "";
  });
  buttonPayment.addEventListener("click", () => {
    const inputDate = document.querySelector(
      "#condition-payment__number"
    ).value;
    const inputSum = document.querySelector("#condition-payment__sum").value;
    const div = document.createElement("div");
    div.innerText = `Платеж номер: ${inputDate}. Внесено ${inputSum} денег`;

    const dataCondition = {
      action: constantsConditionActions.payment,
      data: {
        term: inputDate,
        sum: inputSum,
      },
    };
    createRowConditionResult("Платеж на дату", div, dataCondition);
    // dataLeasingStart.condition.push({
    //   action: conditionActions.percent,
    //   data: {
    //     date: inputDate,
    //     sum: inputSum,
    //   },
    // });
    inputDate.value = "";
    inputSum.value = "";
  });
  function createRowConditionResult(title, blockContent, data) {
    const conditionBlock = document.querySelector(".condition-result");

    const conditionItem = document.createElement("div");
    conditionItem.setAttribute("data", JSON.stringify(data));
    conditionItem.classList.add("condition-result__item");
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.innerText = title;
    const buttonDelete = document.createElement("div");
    buttonDelete.classList.add("delete-condition");
    buttonDelete.innerText = "x";
    buttonDelete.addEventListener("click", () => {
      conditionItem.remove();
    });
    conditionItem.appendChild(titleDiv);
    conditionItem.appendChild(blockContent);
    conditionItem.appendChild(buttonDelete);

    conditionBlock.appendChild(conditionItem);
  }
}
createConditionsBlock();
logicModal();
