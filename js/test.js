const testButton = document.querySelector("#main-test");
const stateError = {
  splitPayment: false,
  remainCost: false,
  startEndData: false,
};
testButton.addEventListener("click", () => {
  const table = document.querySelector(".result-ctn");
  const rows = table.querySelectorAll(".table-row");
  const inputData = {
    sum: document.querySelector("#sum-input").value,
    firstPay: document.querySelector("#firstPay-input").value,
    percent: document.querySelector("#percent-input").value,
    term: document.querySelector("#term-input").value,
  };
  const lastRow = rows[rows.length - 1].querySelectorAll("td");

  rows.forEach((row, index) => {
    if (index === rows.length - 1) {
      return;
    }

    const cells = row.querySelectorAll("td");

    const payment = +cells[1].innerHTML * 100;
    const principalPaymentValue = +(+cells[2].innerHTML * 100).toFixed(0);
    const principalPaymentNds = +(+cells[3].innerHTML * 100).toFixed(0);
    const interestPaymentValue = +(+cells[4].innerHTML * 100).toFixed(0);
    const interestPaymentNds = +(+cells[5].innerHTML * 100).toFixed(0);
    const paymentValue = +(+cells[6].innerHTML * 100).toFixed(0);
    const paymentNds = +(+cells[7].innerHTML * 100).toFixed(0);
    const balance = +(+cells[8].innerHTML * 100).toFixed(0);

    if (!checkSplitPayment()) {
      stateError.splitPayment = true;
      console.log("test splitPayment not  completed");
    }
    if (index > 0) {
      if (!checkRemainCost()) {
        stateError.remainCost = true;
        console.log("test remainCost not  completed");
      }
    }
    function checkRemainCost() {
      const prevBalance = +(
        +rows[index - 1].querySelectorAll("td")[8].innerHTML * 100
      ).toFixed(0);
      return (
        prevBalance - principalPaymentValue - principalPaymentNds === balance
      );
    }
    function checkSplitPayment() {
      return (
        payment ===
        principalPaymentValue +
          principalPaymentNds +
          interestPaymentValue +
          interestPaymentNds
      );
    }
  });
  if (!checkStartEndData()) {
    stateError.startEndData = true;
    console.log("test startEndData not  completed");
  }
  function checkStartEndData() {
    const sumValue = +(+lastRow[2].innerHTML * 100).toFixed(0);
    const sumNds = +(+lastRow[3].innerHTML * 100).toFixed(0);

    return sumValue + sumNds === +inputData.sum * 100;
  }
  if(stateError.remainCost || stateError.splitPayment || stateError.startEndData){
    alert('Тест не пройдет. Обратитесь к богу чтобы он исправил все')
  }
  console.log(stateError);
});
