function downloadFile(tableData) {
    function convertToCSV(data) {
      const headers = [
        "месяц",
        "Лизинговый платеж с НДС",
        "Гашение основного долга без НДС",
        "Гашение основного долга - НДС",
        "Interest Payment (With NDS)",
        "Вознаграждение лизингодателя без ндс",
        "Вознаграждение лизингодателя - НДС",
        "Principal Payment (With NDS)",
        "Величина платежа без НДС",
        "Величина платежа - НДС",
        "Остаток стоиомсти предмета",
      ];
  
      const rows = data.map((item) => [
        item.month,
        item.monthlyPayment?.withNds || 0,
        item.monthlyPayment?.value || 0,
        item.monthlyPayment?.nds || 0,
        item.interestPayment?.withNds || 0,
        item.interestPayment?.value || 0,
        item.interestPayment?.nds || 0,
        item.principalPayment?.withNds || 0,
        item.principalPayment?.value || 0,
        item.principalPayment?.nds || 0,
        item.balance || 0,
      ]);
  
      const csvContent = [headers, ...rows]
        .map((row) => row.join(";"))
        .join("\n");
  
      return `\uFEFF${csvContent}`;
    }
    function downloadFile(content, contentType) {
      const blob = new Blob([content], { type: contentType });
      const inputName = document.querySelector("#nameFile-input");
      const fileName = inputName.value ? inputName.value : "линговый договорчик";
      buttonDownload.href = URL.createObjectURL(blob);
      buttonDownload.download = `${fileName}.csv`;
    }
    const csvContent = convertToCSV(tableData);
    downloadFile(csvContent, "text/csv");
  }