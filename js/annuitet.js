function additionHundredth(num1, num2, sign) {
  let returnedData = "";
  switch (sign) {
    case "-":
      returnedData = +(num1 * 100 - num2 * 100).toFixed(0) / 100;
      break;

    case "*":
      returnedData = +(num1 * 100 * (num2 * 100)).toFixed(0) / 100;
      break;

    case "/":
      returnedData = +((num1 * 100) / (num2 * 100)).toFixed(0) / 100;
      break;

    default:
      returnedData = +(num1 * 100 + num2 * 100).toFixed(0) / 100;
      break;
  }
  return returnedData;
}
function getRatePerMonth({ percent: percent }) {
  const kef = percent / 12 / 100;
  return kef;
}
function getRateAnnuity({ kef: kef, term: term }) {
  const rate = (kef * (1 + kef) ** term) / ((1 + kef) ** term - 1);
  return rate;
}

function getRedemptionValue({
  redemptionPercent: redemptionPercent,
  sum: sum,
}) {
  return (sum / 100) * redemptionPercent;
}
function getPercent({ percent: percent, value: value }) {
  const valueOfPercent = +((value * percent) / (100 + percent)).toFixed(2);
  const originValue = +(value - valueOfPercent).toFixed(2);
  if (+(valueOfPercent + originValue).toFixed(2) !== value) {
    // console.log(originValue);
    // console.log(valueOfPercent);
    // console.log(value);

    console.log("getPercent error. Not exactly.");
  }
  return {
    withNds: value,
    value: originValue,
    nds: valueOfPercent,
  };
}

function getTest(schedule) {
  schedule.forEach((item) => {
    console.log(
      additionHundredth(
        item.principalPayment.value,
        item.interestPayment.value,
        "+"
      ) === item.monthlyPayment.value
    );
  });
}
function leasingSchedule({
  sum,
  firstPayment,
  percent,
  term,
  redemptionPercent,
  nds,
}) {
  const kef = getRatePerMonth({ percent: percent });
  const monthlyAnnuity = getRateAnnuity({ kef: kef, term: term });
  const redemptionValue = getRedemptionValue({
    sum: sum,
    redemptionPercent: redemptionPercent,
  }); // Добавочная стоимость
  const financedAmount = sum - firstPayment - redemptionValue;
  const monthlyPayment = +(financedAmount * monthlyAnnuity).toFixed(2) * 100;

  let balance = financedAmount * 100;
  let schedule = [];

  schedule.push(getFirstPayment()); // первый платеж

  for (let i = 1; i <= term; i++) {
    let interestPayment = +((balance / 100) * kef).toFixed(2) * 100; // Процентная часть
    let principalPayment = monthlyPayment - interestPayment; // Погашение основного долга
    balance -= principalPayment; // Остаток долга

    if (i !== term) {
      const interestPaymentWithNds = getPercent({
        percent: nds,
        value: +interestPayment.toFixed(0) / 100,
      });
      const principalPaymentWithNds = getPercent({
        percent: nds,
        value: +principalPayment.toFixed(0) / 100,
      });
      const monthlyPaymentWithNds = {
        withNds: additionHundredth(
          interestPaymentWithNds.withNds,
          principalPaymentWithNds.withNds,
          "+"
        ),
        value: additionHundredth(
          interestPaymentWithNds.value,
          principalPaymentWithNds.value,
          "+"
        ),
        nds: additionHundredth(
          interestPaymentWithNds.nds,
          principalPaymentWithNds.nds,
          "+"
        ),
      };
      schedule.push({
        month: i,
        monthlyPayment: monthlyPaymentWithNds,
        interestPayment: interestPaymentWithNds,
        principalPayment: principalPaymentWithNds,
        balance: +balance.toFixed(0) / 100 + redemptionValue,
      });
    } else {
      // при последнее итерации выравниваем копейки. для ровного выкупного платежа.
      if (balance < 0) {
        principalPayment -= Math.abs(balance);
        interestPayment += Math.abs(balance);
        balance += Math.abs(balance);
      } else {
        principalPayment += Math.abs(balance);
        interestPayment -= Math.abs(balance);
        balance -= Math.abs(balance);
      }

      const interestPaymentWithNds = getPercent({
        percent: nds,
        value: interestPayment / 100,
      });
      const principalPaymentWithNds = getPercent({
        percent: nds,
        value: principalPayment / 100,
      });
      const monthlyPaymentWithNds = {
        withNds: additionHundredth(
          interestPaymentWithNds.withNds,
          principalPaymentWithNds.withNds,
          "+"
        ),
        value: additionHundredth(
          interestPaymentWithNds.value,
          principalPaymentWithNds.value,
          "+"
        ),
        nds: additionHundredth(
          interestPaymentWithNds.nds,
          principalPaymentWithNds.nds,
          "+"
        ),
      };
      schedule.push({
        type: "lastMonthly",
        month: i,
        monthlyPayment: monthlyPaymentWithNds,
        interestPayment: interestPaymentWithNds,
        principalPayment: principalPaymentWithNds,
        balance: balance / 100 + redemptionValue,
      });
    }
  }
  schedule.push(getLastPayment()); // последний платеж
  schedule.push(getFinalResult({ schedule: schedule })); // итого платежей
  function getFirstPayment() {
    const monthlyPayment = getPercent({
      percent: nds,
      value: firstPayment,
    });
    const principalPayment = getPercent({
      percent: nds,
      value: firstPayment,
    });
    return {
      month: 0,
      monthlyPayment: monthlyPayment,
      interestPayment: { withNds: 0, value: 0, nds: 0 },
      principalPayment: principalPayment,
      balance: +balance.toFixed(0) / 100 + redemptionValue,
    };
  }
  function getLastPayment() {
    const monthlyPayment = getPercent({
      percent: nds,
      value: redemptionValue,
    });
    const principalPayment = getPercent({
      percent: nds,
      value: redemptionValue,
    });
    return {
      month: schedule.length,
      monthlyPayment: monthlyPayment,
      interestPayment: { withNds: 0, value: 0, nds: 0 },
      principalPayment: principalPayment,
      balance: 0,
    };
  }

  function getFinalResult({ schedule: schedule }) {
    const allPayment = {
      month: "итого",
      monthlyPayment: { withNds: 0, value: 0, nds: 0 },
      principalPayment: { withNds: 0, value: 0, nds: 0 },
      interestPayment: { withNds: 0, value: 0, nds: 0 },
    };
    schedule.forEach((item) => {
      allPayment.monthlyPayment.withNds = additionHundredth(
        item.monthlyPayment.withNds,
        allPayment.monthlyPayment.withNds,
        "+"
      );

      allPayment.principalPayment.value = additionHundredth(
        item.principalPayment.value,
        allPayment.principalPayment.value,
        "+"
      );
      allPayment.principalPayment.nds = additionHundredth(
        item.principalPayment.nds,
        allPayment.principalPayment.nds,
        "+"
      );
      allPayment.interestPayment.value = additionHundredth(
        item.interestPayment.value,
        allPayment.interestPayment.value,
        "+"
      );
      allPayment.interestPayment.nds = additionHundredth(
        item.interestPayment.nds,
        allPayment.interestPayment.nds,
        "+"
      );
      allPayment.monthlyPayment.value = additionHundredth(
        item.monthlyPayment.value,
        allPayment.monthlyPayment.value,
        "+"
      );
      allPayment.monthlyPayment.nds = additionHundredth(
        item.monthlyPayment.nds,
        allPayment.monthlyPayment.nds,
        "+"
      );
    });
    return allPayment;
    // return {
    //   allMoney: getPercent({ percent: nds, value: allPayment.allMoney }),
    //   interest: getPercent({ percent: nds, value: allPayment.interest }),
    //   principalPayment: getPercent({
    //     percent: nds,
    //     value: allPayment.principalPayment,
    //   }),
    // };
  }
  function checkFinalAllPaymentAndNds({ schedule: schedule }) {
    const objectSum = getPercent({ percent: nds, value: sum });
    const difference = additionHundredth(
      schedule[schedule.length - 1].principalPayment.value,
      objectSum.value,
      "-"
    );

    // console.log(schedule[schedule.length - 1].principalPayment.value);
    // console.log(objectSum.value);

   
    return schedule.map((item) => {
      if(item.type === "lastMonthly") {
        if (difference > 0) {
          console.log(difference);
          item.principalPayment.value = additionHundredth(item.principalPayment.value, difference, '-')
          item.principalPayment.nds  = additionHundredth(item.principalPayment.nds, difference, '+')
        } else {
          item.principalPayment.value = additionHundredth(item.principalPayment.value, difference, '+')
          item.principalPayment.nds  = additionHundredth(item.principalPayment.nds, difference, '-')
        }
      }
      return item
    });
  }

  schedule = checkFinalAllPaymentAndNds({ schedule: schedule });
  schedule.pop()
  schedule.push( getFinalResult({ schedule: schedule }))
  return schedule;
}
