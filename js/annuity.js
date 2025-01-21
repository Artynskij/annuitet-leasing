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
function getRedemptionValue({
  redemptionPercent: redemptionPercent,
  sum: sum,
}) {
  return (sum / 100) * redemptionPercent;
}
function getRatePerMonth({ percent: percent }) {
  const kef = percent / 12 / 100;
  return kef;
}
function getRateAnnuity({ kef: kef, term: term }) {
  const rate = (kef * (1 + kef) ** term) / ((1 + kef) ** term - 1);
  return rate;
}

function getPercent({ percent: percent, value: value }) {
  let valueOfPercent;
  let originValue;

  if (percent !== 0) {
    valueOfPercent = +((value * percent) / (100 + percent)).toFixed(2);
    originValue = +(value - valueOfPercent).toFixed(2);
  } else {
    valueOfPercent = 0;
    originValue = value;
  }

  if (+(valueOfPercent + originValue).toFixed(2) !== value) {
    console.log(`getPercent error. Not exactly. ${percent}, ${value}`);
  }
  return {
    withNds: value,
    value: originValue,
    nds: valueOfPercent,
  };
}

function leasingAnnuitySchedule({
  sum,
  firstPayment,
  percent,
  term,
  redemptionPercent,
  nds,
  condition,
}) {
  const redemptionValue = getRedemptionValue({
    sum: sum,
    redemptionPercent: redemptionPercent,
  }); // Добавочная стоимость
  let kef = getRatePerMonth({ percent: percent });
  let monthlyAnnuity = getRateAnnuity({ kef: kef, term: term });
  const financedAmount = sum - firstPayment - redemptionValue;
  let monthlyPayment = +(financedAmount * monthlyAnnuity).toFixed(2) * 100;

  let balance = financedAmount * 100;
  let schedule = [];

  schedule.push(getFirstPayment()); // первый платеж

  for (let i = 1; i <= term; i++) {
    let interestPayment = +((balance / 100) * kef).toFixed(2) * 100; // Процентная часть
    let principalPayment = monthlyPayment - interestPayment; // Погашение основного долга
    if (!condition.find((item) => +item.term === i)) {
      balance -= principalPayment; // Остаток долга
    }

    condition.forEach((item) => {
      if (+item.term === i) {
        applyConditions(item.conditionData);
      }
    }); // обработка условий
    function applyConditions(item) {
      const actionPayment = item.find(
        (item) => item.action === constantsConditionActions.payment
      )?.data;
      const actionPercent = item.find(
        (item) => item.action === constantsConditionActions.percent
      )?.data;
      const actionTerm = item.find(
        (item) => item.action === constantsConditionActions.term
      )?.data;
      // изменение платежа и процента и срока
      if (!!actionPayment && !!actionPercent && !!actionTerm) {
        term = +actionTerm.end;
        kef = getRatePerMonth({
          percent: +actionPercent.percent,
        });
        monthlyAnnuity = getRateAnnuity({ kef: kef, term: term - i + 1 });
        interestPayment = +((balance / 100) * kef).toFixed(2) * 100; // Процентная часть
        principalPayment = +actionPayment.sum * 100 - interestPayment; // другой платеж

        // перерасчет месячного платежа
        balance -= principalPayment; // Остаток долга
        monthlyPayment = +((balance / 100) * monthlyAnnuity).toFixed(2) * 100;

        return;
      }
      // изменение платежа и срока
      if (!!actionPayment && !!actionTerm && !actionPercent) {
        term = +actionTerm.end;

        principalPayment = actionPayment.sum * 100 - interestPayment;
        // перерасчет месячного платежа
        balance -= principalPayment; // Остаток долга
        monthlyAnnuity = getRateAnnuity({ kef: kef, term: term - i });
        monthlyPayment = +((balance / 100) * monthlyAnnuity).toFixed(2) * 100;
        return;
      }
      // изменение процента и срока
      if (!!actionPercent && !!actionTerm && !actionPayment) {
        term = +actionTerm.end;
        kef = getRatePerMonth({
          percent: actionPercent.percent,
        });
        monthlyAnnuity = getRateAnnuity({ kef: kef, term: term - i + 1 });
        monthlyPayment = +((balance / 100) * monthlyAnnuity).toFixed(2) * 100;
        interestPayment = +((balance / 100) * kef).toFixed(2) * 100; // Процентная част
        principalPayment = monthlyPayment - interestPayment; // Погашение основного долга
        balance -= principalPayment; // Остаток долга
        return;
      }
      // изменение платежа и процента
      if (!!actionPayment && !!actionPercent && !actionTerm) {
        kef = getRatePerMonth({
          percent: +actionPercent.percent,
        });
        monthlyAnnuity = getRateAnnuity({ kef: kef, term: term - i + 1 });
        interestPayment = +((balance / 100) * kef).toFixed(2) * 100; // Процентная часть
        principalPayment = +actionPayment.sum * 100 - interestPayment; // другой платеж

        // перерасчет месячного платежа
        balance -= principalPayment; // Остаток долга
        monthlyPayment = +((balance / 100) * monthlyAnnuity).toFixed(2) * 100;

        return;
      }
      // изменение платежа(один )
      if (!!actionPayment && !actionPercent && !actionTerm) {
        principalPayment = actionPayment.sum * 100 - interestPayment;
        // перерасчет месячного платежа
        balance -= principalPayment; // Остаток долга
        monthlyAnnuity = getRateAnnuity({ kef: kef, term: term - i });
        monthlyPayment = +((balance / 100) * monthlyAnnuity).toFixed(2) * 100;
        return;
      }
      // изменение процента
      if (!!actionPercent && !actionPayment && !actionTerm) {
        kef = getRatePerMonth({
          percent: actionPercent.percent,
        });
        monthlyAnnuity = getRateAnnuity({ kef: kef, term: term - i + 1 });
        monthlyPayment = +((balance / 100) * monthlyAnnuity).toFixed(2) * 100;
        interestPayment = +((balance / 100) * kef).toFixed(2) * 100; // Процентная част
        principalPayment = monthlyPayment - interestPayment; // Погашение основного долга
        balance -= principalPayment; // Остаток долга
        return;
      }
      // изменение сроков
      if (!!actionTerm && !actionPayment && !actionPercent) {
        term = +actionTerm.end;
        // console.log(term);
        monthlyAnnuity = getRateAnnuity({ kef: kef, term: term - i + 1 });
        monthlyPayment = +((balance / 100) * monthlyAnnuity).toFixed(2) * 100;
        interestPayment = +((balance / 100) * kef).toFixed(2) * 100; // Процентная част
        principalPayment = monthlyPayment - interestPayment; // Погашение основного долга
        balance -= principalPayment; // Остаток долга
        return;
      }
    }
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
      // высчитываем НДС
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

    return schedule.map((item) => {
      if (item.type === "lastMonthly") {
        if (difference > 0) {
          item.principalPayment.value = additionHundredth(
            item.principalPayment.value,
            difference,
            "-"
          );
          item.principalPayment.nds = additionHundredth(
            item.principalPayment.nds,
            difference,
            "+"
          );
        } else {
          item.principalPayment.value = additionHundredth(
            item.principalPayment.value,
            difference,
            "+"
          );
          item.principalPayment.nds = additionHundredth(
            item.principalPayment.nds,
            difference,
            "-"
          );
        }
      }
      return item;
    });
  }

  schedule = checkFinalAllPaymentAndNds({ schedule: schedule });
  schedule.pop();
  schedule.push(getFinalResult({ schedule: schedule }));
  return schedule;
}
class Annuity {
  constructor({
    sum,
    firstPayment,
    percent,
    term,
    redemptionPercent,
    nds,
    condition,
  }) {
    this.sum = sum;
    this.firstPayment = firstPayment;
    this.percent = percent;
    this.term = term;
    this.redemptionPercent = redemptionPercent;
    this.nds = nds;
    this.condition = condition;

    this.redemptionValue = getRedemptionValue({
      sum: sum,
      redemptionPercent: redemptionPercent,
    }); // Добавочная стоимость

    this.kef = Annuity.getRatePerMonth({ percent: this.percent });
    this.monthlyAnnuity = Annuity.getRateAnnuity({
      kef: this.kef,
      term: this.term,
    });
    this.financedAmount = this.sum - this.firstPayment - this.redemptionValue;
    this.monthlyPayment =
      +(this.financedAmount * this.monthlyAnnuity).toFixed(2) * 100;

    this.balance = this.financedAmount * 100;
  }
  static getRatePerMonth({ percent }) {
    const kef = percent / 12 / 100;
    return kef;
  }
  static getRateAnnuity({ kef, term }) {
    const rate = (kef * (1 + kef) ** term) / ((1 + kef) ** term - 1);
    return rate;
  }
  static getFirstPayment({ nds, firstPayment, balance, redemptionValue }) {
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
  static getLastPayment({ nds, redemptionValue, schedule }) {
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
  static getFinalResult({ schedule }) {
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
  }
  static checkFinalAllPaymentAndNds({ schedule, nds, sum }) {
    const objectSum = getPercent({ percent: nds, value: sum });
    const difference = additionHundredth(
      schedule[schedule.length - 1].principalPayment.value,
      objectSum.value,
      "-"
    );

    return schedule.map((item) => {
      if (item.type === "lastMonthly") {
        if (difference > 0) {
          item.principalPayment.value = additionHundredth(
            item.principalPayment.value,
            difference,
            "-"
          );
          item.principalPayment.nds = additionHundredth(
            item.principalPayment.nds,
            difference,
            "+"
          );
        } else {
          item.principalPayment.value = additionHundredth(
            item.principalPayment.value,
            difference,
            "+"
          );
          item.principalPayment.nds = additionHundredth(
            item.principalPayment.nds,
            difference,
            "-"
          );
        }
      }
      return item;
    });
  }

  getSchedule() {
    let schedule = [];

    schedule.push(
      Annuity.getFirstPayment({
        nds: this.nds,
        firstPayment: this.firstPayment,
        balance: this.balance,
        redemptionValue: this.redemptionValue,
      })
    ); // первый платеж

    for (let i = 1; i <= this.term; i++) {
      let interestPayment = +((this.balance / 100) * this.kef).toFixed(2) * 100; // Процентная часть
      let principalPayment = this.monthlyPayment - interestPayment; // Погашение основного долга
      if (!this.condition.find((item) => +item.term === i)) {
        this.balance -= principalPayment; // Остаток долга
      }
      // console.log(this.monthlyPayment);
      this.condition.forEach((item) => {
        if (+item.term === i) {
          applyConditions.bind(this)({
            item: item.conditionData,
            iteration: i,
          });
        }
      }); // обработка условий
      function applyConditions({ item, iteration }) {
        const actionPayment = item.find(
          (item) => item.action === constantsConditionActions.payment
        )?.data;
        const actionPercent = item.find(
          (item) => item.action === constantsConditionActions.percent
        )?.data;
        const actionTerm = item.find(
          (item) => item.action === constantsConditionActions.term
        )?.data;
        // изменение платежа и процента и срока
        if (!!actionPayment && !!actionPercent && !!actionTerm) {
          this.term = +actionTerm.end;
          this.kef = Annuity.getRatePerMonth({
            percent: +actionPercent.percent,
          });
          this.monthlyAnnuity = Annuity.getRateAnnuity({
            kef: this.kef,
            term: this.term - i + 1,
          });
          interestPayment = +((balance / 100) * this.kef).toFixed(2) * 100; // Процентная часть
          principalPayment = +actionPayment.sum * 100 - interestPayment; // другой платеж

          // перерасчет месячного платежа
          this.balance -= principalPayment; // Остаток долга
          this.monthlyPayment =
            +((this.balance / 100) * this.monthlyAnnuity).toFixed(2) * 100;

          return;
        }
        // изменение платежа и срока
        if (!!actionPayment && !!actionTerm && !actionPercent) {
          this.term = +actionTerm.end;

          principalPayment = actionPayment.sum * 100 - interestPayment;
          // перерасчет месячного платежа
          this.balance -= principalPayment; // Остаток долга
          this.monthlyAnnuity = Annuity.getRateAnnuity({
            kef: this.kef,
            term: this.term - iteration,
          });
          this.monthlyPayment =
            +((this.balance / 100) * this.monthlyAnnuity).toFixed(2) * 100;
          return;
        }
        // изменение процента и срока
        if (!!actionPercent && !!actionTerm && !actionPayment) {
          this.term = +actionTerm.end;
          this.kef = Annuity.getRatePerMonth({
            percent: actionPercent.percent,
          });
          this.monthlyAnnuity = Annuity.getRateAnnuity({
            kef: this.kef,
            term: this.term - iteration + 1,
          });
          this.monthlyPayment =
            +((this.balance / 100) * this.monthlyAnnuity).toFixed(2) * 100;
          interestPayment = +((this.balance / 100) * this.kef).toFixed(2) * 100; // Процентная част
          principalPayment = this.monthlyPayment - interestPayment; // Погашение основного долга
          this.balance -= principalPayment; // Остаток долга
          return;
        }
        // изменение платежа и процента
        if (!!actionPayment && !!actionPercent && !actionTerm) {
          this.kef = Annuity.getRatePerMonth({
            percent: +actionPercent.percent,
          });
          this.monthlyAnnuity = Annuity.getRateAnnuity({
            kef: this.kef,
            term: this.term - iteration,
          });
          interestPayment = +((this.balance / 100) * this.kef).toFixed(2) * 100; // Процентная часть
          principalPayment = +actionPayment.sum * 100 - interestPayment; // другой платеж

          // перерасчет месячного платежа
          console.log(this.balance);

          this.balance -= principalPayment; // Остаток долга
          console.log(this.balance);
          this.monthlyPayment =
            +((this.balance / 100) * this.monthlyAnnuity).toFixed(2) * 100;

          return;
        }
        // изменение платежа(один)
        if (!!actionPayment && !actionPercent && !actionTerm) {
          principalPayment = actionPayment.sum * 100 - interestPayment;
          // перерасчет месячного платежа
          this.balance -= principalPayment; // Остаток долга
          this.monthlyAnnuity = Annuity.getRateAnnuity({
            kef: this.kef,
            term: this.term - iteration,
          });
          this.monthlyPayment =
            +((this.balance / 100) * this.monthlyAnnuity).toFixed(2) * 100;
          return;
        }
        // изменение процента
        if (!!actionPercent && !actionPayment && !actionTerm) {
          this.kef = Annuity.getRatePerMonth({
            percent: actionPercent.percent,
          });
          this.monthlyAnnuity = Annuity.getRateAnnuity({
            kef: this.kef,
            term: this.term - iteration + 1,
          });
          this.monthlyPayment =
            +((this.balance / 100) * this.monthlyAnnuity).toFixed(2) * 100;
          interestPayment = +((this.balance / 100) * this.kef).toFixed(2) * 100; // Процентная част
          principalPayment = this.monthlyPayment - interestPayment; // Погашение основного долга
          this.balance -= principalPayment; // Остаток долга
          return;
        }
        // изменение сроков
        if (!!actionTerm && !actionPayment && !actionPercent) {
          this.term = +actionTerm.end;
          this.monthlyAnnuity = Annuity.getRateAnnuity({
            kef: this.kef,
            term: this.term - iteration + 1,
          });
          this.monthlyPayment =
            +((this.balance / 100) * this.monthlyAnnuity).toFixed(2) * 100;
          interestPayment = +((this.balance / 100) * this.kef).toFixed(2) * 100; // Процентная част
          principalPayment = this.monthlyPayment - interestPayment; // Погашение основного долга
          this.balance -= principalPayment; // Остаток долга
          return;
        }
      }

      if (i !== this.term) {
        const interestPaymentWithNds = getPercent({
          percent: this.nds,
          value: +interestPayment.toFixed(0) / 100,
        });
        const principalPaymentWithNds = getPercent({
          percent: this.nds,
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
          balance: +this.balance.toFixed(0) / 100 + this.redemptionValue,
        });
      } else {
        // при последнее итерации выравниваем копейки. для ровного выкупного платежа.

        if (this.balance < 0) {
          principalPayment -= Math.abs(this.balance);
          interestPayment += Math.abs(this.balance);
          this.balance += Math.abs(this.balance);
        } else {
          principalPayment += Math.abs(this.balance);
          interestPayment -= Math.abs(this.balance);
          this.balance -= Math.abs(this.balance);
        }
        // высчитываем НДС
        const interestPaymentWithNds = getPercent({
          percent: this.nds,
          value: interestPayment / 100,
        });
        const principalPaymentWithNds = getPercent({
          percent: this.nds,
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
        console.log(principalPaymentWithNds);

        schedule.push({
          type: "lastMonthly",
          month: i,
          monthlyPayment: monthlyPaymentWithNds,
          interestPayment: interestPaymentWithNds,
          principalPayment: principalPaymentWithNds,
          balance: this.balance / 100 + this.redemptionValue,
        });
      }
    }
    schedule.push(
      Annuity.getLastPayment({
        nds: this.nds,
        redemptionValue: this.redemptionValue,
        schedule: schedule,
      })
    ); // последний платеж
    schedule.push(Annuity.getFinalResult({ schedule: schedule })); // итого платежей

    schedule = Annuity.checkFinalAllPaymentAndNds({
      schedule: schedule,
      nds: this.nds,
      sum: this.sum,
    });
    schedule.pop();
    schedule.push(Annuity.getFinalResult({ schedule: schedule }));
    return schedule;
  }
}
