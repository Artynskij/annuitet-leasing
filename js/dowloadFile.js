const headers = [
  "месяц",
  "Лизинговый платеж с НДС (гр.3+гр.4+гр.5+гр.6)",
  "Возмещение инвестиционных расходов по приобретению Предметов лизинга без НДС",
  "НДС на инвестиционные расходы по приобретению Предметов лизинка по ставке 20%",
  "Вознаграждение Лизингодателяи и иные инвестиционные расходы",
  "Сумма НДС на Вознаграждение Лизингодателя по ставке 20%",
  "Величина платежа без НДС (гр.3+гр.5)",
  "Всего НДС (гр.4+гр.6)",
  "Остаток стоиомсти лизинга",
];
const underHeader = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
function downloadFile(tableData) {
  //   function convertToCSV(data) {
  //     const headers = [
  //       "месяц",
  //       "Лизинговый платеж с НДС (гр.3+гр.4+гр.5+гр.6)",
  //       "Возмещение инвестиционных расходов по приобретению Предметов лизинга без НДС",
  //       "НДС на инвестиционные расходы по приобретению Предметов лизинка по ставке 20%",
  //       "Вознаграждение Лизингодателяи и иные инвестиционные расходы",
  //       "Сумма НДС на Вознаграждение Лизингодателя по ставке 20%",
  //       "Величина платежа без НДС (гр.3+гр.5)",
  //       "Всего НДС (гр.4+гр.6)",
  //       "Остаток стоиомсти лизинга",
  //     ];
  //     const underHeader = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  //     const rows = data.map((item) => [
  //       item.month,
  //       item.monthlyPayment?.withNds || 0,
  //       item.principalPayment?.value || 0,
  //       item.principalPayment?.nds || 0,
  //       item.interestPayment?.value || 0,
  //       item.interestPayment?.nds || 0,
  //       item.monthlyPayment?.value || 0,
  //       item.monthlyPayment?.nds || 0,
  //       item.balance || 0,
  //     ]);

  //     const csvContent = [headers, underHeader, ...rows]
  //       .map((row) => row.join(";"))
  //       .join("\n");

  //     return `\uFEFF${csvContent}`;
  //   }
  //   function downloadFile(content, contentType) {
  //     const blob = new Blob([content], { type: contentType });
  //     const inputName = document.querySelector("#nameFile-input");
  //     const fileName = inputName.value ? inputName.value : "линговый договорчик";
  //     buttonDownload.href = URL.createObjectURL(blob);
  //     buttonDownload.download = `${fileName}.csv`;
  //   }
  //   const csvContent = convertToCSV(tableData);
  //   downloadFile(csvContent, "text/csv");

  function generate() {
    const funcAsync = async () => {
      // Создаем новую книгу
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Отчёт");
    
      const rows = tableData.map((item) => [
        item.month,
        item.monthlyPayment?.withNds || 0,
        item.principalPayment?.value || 0,
        item.principalPayment?.nds || 0,
        item.interestPayment?.value || 0,
        item.interestPayment?.nds || 0,
        item.monthlyPayment?.value || 0,
        item.monthlyPayment?.nds || 0,
        item.balance || 0,
      ]);
      const rowHeadersMainTable = worksheet.addRow(headers);
      rowHeadersMainTable.height = 25

      rows.forEach((row) => {
        worksheet.addRow(row);
      });
      worksheet.columns = headers.map(() => ({ width: 15 }));
      // Скачивание файла
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Отчет.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    };
    funcAsync();
  }
  generate();
}
